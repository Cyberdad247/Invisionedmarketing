# backend/api/v1/aci/sandbox.py
"""API endpoints for the VM Sandbox."""

from fastapi import APIRouter, Depends, HTTPException, Body, WebSocket, WebSocketDisconnect
from typing import Dict, List, Any, Optional
import json

from backend.services.aci_service import ACIService
from backend.services.dependencies import get_aci_service

router = APIRouter()

@router.post("/deploy-agent")
async def deploy_agent(
    agent_config: Dict[str, Any] = Body(...),
    service: ACIService = Depends(get_aci_service)
):
    """Deploy an agent to the VM sandbox."""
    try:
        agent_id = await service.deploy_agent_to_sandbox(agent_config)
        return {"status": "success", "data": {"agent_id": agent_id}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent deployment failed: {str(e)}")

@router.post("/execute-task/{agent_id}")
async def execute_task(
    agent_id: str,
    task: Dict[str, Any] = Body(...),
    service: ACIService = Depends(get_aci_service)
):
    """Execute a task with the specified agent."""
    try:
        success = await service.execute_task_in_sandbox(agent_id, task)
        if not success:
            raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
        return {"status": "success", "message": f"Task sent to agent {agent_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Task execution failed: {str(e)}")

@router.delete("/terminate-agent/{agent_id}")
async def terminate_agent(
    agent_id: str,
    service: ACIService = Depends(get_aci_service)
):
    """Terminate an agent in the VM sandbox."""
    try:
        success = await service.terminate_agent_in_sandbox(agent_id)
        if not success:
            raise HTTPException(status_code=404, detail=f"Agent {agent_id} not found")
        return {"status": "success", "message": f"Agent {agent_id} terminated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent termination failed: {str(e)}")

@router.websocket("/agent-events/{agent_id}")
async def agent_events_websocket(
    websocket: WebSocket,
    agent_id: str,
    service: ACIService = Depends(get_aci_service)
):
    """WebSocket endpoint for receiving agent events."""
    await websocket.accept()

    try:
        # Register the websocket for agent events
        await service.register_agent_events_websocket(agent_id, websocket)

        # Keep the connection open until the client disconnects
        while True:
            # This will handle incoming messages from the client if needed
            data = await websocket.receive_text()

            # Process any client commands if needed
            try:
                command = json.loads(data)
                if command.get("type") == "ping":
                    await websocket.send_json({"type": "pong"})
            except:
                pass

    except WebSocketDisconnect:
        # Unregister the websocket when the client disconnects
        await service.unregister_agent_events_websocket(agent_id, websocket)
    except Exception as e:
        await websocket.close(code=1011, reason=f"Error: {str(e)}")