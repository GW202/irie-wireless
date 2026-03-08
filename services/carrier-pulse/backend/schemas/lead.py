"""Pydantic schemas for leads."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class LeadResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    finding_id: int | None
    brand_name: str
    description: str | None
    vertical: str | None
    status: str
    notes: str | None
    source_url: str | None
    detected_at: datetime
    updated_at: datetime


class LeadUpdate(BaseModel):
    status: str | None = None
    notes: str | None = None
