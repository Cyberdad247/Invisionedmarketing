from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query, Path
from fastapi.responses import StreamingResponse
from typing import Dict, List, Any, Optional, Union
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
import asyncio
import json
import uuid
from datetime import datetime

from utils.db import get_db
from agents.crew_agent import CrewAgent, CrewAgentConfig, CrewAITool
from agents.crew_workflow import CrewWorkflow, CrewWorkflowConfig

router = APIRouter(prefix="/crew", tags=["crew"])

# ==================== Schema Definitions ====================

class ToolRequest(BaseModel):
    """Schema for tool configuration in requests."""
    name: str
    description: str
    function: Optional[str] = None
    return_direct: bool = False

class CrewAgentRequest(BaseModel):
    """Request schema for creating a CrewAI agent."""
    name: str
    role: str
    goal: str
    backstory: str
    model: str = "gpt-4o"
    verbose: bool = True
    allow_delegation: bool = False
    tools: List[ToolRequest] = Field(default_factory=list)
    temperature: float = 0.7
    max_tokens: int = 1500

class CrewAgentUpdateRequest(BaseModel):
    """Request schema for updating a CrewAI agent."""
    role: Optional[str] = None
    goal: Optional[str] = None
    backstory: Optional[str] = None
    model: Optional[str] = None
    verbose: Optional[bool] = None
    allow_delegation: Optional[bool] = None
    tools: Optional[List[ToolRequest]] = None
    temperature: Optional[float] = None
    max_tokens: Optional[int] = None

class CrewAgentResponse(BaseModel):
    """Response schema for a CrewAI agent."""
    id: int
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
    created_at: datetime
    updated_at: datetime

class CrewRunRequest(BaseModel):
    """Request schema for running a CrewAI agent."""
    input: str
    stream: bool = False

class CrewRunResponse(BaseModel):
    """Response schema for running a CrewAI agent."""
    agent_id: int
    execution_id: str
    output: str
    execution_time: float

class TaskRequest(BaseModel):
    """Request schema for a task in a CrewAI workflow."""
    description: str
    agent_index: int
    expected_output: Optional[str] = None

class CrewWorkflowRequest(BaseModel):
    """Request schema for creating a CrewAI workflow."""
    name: str
    description: Optional[str] = None
    agents: List[int]  # List of agent IDs
    tasks: List[TaskRequest]
    process: str = "sequential"
    verbose: bool = True

class CrewWorkflowUpdateRequest(BaseModel):
    """Request schema for updating a CrewAI workflow."""
    name: Optional[str] = None
    description: Optional[str] = None
    agents: Optional[List[int]] = None
    tasks: Optional[List[TaskRequest]] = None
    process: Optional[str] = None
    verbose: Optional[bool] = None

class CrewWorkflowResponse(BaseModel):
    """Response schema for a CrewAI workflow."""
    id: int
    name: str
    description: Optional[str]
    agents: List[CrewAgentResponse]
    tasks: List[Dict[str, Any]]
    process: str
    verbose: bool
    created_at: datetime
    updated_at: datetime

class ExecutionLogResponse(BaseModel):
    """Response schema for an execution log."""
    id: int
    workflow_id: Optional[int]
    agent_id: Optional[int]
    execution_id: str
    status: str
    start_time: datetime
    end_time: Optional[datetime]
    result: Optional[str]
    logs: List[Dict[str, Any]]

# ==================== Database Models ====================

# These would typically be in a separate models file, but for simplicity
# we'll define them here as functions that create SQL queries

def create_agent(db: Session, agent: CrewAgentRequest) -> int:
    """Create a new agent in the database."""
    query = """
    INSERT INTO crew_agents (name, role, goal, backstory, model, "verbose", allow_delegation, tools, temperature, max_tokens)
    VALUES (:name, :role, :goal, :backstory, :model, :verbose, :allow_delegation, :tools, :temperature, :max_tokens)
    RETURNING id
    """
    
    tools_json = json.dumps([tool.dict() for tool in agent.tools])
    
    result = db.execute(
        query,
        {
            "name": agent.name,
            "role": agent.role,
            "goal": agent.goal,
            "backstory": agent.backstory,
            "model": agent.model,
            "verbose": agent.verbose,
            "allow_delegation": agent.allow_delegation,
            "tools": tools_json,
            "temperature": agent.temperature,
            "max_tokens": agent.max_tokens
        }
    )
    
    agent_id = result.scalar_one()
    db.commit()
    return agent_id

