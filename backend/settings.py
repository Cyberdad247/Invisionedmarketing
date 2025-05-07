from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List, Dict

class Settings(BaseSettings):
    # Database Configuration
    DATABASE_URL: str

    # LLM Provider Configuration
    DEFAULT_LLM_MODEL: str = "gpt-4o" # Example default
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    # Add other LLM provider keys as needed

    # Tool Management Configuration
    # Tool-specific API keys and URLs will be added here as tools are integrated
    N8N_API_KEY: Optional[str] = None
    N8N_API_URL: Optional[str] = None

    # MCP Server Configuration
    # MCP server URLs and API keys will be added here as servers are integrated
    # Example:
    # MCP_SERVER_URL_WEATHER: Optional[str] = None
    # MCP_SERVER_API_KEY_WEATHER: Optional[str] = None

    # App Store Data Configuration
    APP_STORE_API_URL: Optional[str] = None
    APP_STORE_API_KEY: Optional[str] = None

    # Agent Playground Core Logic Configuration
    AGENT_EXECUTION_TIMEOUT: int = 300 # Default timeout in seconds
    AGENT_DEFAULT_TOOLS: List[str] = [] # Example default empty list

    # ACI Integration Configuration
    ACI_OPENAI_EMBEDDING_MODEL: Optional[str] = None
    ACI_OPENAI_EMBEDDING_DIMENSION: Optional[int] = None
    ACI_SIGNING_KEY: Optional[str] = None
    ACI_JWT_ALGORITHM: Optional[str] = None
    ACI_JWT_ACCESS_TOKEN_EXPIRE_MINUTES: Optional[int] = None
    ACI_REDIRECT_URI_BASE: Optional[str] = None
    ACI_COOKIE_KEY_FOR_AUTH_TOKEN: str = "accessToken" # Default value from ACI config
    ACI_DB_SCHEME: Optional[str] = None
    ACI_DB_USER: Optional[str] = None
    ACI_DB_PASSWORD: Optional[str] = None
    ACI_DB_HOST: Optional[str] = None
    ACI_DB_PORT: Optional[str] = None
    ACI_DB_NAME: Optional[str] = None
    ACI_DB_FULL_URL: Optional[str] = None # Can be constructed from other DB settings
    ACI_PROPELAUTH_AUTH_URL: Optional[str] = None
    ACI_PROPELAUTH_API_KEY: Optional[str] = None
    ACI_SVIX_SIGNING_SECRET: Optional[str] = None
    ACI_RATE_LIMIT_IP_PER_SECOND: Optional[int] = None
    ACI_RATE_LIMIT_IP_PER_DAY: Optional[int] = None
    ACI_AOPOLABS_API_KEY_NAME: str = "X-API-KEY" # Default value from ACI config
    ACI_PROJECT_DAILY_QUOTA: Optional[int] = None
    ACI_MAX_PROJECTS_PER_ORG: Optional[int] = None
    ACI_MAX_AGENTS_PER_PROJECT: Optional[int] = None
    ACI_APPLICATION_LOAD_BALANCER_DNS: Optional[str] = None
    ACI_DEV_PORTAL_URL: Optional[str] = None
    ACI_LOGFIRE_WRITE_TOKEN: Optional[str] = None
    ACI_LOGFIRE_READ_TOKEN: Optional[str] = None
    ACI_STRIPE_SECRET_KEY: Optional[str] = None
    ACI_STRIPE_WEBHOOK_SIGNING_SECRET: Optional[str] = None


    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()