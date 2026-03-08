"""Trends API routes — time-series aggregations."""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Finding, ActionItem
from models.user import User
from utils.security import get_current_user, check_brand_access

router = APIRouter(prefix="/api/trends", tags=["trends"])


@router.get("/categories")
async def trends_by_category(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Finding count by category per week."""
    await check_brand_access(brand_id, current_user, db)

    stmt = (
        select(
            func.strftime("%Y-%W", Finding.created_at).label("week"),
            Finding.category,
            func.count().label("count"),
        )
        .where(Finding.brand_id == brand_id)
        .group_by("week", Finding.category)
        .order_by("week")
    )
    result = await db.execute(stmt)
    rows = result.all()
    return [{"week": r.week, "category": r.category, "count": r.count} for r in rows]


@router.get("/carriers")
async def trends_by_carrier(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Finding count by carrier per week."""
    await check_brand_access(brand_id, current_user, db)

    stmt = (
        select(
            func.strftime("%Y-%W", Finding.created_at).label("week"),
            Finding.carrier,
            func.count().label("count"),
        )
        .where(Finding.brand_id == brand_id, Finding.carrier.isnot(None))
        .group_by("week", Finding.carrier)
        .order_by("week")
    )
    result = await db.execute(stmt)
    rows = result.all()
    return [{"week": r.week, "carrier": r.carrier, "count": r.count} for r in rows]


@router.get("/relevance")
async def trends_by_relevance(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Finding count by relevance per week."""
    await check_brand_access(brand_id, current_user, db)

    stmt = (
        select(
            func.strftime("%Y-%W", Finding.created_at).label("week"),
            Finding.relevance,
            func.count().label("count"),
        )
        .where(Finding.brand_id == brand_id)
        .group_by("week", Finding.relevance)
        .order_by("week")
    )
    result = await db.execute(stmt)
    rows = result.all()
    return [{"week": r.week, "relevance": r.relevance, "count": r.count} for r in rows]


@router.get("/actions")
async def trends_actions(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """New action items per week."""
    await check_brand_access(brand_id, current_user, db)

    stmt = (
        select(
            func.strftime("%Y-%W", ActionItem.created_at).label("week"),
            func.count().label("count"),
        )
        .where(ActionItem.brand_id == brand_id)
        .group_by("week")
        .order_by("week")
    )
    result = await db.execute(stmt)
    rows = result.all()
    return [{"week": r.week, "count": r.count} for r in rows]
