from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any, Union
from datetime import datetime
from uuid import UUID, uuid4

class WorkflowStepBase(BaseModel):
    """Base schema for a workflow step."""
    name: str
    agent_id: UUID
    inputs: Dict[str, Any] = Field(default_factory=dict)
    outputs: List[str] = Field(default_factory=list)
    
class WorkflowBase(BaseModel):
    """Base schema for workflow data."""
    name: str = Field(..., description="Name of the workflow")
    description: Optional[str] = Field(None, description="Description of the workflow's purpose")
    
class WorkflowCreate(WorkflowBase):
    """Schema for creating a new workflow."""
    steps: List[WorkflowStepBase] = Field(..., description="Steps in the workflow")
    
class WorkflowUpdate(BaseModel):
    """Schema for updating an existing workflow."""
    name: Optional[str] = None
    description: Optional[str] = None
    steps: Optional[List[WorkflowStepBase]] = None
    
class WorkflowInDB(WorkflowBase):
    """Schema for workflow data as stored in the database."""
    id: UUID = Field(default_factory=uuid4)
    steps: List[WorkflowStepBase]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
