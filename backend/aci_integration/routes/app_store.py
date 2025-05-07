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

router = APIRouter()

@router.get("/functions", response_model=list[FunctionDetails])
async def get_functions(
    context: Annotated[deps.RequestContext, Depends(deps.get_request_context)],
    limit: int = Query(20, ge=1, le=1000),
    offset: int = Query(0, ge=0),
):
    """
    Retrieves a list of available ACI tools/integrations.

    Includes basic validation for query parameters 'limit' and 'offset'
    using FastAPI's Query with 'ge' (greater than or equal to) and 'le'
    (less than or equal to) constraints.
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

    Includes validation for the 'format' query parameter using FastAPI's Query
    with an Enum. The 'function_name' is validated as a path parameter by FastAPI.

    Args:
        function_name: The name of the tool/integration.
        format: The desired format for the function definition.
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