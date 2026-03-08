"""Pydantic schemas for findings."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class FindingResponse(BaseModel):
    """A single intelligence finding discovered by the AI agent."""
    model_config = ConfigDict(from_attributes=True, json_schema_extra={
        "example": {
            "id": 42,
            "run_id": 5,
            "category": "MVNO Market Trends",
            "carrier": "T-Mobile",
            "title": "T-Mobile Expands MVNO Partner Program",
            "summary": "T-Mobile announced an expanded wholesale program offering better rates for MVNOs, potentially benefiting smaller carriers...",
            "source_url": "https://example.com/article/tmobile-mvno-expansion",
            "source_name": "Fierce Wireless",
            "published_date": "2025-03-07",
            "relevance": "high",
            "is_sales_lead": False,
            "created_at": "2025-03-08T02:15:00",
        }
    })

    id: int = Field(..., description="Finding ID")
    run_id: int = Field(..., description="ID of the agent run that produced this finding")
    category: str = Field(..., description="Intelligence category (e.g., 'MVNO Market Trends')")
    carrier: str | None = Field(None, description="Specific carrier mentioned, if applicable")
    title: str = Field(..., description="Finding headline")
    summary: str = Field(..., description="AI-generated summary of the finding")
    source_url: str | None = Field(None, description="Link to the original source article")
    source_name: str | None = Field(None, description="Name of the source publication")
    published_date: str | None = Field(None, description="Publication date of the source (YYYY-MM-DD)")
    relevance: str = Field(..., description="Relevance level: `high`, `medium`, or `low`")
    is_sales_lead: bool = Field(..., description="Whether this finding represents a potential sales opportunity")
    created_at: datetime = Field(..., description="When this finding was created")


class FindingFilters(BaseModel):
    """Query parameters for filtering findings."""
    category: str | None = Field(None, description="Filter by category name")
    carrier: str | None = Field(None, description="Filter by carrier name")
    relevance: str | None = Field(None, description="Filter by relevance: `high`, `medium`, or `low`")
    is_sales_lead: bool | None = Field(None, description="Filter for sales leads only")
    from_date: str | None = Field(None, description="Start date filter (ISO format: YYYY-MM-DD or full datetime)")
    to_date: str | None = Field(None, description="End date filter (ISO format: YYYY-MM-DD or full datetime)")
    search: str | None = Field(None, description="Free-text search across title and summary")
    limit: int = Field(default=50, description="Max results to return (max 200)")
    offset: int = Field(default=0, description="Number of results to skip for pagination")
