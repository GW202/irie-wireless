"""Brand API routes — list, create, update, onboard brands."""

import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import Brand
from models.user import User
from models.user_brand import UserBrand
from schemas import BrandResponse, BrandDetailResponse, BrandCreate, BrandUpdate
from schemas.brand import (
    BrandOnboardRequest,
    BrandOnboardResponse,
    BrandConfirmRequest,
    CategoryAssistRequest,
    CategoryAssistResponse,
    CategoryDef,
)
from agent.onboarder import onboard_brand, assist_category
from utils.security import get_current_user, require_role

router = APIRouter(prefix="/api/brands", tags=["brands"])


@router.get("", response_model=list[BrandResponse])
async def list_brands(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role == "superadmin":
        # Superadmins see all active brands
        result = await db.execute(
            select(Brand).where(Brand.is_active == True).order_by(Brand.name)
        )
    else:
        # Others see only assigned brands
        result = await db.execute(
            select(Brand)
            .join(UserBrand, UserBrand.brand_id == Brand.id)
            .where(UserBrand.user_id == current_user.id, Brand.is_active == True)
            .order_by(Brand.name)
        )
    return result.scalars().all()


@router.post("/onboard", response_model=BrandOnboardResponse)
async def onboard_brand_endpoint(
    data: BrandOnboardRequest,
    current_user: User = Depends(require_role("admin")),
):
    """AI-powered brand onboarding — research a company and generate a profile.

    Requires admin+ role. Returns the generated profile for human review.
    """
    try:
        profile = await onboard_brand(data.name, data.hints)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Onboarding failed: {e}")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Onboarding agent error: {str(e)[:200]}",
        )

    # Parse categories into CategoryDef models
    categories = []
    for cat in profile.get("suggested_categories", []):
        categories.append(
            CategoryDef(
                id=cat.get("id", ""),
                name=cat.get("name", ""),
                queries=cat.get("queries", []),
                focus=cat.get("focus", ""),
                carrier=cat.get("carrier"),
            )
        )

    return BrandOnboardResponse(
        slug=profile.get("slug", ""),
        name=profile.get("name", data.name),
        company_context=profile.get("company_context", ""),
        analysis_instructions=profile.get("analysis_instructions", ""),
        suggested_categories=categories,
        email_subject_prefix=profile.get("email_subject_prefix", data.name),
    )


@router.post("/assist-category", response_model=CategoryAssistResponse)
async def assist_category_endpoint(
    data: CategoryAssistRequest,
    current_user: User = Depends(require_role("admin")),
):
    """AI-assisted category completion — generate an optimized category from partial input.

    Requires admin+ role. Returns a single optimized CategoryDef.
    """
    try:
        result = await assist_category(
            brand_name=data.brand_name,
            company_context=data.company_context,
            partial_name=data.partial_name,
            partial_focus=data.partial_focus,
        )
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Category assist failed: {e}")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Category assist error: {str(e)[:200]}",
        )

    category = CategoryDef(
        id=result.get("id", ""),
        name=result.get("name", ""),
        queries=result.get("queries", []),
        focus=result.get("focus", ""),
        carrier=result.get("carrier"),
    )

    return CategoryAssistResponse(category=category)


@router.post("/confirm", response_model=BrandDetailResponse, status_code=201)
async def confirm_brand(
    data: BrandConfirmRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Confirm and create a brand from a reviewed onboarding profile.

    Requires admin+ role. Creates the Brand record and assigns it to the creator.
    """
    # Ensure slug uniqueness — auto-increment suffix if taken
    slug = data.slug
    result = await db.execute(select(Brand).where(Brand.slug == slug))
    if result.scalar_one_or_none():
        counter = 2
        while True:
            candidate = f"{slug}-{counter}"
            check = await db.execute(select(Brand).where(Brand.slug == candidate))
            if not check.scalar_one_or_none():
                slug = candidate
                break
            counter += 1

    # Serialize categories to JSON
    categories_json = None
    if data.categories:
        categories_json = json.dumps([cat.model_dump() for cat in data.categories])

    brand = Brand(
        slug=slug,
        name=data.name,
        company_context=data.company_context,
        analysis_instructions=data.analysis_instructions,
        email_subject_prefix=data.email_subject_prefix,
        categories=categories_json,
        onboarded_at=datetime.utcnow(),
        onboarded_by=current_user.id,
    )
    db.add(brand)
    await db.flush()

    # Auto-assign the brand to the creating user (unless superadmin)
    if current_user.role != "superadmin":
        user_brand = UserBrand(user_id=current_user.id, brand_id=brand.id)
        db.add(user_brand)

    await db.commit()
    await db.refresh(brand)
    return brand


@router.get("/{brand_id}", response_model=BrandDetailResponse)
async def get_brand(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(get_current_user),
):
    brand = await db.get(Brand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    return brand


@router.post("", response_model=BrandDetailResponse, status_code=201)
async def create_brand(
    data: BrandCreate,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(require_role("superadmin")),
):
    # Check slug uniqueness
    result = await db.execute(select(Brand).where(Brand.slug == data.slug))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Brand slug already exists")

    brand = Brand(
        slug=data.slug,
        name=data.name,
        company_context=data.company_context,
        analysis_instructions=data.analysis_instructions,
        email_subject_prefix=data.email_subject_prefix,
    )
    db.add(brand)
    await db.commit()
    await db.refresh(brand)
    return brand


@router.patch("/{brand_id}", response_model=BrandDetailResponse)
async def update_brand(
    brand_id: int,
    data: BrandUpdate,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(require_role("admin")),
):
    brand = await db.get(Brand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    if data.name is not None:
        brand.name = data.name
    if data.company_context is not None:
        brand.company_context = data.company_context
    if data.analysis_instructions is not None:
        brand.analysis_instructions = data.analysis_instructions
    if data.email_subject_prefix is not None:
        brand.email_subject_prefix = data.email_subject_prefix
    if data.categories is not None:
        brand.categories = data.categories
    if data.is_active is not None:
        brand.is_active = data.is_active

    await db.commit()
    await db.refresh(brand)
    return brand


@router.delete("/{brand_id}", status_code=204)
async def delete_brand(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
    _user: User = Depends(require_role("admin")),
):
    """Soft-delete a brand by deactivating it. Requires admin+ role."""
    brand = await db.get(Brand, brand_id)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")

    brand.is_active = False
    await db.commit()
    return None
