from fastapi import APIRouter, HTTPException, Depends, status
from typing import Optional
from sqlalchemy.orm import Session
from ..schemas.task import TaskCreate, TaskResponse
from ..services.task_scheduler import task_scheduler
from ..dependencies import get_db
from ..errors import TaskNotFoundError, InvalidRequestError, CriticalError

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db)
):
    """
    Create and schedule a new task.
    
    Parameters:
    - name: Task name (required)
    - description: Task description
    - schedule: Execution schedule (cron syntax or 'immediate')
    - priority: Task priority (1-10, 1 being highest)
    - max_retries: Maximum retry attempts (default: 3)
    """
    try:
        return await task_scheduler.create_task(db, task_data)
    except InvalidRequestError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=e.message,
            headers={"X-Error": str(e.details)}
        )
    except CriticalError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
            headers={"X-Error": str(e.details)}
        )

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    db: Session = Depends(get_db)
):
    """
    Get task details by ID.
    """
    try:
        return await task_scheduler.get_task(db, task_id)
    except TaskNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.message,
            headers={"X-Error": str(e.details)}
        )
    except CriticalError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
            headers={"X-Error": str(e.details)}
        )

@router.put("/{task_id}/cancel", response_model=TaskResponse)
async def cancel_task(
    task_id: str,
    db: Session = Depends(get_db)
):
    """
    Cancel a scheduled or running task.
    """
    try:
        return await task_scheduler.cancel_task(db, task_id)
    except TaskNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=e.message,
            headers={"X-Error": str(e.details)}
        )
    except CriticalError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=e.message,
            headers={"X-Error": str(e.details)}
        )