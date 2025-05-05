from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def read_health():
    """
    Basic health check endpoint.
    """
    return {"status": "ok"}
