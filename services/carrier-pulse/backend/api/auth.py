"""Authentication API routes — current user."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.user import User
from models.brand import Brand
from schemas.auth import UserResponse, BrandRef

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
    description="Returns the first superadmin user's profile with all active brands.",
)
async def me(
    db: AsyncSession = Depends(get_db),
):
    # Return the first superadmin user
    result = await db.execute(
        select(User).where(User.role == "superadmin").limit(1)
    )
    user = result.scalar_one_or_none()
    if not user:
        # Fallback: return first user
        result = await db.execute(select(User).limit(1))
        user = result.scalar_one_or_none()

    # Get all active brands
    result = await db.execute(select(Brand).where(Brand.is_active == True))
    brands_rows = result.scalars().all()
    brands = [BrandRef(id=b.id, slug=b.slug, name=b.name) for b in brands_rows]

    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
        is_active=user.is_active,
        created_at=user.created_at,
        last_login=user.last_login,
        brands=brands,
    )
