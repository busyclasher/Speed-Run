"""
Database package for Speed-Run AML Platform.

This package contains:
- SQLAlchemy ORM models
- Database connection management
- Session management
- Alembic migrations
"""

from .connection import engine, get_db
from .session import async_session_maker, get_session
from . import models


async def init_db():
    """Initialize database connections (stub for now)."""
    # TODO: Add database initialization logic if needed
    pass


async def close_db():
    """Close database connections (stub for now)."""
    # TODO: Add database cleanup logic if needed
    pass


__all__ = [
    "engine",
    "get_db",
    "async_session_maker",
    "get_session",
    "models",
    "init_db",
    "close_db",
]
