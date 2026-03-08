"""User management API — superadmin only."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models.user import User
from models.user_brand import UserBrand
from models.brand import Brand
from schemas.user import UserCreate, UserUpdate, UserListItem, UserDetailResponse, UserBrandAssign
from schemas.auth import BrandRef
from utils.security import hash_password, require_role

router = APIRouter(prefix="/api/users", tags=["users"])


async def _build_user_brands(db: AsyncSession, user_id: int) -> list[BrandRef]:
    """Load brands assigned to a user."""
    result = await db.execute(
        select(Brand)
        .join(UserBrand, UserBrand.brand_id == Brand.id)
        .where(UserBrand.user_id == user_id)
    )
    return [BrandRef(id=b.id, slug=b.slug, name=b.name) for b in result.scalars().all()]


@router.get("", response_model=list[UserListItem])
async def list_users(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_role("superadmin")),
):
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    items = []
    for u in users:
        brands = await _build_user_brands(db, u.id)
        items.append(UserListItem(
            id=u.id, email=u.email, name=u.name, role=u.role,
            is_active=u.is_active, created_at=u.created_at,
            last_login=u.last_login, brands=brands,
        ))
    return items


@router.post("", response_model=UserDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    req: UserCreate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_role("superadmin")),
):
    # Validate role
    if req.role not in ("user", "admin", "superadmin"):
        raise HTTPException(status_code=400, detail="Invalid role. Must be user, admin, or superadmin")

    # Check email uniqueness
    result = await db.execute(select(User).where(User.email == req.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already in use")

    # Create user
    user = User(
        email=req.email,
        name=req.name,
        hashed_password=hash_password(req.password),
        role=req.role,
    )
    db.add(user)
    await db.flush()  # get user.id

    # Assign brands
    for brand_id in req.brand_ids:
        # Verify brand exists
        brand_result = await db.execute(select(Brand).where(Brand.id == brand_id))
        if brand_result.scalar_one_or_none() is None:
            raise HTTPException(status_code=400, detail=f"Brand {brand_id} not found")
        db.add(UserBrand(user_id=user.id, brand_id=brand_id))

    await db.commit()
    await db.refresh(user)

    brands = await _build_user_brands(db, user.id)
    return UserDetailResponse(
        id=user.id, email=user.email, name=user.name, role=user.role,
        is_active=user.is_active, created_at=user.created_at,
        updated_at=user.updated_at, last_login=user.last_login, brands=brands,
    )


@router.get("/{user_id}", response_model=UserDetailResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_role("superadmin")),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    brands = await _build_user_brands(db, user.id)
    return UserDetailResponse(
        id=user.id, email=user.email, name=user.name, role=user.role,
        is_active=user.is_active, created_at=user.created_at,
        updated_at=user.updated_at, last_login=user.last_login, brands=brands,
    )


@router.patch("/{user_id}", response_model=UserDetailResponse)
async def update_user(
    user_id: int,
    req: UserUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_role("superadmin")),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent self-demotion
    if user.id == admin.id and req.role and req.role != "superadmin":
        raise HTTPException(status_code=400, detail="Cannot demote yourself")

    if req.email is not None:
        # Check uniqueness
        dup = await db.execute(select(User).where(User.email == req.email, User.id != user_id))
        if dup.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = req.email

    if req.name is not None:
        user.name = req.name
    if req.password is not None:
        user.hashed_password = hash_password(req.password)
    if req.role is not None:
        if req.role not in ("user", "admin", "superadmin"):
            raise HTTPException(status_code=400, detail="Invalid role")
        user.role = req.role
    if req.is_active is not None:
        # Prevent self-deactivation
        if user.id == admin.id and not req.is_active:
            raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
        user.is_active = req.is_active

    await db.commit()
    await db.refresh(user)

    brands = await _build_user_brands(db, user.id)
    return UserDetailResponse(
        id=user.id, email=user.email, name=user.name, role=user.role,
        is_active=user.is_active, created_at=user.created_at,
        updated_at=user.updated_at, last_login=user.last_login, brands=brands,
    )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deactivate_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_role("superadmin")),
):
    """Soft-delete: deactivate the user instead of removing."""
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_active = False
    await db.commit()


@router.post("/{user_id}/brands", response_model=UserDetailResponse)
async def assign_brand(
    user_id: int,
    req: UserBrandAssign,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_role("superadmin")),
):
    # Verify user exists
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify brand exists
    brand_result = await db.execute(select(Brand).where(Brand.id == req.brand_id))
    if brand_result.scalar_one_or_none() is None:
        raise HTTPException(status_code=400, detail="Brand not found")

    # Check if already assigned
    existing = await db.execute(
        select(UserBrand).where(UserBrand.user_id == user_id, UserBrand.brand_id == req.brand_id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Brand already assigned")

    db.add(UserBrand(user_id=user_id, brand_id=req.brand_id))
    await db.commit()

    brands = await _build_user_brands(db, user.id)
    return UserDetailResponse(
        id=user.id, email=user.email, name=user.name, role=user.role,
        is_active=user.is_active, created_at=user.created_at,
        updated_at=user.updated_at, last_login=user.last_login, brands=brands,
    )


@router.delete("/{user_id}/brands/{brand_id}", response_model=UserDetailResponse)
async def unassign_brand(
    user_id: int,
    brand_id: int,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_role("superadmin")),
):
    # Verify user exists
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Find assignment
    assignment = await db.execute(
        select(UserBrand).where(UserBrand.user_id == user_id, UserBrand.brand_id == brand_id)
    )
    ub = assignment.scalar_one_or_none()
    if not ub:
        raise HTTPException(status_code=404, detail="Brand assignment not found")

    await db.delete(ub)
    await db.commit()

    brands = await _build_user_brands(db, user.id)
    return UserDetailResponse(
        id=user.id, email=user.email, name=user.name, role=user.role,
        is_active=user.is_active, created_at=user.created_at,
        updated_at=user.updated_at, last_login=user.last_login, brands=brands,
    )
