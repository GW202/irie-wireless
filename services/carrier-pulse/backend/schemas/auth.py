"""Pydantic schemas for authentication."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class LoginRequest(BaseModel):
    """Credentials for obtaining a JWT access token."""
    email: str = Field(..., description="User's email address", examples=["admin@carrierpulse.com"])
    password: str = Field(..., description="User's password", examples=["admin"])

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "email": "admin@carrierpulse.com",
            "password": "admin",
        }
    })


class TokenResponse(BaseModel):
    """JWT access token returned after successful login."""
    access_token: str = Field(..., description="JWT token — include in `Authorization: Bearer <token>` header")
    token_type: str = Field(default="bearer", description="Always `bearer`")

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "token_type": "bearer",
        }
    })


class BrandRef(BaseModel):
    """Lightweight brand reference included in user responses."""
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="Brand ID", examples=[1])
    slug: str = Field(..., description="URL-friendly brand identifier", examples=["irie-wireless"])
    name: str = Field(..., description="Brand display name", examples=["Irie Wireless"])


class UserResponse(BaseModel):
    """Current authenticated user profile with assigned brands."""
    model_config = ConfigDict(from_attributes=True, json_schema_extra={
        "example": {
            "id": 1,
            "email": "admin@carrierpulse.com",
            "name": "Admin",
            "role": "superadmin",
            "is_active": True,
            "created_at": "2025-01-15T10:30:00",
            "last_login": "2025-03-08T14:22:00",
            "brands": [
                {"id": 1, "slug": "usa-mobile", "name": "USA Mobile"},
                {"id": 2, "slug": "irie-wireless", "name": "Irie Wireless"},
            ],
        }
    })

    id: int = Field(..., description="User ID")
    email: str = Field(..., description="User's email address")
    name: str = Field(..., description="User's display name")
    role: str = Field(..., description="Role: `superadmin`, `admin`, or `user`")
    is_active: bool = Field(..., description="Whether the account is active")
    created_at: datetime = Field(..., description="Account creation timestamp (UTC)")
    last_login: datetime | None = Field(None, description="Last successful login timestamp (UTC)")
    brands: list[BrandRef] = Field(default=[], description="Brands this user has access to")
