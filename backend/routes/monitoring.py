from fastapi import APIRouter, Depends
from fastapi.responses import Response, JSONResponse
from sqlalchemy.orm import Session
from ..services.workflow_monitor import workflow_monitor
from ..dependencies import get_db
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

router = APIRouter(prefix="/monitoring", tags=["monitoring"])

@router.get("/metrics")
async def get_metrics():
    """Expose Prometheus metrics"""
    return Response(
        generate_latest(),
        media_type=CONTENT_TYPE_LATEST
    )

@router.get("/active-tasks")
async def get_active_tasks(db: Session = Depends(get_db)):
    """Get list of currently active tasks"""
    active_tasks = await workflow_monitor.get_active_tasks()
    return JSONResponse(content={"active_tasks": active_tasks})

@router.get("/queue-stats")
async def get_queue_stats(db: Session = Depends(get_db)):
    """Get current queue statistics"""
    stats = await workflow_monitor.get_queue_stats()
    return JSONResponse(content=stats)

@router.get("/debug-checkpoints")
async def get_debug_checkpoints():
    """Get debug checkpoint status"""
    checkpoints = await workflow_monitor.get_debug_checkpoints()
    return JSONResponse(content={"checkpoints": checkpoints})