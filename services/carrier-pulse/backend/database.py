"""Async SQLAlchemy engine, session factory, and Base class."""

import logging
import os

from sqlalchemy import inspect, text
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


def _get_column_type_sql(col):
    """Return a SQL type string for a SQLAlchemy column."""
    dialect = _get_engine().dialect
    return col.type.compile(dialect=dialect)


def _sync_missing_columns(conn):
    """Add any columns defined in models but missing from the database."""
    inspector = inspect(conn)
    for table in Base.metadata.sorted_tables:
        if not inspector.has_table(table.name):
            continue
        existing = {c["name"] for c in inspector.get_columns(table.name)}
        for col in table.columns:
            if col.name not in existing:
                col_type = _get_column_type_sql(col)
                nullable = "NULL" if col.nullable else "NOT NULL"
                default = ""
                if col.server_default is not None:
                    default = f" DEFAULT {col.server_default.arg}"
                elif col.nullable:
                    default = " DEFAULT NULL"
                    nullable = "NULL"
                else:
                    # Can't add NOT NULL column without default to existing rows
                    nullable = "NULL"
                sql = f'ALTER TABLE {table.name} ADD COLUMN "{col.name}" {col_type} {nullable}{default}'
                logger.info("Adding missing column: %s", sql)
                conn.execute(text(sql))


async def init_db():
    """Create all tables on startup and add any missing columns."""
    from models import Brand, Finding, Brief, ActionItem, RunLog, User, UserBrand, Lead  # noqa: F401

    async with _get_engine().begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await conn.run_sync(_sync_missing_columns)


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
