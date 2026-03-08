"""Brief API routes."""

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Brief, Finding
from models.user import User
from schemas import BriefResponse, BriefListItem, FindingResponse
from utils.security import get_current_user, check_brand_access

router = APIRouter(prefix="/api/briefs", tags=["briefs"])


def _parse_json_field(value: str | None):
    """Safely parse a JSON text field."""
    if not value:
        return None
    try:
        return json.loads(value)
    except (json.JSONDecodeError, TypeError):
        return value


@router.get("", response_model=list[BriefListItem])
async def list_briefs(
    brand_id: int,
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await check_brand_access(brand_id, current_user, db)

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


@router.get("/latest", response_model=BriefResponse)
async def latest_brief(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await check_brand_access(brand_id, current_user, db)

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


@router.get("/{brief_id}", response_model=BriefResponse)
async def get_brief(brief_id: int, db: AsyncSession = Depends(get_db), _user: User = Depends(get_current_user)):
    brief = await db.get(Brief, brief_id)
    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")
    resp = BriefResponse.model_validate(brief)
    resp.top_priorities = _parse_json_field(brief.top_priorities)
    resp.recommendations = _parse_json_field(brief.recommendations)
    return resp


@router.get("/{brief_id}/findings", response_model=list[FindingResponse])
async def get_brief_findings(brief_id: int, db: AsyncSession = Depends(get_db), _user: User = Depends(get_current_user)):
    brief = await db.get(Brief, brief_id)
    if not brief:
        raise HTTPException(status_code=404, detail="Brief not found")
    result = await db.execute(
        select(Finding)
        .where(Finding.run_id == brief.run_id)
        .order_by(Finding.relevance.desc(), Finding.created_at.desc())
    )
    return result.scalars().all()
