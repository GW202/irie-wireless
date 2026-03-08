"""Trends API routes — time-series aggregations."""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Finding, ActionItem

router = APIRouter(prefix="/api/trends", tags=["Trends"])


@router.get(
    "/categories",
    summary="Findings trend by category",
    description="Returns weekly finding counts grouped by monitoring category. Useful for visualizing which categories are generating the most intelligence over time.",
)
async def trends_by_category(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
):
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


@router.get(
    "/carriers",
    summary="Findings trend by carrier",
    description="Returns weekly finding counts grouped by carrier (e.g., AT&T, Verizon, T-Mobile). Useful for tracking which carriers are most active in news and regulatory filings.",
)
async def trends_by_carrier(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
):
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


@router.get(
    "/relevance",
    summary="Findings trend by relevance",
    description="Returns weekly finding counts grouped by relevance level (high, medium, low). Helps track the signal-to-noise ratio of intelligence over time.",
)
async def trends_by_relevance(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
):
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


@router.get(
    "/actions",
    summary="Action items trend",
    description="Returns weekly counts of new action items created. Useful for tracking the operational impact of intelligence findings over time.",
)
async def trends_actions(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
):
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
