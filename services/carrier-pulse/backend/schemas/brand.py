"""Pydantic schemas for brands."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict


class BrandResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    slug: str
    name: str
    is_active: bool


class BrandDetailResponse(BrandResponse):
    company_context: str
    analysis_instructions: str | None
    email_subject_prefix: str | None
    categories: str | None = None  # JSON string of per-brand categories
    created_at: datetime
    onboarded_at: datetime | None = None
    onboarded_by: int | None = None


class BrandCreate(BaseModel):
    slug: str
    name: str
    company_context: str
    analysis_instructions: str | None = None
    email_subject_prefix: str | None = None
    categories: str | None = None


class BrandUpdate(BaseModel):
    name: str | None = None
    company_context: str | None = None
    analysis_instructions: str | None = None
    email_subject_prefix: str | None = None
    categories: str | None = None
    is_active: bool | None = None


class CategoryDef(BaseModel):
    """A single intelligence category definition."""
    id: str
    name: str
    queries: list[str]
    focus: str
    carrier: str | None = None


class CategoryAssistRequest(BaseModel):
    """Request body for the AI category assistant."""
    brand_name: str
    company_context: str
    partial_name: str = ""
    partial_focus: str = ""


class CategoryAssistResponse(BaseModel):
    """AI-generated optimized category."""
    category: CategoryDef


class BrandOnboardRequest(BaseModel):
    name: str
    hints: str | None = None


class BrandOnboardResponse(BaseModel):
    slug: str
    name: str
    company_context: str
    analysis_instructions: str
    suggested_categories: list[CategoryDef]
    email_subject_prefix: str


class BrandConfirmRequest(BaseModel):
    slug: str
    name: str
    company_context: str
    analysis_instructions: str | None = None
    categories: list[CategoryDef] | None = None
    email_subject_prefix: str | None = None
