# Invisionedmarketing Backend

This directory contains the FastAPI-based backend for the Invisionedmarketing platform.

## Structure

- `main.py`: Application entry point
- `/routes`: API endpoints
- `/schemas`: Pydantic models for request/response validation
- `/models`: SQLModel database models
- `/agents`: Agent framework wrappers and logic
- `/utils`: Utility functions and helpers
- `/memory`: Vector database integration for agent memory
- `/tasks`: Celery task definitions

## Setup

1. Install dependencies:
   \`\`\`
   pip install -r requirements.txt
   \`\`\`

2. Start the development server:
   \`\`\`
   uvicorn main:app --reload
   \`\`\`

## Testing

Run tests with:
\`\`\`
pytest
\`\`\`

## Environment Variables

Create a `.env` file with the following variables:
\`\`\`
NEON_DATABASE_URL=postgresql://user:password@localhost:5432/invisionedmarketing
REDIS_URL=redis://localhost:6379/0
VECTOR_DB_URL=http://localhost:8080
