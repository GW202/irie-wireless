"""Pydantic schemas for brands."""

from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class BrandResponse(BaseModel):
    """Lightweight brand summary for list views."""
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="Brand ID")
    slug: str = Field(..., description="URL-friendly identifier", examples=["irie-wireless"])
    name: str = Field(..., description="Display name", examples=["Irie Wireless"])
    is_active: bool = Field(..., description="Whether the brand is actively monitored")


class BrandDetailResponse(BrandResponse):
    """Full brand profile including context, categories, and onboarding info."""
    company_context: str = Field(..., description="Company background used by the AI agent for analysis")
    analysis_instructions: str | None = Field(None, description="Custom instructions for how the AI should analyze findings")
    email_subject_prefix: str | None = Field(None, description="Prefix for email report subject lines")
    categories: str | None = Field(None, description="JSON string of per-brand intelligence categories")
    created_at: datetime = Field(..., description="Brand creation timestamp")
    onboarded_at: datetime | None = Field(None, description="When the AI onboarding completed")
    onboarded_by: int | None = Field(None, description="User ID who triggered the onboarding")

    model_config = ConfigDict(from_attributes=True, json_schema_extra={
        "example": {
            "id": 2,
            "slug": "irie-wireless",
            "name": "Irie Wireless",
            "is_active": True,
            "company_context": "Irie Wireless is a Caribbean-focused MVNO providing affordable mobile plans...",
            "analysis_instructions": "Focus on Caribbean telecom market, roaming partnerships, and MVNO trends.",
            "email_subject_prefix": "Irie Wireless",
            "categories": "[{\"id\":\"mvno_market\",\"name\":\"MVNO Market Trends\",\"queries\":[\"MVNO market trends\"],\"focus\":\"Track MVNO industry developments\",\"carrier\":null}]",
            "created_at": "2025-01-15T10:00:00",
            "onboarded_at": "2025-01-15T10:02:30",
            "onboarded_by": 1,
        }
    })


class BrandCreate(BaseModel):
    """Manually create a brand (superadmin only). For AI-assisted creation, use the onboard flow instead."""
    slug: str = Field(..., description="URL-friendly identifier (must be unique)", examples=["new-carrier"])
    name: str = Field(..., description="Display name", examples=["New Carrier Co"])
    company_context: str = Field(..., description="Background info about the company for the AI agent")
    analysis_instructions: str | None = Field(None, description="Custom analysis instructions")
    email_subject_prefix: str | None = Field(None, description="Email subject prefix")
    categories: str | None = Field(None, description="JSON string of category definitions")

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "slug": "new-carrier",
            "name": "New Carrier Co",
            "company_context": "New Carrier Co is a regional wireless provider in the Southeast US...",
            "analysis_instructions": "Focus on regional competition and spectrum auctions.",
            "email_subject_prefix": "New Carrier",
        }
    })


class BrandUpdate(BaseModel):
    """Partial update for a brand. Only provided fields are changed."""
    name: str | None = Field(None, description="New display name")
    company_context: str | None = Field(None, description="Updated company context")
    analysis_instructions: str | None = Field(None, description="Updated analysis instructions")
    email_subject_prefix: str | None = Field(None, description="Updated email prefix")
    categories: str | None = Field(None, description="Updated categories JSON string")
    is_active: bool | None = Field(None, description="Set `false` to soft-delete the brand")


class CategoryDef(BaseModel):
    """A single intelligence category that the AI agent monitors."""
    id: str = Field(..., description="Unique category identifier", examples=["spectrum_policy"])
    name: str = Field(..., description="Human-readable category name", examples=["Spectrum & Policy"])
    queries: list[str] = Field(..., description="Search queries the agent uses for this category",
                               examples=[["FCC spectrum auction 2025", "telecom regulatory changes"]])
    focus: str = Field(..., description="What the agent should focus on when analyzing results",
                       examples=["Track spectrum auctions, FCC rulings, and regulatory changes"])
    carrier: str | None = Field(None, description="Specific carrier to focus on (null for general categories)",
                                examples=["T-Mobile"])

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "id": "spectrum_policy",
            "name": "Spectrum & Policy",
            "queries": ["FCC spectrum auction 2025", "telecom regulatory changes"],
            "focus": "Track spectrum auctions, FCC rulings, and regulatory changes affecting MVNOs",
            "carrier": None,
        }
    })


class CategoryAssistRequest(BaseModel):
    """Request AI assistance to generate or optimize a monitoring category."""
    brand_name: str = Field(..., description="Name of the brand this category is for", examples=["Irie Wireless"])
    company_context: str = Field(..., description="Company context to help the AI tailor the category")
    partial_name: str = Field(default="", description="Optional partial category name to refine", examples=["Caribbean Roaming"])
    partial_focus: str = Field(default="", description="Optional partial focus description to refine")


class CategoryAssistResponse(BaseModel):
    """AI-generated optimized category definition."""
    category: CategoryDef = Field(..., description="The generated/optimized category")


class BrandOnboardRequest(BaseModel):
    """Trigger AI-powered brand onboarding. The agent will research the company and generate a complete monitoring profile."""
    name: str = Field(..., description="Company name to research", examples=["Gigs"])
    hints: str | None = Field(None, description="Optional context to guide the AI research",
                              examples=["Caribbean MVNO focused on prepaid plans and roaming"])

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "name": "Gigs",
            "hints": "Telecom API platform for eSIM and connectivity",
        }
    })


class BrandOnboardResponse(BaseModel):
    """AI-generated brand profile ready for human review and confirmation."""
    slug: str = Field(..., description="Suggested URL-friendly identifier")
    name: str = Field(..., description="Company name")
    company_context: str = Field(..., description="AI-generated company background")
    analysis_instructions: str = Field(..., description="Suggested analysis instructions")
    suggested_categories: list[CategoryDef] = Field(..., description="AI-suggested monitoring categories")
    email_subject_prefix: str = Field(..., description="Suggested email subject prefix")

    model_config = ConfigDict(json_schema_extra={
        "example": {
            "slug": "gigs",
            "name": "Gigs",
            "company_context": "Gigs is a telecom API platform providing eSIM and connectivity services...",
            "analysis_instructions": "Focus on eSIM market trends, telecom API developments, and connectivity partnerships.",
            "suggested_categories": [
                {
                    "id": "esim_market",
                    "name": "eSIM Market",
                    "queries": ["eSIM market trends 2025", "eSIM adoption telecom"],
                    "focus": "Track eSIM adoption and market developments",
                    "carrier": None,
                }
            ],
            "email_subject_prefix": "Gigs",
        }
    })


class BrandConfirmRequest(BaseModel):
    """Confirm and save a reviewed onboarding profile. Creates the brand in the database."""
    slug: str = Field(..., description="URL-friendly identifier (auto-incremented if taken)")
    name: str = Field(..., description="Brand display name")
    company_context: str = Field(..., description="Company context (may be edited from AI suggestion)")
    analysis_instructions: str | None = Field(None, description="Analysis instructions")
    categories: list[CategoryDef] | None = Field(None, description="Finalized monitoring categories")
    email_subject_prefix: str | None = Field(None, description="Email subject prefix")
