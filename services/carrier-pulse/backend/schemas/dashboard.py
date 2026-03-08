"""Pydantic schemas for dashboard."""

from typing import Any
from pydantic import BaseModel


class CategoryCount(BaseModel):
    category: str
    count: int


class DashboardResponse(BaseModel):
    total_findings_this_week: int
    high_priority_count: int
    open_actions_count: int
    latest_brief_id: int | None
    top_priorities: Any | None
    runs_this_month: int
    findings_by_category: list[CategoryCount]
