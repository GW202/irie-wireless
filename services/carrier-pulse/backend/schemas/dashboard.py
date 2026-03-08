"""Pydantic schemas for dashboard."""

from typing import Any
from pydantic import BaseModel, Field


class CategoryCount(BaseModel):
    """Finding count for a single category."""
    category: str = Field(..., description="Category name", examples=["MVNO Market Trends"])
    count: int = Field(..., description="Number of findings", examples=[8])


class DashboardResponse(BaseModel):
    """Summary dashboard statistics for a brand."""
    total_findings_this_week: int = Field(..., description="Total findings discovered this week (Monday to now)")
    high_priority_count: int = Field(..., description="High-relevance findings this week")
    open_actions_count: int = Field(..., description="Action items with `open` status")
    latest_brief_id: int | None = Field(None, description="ID of the most recent brief, or null")
    top_priorities: Any | None = Field(None, description="Top priority items from the latest brief (parsed JSON)")
    runs_this_month: int = Field(..., description="Number of agent runs this calendar month")
    findings_by_category: list[CategoryCount] = Field(..., description="Finding counts grouped by category from the latest run")

    model_config = {
        "json_schema_extra": {
            "example": {
                "total_findings_this_week": 23,
                "high_priority_count": 5,
                "open_actions_count": 8,
                "latest_brief_id": 10,
                "top_priorities": ["T-Mobile MVNO expansion", "FCC spectrum auction results"],
                "runs_this_month": 3,
                "findings_by_category": [
                    {"category": "MVNO Market Trends", "count": 8},
                    {"category": "Spectrum & Policy", "count": 6},
                    {"category": "Competitive Moves", "count": 9},
                ],
            }
        }
    }
