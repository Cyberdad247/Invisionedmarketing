from sqlmodel import Field, SQLModel, Column, JSON
from typing import Optional

class Tool(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: str
    parameters: dict = Field(default={}, sa_column=Column(JSON))