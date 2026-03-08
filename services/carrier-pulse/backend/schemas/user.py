"""Pydantic schemas for user management."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict

from schemas.auth import BrandRef


class UserCreate(BaseModel):
    email: str
    name: str
    password: str
    role: str = "user"
    brand_ids: list[int] = []


class UserUpdate(BaseModel):
    email: str | None = None
    name: str | None = None
    password: str | None = None
    role: str | None = None
    is_active: bool | None = None


class UserListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str
    role: str
    is_active: bool
    created_at: datetime
    last_login: datetime | None = None
    brands: list[BrandRef] = []


class UserDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    name: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime | None = None
    last_login: datetime | None = None
    brands: list[BrandRef] = []


class UserBrandAssign(BaseModel):
    brand_id: int
