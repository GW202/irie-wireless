"""Async SQLAlchemy engine, session factory, and Base class."""

import os

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from config import settings


class Base(DeclarativeBase):
    pass


# Lazily create the engine and session factory so that the module can be
# imported even when the async driver (asyncpg) is not yet installed.
# They are initialised on first access.
_engine = None
_async_session = None


def _get_engine():
    global _engine
    if _engine is None:
        if "sqlite" in settings.database_url:
            os.makedirs("data", exist_ok=True)
        _engine = create_async_engine(settings.database_url, echo=False)
    return _engine


def _get_session_factory():
    global _async_session
    if _async_session is None:
        _async_session = async_sessionmaker(
            _get_engine(), class_=AsyncSession, expire_on_commit=False
        )
    return _async_session


async def get_db():
    """FastAPI dependency that yields an async database session."""
    async with _get_session_factory()() as session:
        yield session


async def init_db():
    """Create all tables on startup."""
    from models import Brand, Finding, Brief, ActionItem, RunLog, User, UserBrand, Lead  # noqa: F401

    async with _get_engine().begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# Convenience alias so callers that import ``async_session`` keep working.
# This is a proxy object that, when called, delegates to the lazily-created
# session factory.
class _SessionFactoryProxy:
    """Thin proxy so ``async_session()`` works the same as before."""

    def __call__(self, *args, **kwargs):
        return _get_session_factory()(*args, **kwargs)

    def __getattr__(self, name):
        return getattr(_get_session_factory(), name)


async_session = _SessionFactoryProxy()
