# backend/api/v1/aci/developer.py
"""API endpoints for the Developer Realm."""

from fastapi import APIRouter, Depends, HTTPException, Body, File, UploadFile
from typing import Dict, List, Any, Optional

from backend.services.aci_service import ACIService
from backend.services.dependencies import get_aci_service

router = APIRouter()

@router.post("/generate-code")
async def generate_code(
    code_request: Dict[str, Any] = Body(...),
    service: ACIService = Depends(get_aci_service)
):
    """Generate code based on natural language instructions."""
    try:
        instructions = code_request.get("instructions")
        language = code_request.get("language", "python")
        context = code_request.get("context", {})

        if not instructions:
            raise HTTPException(status_code=400, detail="Instructions are required")

        result = await service.generate_code(instructions, language, context)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code generation failed: {str(e)}")

@router.post("/generate-tests")
async def generate_tests(
    test_request: Dict[str, Any] = Body(...),
    service: ACIService = Depends(get_aci_service)
):
    """Generate unit tests for code."""
    try:
        code = test_request.get("code")
        language = test_request.get("language", "python")
        framework = test_request.get("framework", "pytest")

        if not code:
            raise HTTPException(status_code=400, detail="Code is required")

        result = await service.generate_tests(code, language, framework)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Test generation failed: {str(e)}")

@router.post("/analyze-code")
async def analyze_code(
    analysis_request: Dict[str, Any] = Body(...),
    service: ACIService = Depends(get_aci_service)
):
    """Analyze code for improvements and issues."""
    try:
        code = analysis_request.get("code")
        language = analysis_request.get("language", "python")

        if not code:
            raise HTTPException(status_code=400, detail="Code is required")

        result = await service.analyze_code(code, language)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code analysis failed: {str(e)}")

@router.post("/generate-documentation")
async def generate_documentation(
    doc_request: Dict[str, Any] = Body(...),
    service: ACIService = Depends(get_aci_service)
):
    """Generate documentation for code."""
    try:
        code = doc_request.get("code")
        language = doc_request.get("language", "python")
        format = doc_request.get("format", "markdown")

        if not code:
            raise HTTPException(status_code=400, detail="Code is required")

        result = await service.generate_documentation(code, language, format)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Documentation generation failed: {str(e)}")

@router.post("/files/upload")
async def upload_file(
    file: UploadFile = File(...),
    service: ACIService = Depends(get_aci_service)
):
    """Upload a file to the Developer Realm."""
    try:
        content = await file.read()
        result = await service.save_file(file.filename, content)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@router.get("/files/{file_path:path}")
async def get_file(
    file_path: str,
    service: ACIService = Depends(get_aci_service)
):
    """Get a file from the Developer Realm."""
    try:
        content = await service.get_file(file_path)
        if not content:
            raise HTTPException(status_code=404, detail=f"File {file_path} not found")
        return {"status": "success", "data": {"content": content}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File retrieval failed: {str(e)}")