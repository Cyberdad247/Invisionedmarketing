import logging
import asyncio # Import asyncio for retries
from sqlalchemy.orm import Session
from typing import List
from .schemas import ToolResponse, ToolSearchRequest, ToolExecuteRequest
from .models.tool import Tool
from backend.aci_integration.routes.mcp_tools import search_mcp_tools, execute_mcp_tool
from fastapi import HTTPException, status
from sqlalchemy.exc import OperationalError, IntegrityError
from .services.tool_mapping import map_aci_execute_response_to_tool_response
from .errors import ToolExecutionError, TransientError, CriticalError, ServiceUnavailableError, CircuitBreakerOpenError, ToolNotFoundError, InvalidRequestError # Import custom exceptions

# Configure logging (Consider centralizing this in main.py for larger applications)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def search_tools(db: Session, query: str) -> List[ToolResponse]:
    """
    Search for tools based on the provided query using the MCP tools endpoint.
    """
    if not query or not query.strip(): # Added strip() for better validation
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Search query cannot be empty")

    try:
        # Assuming search_mcp_tools handles its own potential HTTPExceptions
        mcp_tools_response = await search_mcp_tools(query=query, skip=0, limit=100, db=db)
        tools = []
        if hasattr(mcp_tools_response, 'tools') and isinstance(mcp_tools_response.tools, list):
            for mcp_tool in mcp_tools_response.tools:
                 if hasattr(mcp_tool, 'id') and hasattr(mcp_tool, 'name') and hasattr(mcp_tool, 'description') and hasattr(mcp_tool, 'parameters'):
                    tools.append(ToolResponse(id=mcp_tool.id, name=mcp_tool.name, description=mcp_tool.description, parameters=mcp_tool.parameters))
                 else:
                    logger.warning(f"Unexpected MCP tool structure received during search: {mcp_tool}")
        else:
             logger.warning(f"Unexpected MCP tools response structure received during search: {mcp_tools_response}")

        if not tools:
             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"No tools found for query: '{query}'") # Improved error message

        return tools
    except HTTPException as e:
        # Re-raise HTTPExceptions originating from lower layers (e.g., ACI integration)
        # Consider classifying these based on status code if needed
        logger.error(f"HTTPException during tool search for query '{query}': {e.detail}", exc_info=True)
        raise e # Re-raise the original HTTPException for now, classification can be added later if needed
    except (OperationalError, IntegrityError) as e: # Catch specific DB errors
        logger.error(f"Database error during tool search for query '{query}': {e}", exc_info=True) # Log with exc_info
        raise CriticalError(message="Database error during tool search.", details={"query": query, "error": str(e)})
    except Exception as e:
        logger.error(f"An unexpected error occurred during tool search for query '{query}': {e}", exc_info=True) # Log with exc_info
        raise CriticalError(message="An unexpected error occurred during tool search.", details={"query": query, "error": str(e)})


