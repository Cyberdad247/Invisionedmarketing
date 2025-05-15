from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List
from sqlalchemy.orm import Session
from ..schemas import ToolResponse, ToolSearchRequest
from ..services import tool_service
from ..dependencies import get_db

router = APIRouter(prefix="/mcp_tools", tags=["mcp_tools"])

@router.get("/search", response_model=List[ToolResponse])
async def search_tools( # Made asynchronous
    query: str = Query(..., description="Search query for tools"),
    db: Session = Depends(get_db)
):
    """
    Search for tools based on the provided query.
    """
    tools = await tool_service.search_tools(db, query) # Await the asynchronous service function
    if not tools:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No tools found for query: '{query}'") # Use status and improved message
    return tools

@router.post("/execute", response_model=ToolResponse)
async def execute_tool( # Made async to match service function
    tool_request: ToolExecuteRequest, # Updated schema
    db: Session = Depends(get_db)
):
    """
    Execute a tool based on the provided request.
    """
    tool = await tool_service.execute_tool(db, tool_request) # Await the async service function
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found or execution failed")
    return tool