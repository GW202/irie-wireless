"""Pydantic schemas for run logs."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class RunLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    started_at: datetime
    completed_at: datetime | None
    status: str
    search_count: int
    finding_count: int
    error_message: str | None
    cost_estimate: float | None
    trigger: str
    brand_id: int
