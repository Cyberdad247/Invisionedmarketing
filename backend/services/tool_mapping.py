from typing import Any, Dict
from ..schemas import ToolResponse
from backend.aci_integration.routes.mcp_tools import ToolExecuteResponse

def map_aci_execute_response_to_tool_response(
    tool_name: str,
    aci_response: ToolExecuteResponse,
    tool_details: Dict[str, Any] # Assuming we can pass tool details here
) -> ToolResponse:
    """
    Maps a generic ACI ToolExecuteResponse to a structured internal ToolResponse.
    """
    # This is a basic mapping. More complex logic might be needed
    # based on the specific tool and its expected output structure.
    # The 'tool_details' can be used to populate id, name, description.
    # The 'aci_response.result' needs to be mapped to the 'parameters' field.

    # For a robust mapping, we might need a configuration or a strategy pattern
    # to handle different tool output structures.
    # For now, a simple mapping:
    mapped_parameters = {"execution_result": aci_response.result}

    return ToolResponse(
        id=tool_details.get("id", 0), # Use provided tool details or default
        name=tool_name, # Use tool_name from the request
        description=tool_details.get("description", "No description available"), # Use provided tool details or default
        parameters=mapped_parameters
    )

# Future improvement: Implement a more sophisticated mapping mechanism
# that can handle different tool output formats based on tool type or configuration.