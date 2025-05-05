from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, List, Any, Optional
from pydantic import BaseModel

from agents.crew_agent import CrewAgent, CrewAgentConfig
from agents.crew_workflow import CrewWorkflow, CrewWorkflowConfig

router = APIRouter(prefix="/crew", tags=["crew"])

class CrewAgentRequest(BaseModel):
    """
    Request schema for creating a CrewAI agent.
    """
    name: str
    role: str
    goal: str
    backstory: str
    model: str = "gpt-4o"
    verbose: bool = True
    allow_delegation: bool = False
    tools: List[Dict[str, Any]] = []
    temperature: float = 0.7
    max_tokens: int = 1500

class CrewAgentResponse(BaseModel):
    """
    Response schema for a CrewAI agent.
    """
    name: str
    role: str
    goal: str
    backstory: str
    model: str
    verbose: bool
    allow_delegation: bool
    tools: List[Dict[str, Any]]
    temperature: float
    max_tokens: int

class CrewRunRequest(BaseModel):
    """
    Request schema for running a CrewAI agent.
    """
    input: str

class CrewRunResponse(BaseModel):
    """
    Response schema for running a CrewAI agent.
    """
    output: str

class CrewWorkflowRequest(BaseModel):
    """
    Request schema for creating a CrewAI workflow.
    """
    agents: List[CrewAgentRequest]
    tasks: List[Dict[str, Any]]
    process: str = "sequential"
    verbose: bool = True

class CrewWorkflowResponse(BaseModel):
    """
    Response schema for a CrewAI workflow.
    """
    agents: List[CrewAgentResponse]
    tasks: List[Dict[str, Any]]
    process: str
    verbose: bool

# In-memory storage for agents and workflows
# In a real implementation, these would be stored in a database
crew_agents = {}
crew_workflows = {}

@router.post("/agents", response_model=CrewAgentResponse)
async def create_crew_agent(request: CrewAgentRequest):
    """
    Create a new CrewAI agent.
    """
    # Convert tools to the expected format
    tools = []
    for tool in request.tools:
        tools.append({
            "name": tool["name"],
            "description": tool.get("description", ""),
            "function": tool.get("function")
        })
    
    # Create agent configuration
    config = CrewAgentConfig(
        name=request.name,
        role=request.role,
        goal=request.goal,
        backstory=request.backstory,
        model=request.model,
        verbose=request.verbose,
        allow_delegation=request.allow_delegation,
        tools=tools,
        temperature=request.temperature,
        max_tokens=request.max_tokens
    )
    
    # Create agent
    agent = CrewAgent.from_config(config)
    
    # Store agent in memory
    crew_agents[request.name] = agent
    
    # Return response
    return CrewAgentResponse(
        name=request.name,
        role=request.role,
        goal=request.goal,
        backstory=request.backstory,
        model=request.model,
        verbose=request.verbose,
        allow_delegation=request.allow_delegation,
        tools=request.tools,
        temperature=request.temperature,
        max_tokens=request.max_tokens
    )

@router.get("/agents", response_model=List[CrewAgentResponse])
async def list_crew_agents():
    """
    List all CrewAI agents.
    """
    responses = []
    for name, agent in crew_agents.items():
        responses.append(CrewAgentResponse(
            name=agent.name,
            role=agent.role,
            goal=agent.goal,
            backstory=agent.backstory,
            model=agent.model,
            verbose=agent.verbose,
            allow_delegation=agent.allow_delegation,
            tools=agent.tools or [],
            temperature=agent.temperature,
            max_tokens=agent.max_tokens
        ))
    return responses

@router.get("/agents/{name}", response_model=CrewAgentResponse)
async def get_crew_agent(name: str):
    """
    Get a specific CrewAI agent.
    """
    if name not in crew_agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent = crew_agents[name]
    return CrewAgentResponse(
        name=agent.name,
        role=agent.role,
        goal=agent.goal,
        backstory=agent.backstory,
        model=agent.model,
        verbose=agent.verbose,
        allow_delegation=agent.allow_delegation,
        tools=agent.tools or [],
        temperature=agent.temperature,
        max_tokens=agent.max_tokens
    )

@router.post("/agents/{name}/run", response_model=CrewRunResponse)
async def run_crew_agent(name: str, request: CrewRunRequest):
    """
    Run a CrewAI agent with the given input.
    """
    if name not in crew_agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent = crew_agents[name]
    output = await agent.run(request.input)
    
    return CrewRunResponse(output=output)

@router.post("/workflows", response_model=CrewWorkflowResponse)
async def create_crew_workflow(request: CrewWorkflowRequest):
    """
    Create a new CrewAI workflow.
    """
    # Convert agent requests to agent configurations
    agent_configs = []
    for agent_request in request.agents:
        # Convert tools to the expected format
        tools = []
        for tool in agent_request.tools:
            tools.append({
                "name": tool["name"],
                "description": tool.get("description", ""),
                "function": tool.get("function")
            })
        
        agent_configs.append(CrewAgentConfig(
            name=agent_request.name,
            role=agent_request.role,
            goal=agent_request.goal,
            backstory=agent_request.backstory,
            model=agent_request.model,
            verbose=agent_request.verbose,
            allow_delegation=agent_request.allow_delegation,
            tools=tools,
            temperature=agent_request.temperature,
            max_tokens=agent_request.max_tokens
        ))
    
    # Create workflow configuration
    config = CrewWorkflowConfig(
        agents=agent_configs,
        tasks=[],  # Tasks will be added separately
        process=request.process,
        verbose=request.verbose
    )
    
    # Create workflow
    workflow = CrewWorkflow(config)
    
    # Add tasks
    for task_data in request.tasks:
        workflow.add_task(
            description=task_data["description"],
            agent_index=task_data["agent_index"],
            expected_output=task_data.get("expected_output")
        )
    
    # Store workflow in memory
    workflow_id = f"workflow_{len(crew_workflows) + 1}"
    crew_workflows[workflow_id] = workflow
    
    # Return response
    return CrewWorkflowResponse(
        agents=[CrewAgentResponse(
            name=agent.name,
            role=agent.role,
            goal=agent.goal,
            backstory=agent.backstory,
            model=agent.model,
            verbose=agent.verbose,
            allow_delegation=agent.allow_delegation,
            tools=agent.tools or [],
            temperature=agent.temperature,
            max_tokens=agent.max_tokens
        ) for agent in workflow.agents],
        tasks=request.tasks,
        process=request.process,
        verbose=request.verbose
    )

@router.post("/workflows/{workflow_id}/run", response_model=CrewRunResponse)
async def run_crew_workflow(workflow_id: str):
    """
    Run a CrewAI workflow.
    """
    if workflow_id not in crew_workflows:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    workflow = crew_workflows[workflow_id]
    output = await workflow.run()
    
    return CrewRunResponse(output=output)