def get_agent(db: Session, agent_id: int) -> Dict[str, Any]:
    """Get an agent from the database."""
    query = """
    SELECT * FROM crew_agents WHERE id = :agent_id
    """
    
    result = db.execute(query, {"agent_id": agent_id})
    agent = result.fetchone()
    
    if not agent:
        return None
    
    return dict(agent)

def update_agent(db: Session, agent_id: int, agent: CrewAgentUpdateRequest) -> bool:
    """Update an agent in the database."""
    # Build the SET clause dynamically based on which fields are provided
    set_clauses = []
    params = {"agent_id": agent_id}
    
    if agent.role is not None:
        set_clauses.append("role = :role")
        params["role"] = agent.role
    
    if agent.goal is not None:
        set_clauses.append("goal = :goal")
        params["goal"] = agent.goal
    
    if agent.backstory is not None:
        set_clauses.append("backstory = :backstory")
        params["backstory"] = agent.backstory
    
    if agent.model is not None:
        set_clauses.append("model = :model")
        params["model"] = agent.model
    
    if agent.verbose is not None:
        set_clauses.append("\"verbose\" = :verbose")
        params["verbose"] = agent.verbose
    
    if agent.allow_delegation is not None:
        set_clauses.append("allow_delegation = :allow_delegation")
        params["allow_delegation"] = agent.allow_delegation
    
    if agent.tools is not None:
        set_clauses.append("tools = :tools")
        params["tools"] = json.dumps([tool.dict() for tool in agent.tools])
    
    if agent.temperature is not None:
        set_clauses.append("temperature = :temperature")
        params["temperature"] = agent.temperature
    
    if agent.max_tokens is not None:
        set_clauses.append("max_tokens = :max_tokens")
        params["max_tokens"] = agent.max_tokens
    
    # Add updated_at timestamp
    set_clauses.append("updated_at = CURRENT_TIMESTAMP")
    
    if not set_clauses:
        return True  # Nothing to update
    
    query = f"""
    UPDATE crew_agents
    SET {", ".join(set_clauses)}
    WHERE id = :agent_id
    """
    
    result = db.execute(query, params)
    db.commit()
    
    return result.rowcount > 0

def delete_agent(db: Session, agent_id: int) -> bool:
    """Delete an agent from the database."""
    query = """
    DELETE FROM crew_agents WHERE id = :agent_id
    """
    
    result = db.execute(query, {"agent_id": agent_id})
    db.commit()
    
    return result.rowcount > 0

