import asyncio
import logging
import json
from datetime import datetime
from typing import List, Optional, Dict
from queue import PriorityQueue
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from sqlalchemy.exc import OperationalError, IntegrityError
from croniter import croniter
from ..models.task import Task
from ..schemas.task import TaskCreate, TaskResponse, TaskUpdate
from ..errors import TaskNotFoundError, InvalidRequestError, TransientError, CriticalError
from ..services.workflow_monitor import workflow_monitor

logger = logging.getLogger(__name__)

class TaskScheduler:
    def __init__(self):
        self.task_queue = PriorityQueue()
        self.batch_queue = asyncio.Queue()
        self.active_tasks: Dict[str, asyncio.Task] = {}
        self.batch_processors: Dict[str, asyncio.Task] = {}
        self.lock = asyncio.Lock()
        self.batch_lock = asyncio.Lock()
        # Start batch processor
        asyncio.create_task(self._batch_processor())

    async def create_task(self, db: Session, task_data: TaskCreate) -> TaskResponse:
        """Create and schedule a new task"""
        try:
            async with self.lock:
                task = Task(
                    name=task_data.name,
                    description=task_data.description,
                    schedule=task_data.schedule,
                    priority=task_data.priority,
                    status="pending",
                    retry_count=0,
                    max_retries=task_data.max_retries or 3,
                    batch_key=task_data.batch_key  # New field for batch processing
                )
                db.add(task)
                db.commit()
                db.refresh(task)

                if task_data.schedule == "immediate":
                    if task_data.batch_key:
                        await self.batch_queue.put(task.id)
                    else:
                        asyncio.create_task(self._execute_task(db, task.id))
                
                return TaskResponse.from_orm(task)
        except IntegrityError as e:
            db.rollback()
            logger.error(f"Integrity error creating task: {e}", exc_info=True)
            raise InvalidRequestError(message="Invalid task data", details={"error": str(e)})
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating task: {e}", exc_info=True)
            raise CriticalError(message="Failed to create task", details={"error": str(e)})

    async def get_task(self, db: Session, task_id: str) -> TaskResponse:
        """Get task details by ID"""
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise TaskNotFoundError(message=f"Task {task_id} not found")
        return TaskResponse.from_orm(task)

    async def cancel_task(self, db: Session, task_id: str) -> TaskResponse:
        """Cancel a scheduled or running task"""
        async with self.lock:
            task = db.query(Task).filter(Task.id == task_id).first()
            if not task:
                raise TaskNotFoundError(message=f"Task {task_id} not found")

            if task.status == "running":
                if task_id in self.active_tasks:
                    self.active_tasks[task_id].cancel()
                    del self.active_tasks[task_id]

            task.status = "cancelled"
            db.commit()
            db.refresh(task)
            return TaskResponse.from_orm(task)

    async def _execute_task(self, db: Session, task_id: str) -> None:
        """Internal method to execute a task with retry logic"""
        task = None
        try:
            async with self.lock:
                task = db.query(Task).filter(Task.id == task_id).first()
                if not task:
                    raise TaskNotFoundError(message=f"Task {task_id} not found")

                task.status = "running"
                task.started_at = datetime.utcnow()
                db.commit()
                db.refresh(task)

                self.active_tasks[task_id] = asyncio.current_task()
                await workflow_monitor.task_started(task)
                await workflow_monitor.update_queue_metrics(self)

            # Smart retry with exponential backoff
            max_retries = task.max_retries
            base_delay = 1  # seconds
            max_delay = 60  # seconds

            for attempt in range(max_retries + 1):
                pre_state = None
                try:
                    # Capture pre-execution state
                    pre_state = {
                        'task': task.to_dict(),
                        'db_state': self._get_db_state(db, task)
                    }

                    # Execute task with timeout
                    result = await asyncio.wait_for(
                        self._execute_task_logic(db, task),
                        timeout=task.timeout if hasattr(task, 'timeout') else 30
                    )

                    # Post-execution validation
                    if not self._validate_execution(result):
                        raise CriticalError("Task execution validation failed")

                    # Mark task as completed if successful
                    async with self.lock:
                        task.status = "completed"
                        task.completed_at = datetime.utcnow()
                        db.commit()
                        await workflow_monitor.task_completed(task)
                    break

                except TransientError as e:
                    if attempt == max_retries:
                        # Attempt recovery actions if available
                        if hasattr(e, 'recovery_actions') and e.recovery_actions:
                            for action in e.recovery_actions:
                                try:
                                    await action(pre_state)
                                except Exception as recovery_error:
                                    logger.error(f"Recovery action failed: {recovery_error}")

                        await self._handle_failure(db, task, e)
                        await workflow_monitor.task_failed(task, e)
                        await workflow_monitor.update_queue_metrics(self)
                        break
                    
                    delay = min(base_delay * (2 ** attempt), max_delay)
                    await asyncio.sleep(delay)
                    continue

                except Exception as e:
                    # Attempt rollback if possible
                    if pre_state:
                        await self._rollback_state(db, pre_state)

                    async with self.lock:
                        task.status = "failed"
                        task.error_message = str(e)
                        db.commit()
                        await workflow_monitor.task_failed(task, e)

        except asyncio.CancelledError:
            async with self.lock:
                if task:
                    task.status = "cancelled"
                    db.commit()
                    await workflow_monitor.task_cancelled(task)
        except Exception as e:
            logger.error(f"Unexpected error in task execution: {e}")
        finally:
            async with self.lock:
                if task_id in self.active_tasks:
                    del self.active_tasks[task_id]
            await workflow_monitor.update_queue_metrics(self)

    def _get_db_state(self, db: Session, task: Task) -> dict:
        """Capture relevant database state before task execution"""
        return {
            'task': db.query(Task).filter(Task.id == task.id).first().to_dict(),
            'dependencies': [t.to_dict() for t in db.query(Task)
                           .filter(Task.batch_key == task.batch_key)
                           .all()] if task.batch_key else []
        }

    def _validate_execution(self, result: Any) -> bool:
        """Validate task execution results"""
        if result is None:
            return False
        if isinstance(result, dict) and result.get('status') == 'failed':
            return False
        return True

    async def _rollback_state(self, db: Session, state: dict) -> bool:
        """Attempt to restore system state from snapshot"""
        try:
            # Restore task state
            task = db.query(Task).filter(Task.id == state['task']['id']).first()
            if task:
                for key, value in state['task'].items():
                    if hasattr(task, key) and key not in ['id', 'created_at']:
                        setattr(task, key, value)
                
                # Restore batch state if applicable
                if 'dependencies' in state:
                    for dep_state in state['dependencies']:
                        dep = db.query(Task).filter(Task.id == dep_state['id']).first()
                        if dep:
                            for key, value in dep_state.items():
                                if hasattr(dep, key) and key not in ['id', 'created_at']:
                                    setattr(dep, key, value)
                
                db.commit()
                return True
        except Exception as e:
            logger.error(f"Rollback failed: {e}")
            db.rollback()
        return False

    async def _batch_processor(self) -> None:
        """Process tasks in batches"""
        while True:
            batch = {}
            try:
                # Collect tasks with same batch_key
                task_id = await self.batch_queue.get()
                async with self.lock:
                    task = db.query(Task).filter(Task.id == task_id).first()
                    if task and task.batch_key:
                        if task.batch_key not in batch:
                            batch[task.batch_key] = []
                        batch[task.batch_key].append(task.id)
                
                # Process batch when we have enough items or after timeout
                await asyncio.wait_for(
                    self._process_batch(db, batch[task.batch_key]),
                    timeout=5.0
                )
            except Exception as e:
                logger.error(f"Batch processing error: {e}", exc_info=True)

    async def _process_batch(self, db: Session, task_ids: List[str]) -> None:
        """Execute a batch of tasks together"""
        try:
            async with self.batch_lock:
                # Get all tasks in batch
                tasks = db.query(Task).filter(Task.id.in_(task_ids)).all()
                
                # Update status for all tasks
                for task in tasks:
                    task.status = "running"
                    task.started_at = datetime.utcnow()
                db.commit()

                # Execute batch logic
                results = await self._execute_batch_logic(db, tasks)

                # Update results and monitoring
                for task, result in zip(tasks, results):
                    if result.success:
                        task.status = "completed"
                        task.result = json.dumps(result.output)
                        await workflow_monitor.task_completed(task)
                    else:
                        task.status = "failed"
                        task.error_message = result.error
                        await workflow_monitor.task_failed(task, Exception(result.error))
                    task.completed_at = datetime.utcnow()
                db.commit()
                await workflow_monitor.update_queue_metrics(self)
        except Exception as e:
            logger.error(f"Batch processing failed: {e}", exc_info=True)
            # Mark all tasks as failed
            for task in tasks:
                task.status = "failed"
                task.error_message = "Batch processing error"
            db.commit()

    async def _parse_schedule(self, schedule: str) -> Optional[datetime]:
        """Parse cron-like schedule into next execution time"""
        if schedule == "immediate":
            return datetime.utcnow()
        try:
            return croniter(schedule, datetime.utcnow()).get_next(datetime)
        except Exception:
            logger.warning(f"Invalid schedule format: {schedule}")
            return None

# Global scheduler instance
task_scheduler = TaskScheduler()