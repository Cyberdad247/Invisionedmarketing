from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import health, agents, crew

app = FastAPI(title="Invisionedmarketing API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api/v1")
app.include_router(agents.router, prefix="/api/v1")
app.include_router(crew.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Invisionedmarketing FastAPI Backend"}
