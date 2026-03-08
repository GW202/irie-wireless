"""Pydantic schemas for findings."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class FindingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    run_id: int
    category: str
    carrier: str | None
    title: str
    summary: str
    source_url: str | None
    source_name: str | None
    published_date: str | None
    relevance: str
    is_sales_lead: bool
    created_at: datetime


class FindingFilters(BaseModel):
    category: str | None = None
    carrier: str | None = None
    relevance: str | None = None
    is_sales_lead: bool | None = None
    from_date: str | None = None
    to_date: str | None = None
    search: str | None = None
    limit: int = 50
    offset: int = 0
