"""Brief API routes."""

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Brief, Finding
from schemas import BriefResponse, BriefListItem, FindingResponse

router = APIRouter(prefix="/api/briefs", tags=["Briefs"])


def _parse_json_field(value: str | None):
    """Safely parse a JSON text field."""
    if not value:
        return None
    try:
        return json.loads(value)
    except (json.JSONDecodeError, TypeError):
        return value


@router.get(
    "",
    response_model=list[BriefListItem],
    summary="List briefs for a brand",
    description="Returns executive intelligence briefs for a brand, paginated and sorted by newest first. Each brief summarizes findings from an agent run.",
)
async def list_briefs(
    brand_id: int,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Brief).where(Brief.brand_id == brand_id).order_by(Brief.created_at.desc()).offset(offset).limit(limit)
    )
    briefs = result.scalars().all()
    items = []
    for b in briefs:
        item = BriefListItem.model_validate(b)
        item.top_priorities = _parse_json_field(b.top_priorities)
        items.append(item)
    return items


@router.get(
    "/latest",
    response_model=BriefResponse,
    summary="Get the latest brief",
    description="Returns the most recent executive brief for a brand, including top priorities and recommendations.",
    responses={404: {"description": "No briefs found for this brand"}},
)
async def latest_brief(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Brief).where(Brief.brand_id == brand_id).order_by(Brief.created_at.desc()).limit(1)
    )
    brief = result.scalar_one_or_none()
    if not brief:
        raise HTTPException(status_code=404, detail="No briefs found")
    resp = BriefResponse.model_validate(brief)
    resp.top_priorities = _parse_json_field(brief.top_priorities)
    resp.recommendations = _parse_json_field(brief.recommendations)
    return resp


@router.get(
    "/{brief_id}",
    response_model=BriefResponse,
    summary="Get a specific brief",
    description="Returns full details for a specific executive brief including top priorities and recommendations.",
    responses={404: {"description": "Brief not found"}},
)
async def get_brief(brief_id: int, db: AsyncSession = Depends(get_db)):
    brief = await db.get(Brief, brief_id)
    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")
    resp = BriefResponse.model_validate(brief)
    resp.top_priorities = _parse_json_field(brief.top_priorities)
    resp.recommendations = _parse_json_field(brief.recommendations)
    return resp


@router.get(
    "/{brief_id}/findings",
    response_model=list[FindingResponse],
    summary="Get findings for a brief",
    description="Returns all findings associated with a specific brief's agent run, sorted by relevance and date.",
    responses={404: {"description": "Brief not found"}},
)
async def get_brief_findings(brief_id: int, db: AsyncSession = Depends(get_db)):
    brief = await db.get(Brief, brief_id)
    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")
    result = await db.execute(
        select(Finding)
        .where(Finding.run_id == brief.run_id)
        .order_by(Finding.relevance.desc(), Finding.created_at.desc())
    )
    return result.scalars().all()
