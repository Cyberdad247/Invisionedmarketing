from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query

# Import necessary components from the embedded ACI code
from backend.aci_integration.server import dependencies as deps
from backend.aci_integration.aci.server.routes.functions import (
    list_functions as aci_list_functions,
    get_function_definition as aci_get_function_definition,
)
from backend.aci_integration.common.schemas.function import (
    FunctionDetails,
    OpenAIResponsesFunctionDefinition,
    BasicFunctionDefinition,
    AnthropicFunctionDefinition,
    OpenAIFunctionDefinition,
)
from backend.aci_integration.common.enums import FunctionDefinitionFormat

router = APIRouter(
    prefix="/app-store",
    tags=["app-store"],
    description="Endpoints for accessing the AI Core Integration (ACI) App Store functions and tools"
)

@router.get("/functions", response_model=list[FunctionDetails], summary="List App Store Functions", description="Get a paginated list of all available ACI tools and integrations")
async def get_functions(
    context: Annotated[deps.RequestContext, Depends(deps.get_request_context)],
    limit: int = Query(20, ge=1, le=1000, description="Maximum number of functions to return (1-1000)"),
    offset: int = Query(0, ge=0, description="Number of functions to skip for pagination"),
):
    """
    Retrieves a list of available ACI tools/integrations.
    
    This endpoint returns a paginated list of all available AI Core Integration (ACI) 
    tools and integrations that can be used by agents. Each function includes basic 
    information such as name, description, and other metadata.
    
    Args:
        context: The request context containing authentication and session information.
        limit: Maximum number of functions to return (1-1000, default: 20).
        offset: Number of functions to skip for pagination (default: 0).
        
    Returns:
        list[FunctionDetails]: A list of function details objects.
    """
    # Call the embedded ACI code to get the list of tools/integrations
    # The aci_list_functions already returns the data in a suitable format (list of FunctionDetails)
    # Error handling for the ACI call itself is assumed to be handled within aci_list_functions
    # or will raise an exception caught by FastAPI's default exception handlers
    tools_list = await aci_list_functions(context=context, query_params={"limit": limit, "offset": offset})

    return tools_list

@router.get(
    "/functions/{function_name}/definition",
    response_model=OpenAIResponsesFunctionDefinition
    | BasicFunctionDefinition
    | AnthropicFunctionDefinition
    | OpenAIFunctionDefinition,
    response_model_exclude_none=True,
    summary="Get Function Definition",
    description="Get the detailed definition of a specific ACI function in various formats"
)
async def get_function_definition(
    context: Annotated[deps.RequestContext, Depends(deps.get_request_context)],
    function_name: str,
    format: FunctionDefinitionFormat = Query(
        default=FunctionDefinitionFormat.OPENAI_RESPONSES,
        description="The format to use for the function definition (e.g., 'openai_responses', 'openai', 'anthropic', or 'basic').",
    ),
):
    """
    Retrieves the detailed definition for a specific ACI tool/integration.
    
    This endpoint returns the complete definition of a specific AI Core Integration (ACI)
    function, including its parameters, required fields, and other metadata. The definition
    can be returned in different formats to support various AI model providers.
    
    Args:
        context: The request context containing authentication and session information.
        function_name: The name of the tool/integration to retrieve.
        format: The desired format for the function definition (openai_responses, openai, anthropic, or basic).
        
    Returns:
        Union[OpenAIResponsesFunctionDefinition, BasicFunctionDefinition, AnthropicFunctionDefinition, OpenAIFunctionDefinition]:
            The function definition in the requested format.
            
    Raises:
        HTTPException: 404 error if the function is not found or an error occurs during retrieval.
    """
    try:
        # Call the embedded ACI code to get the definition for the specified tool/integration
        function_definition = await aci_get_function_definition(
            context=context, function_name=function_name, format=format
        )
        # If the ACI function returns None or an empty result for a valid call
        # but the function wasn't found, this might need additional checking here
        # depending on the aci_get_function_definition implementation details.
        # Assuming aci_get_function_definition raises an exception if not found.
        return function_definition
    except Exception as e:
        # Handle potential exceptions from the ACI function, e.g., FunctionNotFound.
        # Raising HTTPException with status_code 404 for not found or other errors
        # originating from the ACI layer during definition retrieval.
        raise HTTPException(status_code=404, detail=f"Function '{function_name}' not found or an error occurred: {e}")