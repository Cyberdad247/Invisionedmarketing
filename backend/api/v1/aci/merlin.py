# backend/api/v1/aci/merlin.py
"""API endpoints for Merlin's Oracle."""

from fastapi import APIRouter, Depends, HTTPException, Body
from typing import Dict, List, Any, Optional

from backend.services.aci_service import ACIService
from backend.services.dependencies import get_aci_service

router = APIRouter()

@router.post("/analyze-repository")
async def analyze_repository(
    repo_data: Dict[str, Any] = Body(...),
    service: ACIService = Depends(get_aci_service)
):
    """Analyze a repository using Merlin's Crawl4ai."""
    try:
        repo_url = repo_data.get("repo_url")
        if not repo_url:
            raise HTTPException(status_code=400, detail="Repository URL is required")

        result = await service.analyze_repository(repo_url)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Repository analysis failed: {str(e)}")

@router.post("/select-framework")
async def select_framework(
    requirements: Dict[str, Any] = Body(...),
    service: ACIService = Depends(get_aci_service)
):
    """Select the best framework based on requirements."""
    try:
        task_domain = requirements.get("task_domain")
        if not task_domain:
            raise HTTPException(status_code=400, detail="Task domain is required")

        result = await service.select_best_framework(task_domain, requirements)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Framework selection failed: {str(e)}")

@router.post("/select-tools")
async def select_tools(
    requirements: Dict[str, Any] = Body(...),
    service: ACIService = Depends(get_aci_service)
):
    """Select the best tools based on requirements."""
    try:
        task_domain = requirements.get("task_domain")
        framework = requirements.get("framework")
        if not task_domain or not framework:
            raise HTTPException(status_code=400, detail="Task domain and framework are required")

        result = await service.select_best_tools(task_domain, framework)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tool selection failed: {str(e)}")

@router.post("/generate-agent-config")
async def generate_agent_config(
    agent_data: Dict[str, Any] = Body(...),
    service: ACIService = Depends(get_aci_service)
):
    """Generate an agent configuration based on user inputs."""
    try:
        purpose = agent_data.get("purpose")
        skills = agent_data.get("skills", [])
        tools = agent_data.get("tools", [])
        interaction_style = agent_data.get("interaction_style", "professional")
        constraints = agent_data.get("constraints", [])

        if not purpose:
            raise HTTPException(status_code=400, detail="Agent purpose is required")

        result = await service.generate_agent_config(
            purpose, skills, tools, interaction_style, constraints
        )
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent configuration generation failed: {str(e)}")