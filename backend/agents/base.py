from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional

class BaseAgent(ABC):
    """
    Base class for all agent implementations.
    """
    def __init__(
        self,
        name: str,
        model: str,
        system_prompt: str,
        tools: Optional[List[Dict[str, Any]]] = None,
        parameters: Optional[Dict[str, Any]] = None
    ):
        self.name = name
        self.model = model
        self.system_prompt = system_prompt
        self.tools = tools or []
        self.parameters = parameters or {}
    
    @abstractmethod
    async def run(self, input_text: str) -> str:
        """
        Run the agent with the given input.
        
        Args:
            input_text: The input text to process
            
        Returns:
            The agent's response
        """
        pass
    
    @abstractmethod
    async def stream(self, input_text: str):
        """
        Stream the agent's response.
        
        Args:
            input_text: The input text to process
            
        Yields:
            Chunks of the agent's response
        """
        pass
