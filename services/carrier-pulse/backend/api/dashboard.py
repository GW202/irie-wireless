"""Dashboard API route — summary stats."""

import json
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Brief, Finding, ActionItem, RunLog
from schemas import DashboardResponse, CategoryCount

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get(
    "",
    response_model=DashboardResponse,
    summary="Get dashboard summary",
    description="Returns an overview of key metrics for a brand: findings this week, high-priority count, open action items, latest brief ID, top priorities, monthly run count, and findings breakdown by category.",
)
async def dashboard(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
):
    now = datetime.utcnow()
    # Monday of current week
    monday = now - timedelta(days=now.weekday())
    monday = monday.replace(hour=0, minute=0, second=0, microsecond=0)

    # First of current month
    first_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # Total findings this week
    result = await db.execute(
        select(func.count())
        .select_from(Finding)
        .where(Finding.brand_id == brand_id, Finding.created_at >= monday)
    )
    total_findings_this_week = result.scalar() or 0

    # High priority count this week
    result = await db.execute(
        select(func.count())
        .select_from(Finding)
        .where(Finding.brand_id == brand_id, Finding.created_at >= monday, Finding.relevance == "high")
    )
    high_priority_count = result.scalar() or 0

    # Open actions count
    result = await db.execute(
        select(func.count())
        .select_from(ActionItem)
        .where(ActionItem.brand_id == brand_id, ActionItem.status == "open")
    )
    open_actions_count = result.scalar() or 0

    # Latest brief
    result = await db.execute(
        select(Brief)
        .where(Brief.brand_id == brand_id)
        .order_by(Brief.created_at.desc())
        .limit(1)
    )
    latest_brief = result.scalar_one_or_none()
    latest_brief_id = latest_brief.id if latest_brief else None
    top_priorities = None
    if latest_brief and latest_brief.top_priorities:
        try:
            top_priorities = json.loads(latest_brief.top_priorities)
        except (json.JSONDecodeError, TypeError):
            pass

    # Runs this month
    result = await db.execute(
        select(func.count())
        .select_from(RunLog)
        .where(RunLog.brand_id == brand_id, RunLog.started_at >= first_of_month)
    )
    runs_this_month = result.scalar() or 0

    # Findings by category (latest run)
    findings_by_category: list[CategoryCount] = []
    if latest_brief:
        result = await db.execute(
            select(Finding.category, func.count().label("count"))
            .where(Finding.run_id == latest_brief.run_id)
            .group_by(Finding.category)
        )
        rows = result.all()
        findings_by_category = [
            CategoryCount(category=r.category, count=r.count) for r in rows
        ]

    return DashboardResponse(
        total_findings_this_week=total_findings_this_week,
        high_priority_count=high_priority_count,
        open_actions_count=open_actions_count,
        latest_brief_id=latest_brief_id,
        top_priorities=top_priorities,
        runs_this_month=runs_this_month,
        findings_by_category=findings_by_category,
    )
