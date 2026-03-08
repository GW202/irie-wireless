"""Authentication API routes — login, current user."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.user import User
from models.user_brand import UserBrand
from models.brand import Brand
from schemas.auth import LoginRequest, TokenResponse, UserResponse, BrandRef
from utils.security import verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Log in with email and password",
    description="Authenticate a user with email and password credentials. Returns a JWT access token on success. The token must be included in subsequent requests as a Bearer token in the Authorization header.",
    responses={
        401: {"description": "Invalid email or password"},
        403: {"description": "Account is deactivated"},
    },
)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    # Update last_login
    user.last_login = datetime.utcnow()
    await db.commit()

    token = create_access_token(data={"sub": user.email})
    return TokenResponse(access_token=token)


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
    description="Returns the authenticated user's profile including their role and assigned brands. Superadmins see all active brands; other users see only their assigned brands.",
    responses={401: {"description": "Not authenticated"}},
)
async def me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Build brands list based on role
    if current_user.role == "superadmin":
        # Superadmins see all brands
        result = await db.execute(select(Brand).where(Brand.is_active == True))
        brands_rows = result.scalars().all()
    else:
        # Others see only assigned brands
        result = await db.execute(
            select(Brand)
            .join(UserBrand, UserBrand.brand_id == Brand.id)
            .where(UserBrand.user_id == current_user.id, Brand.is_active == True)
        )
        brands_rows = result.scalars().all()

    brands = [BrandRef(id=b.id, slug=b.slug, name=b.name) for b in brands_rows]

    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        role=current_user.role,
        is_active=current_user.is_active,
        created_at=current_user.created_at,
        last_login=current_user.last_login,
        brands=brands,
    )
