import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.main import app
from backend.dependencies import get_db
from backend.models.tool import Tool
from backend.schemas import ToolExecuteRequest

# Setup a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define a dependency override for the test database session
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

# Create tables in the test database
@pytest.fixture(name="session")
def session_fixture():
    Tool.metadata.create_all(engine)
    yield TestingSessionLocal()
    Tool.metadata.drop_all(engine)

# Test data
tool_data = {
    "name": "test_tool",
    "description": "A tool for testing",
    "parameters": {"param1": "value1"}
}

# Integration tests for MCP tools endpoints
def test_search_mcp_tools(session: Session):
    """Test searching for MCP tools."""
    # Add a tool to the test database
    db_tool = Tool(**tool_data)
    session.add(db_tool)
    session.commit()
    session.refresh(db_tool)

    response = client.get("/api/v1/mcp_tools/search", params={"query": "test"})

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["name"] == "test_tool"

def test_search_mcp_tools_not_found(session: Session):
    """Test searching for non-existent MCP tools."""
    response = client.get("/api/v1/mcp_tools/search", params={"query": "nonexistent"})

    assert response.status_code == 404
    assert response.json() == {"detail": "No tools found for query: nonexistent"}

# Note: To fully test the execute endpoint, we would need to mock the
# execute_mcp_tool function from backend.aci_integration.routes.mcp_tools
# as we cannot directly call the external ACI service in an integration test.
# This requires a mocking library like unittest.mock or pytest-mock.

def test_execute_mcp_tool_success(session: Session, mocker):
    """Test executing an MCP tool successfully."""
    # Mock the execute_mcp_tool function from backend.services
    mock_execute = mocker.patch("backend.services.execute_mcp_tool")
    # Mock the response structure expected by map_aci_execute_response_to_tool_response
    mock_execute.return_value = {"result": {"output": "success"}}

    # Add a tool to the test database
    db_tool = Tool(**tool_data)
    session.add(db_tool)
    session.commit()
    session.refresh(db_tool)

    execute_request = ToolExecuteRequest(tool_name="test_tool", parameters={"input": "test"})

    response = client.post("/api/v1/mcp_tools/execute", json=execute_request.model_dump()) # Use model_dump() for Pydantic v2

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "test_tool"
    # The mapping function puts the execution result under "execution_result"
    assert data["parameters"]["execution_result"] == {"output": "success"}
    mock_execute.assert_called_once_with(
        tool_name="test_tool",
        request=mocker.ANY, # We don't need to assert the exact request object structure here
        db=session
    )

def test_execute_mcp_tool_not_found_in_db(session: Session, mocker):
    """Test executing an MCP tool that exists in ACI but not in our DB."""
    # Mock the execute_mcp_tool function to return a successful ACI response
    mock_execute = mocker.patch("backend.services.execute_mcp_tool")
    mock_execute.return_value = {"result": {"output": "success from ACI"}}

    # Do NOT add the tool to the test database

    execute_request = ToolExecuteRequest(tool_name="nonexistent_in_db_tool", parameters={"input": "test"})

    response = client.post("/api/v1/mcp_tools/execute", json=execute_request.model_dump())

    # The service layer logs a warning but proceeds with mapping if the tool is not in the DB.
    # The mapping function will use the tool_name from the request.
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "nonexistent_in_db_tool"
    assert data["parameters"]["execution_result"] == {"output": "success from ACI"}
    mock_execute.assert_called_once_with(
        tool_name="nonexistent_in_db_tool",
        request=mocker.ANY,
        db=session
    )

def test_execute_mcp_tool_aci_not_found(session: Session, mocker):
    """Test executing an MCP tool that is not found by the ACI integration."""
    # Mock the execute_mcp_tool function to raise an HTTPException with 404 status
    mock_execute = mocker.patch("backend.services.execute_mcp_tool")
    from fastapi import HTTPException, status
    mock_execute.side_effect = HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tool not found in ACI")

    # Add a tool to the test database (optional, the service should handle this case even if the tool exists in DB)
    db_tool = Tool(**tool_data)
    session.add(db_tool)
    session.commit()
    session.refresh(db_tool)

    execute_request = ToolExecuteRequest(tool_name="nonexistent_in_aci_tool", parameters={"input": "test"})

    response = client.post("/api/v1/mcp_tools/execute", json=execute_request.model_dump())

    assert response.status_code == 404
    assert response.json() == {"detail": "Tool not found in ACI"}
    mock_execute.assert_called_once_with(
        tool_name="nonexistent_in_aci_tool",
        request=mocker.ANY,
        db=session
    )

def test_execute_mcp_tool_aci_internal_error(session: Session, mocker):
    """Test executing an MCP tool when ACI integration returns an internal server error."""
    # Mock the execute_mcp_tool function to raise an HTTPException with 500 status
    mock_execute = mocker.patch("backend.services.execute_mcp_tool")
    from fastapi import HTTPException, status
    mock_execute.side_effect = HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="ACI internal error")

    # Add a tool to the test database
    db_tool = Tool(**tool_data)
    session.add(db_tool)
    session.commit()
    session.refresh(db_tool)

    execute_request = ToolExecuteRequest(tool_name="test_tool", parameters={"input": "test"})

    response = client.post("/api/v1/mcp_tools/execute", json=execute_request.model_dump())

    assert response.status_code == 500
    assert response.json() == {"detail": "ACI internal error"}
    mock_execute.assert_called_once_with(
        tool_name="test_tool",
        request=mocker.ANY,
        db=session
    )

def test_execute_mcp_tool_invalid_request(session: Session):
    """Test executing an MCP tool with an invalid request body."""
    # Missing tool_name in the request body
    invalid_request_data = {"parameters": {"input": "test"}}

    response = client.post("/api/v1/mcp_tools/execute", json=invalid_request_data)

    assert response.status_code == 422 # FastAPI validation error
    # Assert on the structure of the validation error response if needed, but 422 is sufficient for this test.

def test_search_mcp_tools_empty_query(session: Session):
    """Test searching for MCP tools with an empty query."""
    response = client.get("/api/v1/mcp_tools/search", params={"query": ""})

    assert response.status_code == 400
    assert response.json() == {"detail": "Search query cannot be empty"}