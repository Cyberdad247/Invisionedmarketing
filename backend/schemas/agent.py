from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class AgentBase(BaseModel):
    """
    Base schema for agent data.
    """
    name: str = Field(..., description="Name of the agent")
    description: Optional[str] = Field(None, description="Description of the agent")
    framework: str = Field(..., description="Agent framework (e.g., 'smol', 'crew', 'langgraph')")
    model: str = Field(..., description="LLM model to use (e.g., 'gpt-4o', 'claude-3')")
    system_prompt: str = Field(..., description="System prompt for the agent")
    tools: Optional[List[Dict[str, Any]]] = Field(None, description="Tools available to the agent")
    parameters: Optional[Dict[str, Any]] = Field(None, description="Additional parameters for the agent")

class AgentCreate(AgentBase):
    """
    Schema for creating a new agent.
    """
    pass

class AgentUpdate(BaseModel):
    """
    Schema for updating an existing agent.
    """
    name: Optional[str] = None
    description: Optional[str] = None
    framework: Optional[str] = None
    model: Optional[str] = None
    system_prompt: Optional[str] = None
    tools: Optional[List[Dict[str, Any]]] = None
    parameters: Optional[Dict[str, Any]] = None

class AgentResponse(AgentBase):
    """
    Schema for agent response.
    """
    id: int
    
    class Config:
        orm_mode = True
