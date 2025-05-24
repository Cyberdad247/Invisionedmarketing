from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from fastapi.openapi.utils import get_openapi
import os
import stripe
import logfire

from routes import health, agents, crew, monitoring
from backend.settings import settings
from backend.aci_integration.routes import app_store

# Import ACI initialization components
from backend.aci_integration.server.dependency_check import check_dependencies
from backend.aci_integration.server.sentry import setup_sentry
from backend.aci_integration.common.logging_setup import setup_logging
from backend.aci_integration.server.acl import get_propelauth
from backend.aci_integration.server import config as aci_config # Import ACI config separately to avoid name conflicts
from pythonjsonlogger.json import JsonFormatter
# from aci.common.exceptions import ACIException # Import ACIException for exception handling - not needed in main.py

app = FastAPI(
    title="Invisionedmarketing API",
    description="API for Invisionedmarketing platform, providing agent and workflow management capabilities.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

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
app.include_router(app_store.router, prefix="/api/v1")
app.include_router(monitoring.router, prefix="/api/v1")

# ACI Initialization Logic
@app.on_event("startup")
async def startup_event():
    """
    Initializes embedded ACI components on application startup.
    Loads ACI configuration from settings and performs necessary setup.
    """
    # Load ACI configuration from settings
    # Note: ACI configuration is assumed to be loaded into the 'settings' object
    # via environment variables using pydantic-settings.

    # Perform ACI dependency checks
    check_dependencies()

    # Setup ACI Sentry for error tracking
    setup_sentry()

    # Setup ACI logging
    setup_logging(
        formatter=JsonFormatter(
            "{levelname} {asctime} {name} {message}",
            style="{",
            rename_fields={"asctime": "timestamp", "name": "file", "levelname": "level"},
        ),
        # Assuming a RequestIDLogFilter is available in the copied ACI code
        # filters=[RequestIDLogFilter()], # Uncomment if RequestIDLogFilter is needed and available
        environment="development", # Replace with appropriate environment setting from your app
    )

    # Initialize Stripe with ACI secret key
    if settings.ACI_STRIPE_SECRET_KEY:
        stripe.api_key = settings.ACI_STRIPE_SECRET_KEY

    # Initialize PropelAuth for ACI
    # Assuming get_propelauth can be initialized with settings
    # auth = get_propelauth(settings) # Uncomment and adapt if get_propelauth requires settings

    # Add other ACI initialization steps as needed based on the ACI main.py

@app.get("/")
def read_root():
    return {"message": "Invisionedmarketing FastAPI Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
