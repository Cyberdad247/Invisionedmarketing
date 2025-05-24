from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from models.agent import Agent
from schemas.agent import AgentCreate, AgentResponse, AgentUpdate
from utils.db import get_session

router = APIRouter(
    prefix="/agents",
    tags=["agents"],
    description="Endpoints for managing AI agents"
)

@router.post("", response_model=AgentResponse, summary="Create Agent", description="Create a new AI agent with specified configuration")
def create_agent(agent: AgentCreate, session: Session = Depends(get_session)):
    """
    Create a new AI agent.
    
    This endpoint allows creating a new AI agent with specified configuration including
    name, description, framework, model, system prompt, tools, and parameters.
    
    Args:
        agent (AgentCreate): The agent configuration data.
        session (Session): Database session dependency.
        
    Returns:
        AgentResponse: The created agent data with assigned ID.
    """
    db_agent = Agent(
        name=agent.name,
        description=agent.description,
        framework=agent.framework,
        model=agent.model,
        system_prompt=agent.system_prompt,
        tools=agent.tools,
        parameters=agent.parameters
    )
    session.add(db_agent)
    session.commit()
    session.refresh(db_agent)
    return db_agent

@router.get("", response_model=List[AgentResponse], summary="List Agents", description="Get a list of all available AI agents")
def read_agents(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    """
    Get all available AI agents.
    
    This endpoint returns a list of all agents in the system with pagination support.
    
    Args:
        skip (int, optional): Number of records to skip for pagination. Defaults to 0.
        limit (int, optional): Maximum number of records to return. Defaults to 100.
        session (Session): Database session dependency.
        
    Returns:
        List[AgentResponse]: List of agent objects.
    """
    agents = session.exec(select(Agent).offset(skip).limit(limit)).all()
    return agents

@router.get("/{agent_id}", response_model=AgentResponse, summary="Get Agent", description="Get a specific AI agent by its ID")
def read_agent(agent_id: int, session: Session = Depends(get_session)):
    """
    Get an agent by ID.
    
    This endpoint retrieves a specific agent by its unique identifier.
    
    Args:
        agent_id (int): The unique identifier of the agent.
        session (Session): Database session dependency.
        
    Returns:
        AgentResponse: The agent data.
        
    Raises:
        HTTPException: 404 error if agent is not found.
    """
    agent = session.get(Agent, agent_id)
    if agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.put("/{agent_id}", response_model=AgentResponse, summary="Update Agent", description="Update an existing AI agent's configuration")
def update_agent(agent_id: int, agent: AgentUpdate, session: Session = Depends(get_session)):
    """
    Update an existing agent.
    
    This endpoint allows updating an agent's configuration by its ID. Only the fields
    provided in the request will be updated; other fields will remain unchanged.
    
    Args:
        agent_id (int): The unique identifier of the agent to update.
        agent (AgentUpdate): The agent data to update.
        session (Session): Database session dependency.
        
    Returns:
        AgentResponse: The updated agent data.
        
    Raises:
        HTTPException: 404 error if agent is not found.
    """
    db_agent = session.get(Agent, agent_id)
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent_data = agent.dict(exclude_unset=True)
    for key, value in agent_data.items():
        setattr(db_agent, key, value)
    
    session.add(db_agent)
    session.commit()
    session.refresh(db_agent)
    return db_agent

@router.delete("/{agent_id}", summary="Delete Agent", description="Delete an AI agent by its ID")
def delete_agent(agent_id: int, session: Session = Depends(get_session)):
    """
    Delete an agent by ID.
    
    This endpoint permanently removes an agent from the system.
    
    Args:
        agent_id (int): The unique identifier of the agent to delete.
        session (Session): Database session dependency.
        
    Returns:
        dict: A confirmation message indicating successful deletion.
        
    Raises:
        HTTPException: 404 error if agent is not found.
    """
    agent = session.get(Agent, agent_id)
    if agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    session.delete(agent)
    session.commit()
    return {"ok": True}
