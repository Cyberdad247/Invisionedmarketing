import pytest
from fastapi.testclient import TestClient
from main import app
from models.workflow import Workflow
from schemas.workflow import WorkflowCreate, WorkflowStepBase

client = TestClient(app)

def test_create_workflow(session):
    """Test creating a new workflow."""
    workflow_data = {
        "name": "Test Workflow",
        "description": "A test workflow",
        "steps": [{"name": "Step 1", "description": "First step"}]
    }
    response = client.post("/api/v1/workflows", json=workflow_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Workflow"
    assert len(data["steps"]) == 1

def test_list_workflows(session):
    """Test listing all workflows."""
    # Create a test workflow
    workflow = Workflow(name="Test", description="Test", steps=[{"name": "Step 1"}])
    session.add(workflow)
    session.commit()
    
    response = client.get("/api/v1/workflows")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(w["name"] == "Test" for w in data)

def test_get_workflow(session):
    """Test getting a specific workflow by ID."""
    workflow = Workflow(name="Test", description="Test", steps=[{"name": "Step 1"}])
    session.add(workflow)
    session.commit()
    
    response = client.get(f"/api/v1/workflows/{workflow.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(workflow.id)
    assert data["name"] == "Test"

# TODO: Add tests for update, delete, and execute endpoints