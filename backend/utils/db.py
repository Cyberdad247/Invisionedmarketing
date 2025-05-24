from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
from backend.settings import settings

# Use the database URL from the Settings object (which loads from environment variables)
engine = create_engine(settings.DATABASE_URL, echo=True)

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
