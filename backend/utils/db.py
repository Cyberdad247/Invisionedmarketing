from sqlmodel import SQLModel, create_engine, Session
import os
from typing import Generator

# Get the database URL from environment variables
NEON_DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./test.db")

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """
    Create all tables in the database.
    """
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """
    Get a database session.
    """
    with Session(engine) as session:
        yield session
