import pytest
import asyncio
from agents.crew_agent import CrewAgent, CrewAgentConfig

@pytest.mark.asyncio
async def test_crew_agent_initialization():
    """Test that a CrewAI agent can be initialized with basic parameters."""
    agent = CrewAgent(
        name="TestCrewAgent",
        model="gpt-4o",
        system_prompt="You are a helpful assistant.",
        tools=[],
        parameters={
            "role": "Researcher",
            "goal": "Find information",
            "backstory": "You are an expert researcher."
        }
    )
    
    assert agent.name == "TestCrewAgent"
    assert agent.model == "gpt-4o"
    assert agent.system_prompt == "You are a helpful assistant."
    assert agent.role == "Researcher"
    assert agent.goal == "Find information"
    assert agent.backstory == "You are an expert researcher."

@pytest.mark.asyncio
async def test_crew_agent_from_config():
    """Test that a CrewAI agent can be created from a configuration object."""
    config = CrewAgentConfig(
        name="ConfigAgent",
        role="Writer",
        goal="Create content",
        backstory="You are a professional writer.",
        model="gpt-4o",
        verbose=True,
        allow_delegation=False,
        tools=[],
        temperature=0.5,
        max_tokens=2000
    )
    
    agent = CrewAgent.from_config(config)
    
    assert agent.name == "ConfigAgent"
    assert agent.role == "Writer"
    assert agent.goal == "Create content"
    assert agent.backstory == "You are a professional writer."
    assert agent.model == "gpt-4o"
    assert agent.verbose == True
    assert agent.allow_delegation == False
    assert agent.temperature == 0.5
    assert agent.max_tokens == 2000

@pytest.mark.asyncio
async def test_crew_agent_with_tools():
    """Test that a CrewAI agent can be initialized with tools."""
    tools = [
        {
            "name": "search",
            "description": "Search for information on the web."
        },
        {
            "name": "calculator",
            "description": "Perform calculations."
        }
    ]
    
    agent = CrewAgent(
        name="ToolAgent",
        model="gpt-4o",
        system_prompt="You are a helpful assistant.",
        tools=tools,
        parameters={}
    )
    
    assert len(agent.tools) == 2
    assert agent.tools[0]["name"] == "search"
    assert agent.tools[1]["name"] == "calculator"  == 2
    assert agent.tools[0]["name"] == "search"
    assert agent.tools[1]["name"] == "calculator"

@pytest.mark.asyncio
async def test_crew_agent_initialize_llm():
    """Test that a CrewAI agent can initialize an LLM."""
    agent = CrewAgent(
        name="LLMAgent",
        model="gpt-4o",
        system_prompt="You are a helpful assistant.",
        tools=[],
        parameters={}
    )
    
    llm = agent._initialize_llm()
    assert llm is not None
    assert llm["model"] == "gpt-4o"  # In the real implementation, this would be a ChatOpenAI instance

@pytest.mark.asyncio
async def test_crew_agent_initialize_agent():
    """Test that a CrewAI agent can initialize a CrewAI agent instance."""
    agent = CrewAgent(
        name="InitAgent",
        model="gpt-4o",
        system_prompt="You are a helpful assistant.",
        tools=[],
        parameters={}
    )
    
    crew_agent = agent._initialize_agent()
    assert crew_agent is not None
    assert crew_agent["name"] == "InitAgent"
    assert crew_agent["type"] == "agent"

@pytest.mark.asyncio
async def test_crew_agent_run():
    """Test that a CrewAI agent can run with input text."""
    agent = CrewAgent(
        name="RunAgent",
        model="gpt-4o",
        system_prompt="You are a helpful assistant.",
        tools=[],
        parameters={}
    )
    
    response = await agent.run("Tell me about AI agents")
    assert isinstance(response, str)
    assert len(response) > 0
