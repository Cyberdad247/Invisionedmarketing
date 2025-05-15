import asyncio
from datetime import datetime
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from prometheus_client import Counter, Gauge, Histogram
from ..models.task import Task
from ..errors import TaskError

# Prometheus metrics
TASKS_STARTED = Counter('tasks_started_total', 'Total tasks started', ['type'])
TASKS_COMPLETED = Counter('tasks_completed_total', 'Total tasks completed', ['type', 'status'])
TASK_DURATION = Histogram('task_duration_seconds', 'Task duration in seconds', ['type'])
ACTIVE_TASKS = Gauge('active_tasks', 'Currently active tasks')
QUEUE_SIZE = Gauge('task_queue_size', 'Current task queue size')

class WorkflowMonitor:
    def __init__(self):
        self._task_metrics: Dict[str, Dict] = {}
        self._lock = asyncio.Lock()
        
    async def task_started(self, task: Task):
        """Record when a task starts execution"""
        async with self._lock:
            self._task_metrics[task.id] = {
                'start_time': datetime.utcnow(),
                'type': task.name,
                'retries': task.retry_count
            }
            TASKS_STARTED.labels(type=task.name).inc()
            ACTIVE_TASKS.inc()
            
    async def task_completed(self, task: Task):
        """Record when a task completes successfully"""
        async with self._lock:
            if task.id not in self._task_metrics:
                return
                
            metrics = self._task_metrics.pop(task.id)
            duration = (datetime.utcnow() - metrics['start_time']).total_seconds()
            
            TASK_DURATION.labels(type=task.name).observe(duration)
            TASKS_COMPLETED.labels(type=task.name, status='success').inc()
            ACTIVE_TASKS.dec()
            
    async def task_failed(self, task: Task, error: TaskError):
        """Record when a task fails"""
        async with self._lock:
            if task.id not in self._task_metrics:
                return
                
            metrics = self._task_metrics.pop(task.id)
            duration = (datetime.utcnow() - metrics['start_time']).total_seconds()
            
            TASK_DURATION.labels(type=task.name).observe(duration)
            status = 'retryable' if error.retryable else 'failed'
            TASKS_COMPLETED.labels(type=task.name, status=status).inc()
            ACTIVE_TASKS.dec()
            
    async def update_queue_metrics(self, scheduler):
        """Update queue size metrics"""
        QUEUE_SIZE.set(scheduler.task_queue.qsize())
        
    def get_active_tasks(self) -> List[Dict]:
        """Get information about currently active tasks"""
        return [
            {
                'task_id': task_id,
                'type': metrics['type'],
                'duration': (datetime.utcnow() - metrics['start_time']).total_seconds(),
                'retries': metrics['retries']
            }
            for task_id, metrics in self._task_metrics.items()
        ]

# Global monitor instance
workflow_monitor = WorkflowMonitor()