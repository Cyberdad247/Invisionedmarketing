from typing import Dict, List, Any, Optional, AsyncGenerator, Union, Callable
import asyncio
import json
from pydantic import BaseModel, Field
from .base import BaseAgent

# Import CrewAI components
from crewai import Agent as CrewAIAgent
from crewai import Task as CrewAITask
from crewai import Crew as CrewAICrew
from crewai import Process
from langchain_openai import ChatOpenAI
from langchain.tools import BaseTool

class CrewAITool(BaseModel):
    """
    Schema for CrewAI tool configuration.
    """
    name: str
    description: str
    function: Optional[str] = None
    
    class Config:
        arbitrary_types_allowed = True

class CrewAgentConfig(BaseModel):
    """
    Configuration for a CrewAI agent.
    """
    name: str
    role: str = "Assistant"
    goal: str
    backstory: str
    verbose: bool = True
    allow_delegation: bool = False
    tools: List[CrewAITool] = Field(default_factory=list)
    
    # LLM configuration
    model: str = "gpt-4o"
    temperature: float = 0.7
    max_tokens: int = 1500

class CrewWorkflowConfig(BaseModel):
    """
    Configuration for a CrewAI workflow.
    """
    agents: List[CrewAgentConfig]
    tasks: List[Dict[str, Any]] = Field(default_factory=list)
    process: str = "sequential"  # "sequential" or "hierarchical"
    verbose: bool = True
    
    class Config:
        arbitrary_types_allowed = True

