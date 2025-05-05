from sqlmodel import SQLModel, Field
from typing import Optional, Dict, List
import json

class Agent(SQLModel, table=True):
    """
    Database model for agents.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    framework: str
    model: str
    system_prompt: str
    _tools: Optional[str] = Field(default=None, sa_column_kwargs={"name": "tools"})
    _parameters: Optional[str] = Field(default=None, sa_column_kwargs={"name": "parameters"})

    @property
    def tools(self) -> Optional[List[Dict]]:
        if self._tools:
            return json.loads(self._tools)
        return None

    @tools.setter
    def tools(self, value: Optional[List[Dict]]):
        if value:
            self._tools = json.dumps(value)
        else:
            self._tools = None

    @property
    def parameters(self) -> Optional[Dict]:
        if self._parameters:
            return json.loads(self._parameters)
        return None

    @parameters.setter
    def parameters(self, value: Optional[Dict]):
        if value:
            self._parameters = json.dumps(value)
        else:
            self._parameters = None
