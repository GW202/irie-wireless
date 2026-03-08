"""Pydantic schemas for user management."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

from schemas.auth import BrandRef


class UserCreate(BaseModel):
    """Create a new user account. Superadmin only."""
    email: str = Field(..., description="Unique email address", examples=["analyst@company.com"])
    name: str = Field(..., description="Display name", examples=["Jane Analyst"])
    password: str = Field(..., description="Initial password (min 6 characters recommended)", examples=["secure-password-123"])
    role: str = Field(default="user", description="Role: `user`, `admin`, or `superadmin`", examples=["admin"])
    brand_ids: list[int] = Field(default=[], description="Brand IDs to assign on creation", examples=[[1, 2]])

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "email": "analyst@company.com",
            "name": "Jane Analyst",
            "password": "secure-password-123",
            "role": "admin",
            "brand_ids": [1, 2],
        }
    })


class UserUpdate(BaseModel):
    """Partial update for a user. Only provided fields are changed."""
    email: str | None = Field(None, description="New email address")
    name: str | None = Field(None, description="New display name")
    password: str | None = Field(None, description="New password")
    role: str | None = Field(None, description="New role: `user`, `admin`, or `superadmin`")
    is_active: bool | None = Field(None, description="Set to `false` to deactivate the account")

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "name": "Jane Senior Analyst",
            "role": "admin",
        }
    })


class UserListItem(BaseModel):
    """User summary for list views."""
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="User ID")
    email: str = Field(..., description="Email address")
    name: str = Field(..., description="Display name")
    role: str = Field(..., description="Role: `superadmin`, `admin`, or `user`")
    is_active: bool = Field(..., description="Whether the account is active")
    created_at: datetime = Field(..., description="Account creation timestamp")
    last_login: datetime | None = Field(None, description="Last login timestamp")
    brands: list[BrandRef] = Field(default=[], description="Assigned brands")


class UserDetailResponse(BaseModel):
    """Full user details including update timestamp."""
    model_config = ConfigDict(from_attributes=True, json_schema_extra={
        "example": {
            "id": 2,
            "email": "analyst@company.com",
            "name": "Jane Analyst",
            "role": "admin",
            "is_active": True,
            "created_at": "2025-02-01T09:00:00",
            "updated_at": "2025-03-05T16:30:00",
            "last_login": "2025-03-08T08:15:00",
            "brands": [
                {"id": 1, "slug": "usa-mobile", "name": "USA Mobile"},
            ],
        }
    })

    id: int = Field(..., description="User ID")
    email: str = Field(..., description="Email address")
    name: str = Field(..., description="Display name")
    role: str = Field(..., description="Role: `superadmin`, `admin`, or `user`")
    is_active: bool = Field(..., description="Whether the account is active")
    created_at: datetime = Field(..., description="Account creation timestamp")
    updated_at: datetime | None = Field(None, description="Last profile update timestamp")
    last_login: datetime | None = Field(None, description="Last login timestamp")
    brands: list[BrandRef] = Field(default=[], description="Assigned brands")


class UserBrandAssign(BaseModel):
    """Assign a brand to a user."""
    brand_id: int = Field(..., description="ID of the brand to assign", examples=[1])

    model_config = ConfigDict(json_schema_extra={
        "example": {"brand_id": 1}
    })
