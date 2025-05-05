import pytest
import asyncio
from agents.crew_agent import CrewAgentConfig
from agents.crew_workflow import CrewWorkflow, CrewWorkflowConfig

@pytest.mark.asyncio
async def test_crew_workflow_initialization():
    """Test that a CrewAI workflow can be initialized with basic parameters."""
    agent_configs = [
        CrewAgentConfig(
            name="Agent1",
            role="Researcher",
            goal="Find information",
            backstory="You are an expert researcher.",
            model="gpt-4o"
        ),
        CrewAgentConfig(
            name="Agent2",
            role="Writer",
            goal="Create content",
            backstory="You are a professional writer.",
            model="gpt-4o"
        )
    ]
    
    config = CrewWorkflowConfig(
        agents=agent_configs,
        process="sequential",
        verbose=True
    )
    
    workflow = CrewWorkflow(config)
    
    assert len(workflow.agents) == 2
    assert workflow.agents[0].name == "Agent1"
    assert workflow.agents[1].name == "Agent2"
    assert len(workflow.crew_agents) == 2
    assert workflow.crew_agents[0]["name"] == "Agent1"
    assert workflow.crew_agents[1]["name"] == "Agent2"

@pytest.mark.asyncio
async def test_crew_workflow_add_task():
    """Test that tasks can be added to a CrewAI workflow."""
    agent_configs = [
        CrewAgentConfig(
            name="Agent1",
            role="Researcher",
            goal="Find information",
            backstory="You are an expert researcher.",
            model="gpt-4o"
        ),
        CrewAgentConfig(
            name="Agent2",
            role="Writer",
            goal="Create content",
            backstory="You are a professional writer.",
            model="gpt-4o"
        )
    ]
    
    config = CrewWorkflowConfig(
        agents=agent_configs,
        process="sequential",
        verbose=True
    )
    
    workflow = CrewWorkflow(config)
    
    task1 = workflow.add_task(
        description="Research AI trends",
        agent_index=0,
        expected_output="A summary of AI trends"
    )
    
    task2 = workflow.add_task(
        description="Write an article about AI trends",
        agent_index=1,
        expected_output="An article about AI trends"
    )
    
    assert len(workflow.tasks) == 2
    assert task1["description"] == "Research AI trends"
    assert task2["description"] == "Write an article about AI trends"

@pytest.mark.asyncio
async def test_crew_workflow_initialize_crew():
    """Test that a CrewAI crew can be initialized from a workflow."""
    agent_configs = [
        CrewAgentConfig(
            name="Agent1",
            role="Researcher",
            goal="Find information",
            backstory="You are an expert researcher.",
            model="gpt-4o"
        ),
        CrewAgentConfig(
            name="Agent2",
            role="Writer",
            goal="Create content",
            backstory="You are a professional writer.",
            model="gpt-4o"
        )
    ]
    
    config = CrewWorkflowConfig(
        agents=agent_configs,
        process="sequential",
        verbose=True
    )
    
    workflow = CrewWorkflow(config)
    
    workflow.add_task(
        description="Research AI trends",
        agent_index=0,
        expected_output="A summary of AI trends"
    )
    
    workflow.add_task(
        description="Write an article about AI trends",
        agent_index=1,
        expected_output="An article about AI trends"
    )
    
    crew = workflow._initialize_crew()
    
    assert crew is not None
    assert crew["type"] == "crew"
    assert len(crew["agents"]) == 2
    assert len(crew["tasks"]) == 2

@pytest.mark.asyncio
async def test_crew_workflow_from_dict():
    """Test that a CrewAI workflow can be created from a dictionary."""
    workflow_data = {
        "agents": [
            {
                "name": "Agent1",
                "role": "Researcher",
                "goal": "Find information",
                "backstory": "You are an expert researcher.",
                "model": "gpt-4o"
            },
            {
                "name": "Agent2",
                "role": "Writer",
                "goal": "Create content",
                "backstory": "You are a professional writer.",
                "model": "gpt-4o"
            }
        ],
        "tasks": [
            {
                "description": "Research AI trends",
                "agent_index": 0,
                "expected_output": "A summary of AI trends"
            },
            {
                "description": "Write an article about AI trends",
                "agent_index": 1,
                "expected_output": "An article about AI trends"
            }
        ],
        "process": "sequential",
        "verbose": True
    }
    
    workflow = CrewWorkflow.from_dict(workflow_data)
    
    assert len(workflow.agents) == 2
    assert workflow.agents[0].name == "Agent1"
    assert workflow.agents[1].name == "Agent2"
    assert len(workflow.tasks) == 2
    assert workflow.tasks[0]["description"] == "Research AI trends"
    assert workflow.tasks[1]["description"] == "Write an article about AI trends"

@pytest.mark.asyncio
async def test_crew_workflow_run():
    """Test that a CrewAI workflow can be run."""
    agent_configs = [
        CrewAgentConfig(
            name="Agent1",
            role="Researcher",
            goal="Find information",
            backstory="You are an expert researcher.",
            model="gpt-4o"
        ),
        CrewAgentConfig(
            name="Agent2",
            role="Writer",
            goal="Create content",
            backstory="You are a professional writer.",
            model="gpt-4o"
        )
    ]
    
    config = CrewWorkflowConfig(
        agents=agent_configs,
        process="sequential",
        verbose=True
    )
    
    workflow = CrewWorkflow(config)
    
    workflow.add_task(
        description="Research AI trends",
        agent_index=0,
        expected_output="A summary of AI trends"
    )
    
    workflow.add_task(
        description="Write an article about AI trends",
        agent_index=1,
        expected_output="An article about AI trends"
    )
    
    result = await workflow.run()
    
    assert isinstance(result, str)
    assert len(result) > 0
