from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from uuid import UUID
from datetime import datetime

from schemas.workflow import WorkflowCreate, WorkflowUpdate, WorkflowInDB
from models.workflow import Workflow
from utils.db import get_session

router = APIRouter(prefix="/workflows", tags=["workflows"])

@router.post("/", response_model=WorkflowInDB)
async def create_workflow(workflow: WorkflowCreate, session: Session = Depends(get_session)):
    """Create a new workflow."""
    db_workflow = Workflow(
        name=workflow.name,
        description=workflow.description,
        steps=[step.dict() for step in workflow.steps],
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    session.add(db_workflow)
    session.commit()
    session.refresh(db_workflow)
    return db_workflow

@router.get("/", response_model=List[WorkflowInDB])
async def list_workflows(session: Session = Depends(get_session)):
    """List all workflows."""
    workflows = session.exec(select(Workflow)).all()
    return workflows

@router.get("/{workflow_id}", response_model=WorkflowInDB)
async def get_workflow(workflow_id: UUID, session: Session = Depends(get_session)):
    """Get a specific workflow by ID."""
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return workflow

@router.put("/{workflow_id}", response_model=WorkflowInDB)
async def update_workflow(
    workflow_id: UUID, workflow_update: WorkflowUpdate, session: Session = Depends(get_session)
):
    """Update an existing workflow."""
    db_workflow = session.get(Workflow, workflow_id)
    if not db_workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    # Update workflow fields
    update_data = workflow_update.dict(exclude_unset=True)
    
    for key, value in update_data.items():
        if key == "steps" and value is not None:
            setattr(db_workflow, key, [step.dict() for step in value])
        else:
            setattr(db_workflow, key, value)
    
    db_workflow.updated_at = datetime.utcnow()
    session.add(db_workflow)
    session.commit()
    session.refresh(db_workflow)
    return db_workflow

@router.delete("/{workflow_id}")
async def delete_workflow(workflow_id: UUID, session: Session = Depends(get_session)):
    """Delete a workflow."""
    workflow = session.get(Workflow, workflow_id)
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    session.delete(workflow)
    session.commit()
    return {"message": "Workflow deleted successfully"}
