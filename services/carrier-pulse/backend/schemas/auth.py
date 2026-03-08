"""Pydantic schemas for authentication."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class BrandRef(BaseModel):
    """Lightweight brand reference for user responses."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str
    role: str
    is_active: bool
    created_at: datetime
    last_login: datetime | None = None
    brands: list[BrandRef] = []
