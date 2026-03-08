"""CarrierPulse — Multi-Brand Telecom Intelligence Platform."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import select

from database import init_db, async_session
from services.scheduler import start_scheduler
from api.auth import router as auth_router
from api.brands import router as brands_router
from api.briefs import router as briefs_router
from api.findings import router as findings_router
from api.actions import router as actions_router
from api.trends import router as trends_router
from api.dashboard import router as dashboard_router
from api.agent import router as agent_router
from api.users import router as users_router


async def _ensure_default_admin():
    """Create default superadmin user if no users exist."""
    from models.user import User
    from utils.security import hash_password
    from config import settings

    async with async_session() as db:
        result = await db.execute(select(User).limit(1))
        if result.scalar_one_or_none() is None:
            admin = User(
                email=settings.initial_admin_email,
                name=settings.initial_admin_name,
                hashed_password=hash_password(settings.initial_admin_password),
                role="superadmin",
            )
            db.add(admin)
            await db.commit()
            print(f"Created default superadmin (email: {settings.initial_admin_email}, password: {settings.initial_admin_password})")


async def _ensure_default_brands():
    """Seed USA Mobile and Irie Wireless brands if no brands exist."""
    from models import Brand
    from agent.prompts import USA_MOBILE_DEFAULT_CONTEXT, IRIE_WIRELESS_DEFAULT_CONTEXT

    async with async_session() as db:
        result = await db.execute(select(Brand).limit(1))
        if result.scalar_one_or_none() is not None:
            return  # Brands already exist

        usa_mobile = Brand(
            slug="usa-mobile",
            name="USA Mobile",
            company_context=USA_MOBILE_DEFAULT_CONTEXT,
            email_subject_prefix="USA Mobile",
        )
        irie_wireless = Brand(
            slug="irie-wireless",
            name="Irie Wireless",
            company_context=IRIE_WIRELESS_DEFAULT_CONTEXT,
            email_subject_prefix="Irie Wireless",
        )
        db.add(usa_mobile)
        db.add(irie_wireless)
        await db.commit()
        print("Seeded default brands: USA Mobile, Irie Wireless")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await _ensure_default_admin()
    await _ensure_default_brands()
    start_scheduler()
    yield


app = FastAPI(title="CarrierPulse", lifespan=lifespan)

import os

_allowed_origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]
# Add production frontend URL from env if set
_frontend_url = os.environ.get("FRONTEND_URL", "")
if _frontend_url:
    _allowed_origins.append(_frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(auth_router)
app.include_router(brands_router)
app.include_router(briefs_router)
app.include_router(findings_router)
app.include_router(actions_router)
app.include_router(trends_router)
app.include_router(dashboard_router)
app.include_router(agent_router)
app.include_router(users_router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
