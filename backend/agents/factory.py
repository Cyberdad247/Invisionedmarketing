from typing import Dict, List, Any, Optional
from .base import BaseAgent
from .smol_agent import SmolAgent
from .crew_agent import CrewAgent

from typing import Dict, Any
from .base import BaseAgent
from .smol_agent import SmolAgent
from .crew_agent import CrewAgent

def create_agent(config: Dict[str, Any]) -> BaseAgent:
    """
    Create an agent based on the provided configuration.
    
    Args:
        config: Agent configuration
        
    Returns:
        An instance of BaseAgent
        
    Raises:
        ValueError: If the framework is not supported
    """
    framework = config.get("framework", "").lower()
    
    if framework == "smol":
        return SmolAgent(
            name=config["name"],
            description=config.get("description", ""),
            system_prompt=config["system_prompt"],
            model=config["model"],
            tools=config.get("tools", []),
            parameters=config.get("parameters", {})
        )
    elif framework == "crewai":
        return CrewAgent(
            name=config["name"],
            description=config.get("description", ""),
            system_prompt=config["system_prompt"],
            model=config["model"],
            tools=config.get("tools", []),
            parameters=config.get("parameters", {})
        )
    else:
        raise ValueError(f"Unsupported agent framework: {framework}")
