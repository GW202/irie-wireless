"""Password hashing, JWT tokens, and RBAC utilities."""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from config import settings
from database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

# Role hierarchy — higher number = more privilege
ROLE_HIERARCHY = {"user": 1, "admin": 2, "superadmin": 3}


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(hours=settings.jwt_expire_hours))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


async def get_current_user(
    request: Request,
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    """FastAPI dependency — decodes JWT and returns the User object.

    Also supports service-to-service auth via X-Service-Key header,
    which returns the default superadmin user for platform proxy calls.
    """
    from models.user import User

    # Service-to-service auth: platform proxy sends X-Service-Key
    service_key = request.headers.get("X-Service-Key")
    if service_key and settings.service_key and service_key == settings.service_key:
        result = await db.execute(
            select(User).where(User.role == "superadmin").limit(1)
        )
        admin = result.scalar_one_or_none()
        if admin:
            return admin

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )
    return user


def require_role(minimum_role: str):
    """Dependency factory — returns a FastAPI dependency that checks the user meets a minimum role.

    Usage: Depends(require_role("admin"))
    """
    min_level = ROLE_HIERARCHY.get(minimum_role, 0)

    async def _check_role(
        current_user=Depends(get_current_user),
    ):
        user_level = ROLE_HIERARCHY.get(current_user.role, 0)
        if user_level < min_level:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires {minimum_role} role or higher",
            )
        return current_user

    return _check_role


async def check_brand_access(brand_id: int, user, db: AsyncSession):
    """Verify user has access to a brand. Superadmins bypass. Returns None or raises 403."""
    from models.user_brand import UserBrand

    if user.role == "superadmin":
        return  # superadmins can access all brands

    result = await db.execute(
        select(UserBrand).where(
            UserBrand.user_id == user.id,
            UserBrand.brand_id == brand_id,
        )
    )
    if result.scalar_one_or_none() is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this brand",
        )
