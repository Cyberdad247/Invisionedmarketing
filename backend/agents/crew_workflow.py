from typing import Dict, List, Any, Optional, AsyncGenerator, Union
import asyncio
import json
from pydantic import BaseModel, Field

from crewai import Agent as CrewAIAgent
from crewai import Task as CrewAITask
from crewai import Crew as CrewAICrew
from crewai import Process

from .crew_agent import CrewAgent, CrewAgentConfig, CrewWorkflowConfig

class CrewWorkflow:
    """
    Manages workflows involving multiple CrewAI agents.
    
    This class provides functionality for creating and running workflows
    that involve multiple CrewAI agents working together.
    """
    
    def __init__(self, config: CrewWorkflowConfig):
        """
        Initialize a CrewAI workflow.
        
        Args:
            config: Configuration for the workflow
        """
        self.config = config
        self.agents = []
        self.crew_agents = []
        self.tasks = []
        self.crew = None
        
        # Initialize agents
        for agent_config in config.agents:
            agent = CrewAgent.from_config(agent_config)
            self.agents.append(agent)
            # Initialize the CrewAI agent
            crew_agent = agent._initialize_agent()
            self.crew_agents.append(crew_agent)
    
    def add_task(self, description: str, agent_index: int, expected_output: str = None):
        """
        Add a task to the workflow.
        
        Args:
            description: Description of the task
            agent_index: Index of the agent to assign the task to
            expected_output: Optional description of the expected output
            
        Returns:
            The created task
        """
        if agent_index < 0 or agent_index >= len(self.crew_agents):
            raise ValueError(f"Invalid agent index: {agent_index}")
        
        agent = self.crew_agents[agent_index]
        
        task = CrewAITask(
            description=description,
            agent=agent,
            expected_output=expected_output or "A helpful response addressing the task."
        )
        
        self.tasks.append(task)
        return task
    
    def _initialize_crew(self):
        """
        Initialize the CrewAI crew with the configured agents and tasks.
        
        Returns:
            The initialized CrewAI crew
        """
        if self.crew is not None:
            return self.crew
        
        # Determine the process type
        process_type = self.config.process.lower()
        if process_type == "hierarchical":
            process = Process.hierarchical
        else:
            process = Process.sequential
        
        # Create the CrewAI crew
        self.crew = CrewAICrew(
            agents=self.crew_agents,
            tasks=self.tasks,
            verbose=self.config.verbose,
            process=process
        )
        
        return self.crew
    
    async def run(self) -> str:
        """
        Run the workflow.
        
        Returns:
            The result of running the workflow
        """
        try:
            # Initialize crew if not already done
            if self.crew is None:
                self._initialize_crew()
            
            # Run the crew in a separate thread to avoid blocking
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, self.crew.kickoff)
            
            return result
            
        except Exception as e:
            error_message = f"Error running CrewAI workflow: {str(e)}"
            print(error_message)
            return error_message
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'CrewWorkflow':
        """
        Create a CrewWorkflow from a dictionary.
        
        Args:
            data: Dictionary containing workflow configuration
            
        Returns:
            Initialized CrewWorkflow
        """
        # Convert agent configurations
        agent_configs = []
        for agent_data in data.get("agents", []):
            agent_configs.append(CrewAgentConfig(**agent_data))
        
        # Create workflow configuration
        config = CrewWorkflowConfig(
            agents=agent_configs,
            tasks=[],  # Tasks will be added separately
            process=data.get("process", "sequential"),
            verbose=data.get("verbose", True)
        )
        
        # Create workflow
        workflow = cls(config)
        
        # Add tasks
        for task_data in data.get("tasks", []):
            workflow.add_task(
                description=task_data["description"],
                agent_index=task_data["agent_index"],
                expected_output=task_data.get("expected_output")
            )
        
        return workflow
