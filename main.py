from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Archon Super Agent API")

class Agent(BaseModel):
    id: Optional[str] = None
    name: str
    description: str
    framework: str
    capabilities: List[str]
    status: str = "inactive"

# In-memory database for demonstration
agents_db = {}

@app.get("/")
async def root():
    return {"message": "Archon Super Agent API is running"}

@app.post("/agents/", response_model=Agent)
async def create_agent(agent: Agent):
    # Generate a simple ID if not provided
    if agent.id is None:
        agent.id = f"agent_{len(agents_db) + 1}"
    
    agents_db[agent.id] = agent
    return agent

@app.get("/agents/", response_model=List[Agent])
async def list_agents():
    return list(agents_db.values())

@app.get("/agents/{agent_id}", response_model=Agent)
async def get_agent(agent_id: str):
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agents_db[agent_id]

@app.put("/agents/{agent_id}", response_model=Agent)
async def update_agent(agent_id: str, agent: Agent):
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agent.id = agent_id
    agents_db[agent_id] = agent
    return agent

@app.delete("/agents/{agent_id}")
async def delete_agent(agent_id: str):
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    del agents_db[agent_id]
    return {"message": "Agent deleted successfully"}

@app.post("/agents/{agent_id}/start")
async def start_agent(agent_id: str):
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agents_db[agent_id].status = "active"
    return {"message": f"Agent {agent_id} started successfully"}

@app.post("/agents/{agent_id}/stop")
async def stop_agent(agent_id: str):
    if agent_id not in agents_db:
        raise HTTPException(status_code=404, detail="Agent not found")
    
    agents_db[agent_id].status = "inactive"
    return {"message": f"Agent {agent_id} stopped successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
