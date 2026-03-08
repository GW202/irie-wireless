"""Pydantic schemas for action items."""

from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


class ActionItemResponse(BaseModel):
    """An actionable follow-up item derived from intelligence findings."""
    model_config = ConfigDict(from_attributes=True, json_schema_extra={
        "example": {
            "id": 7,
            "finding_id": 42,
            "title": "Schedule call with T-Mobile wholesale team",
            "description": "T-Mobile expanded their MVNO partner program. Explore better wholesale rates.",
            "action_type": "act",
            "priority": "high",
            "status": "open",
            "assigned_to": "jane@company.com",
            "due_date": "2025-03-15",
            "notes": None,
            "source_url": "https://example.com/article/tmobile-mvno-expansion",
            "created_at": "2025-03-08T02:30:00",
            "updated_at": "2025-03-08T02:30:00",
        }
    })

    id: int = Field(..., description="Action item ID")
    finding_id: int | None = Field(None, description="ID of the related finding, if any")
    title: str = Field(..., description="Action item title")
    description: str | None = Field(None, description="Detailed description")
    action_type: str = Field(..., description="Type: `research`, `inform`, `act`, `review`, or `monitor`")
    priority: str = Field(..., description="Priority: `urgent`, `high`, `medium`, or `low`")
    status: str = Field(..., description="Status: `open`, `in_progress`, `blocked`, `done`, or `dismissed`")
    assigned_to: str | None = Field(None, description="Email or name of the assignee")
    due_date: date | None = Field(None, description="Due date (YYYY-MM-DD)")
    notes: str | None = Field(None, description="Internal notes")
    source_url: str | None = Field(None, description="Reference URL")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")


class ActionItemCreate(BaseModel):
    """Create a new action item. Requires admin+ role."""
    brand_id: int = Field(..., description="Brand this action belongs to", examples=[1])
    title: str = Field(..., description="Action item title", examples=["Review T-Mobile wholesale rates"])
    description: str | None = Field(None, description="Detailed description")
    action_type: str = Field(default="research", description="Type: `research`, `inform`, `act`, `review`, or `monitor`")
    priority: str = Field(default="medium", description="Priority: `urgent`, `high`, `medium`, or `low`")
    assigned_to: str | None = Field(None, description="Assignee email or name")
    due_date: date | None = Field(None, description="Due date")
    finding_id: int | None = Field(None, description="Link to a finding")
    source_url: str | None = Field(None, description="Reference URL")

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "brand_id": 1,
            "title": "Review T-Mobile wholesale rates",
            "description": "Compare new T-Mobile MVNO rates against current agreement",
            "action_type": "research",
            "priority": "high",
            "assigned_to": "jane@company.com",
            "due_date": "2025-03-15",
            "finding_id": 42,
        }
    })


class ActionItemUpdate(BaseModel):
    """Partial update for an action item. Only provided fields are changed."""
    status: str | None = Field(None, description="New status: `open`, `in_progress`, `blocked`, `done`, or `dismissed`")
    notes: str | None = Field(None, description="Updated notes")
    assigned_to: str | None = Field(None, description="New assignee")
    due_date: date | None = Field(None, description="New due date")
    priority: str | None = Field(None, description="New priority: `urgent`, `high`, `medium`, or `low`")
    title: str | None = Field(None, description="Updated title")
    description: str | None = Field(None, description="Updated description")
    action_type: str | None = Field(None, description="New type: `research`, `inform`, `act`, `review`, or `monitor`")

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "status": "in_progress",
            "notes": "Called T-Mobile rep, meeting scheduled for Friday",
        }
    })
