"""Pydantic schemas for run logs."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class RunLogResponse(BaseModel):
    """Record of an AI agent run — tracks status, timing, and results."""
    model_config = ConfigDict(from_attributes=True, json_schema_extra={
        "example": {
            "id": 5,
            "started_at": "2025-03-08T02:00:00",
            "completed_at": "2025-03-08T02:15:30",
            "status": "completed",
            "search_count": 24,
            "finding_count": 15,
            "error_message": None,
            "cost_estimate": 0.12,
            "trigger": "manual",
            "brand_id": 1,
        }
    })

    id: int = Field(..., description="Run log ID")
    started_at: datetime = Field(..., description="When the run started")
    completed_at: datetime | None = Field(None, description="When the run finished (null if still running)")
    status: str = Field(..., description="Run status: `running`, `completed`, or `failed`")
    search_count: int = Field(..., description="Number of search queries executed")
    finding_count: int = Field(..., description="Number of findings discovered")
    error_message: str | None = Field(None, description="Error details if the run failed")
    cost_estimate: float | None = Field(None, description="Estimated API cost in USD")
    trigger: str = Field(..., description="What triggered the run: `manual` or `scheduled`")
    brand_id: int = Field(..., description="Brand this run was for")
