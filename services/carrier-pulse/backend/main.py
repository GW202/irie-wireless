"""CarrierPulse — Multi-Brand Telecom Intelligence Platform."""

import os
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
from api.leads import router as leads_router

API_DESCRIPTION = """
# CarrierPulse API

**Multi-Brand Telecom Intelligence Platform** — AI-powered competitive
intelligence gathering, analysis, and monitoring for telecom carriers.

## Overview

CarrierPulse uses an AI agent to automatically research telecom industry news,
analyze findings by relevance, generate weekly intelligence briefs, and surface
actionable insights and sales leads for your brands.

## Authentication

All endpoints (except `POST /api/auth/login` and `GET /api/health`) require a
**Bearer token** in the `Authorization` header:

```
Authorization: Bearer <your_access_token>
```

Obtain a token via `POST /api/auth/login` with your email and password.

## Roles & Permissions

| Role | Capabilities |
|------|-------------|
| **superadmin** | Full access — manage users, all brands, all settings |
| **admin** | Manage assigned brands, trigger agent runs, create actions |
| **user** | Read-only access to assigned brands |

## Key Workflows

1. **Brand Onboarding** — Use `POST /api/brands/onboard` to have the AI research
   a company and generate a monitoring profile, then confirm with `POST /api/brands/confirm`
2. **Agent Runs** — Trigger `POST /api/agent/run` to search for new intelligence
   across all configured categories for a brand
3. **Review Findings** — Browse results via `GET /api/findings` with rich filtering
4. **Weekly Briefs** — Auto-generated summaries available at `GET /api/briefs/latest`
5. **Action Items** — Track follow-ups via `/api/actions`
"""

TAGS_METADATA = [
    {
        "name": "Authentication",
        "description": "Login and retrieve the current user profile. Use `POST /api/auth/login` to obtain a JWT bearer token.",
    },
    {
        "name": "Users",
        "description": "User management — create, update, deactivate users and manage brand assignments. **Superadmin only.**",
    },
    {
        "name": "Brands",
        "description": "Brand CRUD and AI-powered onboarding. Brands represent the companies you monitor for telecom intelligence.",
    },
    {
        "name": "Findings",
        "description": "Intelligence findings discovered by the AI agent. Filter by category, carrier, relevance, date range, or keyword search.",
    },
    {
        "name": "Briefs",
        "description": "Weekly intelligence briefs — auto-generated markdown summaries with top priorities and recommendations.",
    },
    {
        "name": "Action Items",
        "description": "Actionable follow-ups derived from findings. Track status, priority, assignment, and due dates. **Admin+ only.**",
    },
    {
        "name": "Leads",
        "description": "Sales leads automatically detected from intelligence findings. Filter by status or vertical.",
    },
    {
        "name": "Dashboard",
        "description": "Summary statistics for a brand — findings this week, open actions, latest brief, and category breakdown.",
    },
    {
        "name": "Trends",
        "description": "Time-series aggregations — findings by category, carrier, or relevance over time, plus action item volume.",
    },
    {
        "name": "Agent",
        "description": "Control the AI intelligence agent — trigger runs, check live status, and view historical run logs. **Admin+ only.**",
    },
    {
        "name": "System",
        "description": "Health check and system status endpoints.",
    },
]


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
    try:
        await _ensure_default_admin()
    except Exception as e:
        print(f"[lifespan] Warning: failed to seed default admin: {e}")
    try:
        await _ensure_default_brands()
    except Exception as e:
        print(f"[lifespan] Warning: failed to seed default brands: {e}")
    start_scheduler()
    yield


app = FastAPI(
    title="CarrierPulse",
    summary="Multi-Brand Telecom Intelligence Platform",
    description=API_DESCRIPTION,
    version="1.0.0",
    openapi_tags=TAGS_METADATA,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    license_info={"name": "Proprietary"},
)

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
app.include_router(leads_router)


@app.get("/api/health", tags=["System"], summary="Health check",
         description="Returns `{\"status\": \"ok\"}` when the service is running. "
         "Used by Railway's health check probe.")
async def health():
    return {"status": "ok"}