def list_agents(db: Session, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
    """List agents from the database."""
    query = """
    SELECT * FROM crew_agents
    ORDER BY id
    LIMIT :limit OFFSET :skip
    """
    
    result = db.execute(query, {"skip": skip, "limit": limit})
    agents = result.fetchall()
    
    return [dict(agent) for agent in agents]

def create_workflow(db: Session, workflow: CrewWorkflowRequest) -> int:
    """Create a new workflow in the database."""
    query = """
    INSERT INTO crew_workflows (name, description, agents, tasks, process, "verbose")
    VALUES (:name, :description, :agents, :tasks, :process, :verbose)
    RETURNING id
    """
    
    agents_json = json.dumps(workflow.agents)
    tasks_json = json.dumps([task.dict() for task in workflow.tasks])
    
    result = db.execute(
        query,
        {
            "name": workflow.name,
            "description": workflow.description,
            "agents": agents_json,
            "tasks": tasks_json,
            "process": workflow.process,
            "verbose": workflow.verbose
        }
    )
    
    workflow_id = result.scalar_one()
    db.commit()
    return workflow_id

def get_workflow(db: Session, workflow_id: int) -> Dict[str, Any]:
    """Get a workflow from the database."""
    query = """
    SELECT * FROM crew_workflows WHERE id = :workflow_id
    """
    
    result = db.execute(query, {"workflow_id": workflow_id})
    workflow = result.fetchone()
    
    if not workflow:
        return None
    
    return dict(workflow)

def update_workflow(db: Session, workflow_id: int, workflow: CrewWorkflowUpdateRequest) -> bool:
    """Update a workflow in the database."""
    # Build the SET clause dynamically based on which fields are provided
    set_clauses = []
    params = {"workflow_id": workflow_id}
    
    if workflow.name is not None:
        set_clauses.append("name = :name")
        params["name"] = workflow.name
    
    if workflow.description is not None:
        set_clauses.append("description = :description")
        params["description"] = workflow.description
    
    if workflow.agents is not None:
        set_clauses.append("agents = :agents")
        params["agents"] = json.dumps(workflow.agents)
    
    if workflow.tasks is not None:
        set_clauses.append("tasks = :tasks")
        params["tasks"] = json.dumps([task.dict() for task in workflow.tasks])
    
    if workflow.process is not None:
        set_clauses.append("process = :process")
        params["process"] = workflow.process
    
    if workflow.verbose is not None:
        set_clauses.append("\"verbose\" = :verbose")
        params["verbose"] = workflow.verbose
    
    # Add updated_at timestamp
    set_clauses.append("updated_at = CURRENT_TIMESTAMP")
    
    if not set_clauses:
        return True  # Nothing to update
    
    query = f"""
    UPDATE crew_workflows
    SET {", ".join(set_clauses)}
    WHERE id = :workflow_id
    """
    
    result = db.execute(query, params)
    db.commit()
    
    return result.rowcount > 0

def delete_workflow(db: Session, workflow_id: int) -> bool:
    """Delete a workflow from the database."""
    query = """
    DELETE FROM crew_workflows WHERE id = :workflow_id
    """
    
    result = db.execute(query, {"workflow_id": workflow_id})
    db.commit()
    
    return result.rowcount > 0

def list_workflows(db: Session, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
    """List workflows from the database."""
    query = """
    SELECT * FROM crew_workflows
    ORDER BY id
    LIMIT :limit OFFSET :skip
    """
    
    result = db.execute(query, {"skip": skip, "limit": limit})
    workflows = result.fetchall()
    
    return [dict(workflow) for workflow in workflows]

def create_execution_log(db: Session, workflow_id: Optional[int] = None, agent_id: Optional[int] = None) -> str:
    """Create a new execution log in the database."""
    execution_id = str(uuid.uuid4())
    
    query = """
    INSERT INTO crew_execution_logs (workflow_id, agent_id, execution_id, status)
    VALUES (:workflow_id, :agent_id, :execution_id, 'running')
    RETURNING id
    """
    
    result = db.execute(
        query,
        {
            "workflow_id": workflow_id,
            "agent_id": agent_id,
            "execution_id": execution_id
        }
    )
    
    db.commit()
    return execution_id

def update_execution_log(db: Session, execution_id: str, status: str, result: Optional[str] = None, logs: Optional[List[Dict[str, Any]]] = None) -> bool:
    """Update an execution log in the database."""
    query = """
    UPDATE crew_execution_logs
    SET status = :status, end_time = CURRENT_TIMESTAMP, result = :result, logs = :logs
    WHERE execution_id = :execution_id
    """
    
    logs_json = json.dumps(logs or [])
    
    result_db = db.execute(
        query,
        {
            "execution_id": execution_id,
            "status": status,
            "result": result,
            "logs": logs_json
        }
    )
    
    db.commit()
    
    return result_db.rowcount > 0

def get_execution_log(db: Session, execution_id: str) -> Dict[str, Any]:
    """Get an execution log from the database."""
    query = """
    SELECT * FROM crew_execution_logs WHERE execution_id = :execution_id
    """
    
    result = db.execute(query, {"execution_id": execution_id})
    log = result.fetchone()
    
    if not log:
        return None
    
    return dict(log)

def list_execution_logs(db: Session, workflow_id: Optional[int] = None, agent_id: Optional[int] = None, skip: int = 0, limit: int = 100) -> List[Dict[str, Any]]:
    """List execution logs from the database."""
    query = """
    SELECT * FROM crew_execution_logs
    WHERE (:workflow_id IS NULL OR workflow_id = :workflow_id)
    AND (:agent_id IS NULL OR agent_id = :agent_id)
    ORDER BY start_time DESC
    LIMIT :limit OFFSET :skip
    """
    
    result = db.execute(
        query,
        {
            "workflow_id": workflow_id,
            "agent_id": agent_id,
            "skip": skip,
            "limit": limit
        }
    )
    
    logs = result.fetchall()
    
    return [dict(log) for log in logs]

# ==================== Helper Functions ====================

def agent_to_response(agent_data: Dict[str, Any]) -> CrewAgentResponse:
    """Convert agent data from the database to a response object."""
    tools = json.loads(agent_data["tools"]) if isinstance(agent_data["tools"], str) else agent_data["tools"]
    
    return CrewAgentResponse(
        id=agent_data["id"],
        name=agent_data["name"],
        role=agent_data["role"],
        goal=agent_data["goal"],
        backstory=agent_data["backstory"],
        model=agent_data["model"],
        verbose=agent_data["verbose"],
        allow_delegation=agent_data["allow_delegation"],
        tools=tools,
        temperature=agent_data["temperature"],
        max_tokens=agent_data["max_tokens"],
        created_at=agent_data["created_at"],
        updated_at=agent_data["updated_at"]
    )

def workflow_to_response(workflow_data: Dict[str, Any], db: Session) -> CrewWorkflowResponse:
    """Convert workflow data from the database to a response object."""
    agent_ids = json.loads(workflow_data["agents"]) if isinstance(workflow_data["agents"], str) else workflow_data["agents"]
    tasks = json.loads(workflow_data["tasks"]) if isinstance(workflow_data["tasks"], str) else workflow_data["tasks"]
    
    # Get agent data for each agent in the workflow
    agents = []
    for agent_id in agent_ids:
        agent_data = get_agent(db, agent_id)
        if agent_data:
            agents.append(agent_to_response(agent_data))
    
    return CrewWorkflowResponse(
        id=workflow_data["id"],
        name=workflow_data["name"],
        description=workflow_data["description"],
        agents=agents,
        tasks=tasks,
        process=workflow_data["process"],
        verbose=workflow_data["verbose"],
        created_at=workflow_data["created_at"],
        updated_at=workflow_data["updated_at"]
    )

def execution_log_to_response(log_data: Dict[str, Any]) -> ExecutionLogResponse:
    """Convert execution log data from the database to a response object."""
    logs = json.loads(log_data["logs"]) if isinstance(log_data["logs"], str) else log_data["logs"]
    
    return ExecutionLogResponse(
        id=log_data["id"],
        workflow_id=log_data["workflow_id"],
        agent_id=log_data["agent_id"],
        execution_id=log_data["execution_id"],
        status=log_data["status"],
        start_time=log_data["start_time"],
        end_time=log_data["end_time"],
        result=log_data["result"],
        logs=logs
    )

def create_crew_agent_instance(agent_data: Dict[str, Any]) -> CrewAgent:
    """Create a CrewAgent instance from agent data."""
    tools = json.loads(agent_data["tools"]) if isinstance(agent_data["tools"], str) else agent_data["tools"]
    
    # Convert tools to the format expected by CrewAgent
    crew_tools = []
    for tool in tools:
        crew_tools.append({
            "name": tool["name"],
            "description": tool["description"],
            "function": tool.get("function"),
            "return_direct": tool.get("return_direct", False)
        })
    
    # Create agent configuration
    config = CrewAgentConfig(
        name=agent_data["name"],
        role=agent_data["role"],
        goal=agent_data["goal"],
        backstory=agent_data["backstory"],
        model=agent_data["model"],
        verbose=agent_data["verbose"],
        allow_delegation=agent_data["allow_delegation"],
        tools=[CrewAITool(**tool) for tool in crew_tools],
        temperature=agent_data["temperature"],
        max_tokens=agent_data["max_tokens"]
    )
    
    # Create agent instance
    return CrewAgent.from_config(config)

def create_crew_workflow_instance(workflow_data: Dict[str, Any], db: Session) -> CrewWorkflow:
    """Create a CrewWorkflow instance from workflow data."""
    agent_ids = json.loads(workflow_data["agents"]) if isinstance(workflow_data["agents"], str) else workflow_data["agents"]
    tasks_data = json.loads(workflow_data["tasks"]) if isinstance(workflow_data["tasks"], str) else workflow_data["tasks"]
    
    # Get agent data for each agent in the workflow
    agent_configs = []
    for agent_id in agent_ids:
        agent_data = get_agent(db, agent_id)
        if agent_data:
            tools = json.loads(agent_data["tools"]) if isinstance(agent_data["tools"], str) else agent_data["tools"]
            
            # Convert tools to the format expected by CrewAgentConfig
            crew_tools = []
            for tool in tools:
                crew_tools.append(CrewAITool(
                    name=tool["name"],
                    description=tool["description"],
                    function=tool.get("function")
                ))
            
            # Create agent configuration
            config = CrewAgentConfig(
                name=agent_data["name"],
                role=agent_data["role"],
                goal=agent_data["goal"],
                backstory=agent_data["backstory"],
                model=agent_data["model"],
                verbose=agent_data["verbose"],
                allow_delegation=agent_data["allow_delegation"],
                tools=crew_tools,
                temperature=agent_data["temperature"],
                max_tokens=agent_data["max_tokens"]
            )
            
            agent_configs.append(config)
    
    # Create workflow configuration
    config = CrewWorkflowConfig(
        agents=agent_configs,
        tasks=[],  # Tasks will be added separately
        process=workflow_data["process"],
        verbose=workflow_data["verbose"]
    )
    
    # Create workflow instance
    workflow = CrewWorkflow(config)
    
    # Add tasks
    for task_data in tasks_data:
        workflow.add_task(
            description=task_data["description"],
            agent_index=task_data["agent_index"],
            expected_output=task_data.get("expected_output")
        )
    
    return workflow

async def run_agent_task(agent: CrewAgent, input_text: str, db: Session, execution_id: str):
    """Run an agent task in the background."""
    try:
        # Run the agent
        start_time = datetime.now()
        result = await agent.run(input_text)
        end_time = datetime.now()
        
        # Calculate execution time
        execution_time = (end_time - start_time).total_seconds()
        
        # Update execution log
        update_execution_log(
            db=db,
            execution_id=execution_id,
            status="completed",
            result=result,
            logs=[
                {
                    "timestamp": datetime.now().isoformat(),
                    "level": "info",
                    "message": "Agent execution completed successfully",
                    "execution_time": execution_time
                }
            ]
        )
        
        return result, execution_time
        
    except Exception as e:
        # Update execution log with error
        update_execution_log(
            db=db,
            execution_id=execution_id,
            status="failed",
            result=str(e),
            logs=[
                {
                    "timestamp": datetime.now().isoformat(),
                    "level": "error",
                    "message": f"Agent execution failed: {str(e)}"
                }
            ]
        )
        
        raise

async def run_workflow_task(workflow: CrewWorkflow, db: Session, execution_id: str):
    """Run a workflow task in the background."""
    try:
        # Run the workflow
        start_time = datetime.now()
        result = await workflow.run()
        end_time = datetime.now()
        
        # Calculate execution time
        execution_time = (end_time - start_time).total_seconds()
        
        # Update execution log
        update_execution_log(
            db=db,
            execution_id=execution_id,
            status="completed",
            result=result,
            logs=[
                {
                    "timestamp": datetime.now().isoformat(),
                    "level": "info",
                    "message": "Workflow execution completed successfully",
                    "execution_time": execution_time
                }
            ]
        )
        
        return result, execution_time
        
    except Exception as e:
        # Update execution log with error
        update_execution_log(
            db=db,
            execution_id=execution_id,
            status="failed",
            result=str(e),
            logs=[
                {
                    "timestamp": datetime.now().isoformat(),
                    "level": "error",
                    "message": f"Workflow execution failed: {str(e)}"
                }
            ]
        )
        
        raise

async def stream_agent_response(agent: CrewAgent, input_text: str, db: Session, execution_id: str):
    """Stream an agent's response."""
    try:
        # Start streaming
        logs = []
        start_time = datetime.now()
        
        # Create an async generator that yields chunks of the response
        async def response_generator():
            try:
                async for chunk in agent.stream(input_text):
                    # Log the chunk
                    logs.append({
                        "timestamp": datetime.now().isoformat(),
                        "level": "info",
                        "message": "Chunk received",
                        "chunk": chunk
                    })
                    
                    # Yield the chunk
                    yield chunk
                
                # Update execution log when streaming is complete
                end_time = datetime.now()
                execution_time = (end_time - start_time).total_seconds()
                
                update_execution_log(
                    db=db,
                    execution_id=execution_id,
                    status="completed",
                    result="Streaming completed",
                    logs=logs + [
                        {
                            "timestamp": datetime.now().isoformat(),
                            "level": "info",
                            "message": "Streaming completed successfully",
                            "execution_time": execution_time
                        }
                    ]
                )
                
            except Exception as e:
                # Log the error
                error_log = {
                    "timestamp": datetime.now().isoformat(),
                    "level": "error",
                    "message": f"Streaming failed: {str(e)}"
                }
                logs.append(error_log)
                
                # Update execution log with error
                update_execution_log(
                    db=db,
                    execution_id=execution_id,
                    status="failed",
                    result=str(e),
                    logs=logs
                )
                
                # Yield the error
                yield f"Error: {str(e)}"
        
        return response_generator()
        
    except Exception as e:
        # Update execution log with error
        update_execution_log(
            db=db,
            execution_id=execution_id,
            status="failed",
            result=str(e),
            logs=[
                {
                    "timestamp": datetime.now().isoformat(),
                    "level": "error",
                    "message": f"Streaming setup failed: {str(e)}"
                }
            ]
        )
        
        raise

# ==================== API Endpoints ====================

# ----- Agent Endpoints -----

@router.post("/agents", response_model=CrewAgentResponse, status_code=201)
async def create_crew_agent_endpoint(agent: CrewAgentRequest, db: Session = Depends(get_db)):
    """Create a new CrewAI agent."""
    try:
        # Create the agent in the database
        agent_id = create_agent(db, agent)
        
        # Get the created agent
        agent_data = get_agent(db, agent_id)
        
        # Return the agent response
        return agent_to_response(agent_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create agent: {str(e)}")

@router.get("/agents", response_model=List[CrewAgentResponse])
async def list_crew_agents_endpoint(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """List all CrewAI agents."""
    try:
        # Get agents from the database
        agents_data = list_agents(db, skip, limit)
        
        # Convert to response objects
        return [agent_to_response(agent_data) for agent_data in agents_data]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list agents: {str(e)}")

@router.get("/agents/{agent_id}", response_model=CrewAgentResponse)
async def get_crew_agent_endpoint(
    agent_id: int = Path(..., ge=1),
    db: Session = Depends(get_db)
):
    """Get a specific CrewAI agent."""
    try:
        # Get the agent from the database
        agent_data = get_agent(db, agent_id)
        
        # Check if the agent exists
        if not agent_data:
            raise HTTPException(status_code=404, detail=f"Agent with ID {agent_id} not found")
        
        # Return the agent response
        return agent_to_response(agent_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get agent: {str(e)}")

@router.put("/agents/{agent_id}", response_model=CrewAgentResponse)
async def update_crew_agent_endpoint(
    agent: CrewAgentUpdateRequest,
    agent_id: int = Path(..., ge=1),
    db: Session = Depends(get_db)
):
    """Update a specific CrewAI agent."""
    try:
        # Check if the agent exists
        agent_data = get_agent(db, agent_id)
        if not agent_data:
            raise HTTPException(status_code=404, detail=f"Agent with ID {agent_id} not found")
        
        # Update the agent in the database
        updated = update_agent(db, agent_id, agent)
        
        # Check if the update was successful
        if not updated:
            raise HTTPException(status_code=500, detail=f"Failed to update agent with ID {agent_id}")
        
        # Get the updated agent
        agent_data = get_agent(db, agent_id)
        
        # Return the agent response
        return agent_to_response(agent_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update agent: {str(e)}")

@router.delete("/agents/{agent_id}", status_code=204)
async def delete_crew_agent_endpoint(
    agent_id: int = Path(..., ge=1),
    db: Session = Depends(get_db)
):
    """Delete a specific CrewAI agent."""
    try:
        # Check if the agent exists
        agent_data = get_agent(db, agent_id)
        if not agent_data:
            raise HTTPException(status_code=404, detail=f"Agent with ID {agent_id} not found")
        
        # Delete the agent from the database
        deleted = delete_agent(db, agent_id)
        
        # Check if the deletion was successful
        if not deleted:
            raise HTTPException(status_code=500, detail=f"Failed to delete agent with ID {agent_id}")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete agent: {str(e)}")

@router.post("/agents/{agent_id}/run", response_model=CrewRunResponse)
async def run_crew_agent_endpoint(
    request: CrewRunRequest,
    background_tasks: BackgroundTasks,
    agent_id: int = Path(..., ge=1),
    db: Session = Depends(get_db)
):
    """Run a CrewAI agent with the given input."""
    try:
        # Check if the agent exists
        agent_data = get_agent(db, agent_id)
        if not agent_data:
            raise HTTPException(status_code=404, detail=f"Agent with ID {agent_id} not found")
        
        # Create an execution log
        execution_id = create_execution_log(db, agent_id=agent_id)
        
        # Create a CrewAgent instance
        agent = create_crew_agent_instance(agent_data)
        
        # Check if streaming is requested
        if request.stream:
            # Return a streaming response
            generator = stream_agent_response(agent, request.input, db, execution_id)
            return StreamingResponse(generator, media_type="text/plain")
        else:
            # Run the agent in the background
            result, execution_time = await run_agent_task(agent, request.input, db, execution_id)
            
            # Return the result
            return CrewRunResponse(
                agent_id=agent_id,
                execution_id=execution_id,
                output=result,
                execution_time=execution_time
            )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to run agent: {str(e)}")

@router.get("/agents/{agent_id}/executions", response_model=List[ExecutionLogResponse])
async def list_agent_executions_endpoint(
    agent_id: int = Path(..., ge=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """List execution logs for a specific agent."""
    try:
        # Check if the agent exists
        agent_data = get_agent(db, agent_id)
        if not agent_data:
            raise HTTPException(status_code=404, detail=f"Agent with ID {agent_id} not found")
        
        # Get execution logs from the database
        logs_data = list_execution_logs(db, agent_id=agent_id, skip=skip, limit=limit)
        
        # Convert to response objects
        return [execution_log_to_response(log_data) for log_data in logs_data]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list executions: {str(e)}")

# ----- Workflow Endpoints -----

@router.post("/workflows", response_model=CrewWorkflowResponse, status_code=201)
async def create_crew_workflow_endpoint(workflow: CrewWorkflowRequest, db: Session = Depends(get_db)):
    """Create a new CrewAI workflow."""
    try:
        # Check if all agents exist
        for agent_id in workflow.agents:
            agent_data = get_agent(db, agent_id)
            if not agent_data:
                raise HTTPException(status_code=404, detail=f"Agent with ID {agent_id} not found")
        
        # Create the workflow in the database
        workflow_id = create_workflow(db, workflow)
        
        # Get the created workflow
        workflow_data = get_workflow(db, workflow_id)
        
        # Return the workflow response
        return workflow_to_response(workflow_data, db)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create workflow: {str(e)}")

@router.get("/workflows", response_model=List[CrewWorkflowResponse])
async def list_crew_workflows_endpoint(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """List all CrewAI workflows."""
    try:
        # Get workflows from the database
        workflows_data = list_workflows(db, skip, limit)
        
        # Convert to response objects
        return [workflow_to_response(workflow_data, db) for workflow_data in workflows_data]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list workflows: {str(e)}")

@router.get("/workflows/{workflow_id}", response_model=CrewWorkflowResponse)
async def get_crew_workflow_endpoint(
    workflow_id: int = Path(..., ge=1),
    db: Session = Depends(get_db)
):
    """Get a specific CrewAI workflow."""
    try:
        # Get the workflow from the database
        workflow_data = get_workflow(db, workflow_id)
        
        # Check if the workflow exists
        if not workflow_data:
            raise HTTPException(status_code=404, detail=f"Workflow with ID {workflow_id} not found")
        
        # Return the workflow response
        return workflow_to_response(workflow_data, db)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get workflow: {str(e)}")

@router.put("/workflows/{workflow_id}", response_model=CrewWorkflowResponse)
async def update_crew_workflow_endpoint(
    workflow: CrewWorkflowUpdateRequest,
    workflow_id: int = Path(..., ge=1),
    db: Session = Depends(get_db)
):
    """Update a specific CrewAI workflow."""
    try:
        # Check if the workflow exists
        workflow_data = get_workflow(db, workflow_id)
        if not workflow_data:
            raise HTTPException(status_code=404, detail=f"Workflow with ID {workflow_id} not found")
        
        # Check if all agents exist (if agents are being updated)
        if workflow.agents:
            for agent_id in workflow.agents:
                agent_data = get_agent(db, agent_id)
                if not agent_data:
                    raise HTTPException(status_code=404, detail=f"Agent with ID {agent_id} not found")
        
        # Update the workflow in the database
        updated = update_workflow(db, workflow_id, workflow)
        
        # Check if the update was successful
        if not updated:
            raise HTTPException(status_code=500, detail=f"Failed to update workflow with ID {workflow_id}")
        
        # Get the updated workflow
        workflow_data = get_workflow(db, workflow_id)
        
        # Return the workflow response
        return workflow_to_response(workflow_data, db)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update workflow: {str(e)}")

@router.delete("/workflows/{workflow_id}", status_code=204)
async def delete_crew_workflow_endpoint(
    workflow_id: int = Path(..., ge=1),
    db: Session = Depends(get_db)
):
    """Delete a specific CrewAI workflow."""
    try:
        # Check if the workflow exists
        workflow_data = get_workflow(db, workflow_id)
        if not workflow_data:
            raise HTTPException(status_code=404, detail=f"Workflow with ID {workflow_id} not found")
        
        # Delete the workflow from the database
        deleted = delete_workflow(db, workflow_id)
        
        # Check if the deletion was successful
        if not deleted:
            raise HTTPException(status_code=500, detail=f"Failed to delete workflow with ID {workflow_id}")
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete workflow: {str(e)}")

@router.post("/workflows/{workflow_id}/run", response_model=CrewRunResponse)
async def run_crew_workflow_endpoint(
    workflow_id: int = Path(..., ge=1),
    db: Session = Depends(get_db)
):
    """Run a CrewAI workflow."""
    try:
        # Check if the workflow exists
        workflow_data = get_workflow(db, workflow_id)
        if not workflow_data:
            raise HTTPException(status_code=404, detail=f"Workflow with ID {workflow_id} not found")
        
        # Create an execution log
        execution_id = create_execution_log(db, workflow_id=workflow_id)
        
        # Create a CrewWorkflow instance
        workflow = create_crew_workflow_instance(workflow_data, db)
        
        # Run the workflow
        result, execution_time = await run_workflow_task(workflow, db, execution_id)
        
        # Return the result
        return CrewRunResponse(
            agent_id=None,
            execution_id=execution_id,
            output=result,
            execution_time=execution_time
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to run workflow: {str(e)}")

@router.get("/workflows/{workflow_id}/executions", response_model=List[ExecutionLogResponse])
async def list_workflow_executions_endpoint(
    workflow_id: int = Path(..., ge=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """List execution logs for a specific workflow."""
    try:
        # Check if the workflow exists
        workflow_data = get_workflow(db, workflow_id)
        if not workflow_data:
            raise HTTPException(status_code=404, detail=f"Workflow with ID {workflow_id} not found")
        
        # Get execution logs from the database
        logs_data = list_execution_logs(db, workflow_id=workflow_id, skip=skip, limit=limit)
        
        # Convert to response objects
        return [execution_log_to_response(log_data) for log_data in logs_data]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list executions: {str(e)}")

# ----- Execution Log Endpoints -----

@router.get("/executions", response_model=List[ExecutionLogResponse])
async def list_executions_endpoint(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """List all execution logs."""
    try:
        # Get execution logs from the database
        logs_data = list_execution_logs(db, skip=skip, limit=limit)
        
        # Convert to response objects
        return [execution_log_to_response(log_data) for log_data in logs_data]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list executions: {str(e)}")

@router.get("/executions/{execution_id}", response_model=ExecutionLogResponse)
async def get_execution_log_endpoint(
    execution_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific execution log."""
    try:
        # Get the execution log from the database
        log_data = get_execution_log(db, execution_id)
        
        # Check if the log exists
        if not log_data:
            raise HTTPException(status_code=404, detail=f"Execution log with ID {execution_id} not found")
        
        # Return the log response
        return execution_log_to_response(log_data)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get execution log: {str(e)}")
