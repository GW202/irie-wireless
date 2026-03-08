"""Pydantic schemas for action items."""

from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class ActionItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    finding_id: int | None
    title: str
    description: str | None
    action_type: str
    priority: str
    status: str
    assigned_to: str | None
    due_date: date | None
    notes: str | None
    source_url: str | None
    created_at: datetime
    updated_at: datetime


class ActionItemCreate(BaseModel):
    brand_id: int
    title: str
    description: str | None = None
    action_type: str = "research"
    priority: str = "medium"
    assigned_to: str | None = None
    due_date: date | None = None
    finding_id: int | None = None
    source_url: str | None = None


class ActionItemUpdate(BaseModel):
    status: str | None = None
    notes: str | None = None
    assigned_to: str | None = None
    due_date: date | None = None
    priority: str | None = None
    title: str | None = None
    description: str | None = None
    action_type: str | None = None
