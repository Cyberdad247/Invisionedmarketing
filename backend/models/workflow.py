from sqlmodel import Field, SQLModel, Column, JSON
from typing import Dict, List, Optional, Any
from datetime import datetime
from uuid import UUID, uuid4

class Workflow(SQLModel, table=True):
    """Database model for workflow data."""
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str
    description: Optional[str] = None
    steps: List[Dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
