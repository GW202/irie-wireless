"""Leads API routes."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Lead
from schemas import LeadResponse, LeadUpdate

router = APIRouter(prefix="/api/leads", tags=["Leads"])


@router.get(
    "",
    response_model=list[LeadResponse],
    summary="List sales leads",
    description="Returns sales leads detected from carrier intelligence findings. Optionally filter by status (new, contacted, qualified, converted, dismissed) or vertical.",
)
async def list_leads(
    status: str | None = None,
    vertical: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Lead).order_by(Lead.detected_at.desc())
    if status:
        stmt = stmt.where(Lead.status == status)
    if vertical:
        stmt = stmt.where(Lead.vertical == vertical)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.patch(
    "/{lead_id}",
    response_model=LeadResponse,
    summary="Update a lead",
    description="Update a lead's status or notes. Use this to track lead progression through the sales pipeline.",
    responses={404: {"description": "Lead not found"}},
)
async def update_lead(
    lead_id: int,
    update: LeadUpdate,
    db: AsyncSession = Depends(get_db),
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
