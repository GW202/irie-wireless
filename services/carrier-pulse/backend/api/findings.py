"""Findings API routes."""

from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Finding
from schemas import FindingResponse

router = APIRouter(prefix="/api/findings", tags=["Findings"])


@router.get(
    "",
    response_model=list[FindingResponse],
    summary="List findings for a brand",
    description="Returns carrier intelligence findings for a brand with optional filters for category, carrier, relevance level, sales lead flag, date range, and free-text search. Results are paginated and sorted by newest first.",
)
async def list_findings(
    brand_id: int,
    category: str | None = None,
    carrier: str | None = None,
    relevance: str | None = None,
    is_sales_lead: bool | None = None,
    from_date: str | None = None,
    to_date: str | None = None,
    search: str | None = None,
    limit: int = Query(default=50, le=200),
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Finding).where(Finding.brand_id == brand_id).order_by(Finding.created_at.desc())

    if category:
        stmt = stmt.where(Finding.category == category)
    if carrier:
        stmt = stmt.where(Finding.carrier == carrier)
    if relevance:
        stmt = stmt.where(Finding.relevance == relevance)
    if is_sales_lead is not None:
        stmt = stmt.where(Finding.is_sales_lead == is_sales_lead)
    if from_date:
        try:
            dt = datetime.fromisoformat(from_date)
            stmt = stmt.where(Finding.created_at >= dt)
        except ValueError:
            pass
    if to_date:
        try:
            dt = datetime.fromisoformat(to_date)
            if len(to_date) == 10:
                dt = dt.replace(hour=23, minute=59, second=59)
            stmt = stmt.where(Finding.created_at <= dt)
        except ValueError:
            pass
    if search:
        pattern = f"%{search}%"
        stmt = stmt.where(
            or_(Finding.title.ilike(pattern), Finding.summary.ilike(pattern))
        )

    stmt = stmt.offset(offset).limit(limit)
    result = await db.execute(stmt)
    return result.scalars().all()
