from pydantic import BaseModel
from typing import List, Dict, Any

class ToolResponse(BaseModel):
    id: int
    name: str
    description: str
    parameters: dict

class ToolSearchRequest(BaseModel):
    query: str

class ToolExecuteRequest(BaseModel):
    """Request model for tool execution."""
    tool_name: str # Added tool_name for clarity in our service layer
    parameters: Dict[str, Any]