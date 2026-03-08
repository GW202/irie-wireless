"""Async SQLAlchemy engine, session factory, and Base class."""

import logging
import os

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

logger = logging.getLogger(__name__)

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


_COLUMN_MIGRATIONS = [
    # brands table — columns that may be missing from older database schemas
    'ALTER TABLE IF EXISTS brands ADD COLUMN IF NOT EXISTS "company_context" TEXT',
    'ALTER TABLE IF EXISTS brands ADD COLUMN IF NOT EXISTS "analysis_instructions" TEXT',
    'ALTER TABLE IF EXISTS brands ADD COLUMN IF NOT EXISTS "email_subject_prefix" VARCHAR',
    'ALTER TABLE IF EXISTS brands ADD COLUMN IF NOT EXISTS "categories" TEXT',
    'ALTER TABLE IF EXISTS brands ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN DEFAULT TRUE',
    'ALTER TABLE IF EXISTS brands ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP',
    'ALTER TABLE IF EXISTS brands ADD COLUMN IF NOT EXISTS "onboarded_at" TIMESTAMP',
    'ALTER TABLE IF EXISTS brands ADD COLUMN IF NOT EXISTS "onboarded_by" INTEGER',
]


def _run_column_migrations(connection):
    """Run column migrations using the sync connection (same as create_all uses)."""
    for sql in _COLUMN_MIGRATIONS:
        print(f"[init_db] Running migration: {sql}")
        connection.execute(text(sql))
    print(f"[init_db] Column migrations complete ({len(_COLUMN_MIGRATIONS)} statements)")


async def init_db():
    """Create all tables on startup and add any missing columns."""
    from models import Brand, Finding, Brief, ActionItem, RunLog, User, UserBrand, Lead  # noqa: F401

    print("[init_db] Creating tables...")
    async with _get_engine().begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    print("[init_db] Running column migrations...")
    async with _get_engine().begin() as conn:
        await conn.run_sync(_run_column_migrations)

    print("[init_db] Done.")


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