class CrewAgent(BaseAgent):
    """
    Wrapper for the CrewAI framework.
    
    This class provides a standardized interface for creating and running
    agents using the CrewAI framework, which specializes in collaborative
    agent workflows.
    """
    
    def __init__(
        self,
        name: str,
        model: str,
        system_prompt: str,
        tools: Optional[List[Dict[str, Any]]] = None,
        parameters: Optional[Dict[str, Any]] = None
    ):
        """
        Initialize a CrewAI agent.
        
        Args:
            name: Name of the agent
            model: LLM model to use (e.g., 'gpt-4o', 'claude-3-opus')
            system_prompt: System instructions for the agent
            tools: List of tools available to the agent
            parameters: Additional parameters for customizing agent behavior
        """
        super().__init__(name, model, system_prompt, tools, parameters)
        
        # Extract CrewAI-specific parameters
        parameters = parameters or {}
        self.role = parameters.get("role", "Assistant")
        self.goal = parameters.get("goal", system_prompt)
        self.backstory = parameters.get("backstory", f"{name} is an AI assistant.")
        self.verbose = parameters.get("verbose", True)
        self.allow_delegation = parameters.get("allow_delegation", False)
        self.temperature = parameters.get("temperature", 0.7)
        self.max_tokens = parameters.get("max_tokens", 1500)
        
        # Will be initialized when needed
        self._crew_agent = None
        self._crew = None
        self._llm = None
        self._crew_tools = None
        self._tool_functions = {}
    
    def _initialize_llm(self):
        """
        Initialize the language model based on the specified model name.
        
        This method creates the appropriate LLM instance for CrewAI based on
        the model name provided during initialization.
        
        Returns:
            The initialized LLM instance
        """
        try:
            # Initialize the appropriate LLM based on the model name
            if "gpt" in self.model.lower():
                return ChatOpenAI(
                    model=self.model,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens
                )
            else:
                # Default to OpenAI if model not specifically handled
                return ChatOpenAI(
                    model=self.model,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens
                )
        except Exception as e:
            print(f"Error initializing LLM for CrewAI: {str(e)}")
            raise
    
    def _register_tool_function(self, tool_config):
        """
        Register a tool function for later use.
        
        Args:
            tool_config: Configuration for the tool
            
        Returns:
            The function that will be called when the tool is used
        """
        tool_name = tool_config["name"]
        
        # Define a function that will be called when the tool is used
        def tool_function(input_str):
            """Tool function that will be called when the tool is used."""
            print(f"Tool {tool_name} called with input: {input_str}")
            # In a real implementation, this would call the actual tool function
            # For now, return a placeholder response
            return f"Result from {tool_name}: processed '{input_str}'"
        
        # Store the function for later use
        self._tool_functions[tool_name] = tool_function
        
        return tool_function
    
    def _initialize_tools(self):
        """
        Initialize the tools for the CrewAI agent.
        
        This method converts the tool configurations provided during initialization
        into CrewAI-compatible tool instances.
        
        Returns:
            List of initialized CrewAI tool instances
        """
        if not self.tools:
            return []
        
        initialized_tools = []
        
        try:
            for tool_config in self.tools:
                # Register the tool function
                tool_function = self._register_tool_function(tool_config)
                
                # Create a LangChain tool
                tool = BaseTool(
                    name=tool_config["name"],
                    description=tool_config.get("description", ""),
                    func=tool_function,
                    return_direct=tool_config.get("return_direct", False)
                )
                
                initialized_tools.append(tool)
            
            return initialized_tools
            
        except Exception as e:
            print(f"Error initializing tools for CrewAI: {str(e)}")
            return []
    
    def _initialize_agent(self):
        """
        Initialize the CrewAI agent with the configured settings.
        
        This method creates a CrewAI agent instance with the name, role,
        goal, backstory, and other parameters specified during initialization.
        
        Returns:
            The initialized CrewAI agent instance
        """
        if self._crew_agent is not None:
            return self._crew_agent
        
        try:
            # Initialize LLM if not already done
            if self._llm is None:
                self._llm = self._initialize_llm()
            
            # Initialize tools if not already done
            if self._crew_tools is None:
                self._crew_tools = self._initialize_tools()
            
            # Create the CrewAI agent
            self._crew_agent = CrewAIAgent(
                name=self.name,
                role=self.role,
                goal=self.goal,
                backstory=self.backstory,
                verbose=self.verbose,
                allow_delegation=self.allow_delegation,
                tools=self._crew_tools,
                llm=self._llm
            )
            
            return self._crew_agent
            
        except Exception as e:
            print(f"Error initializing CrewAI agent: {str(e)}")
            raise
    
    def _initialize_crew(self, agents=None):
        """
        Initialize a CrewAI crew with this agent and optionally other agents.
        
        This method creates a CrewAI crew instance with this agent and any
        additional agents provided.
        
        Args:
            agents: Optional list of additional CrewAI agents to include in the crew
            
        Returns:
            The initialized CrewAI crew instance
        """
        try:
            # Initialize agent if not already done
            if self._crew_agent is None:
                self._initialize_agent()
            
            # Prepare the list of agents
            crew_agents = [self._crew_agent]
            if agents:
                crew_agents.extend(agents)
            
            # Determine the process type
            process_type = self.parameters.get("process", "sequential")
            if process_type.lower() == "hierarchical":
                process = Process.hierarchical
            else:
                process = Process.sequential
            
            # Create the CrewAI crew
            self._crew = CrewAICrew(
                agents=crew_agents,
                tasks=[],  # Tasks will be created dynamically based on input
                verbose=self.verbose,
                process=process
            )
            
            return self._crew
            
        except Exception as e:
            print(f"Error initializing CrewAI crew: {str(e)}")
            raise
    
    def _create_task(self, input_text, agent=None):
        """
        Create a CrewAI task from the input text.
        
        This method creates a CrewAI task that the agent can work on,
        based on the input text provided by the user.
        
        Args:
            input_text: The input text to process
            agent: Optional agent to assign the task to (defaults to this agent)
            
        Returns:
            A CrewAI task instance
        """
        try:
            # Initialize agent if not already done
            if self._crew_agent is None:
                self._initialize_agent()
            
            # Use this agent if none specified
            if agent is None:
                agent = self._crew_agent
            
            # Create the CrewAI task
            task = CrewAITask(
                description=input_text,
                agent=agent,
                expected_output="A helpful response addressing the user's request."
            )
            
            return task
            
        except Exception as e:
            print(f"Error creating CrewAI task: {str(e)}")
            raise
    
    async def run(self, input_text: str) -> str:
        """
        Run the CrewAI agent with the given input.
        
        This method initializes the agent and crew if needed, creates a task
        based on the input text, and runs the crew to get a response.
        
        Args:
            input_text: The input text to process
            
        Returns:
            The agent's response as a string
        """
        try:
            # Initialize agent if not already done
            if self._crew_agent is None:
                self._initialize_agent()
            
            # Initialize crew if not already done
            if self._crew is None:
                self._initialize_crew()
            
            # Create a task from the input text
            task = self._create_task(input_text)
            
            # Set the crew's tasks
            self._crew.tasks = [task]
            
            # Run the crew in a separate thread to avoid blocking
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, self._crew.kickoff)
            
            return result
            
        except Exception as e:
            error_message = f"Error running CrewAI agent: {str(e)}"
            print(error_message)
            return error_message
    
    async def stream(self, input_text: str) -> AsyncGenerator[str, None]:
        """
        Stream the CrewAI agent's response.
        
        This method simulates streaming the agent's response chunk by chunk.
        CrewAI doesn't natively support streaming, so we run the agent and
        then simulate streaming the response.
        
        Args:
            input_text: The input text to process
            
        Yields:
            Chunks of the agent's response
        """
        try:
            # Run the agent to get the full response
            full_response = await self.run(input_text)
            
            # Split the response into chunks for streaming
            # This is a simulation since CrewAI doesn't natively support streaming
            chunk_size = 20  # Characters per chunk
            for i in range(0, len(full_response), chunk_size):
                yield full_response[i:i+chunk_size]
                await asyncio.sleep(0.05)  # Simulate streaming delay
            
        except Exception as e:
            error_message = f"Error streaming CrewAI agent response: {str(e)}"
            print(error_message)
            yield error_message
    
    @classmethod
    def from_config(cls, config: CrewAgentConfig) -> 'CrewAgent':
        """
        Create a CrewAgent from a configuration object.
        
        Args:
            config: CrewAgentConfig object
            
        Returns:
            Initialized CrewAgent
        """
        tools = []
        for tool in config.tools:
            tools.append({
                "name": tool.name,
                "description": tool.description,
                "function": tool.function
            })
        
        return cls(
            name=config.name,
            model=config.model,
            system_prompt=config.goal,  # Use goal as system prompt
            tools=tools,
            parameters={
                "role": config.role,
                "goal": config.goal,
                "backstory": config.backstory,
                "verbose": config.verbose,
                "allow_delegation": config.allow_delegation,
                "temperature": config.temperature,
                "max_tokens": config.max_tokens
            }
        )
