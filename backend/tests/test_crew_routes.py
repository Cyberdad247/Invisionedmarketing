import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import json
import os

from main import app
from utils.db import get_db

# Create a test database
TEST_NEON_DATABASE_URL = os.environ.get("TEST_DATABASE_URL", "sqlite:///./test.db")
engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override the get_db dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Test data
test_agent = {
    "name": "Test Agent",
    "role": "Assistant",
    "goal": "Help with testing",
    "backstory": "I am a test agent",
    "model": "gpt-4o",
    "verbose": True,
    "allow_delegation": False,
    "tools": [
        {
            "name": "search",
            "description": "Search for information"
        }
    ],
    "temperature": 0.7,
    "max_tokens": 1500
}

test_workflow = {
    "name": "Test Workflow",
    "description": "A workflow for testing",
    "agents": [1],  # Will be replaced with actual agent ID
    "tasks": [
        {
            "description": "Test task",
            "agent_index": 0,
            "expected_output": "Test output"
        }
    ],
    "process": "sequential",
    "verbose": True
}

# Tests for agent endpoints
def test_create_agent():
    response = client.post("/api/v1/crew/agents", json=test_agent)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == test_agent["name"]
    assert data["role"] == test_agent["role"]
    assert data["goal"] == test_agent["goal"]
    assert "id" in data
    
    # Save the agent ID for later tests
    test_workflow["agents"] = [data["id"]]

def test_list_agents():
    response = client.get("/api/v1/crew/agents")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_get_agent():
    # Get the first agent
    response = client.get("/api/v1/crew/agents")
    agents = response.json()
    agent_id = agents[0]["id"]
    
    # Get the agent by ID
    response = client.get(f"/api/v1/crew/agents/{agent_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == agent_id

def test_update_agent():
    # Get the first agent
    response = client.get("/api/v1/crew/agents")
    agents = response.json()
    agent_id = agents[0]["id"]
    
    # Update the agent
    update_data = {
        "role": "Updated Role",
        "goal": "Updated Goal"
    }
    response = client.put(f"/api/v1/crew/agents/{agent_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == update_data["role"]
    assert data["goal"] == update_data["goal"]

# Tests for workflow endpoints
def test_create_workflow():
    response = client.post("/api/v1/crew/workflows", json=test_workflow)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == test_workflow["name"]
    assert data["description"] == test_workflow["description"]
    assert "id" in data

def test_list_workflows():
    response = client.get("/api/v1/crew/workflows")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_get_workflow():
    # Get the first workflow
    response = client.get("/api/v1/crew/workflows")
    workflows = response.json()
    workflow_id = workflows[0]["id"]
    
    # Get the workflow by ID
    response = client.get(f"/api/v1/crew/workflows/{workflow_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == workflow_id

def test_update_workflow():
    # Get the first workflow
    response = client.get("/api/v1/crew/workflows")
    workflows = response.json()
    workflow_id = workflows[0]["id"]
    
    # Update the workflow
    update_data = {
        "name": "Updated Workflow",
        "description": "Updated description"
    }
    response = client.put(f"/api/v1/crew/workflows/{workflow_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["description"] == update_data["description"]

# Cleanup tests
def test_delete_workflow():
    # Get the first workflow
    response = client.get("/api/v1/crew/workflows")
    workflows = response.json()
    if len(workflows) > 0:
        workflow_id = workflows[0]["id"]
        
        # Delete the workflow
        response = client.delete(f"/api/v1/crew/workflows/{workflow_id}")
        assert response.status_code == 204

def test_delete_agent():
    # Get the first agent
    response = client.get("/api/v1/crew/agents")
    agents = response.json()
    if len(agents) > 0:
        agent_id = agents[0]["id"]
        
        # Delete the agent
        response = client.delete(f"/api/v1/crew/agents/{agent_id}")
        assert response.status_code == 204
