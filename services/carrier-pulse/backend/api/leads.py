"""Leads API routes."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Lead
from models.user import User
from schemas import LeadResponse, LeadUpdate
from utils.security import get_current_user

router = APIRouter(prefix="/api/leads", tags=["leads"])


@router.get("", response_model=list[LeadResponse])
async def list_leads(
    status: str | None = None,
    vertical: str | None = None,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    stmt = select(Lead).order_by(Lead.detected_at.desc())
    if status:
        stmt = stmt.where(Lead.status == status)
    if vertical:
        stmt = stmt.where(Lead.vertical == vertical)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.patch("/{lead_id}", response_model=LeadResponse)
async def update_lead(
    lead_id: int,
    update: LeadUpdate,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    lead = await db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if update.status is not None:
        lead.status = update.status
    if update.notes is not None:
        lead.notes = update.notes
    lead.updated_at = datetime.utcnow()

    await db.commit()
    await db.refresh(lead)
    return lead
