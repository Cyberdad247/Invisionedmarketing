import sys
import os
from pathlib import Path

# Add the parent directory to the path so we can import our modules
sys.path.append(str(Path(__file__).parent.parent))

from sqlmodel import Session
from utils.db import engine, create_db_and_tables
from models.agent import Agent
from models.workflow import Workflow
from datetime import datetime
from uuid import uuid4

def init_db():
    """Initialize the database with sample data."""
    print("Creating database tables...")
    create_db_and_tables()
    
    print("Adding sample data...")
    with Session(engine) as session:
        # Check if we already have agents
        agent_count = session.query(Agent).count()
        if agent_count > 0:
            print(f"Database already contains {agent_count} agents. Skipping sample data creation.")
            return
        
        # Create sample agents
        sample_agents = [
            Agent(
                id=uuid4(),
                name="Customer Support Agent",
                description="Handles customer inquiries and support tickets",
                framework="smol",
                model="gpt-4o",
                system_prompt="You are a helpful customer support agent. Answer customer questions accurately and politely.",
                tools=["search_knowledge_base", "create_ticket"],
                parameters={"temperature": 0.7, "max_tokens": 500},
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            Agent(
                id=uuid4(),
                name="Marketing Content Creator",
                description="Creates marketing content based on product information",
                framework="crewai",
                model="claude-3-opus",
                system_prompt="You are a creative marketing content writer. Create engaging content that highlights product benefits.",
                tools=["search_web", "image_generation"],
                parameters={"temperature": 0.9, "max_tokens": 1000},
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            ),
            Agent(
                id=uuid4(),
                name="Data Analyst",
                description="Analyzes marketing data and provides insights",
                framework="langgraph",
                model="gpt-4o",
                system_prompt="You are a data analyst. Analyze marketing data and provide actionable insights.",
                tools=["query_database", "create_charts"],
                parameters={"temperature": 0.2, "max_tokens": 800},
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
        ]
        
        for agent in sample_agents:
            session.add(agent)
        
        # Create sample workflow
        sample_workflow = Workflow(
            id=uuid4(),
            name="Content Creation and Analysis",
            description="Creates marketing content and analyzes its performance",
            steps=[
                {
                    "name": "Generate Content",
                    "agent_id": str(sample_agents[1].id),
                    "inputs": {"product_id": "product_param"},
                    "outputs": ["content"]
                },
                {
                    "name": "Analyze Performance",
                    "agent_id": str(sample_agents[2].id),
                    "inputs": {"content": "content"},
                    "outputs": ["analysis"]
                }
            ],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        session.add(sample_workflow)
        session.commit()
        
        print("Sample data added successfully!")

if __name__ == "__main__":
    init_db()
