from fastapi import APIRouter

router = APIRouter(
    tags=["health"],
    description="Endpoints for system health monitoring"
)

@router.get("/health", summary="Health Check", description="Basic health check endpoint to verify API availability")
def read_health():
    """
    Basic health check endpoint to verify the API is running.
    
    This endpoint can be used by monitoring tools to check if the API is available
    and responding correctly. It returns a simple status message indicating the
    API is operational.
    
    Returns:
        dict: A dictionary with a status key indicating the health status.
    """
    return {"status": "ok"}
