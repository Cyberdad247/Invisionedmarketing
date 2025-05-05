# Invisionedmarketing - Unified AI Agent Creation & Marketing Platform

## Overview

Invisionedmarketing is a cohesive solution that combines advanced digital marketing capabilities with a flexible, multi-framework ecosystem for creating, managing, and deploying diverse AI agents. The platform empowers users to build, orchestrate, and utilize AI agents for a wide range of marketing workflows and beyond.

## Architecture

The platform uses a monorepo structure with:

- **Frontend**: React-based UI for agent creation, workflow management, and marketing dashboards
- **Backend**: FastAPI Python service for agent logic, framework integration, and API endpoints
- **Database**: PostgreSQL for persistent data storage (via Neon)
- **Redis**: For Celery task queue and caching (via Upstash)
- **Vector Database**: For agent memory and context storage

## Key Features

- Multi-framework agent creation and management
- Complex workflow automation
- Real-time analytics and monitoring
- Customer behavior prediction
- Automated A/B testing
- Scalable, platform-agnostic deployments

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Docker and Docker Compose (for local development)
- Vercel account (for deployment)

### Setup Instructions

1. Clone the repository
2. Install frontend dependencies:
   \`\`\`
   cd frontend
   npm install
   \`\`\`
3. Install backend dependencies:
   \`\`\`
   cd backend
   pip install -r requirements.txt
   \`\`\`
4. Set up environment variables (see `.env.example` files in both directories)
5. Start the development environment:
   \`\`\`
   docker-compose up
   \`\`\`

## Development Workflow

Please follow the guidelines in our development process document and adhere to our Golden Rules:
- Keep files under 500 lines
- Write comprehensive tests
- Document all code
- Update TASK.md regularly

## License

[Specify your license here]
