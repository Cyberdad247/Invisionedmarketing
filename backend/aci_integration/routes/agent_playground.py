import logging
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)

# Import necessary components from the embedded ACI code
from backend.aci_integration.server import dependencies as deps
# Assuming these functions exist in the ACI server code for playground interactions
from backend.aci_integration.aci.server.playground import (
    create_playground_session,
    handle_playground_message,
    get_playground_session_history,
)
from backend.aci_integration.common.schemas.playground import (
    PlaygroundSession,
    PlaygroundMessage,
    PlaygroundMessageHistory,
    CreatePlaygroundSessionRequest,
    CreatePlaygroundSessionResponse,
    HandlePlaygroundMessageRequest,
    HandlePlaygroundMessageResponse,
)

router = APIRouter()

class CreateSessionRequest(BaseModel):
    """Request body for creating a new playground session."""
    # Add any necessary parameters for session creation if required by ACI code
    # For now, assuming no specific parameters are needed in the request body
    pass

class CreateSessionResponse(BaseModel):
    """Response body for creating a new playground session."""
    session_id: str

class SendMessageRequest(BaseModel):
    """Request body for sending a message to a playground session."""
    message: str

class SendMessageResponse(BaseModel):
    """Response body for the agent's response."""
    response: str

class MessageHistoryResponse(BaseModel):
    """Response body for retrieving message history."""
    history: List[PlaygroundMessage] # Assuming PlaygroundMessage is defined in ACI schemas

@router.post("/sessions", response_model=CreateSessionResponse)
async def create_session(
    context: Annotated[deps.RequestContext, Depends(deps.get_request_context)],
    request: CreateSessionRequest # Use the defined request model
):
    """
    Creates a new agent playground session.

    Uses Pydantic model `CreateSessionRequest` for request body validation.
    Includes error handling for potential issues during session creation
    by the embedded ACI code.
    """
    logger.info("Received request to create a new playground session.")
    try:
        # Call the embedded ACI code to create a new session
        # Assuming create_playground_session returns a session ID
        session_id = await create_playground_session(context=context)
        logger.info(f"Successfully created playground session: {session_id}")
        return CreateSessionResponse(session_id=session_id)
    except Exception as e:
        # Catch any exceptions raised by the embedded ACI code during session creation
        logger.error(f"Failed to create playground session: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to create session: {e}")

@router.post("/sessions/{session_id}/messages", response_model=SendMessageResponse)
async def send_message(
    context: Annotated[deps.RequestContext, Depends(deps.get_request_context)],
    session_id: str,
    request: SendMessageRequest # Use the defined request model
):
    """
    Sends a message to an existing agent playground session.

    Uses Pydantic model `SendMessageRequest` for request body validation.
    Includes error handling for potential issues during message handling
    by the embedded ACI code, such as session not found.
    """
    logger.info(f"Received message for session {session_id}: {request.message}")
    # Validate session_id format if necessary (FastAPI handles basic type validation)
    if not session_id:
         raise HTTPException(status_code=400, detail="Session ID cannot be empty.")
    try:
        # Call the embedded ACI code to handle the message
        # Assuming handle_playground_message takes session_id and message, and returns agent's response
        agent_response = await handle_playground_message(
            context=context, session_id=session_id, message=request.message
        )
        logger.info(f"Successfully processed message for session {session_id}. Agent response length: {len(agent_response)}")
        return SendMessageResponse(response=agent_response)
    except Exception as e:
        # Handle potential exceptions, e.g., session not found or errors during message processing
        logger.error(f"Failed to send message for session {session_id}: {e}", exc_info=True)
        # A more specific exception from ACI code could be caught here for 404
        raise HTTPException(status_code=500, detail=f"Failed to send message: {e}")

@router.get("/sessions/{session_id}/history", response_model=MessageHistoryResponse)
async def get_history(
    context: Annotated[deps.RequestContext, Depends(deps.get_request_context)],
    session_id: str,
):
    """
    Retrieves the message history for a specific agent playground session.

    Includes error handling for potential issues during history retrieval
    by the embedded ACI code, such as session not found.
    """
    logger.info(f"Received request for history for session {session_id}.")
    # Validate session_id format if necessary (FastAPI handles basic type validation)
    if not session_id:
         raise HTTPException(status_code=400, detail="Session ID cannot be empty.")
    try:
        # Call the embedded ACI code to get the message history
        # Assuming get_playground_session_history takes session_id and returns a list of messages
        history = await get_playground_session_history(context=context, session_id=session_id)
        logger.info(f"Successfully retrieved history for session {session_id}. Number of messages: {len(history)}")
        return MessageHistoryResponse(history=history)
    except Exception as e:
        # Handle potential exceptions, e.g., session not found or errors during history retrieval
        logger.error(f"Failed to retrieve history for session {session_id}: {e}", exc_info=True)
        # A more specific exception from ACI code could be caught here for 404
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {e}")