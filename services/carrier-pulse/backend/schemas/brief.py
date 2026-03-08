"""Pydantic schemas for briefs."""

from datetime import date, datetime
from typing import Any
from pydantic import BaseModel, ConfigDict


class BriefListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    run_id: int
    week_of: date
    top_priorities: Any | None  # JSON string or parsed
    finding_count: int
    action_count: int
    created_at: datetime


class BriefResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    run_id: int
    week_of: date
    brief_markdown: str
    top_priorities: Any | None
    recommendations: Any | None
    finding_count: int
    action_count: int
    created_at: datetime
