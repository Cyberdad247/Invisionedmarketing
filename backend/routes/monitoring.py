from fastapi import APIRouter, Depends
from fastapi.responses import Response, JSONResponse
from sqlalchemy.orm import Session
from ..services.workflow_monitor import workflow_monitor
from ..dependencies import get_db
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

router = APIRouter(
    prefix="/monitoring", 
    tags=["monitoring"],
    description="Endpoints for monitoring system performance and task execution"
)

@router.get("/metrics", summary="Get Prometheus Metrics", description="Exposes Prometheus metrics for system monitoring and alerting")
async def get_metrics():
    """Expose Prometheus metrics for system monitoring.
    
    Returns:
        Response: Raw Prometheus metrics in the standard format.
    """
    return Response(
        generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )

@router.get("/active-tasks", summary="Get Active Tasks", description="Retrieves a list of all currently running tasks in the system")
async def get_active_tasks(db: Session = Depends(get_db)):
    """Get list of currently active tasks in the system.
    
    This endpoint provides real-time information about tasks that are currently
    being processed, including their status, duration, and resource utilization.
    
    Returns:
        JSONResponse: A list of active task objects with their details.
    """
    active_tasks = await workflow_monitor.get_active_tasks()
    return JSONResponse(content={"active_tasks": active_tasks})

@router.get("/queue-stats", summary="Get Queue Statistics", description="Retrieves statistics about the task processing queue")
async def get_queue_stats(db: Session = Depends(get_db)):
    """Get current queue statistics for task processing.
    
    Provides metrics about the task queue including queue length, average wait time,
    throughput, and other performance indicators to help monitor system load.
    
    Returns:
        JSONResponse: Queue statistics including length, processing rate, and performance metrics.
    """
    stats = await workflow_monitor.get_queue_stats()
    return JSONResponse(content=stats)

@router.get("/debug-checkpoints")
async def get_debug_checkpoints():
    """Get debug checkpoint status"""
    checkpoints = await workflow_monitor.get_debug_checkpoints()
    return JSONResponse(content={"checkpoints": checkpoints})