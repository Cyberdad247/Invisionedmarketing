from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from models.agent import Agent
from schemas.agent import AgentCreate, AgentResponse, AgentUpdate
from utils.db import get_session

router = APIRouter()

@router.post("/agents", response_model=AgentResponse)
def create_agent(agent: AgentCreate, session: Session = Depends(get_session)):
    """
    Create a new agent.
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

@router.get("/agents", response_model=List[AgentResponse])
def read_agents(skip: int = 0, limit: int = 100, session: Session = Depends(get_session)):
    """
    Get all agents.
    """
    agents = session.exec(select(Agent).offset(skip).limit(limit)).all()
    return agents

@router.get("/agents/{agent_id}", response_model=AgentResponse)
def read_agent(agent_id: int, session: Session = Depends(get_session)):
    """
    Get an agent by ID.
    """
    agent = session.get(Agent, agent_id)
    if agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.put("/agents/{agent_id}", response_model=AgentResponse)
def update_agent(agent_id: int, agent: AgentUpdate, session: Session = Depends(get_session)):
    """
    Update an agent.
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

@router.delete("/agents/{agent_id}")
def delete_agent(agent_id: int, session: Session = Depends(get_session)):
    """
    Delete an agent.
    """
    agent = session.get(Agent, agent_id)
    if agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    session.delete(agent)
    session.commit()
    return {"ok": True}

@router.post("/agents/marketing/content-generator", response_model=AgentResponse)
def create_content_generator_agent(session: Session = Depends(get_session)):
    """
    Create a pre-configured marketing content generator agent.
    """
    db_agent = Agent(
        name="Marketing Content Generator",
        description="Specialized agent for generating marketing content",
        framework="langchain",
        model="gpt-4",
        system_prompt="You are a marketing content generator specialized in creating engaging copy for various channels.",
        tools=["content_analysis", "seo_optimizer"],
        parameters={"creativity": 0.7, "tone": "professional"}
    )
    session.add(db_agent)
    session.commit()
    session.refresh(db_agent)
    return db_agent

@router.post("/agents/marketing/analytics", response_model=AgentResponse)
def create_analytics_agent(session: Session = Depends(get_session)):
    """
    Create a pre-configured marketing analytics agent.
    """
    db_agent = Agent(
        name="Marketing Analytics",
        description="Specialized agent for analyzing marketing performance",
        framework="langchain",
        model="gpt-4",
        system_prompt="You are a marketing analytics specialist that interprets campaign data and provides insights.",
        tools=["data_visualization", "performance_analysis"],
        parameters={"precision": 0.9, "detail_level": "high"}
    )
    session.add(db_agent)
    session.commit()
    session.refresh(db_agent)
    return db_agent
