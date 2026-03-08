"""Pydantic schemas for briefs."""

from datetime import date, datetime
from typing import Any
from pydantic import BaseModel, ConfigDict, Field


class BriefListItem(BaseModel):
    """Brief summary for list views."""
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="Brief ID")
    run_id: int = Field(..., description="Agent run that generated this brief")
    week_of: date = Field(..., description="Monday of the week this brief covers")
    top_priorities: Any | None = Field(None, description="Parsed JSON array of top priority items")
    finding_count: int = Field(..., description="Number of findings in this brief")
    action_count: int = Field(..., description="Number of action items generated")
    created_at: datetime = Field(..., description="Brief creation timestamp")


class BriefResponse(BaseModel):
    """Full weekly intelligence brief with markdown content and recommendations."""
    model_config = ConfigDict(from_attributes=True, json_schema_extra={
        "example": {
            "id": 10,
            "run_id": 5,
            "week_of": "2025-03-03",
            "brief_markdown": "# Weekly Intelligence Brief\\n\\n## Top Priorities\\n\\n1. T-Mobile MVNO expansion...",
            "top_priorities": ["T-Mobile MVNO expansion offers better wholesale rates", "FCC spectrum auction results"],
            "recommendations": ["Schedule call with T-Mobile wholesale team", "Review spectrum auction implications"],
            "finding_count": 15,
            "action_count": 4,
            "created_at": "2025-03-08T02:30:00",
        }
    })

    id: int = Field(..., description="Brief ID")
    run_id: int = Field(..., description="Agent run that generated this brief")
    week_of: date = Field(..., description="Monday of the week this brief covers")
    brief_markdown: str = Field(..., description="Full brief content in Markdown format")
    top_priorities: Any | None = Field(None, description="Parsed JSON array of top priority items")
    recommendations: Any | None = Field(None, description="Parsed JSON array of recommended actions")
    finding_count: int = Field(..., description="Number of findings in this brief")
    action_count: int = Field(..., description="Number of action items generated")
    created_at: datetime = Field(..., description="Brief creation timestamp")
