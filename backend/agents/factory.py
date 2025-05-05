from typing import Dict, List, Any, Optional
from .base import BaseAgent
from .smol_agent import SmolAgent
from .crew_agent import CrewAgent

def create_agent(
    framework: str,
    name: str,
    model: str,
    system_prompt: str,
    tools: Optional[List[Dict[str, Any]]] = None,
    parameters: Optional[Dict[str, Any]] = None
) -> BaseAgent:
    """
    Factory function to create an agent based on the specified framework.
    
    Args:
        framework: The agent framework to use (e.g., 'smol', 'crew', 'langgraph')
        name: Name of the agent
        model: LLM model to use
        system_prompt: System prompt for the agent
        tools: Tools available to the agent
        parameters: Additional parameters for the agent
        
    Returns:
        An instance of the appropriate agent class
        
    Raises:
        ValueError: If the specified framework is not supported
    """
    framework = framework.lower()
    
    if framework == "smol":
        return SmolAgent(name, model, system_prompt, tools, parameters)
    elif framework == "crew" or framework == "crewai":
        return CrewAgent(name, model, system_prompt, tools, parameters)
    # Add support for other frameworks as needed
    else:
        raise ValueError(f"Unsupported agent framework: {framework}")
