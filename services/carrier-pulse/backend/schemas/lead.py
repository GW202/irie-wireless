"""Pydantic schemas for leads."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class LeadResponse(BaseModel):
    """A sales lead automatically detected from intelligence findings."""
    model_config = ConfigDict(from_attributes=True, json_schema_extra={
        "example": {
            "id": 3,
            "finding_id": 42,
            "brand_name": "Acme Telecom",
            "description": "Acme Telecom is expanding into the Caribbean market and seeking MVNO partnerships",
            "vertical": "Enterprise",
            "status": "new",
            "notes": None,
            "source_url": "https://example.com/article/acme-caribbean-expansion",
            "detected_at": "2025-03-08T02:15:00",
            "updated_at": "2025-03-08T02:15:00",
        }
    })

    id: int = Field(..., description="Lead ID")
    finding_id: int | None = Field(None, description="ID of the finding that generated this lead")
    brand_name: str = Field(..., description="Company or brand name of the lead")
    description: str | None = Field(None, description="Description of the opportunity")
    vertical: str | None = Field(None, description="Industry vertical (e.g., Enterprise, Consumer, IoT)")
    status: str = Field(..., description="Lead status: `new`, `contacted`, `qualified`, `closed`, or `dismissed`")
    notes: str | None = Field(None, description="Internal notes about the lead")
    source_url: str | None = Field(None, description="Source article URL")
    detected_at: datetime = Field(..., description="When the lead was detected")
    updated_at: datetime = Field(..., description="Last update timestamp")


class LeadUpdate(BaseModel):
    """Partial update for a lead. Only provided fields are changed."""
    status: str | None = Field(None, description="New status: `new`, `contacted`, `qualified`, `closed`, or `dismissed`")
    notes: str | None = Field(None, description="Updated notes")

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "status": "contacted",
            "notes": "Sent intro email to VP of Partnerships",
        }
    })