async def execute_tool(db: Session, tool_request: ToolExecuteRequest) -> ToolResponse:
    """
    Execute a tool based on the provided request using the MCP tools endpoint
    and map the response to the internal ToolResponse format.
    """
    if not tool_request or not tool_request.tool_name or not tool_request.tool_name.strip(): # Added strip()
         raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid tool execution request: tool_name is required.")

    try:
        # Create a ToolExecuteRequest object with only the parameters for the ACI endpoint
        # Assuming ToolExecuteRequest from ACI integration expects 'parameters'
        aci_execute_request = ToolExecuteRequest(parameters=tool_request.parameters)

        # Assuming execute_mcp_tool handles its own potential HTTPExceptions
        mcp_tool_execute_response = await execute_mcp_tool(
            tool_name=tool_request.tool_name,
            request=aci_execute_request,
            db=db # Assuming execute_mcp_tool still needs the db session
        )

        # Fetch tool details from the database using the tool_name
        tool_details = db.query(Tool).filter(Tool.name == tool_request.tool_name).first()

        if not tool_details:
             # If tool details not found in our DB, it's a potential configuration issue
             logger.warning(f"Tool details not found in DB for tool: '{tool_request.tool_name}'. Proceeding with mapping using limited info.")
             # We can still attempt to map the ACI response, but the resulting ToolResponse
             # will have default/placeholder values for id, name, description based on the mapping function.
             # Depending on requirements, we might raise a 404 here instead if tool MUST exist in our DB.
             # For now, following the previous logic of proceeding with mapping.
             pass

        # Use the mapping function to convert the ACI response
        # Pass tool_details as a dictionary, even if None, to the mapping function
        return map_aci_execute_response_to_tool_response(
            tool_name=tool_request.tool_name,
            aci_response=mcp_tool_execute_response,
            tool_details=tool_details.dict() if tool_details else {}
        )

    except HTTPException as e:
        # Re-raise HTTPExceptions originating from lower layers (e.g., ACI integration)
        # Consider classifying these based on status code if needed
        logger.error(f"HTTPException during tool execution for '{tool_request.tool_name}': {e.detail}", exc_info=True)
        # Example: Classify 404 from ACI as ToolNotFoundError
        if e.status_code == status.HTTP_404_NOT_FOUND:
             raise ToolNotFoundError(message=e.detail, details={"tool_name": tool_request.tool_name})
        # Example: Classify 400 from ACI as InvalidRequestError
        elif e.status_code == status.HTTP_400_BAD_REQUEST:
             raise InvalidRequestError(message=e.detail, details={"tool_name": tool_request.tool_name, "parameters": tool_request.parameters})
        # Example: Classify 503 from ACI as ServiceUnavailableError (Transient)
        elif e.status_code == status.HTTP_503_SERVICE_UNAVAILABLE:
             raise ServiceUnavailableError(message=e.detail, details={"tool_name": tool_request.tool_name})
        # Re-raise other HTTPExceptions as CriticalError for now
        else:
             raise CriticalError(message=f"ACI integration error: {e.detail}", details={"tool_name": tool_request.tool_name, "status_code": e.status_code})
    except (OperationalError, IntegrityError) as e: # Catch specific DB errors
        logger.error(f"Database error during execution of tool '{tool_request.tool_name}': {e}", exc_info=True) # Log with exc_info
        raise CriticalError(message="Database error during tool execution.", details={"tool_name": tool_request.tool_name, "error": str(e)})
    except TransientError as e:
        # Handle transient errors with retry logic
        logger.warning(f"Transient error during execution of tool '{tool_request.tool_name}': {e.message}. Attempting retry.", exc_info=True)
        # Simple retry logic (e.g., up to 3 times with a delay)
        max_retries = 3
        retry_delay_seconds = 1
        for retry_count in range(max_retries):
            try:
                await asyncio.sleep(retry_delay_seconds) # Wait before retrying
                mcp_tool_execute_response = await execute_mcp_tool(
                    tool_name=tool_request.tool_name,
                    request=aci_execute_request,
                    db=db
                )
                logger.info(f"Retry successful for tool '{tool_request.tool_name}' after {retry_count + 1} attempts.")
                # If retry is successful, map and return the response
                tool_details = db.query(Tool).filter(Tool.name == tool_request.tool_name).first()
                return map_aci_execute_response_to_tool_response(
                    tool_name=tool_request.tool_name,
                    aci_response=mcp_tool_execute_response,
                    tool_details=tool_details.dict() if tool_details else {}
                )
            except TransientError as retry_e:
                logger.warning(f"Retry {retry_count + 1} failed for tool '{tool_request.tool_name}': {retry_e.message}", exc_info=True)
                if retry_count == max_retries - 1:
                    logger.error(f"Max retries reached for tool '{tool_request.tool_name}'.", exc_info=True)
                    raise CriticalError(message=f"Tool execution failed after {max_retries} retries due to transient error.", details={"tool_name": tool_request.tool_name, "error": str(retry_e)})
            except Exception as retry_e:
                 # If a different error occurs during retry, log and re-raise as CriticalError
                 logger.error(f"An unexpected error occurred during retry {retry_count + 1} for tool '{tool_request.tool_name}': {retry_e}", exc_info=True)
                 raise CriticalError(message=f"An unexpected error occurred during retry for tool execution.", details={"tool_name": tool_request.tool_name, "error": str(retry_e)})

    except Exception as e:
        logger.error(f"An unexpected error occurred during execution of tool '{tool_request.tool_name}': {e}", exc_info=True) # Log with exc_info
        raise CriticalError(message="An unexpected error occurred during tool execution.", details={"tool_name": tool_request.tool_name, "error": str(e)})