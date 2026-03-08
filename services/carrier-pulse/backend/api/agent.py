"""Agent API routes — trigger runs, check status, view history."""

import asyncio
import json
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db, async_session
from models import Brand, RunLog
from models.user import User
from schemas import RunLogResponse
from agent.pipeline import run_full_pipeline
from agent.categories import CATEGORIES
from utils.security import get_current_user, require_role, check_brand_access

router = APIRouter(prefix="/api/agent", tags=["agent"])

# Track current running task
_current_task: asyncio.Task | None = None

# Valid category IDs for validation (global defaults)
VALID_CATEGORY_IDS = {cat["id"] for cat in CATEGORIES}


def _get_valid_category_ids(brand: "Brand") -> set[str]:
    """Get valid category IDs for a brand — per-brand if available, else global."""
    if brand.categories:
        try:
            custom = json.loads(brand.categories)
            return {cat["id"] for cat in custom}
        except (json.JSONDecodeError, KeyError):
            pass
    return VALID_CATEGORY_IDS


class RunRequest(BaseModel):
    brand_id: int
    categories: Optional[list[str]] = None  # None means all categories


@router.post("/run")
async def trigger_run(
    body: RunRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    global _current_task

    # Check brand access
    await check_brand_access(body.brand_id, current_user, db)

    # Validate brand exists
    brand = await db.get(Brand, body.brand_id)
    if not brand:
        raise HTTPException(status_code=400, detail="Brand not found")

    # Validate category IDs against the brand's categories (per-brand or global)
    valid_ids = _get_valid_category_ids(brand)
    if body.categories:
        invalid = set(body.categories) - valid_ids
        if invalid:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid category IDs: {', '.join(invalid)}",
            )

    # Check for already-running task
    if _current_task and not _current_task.done():
        raise HTTPException(status_code=409, detail="Agent is already running")

    # Also check DB for stuck "running" status
    result = await db.execute(
        select(RunLog).where(RunLog.status == "running").limit(1)
    )
    stuck = result.scalar_one_or_none()
    if stuck:
        # Mark old stuck run as failed
        stuck.status = "failed"
        stuck.error_message = "Marked as failed — new run triggered"
        stuck.completed_at = datetime.utcnow()
        await db.commit()

    # Create new run log
    run_log = RunLog(
        started_at=datetime.utcnow(),
        trigger="manual",
        status="running",
        brand_id=body.brand_id,
    )
    db.add(run_log)
    await db.commit()
    await db.refresh(run_log)

    # Launch pipeline as background task with optional category filter
    _current_task = asyncio.create_task(
        run_full_pipeline(run_log.id, brand_id=body.brand_id, category_ids=body.categories)
    )

    selected = body.categories or list(valid_ids)
    return {
        "run_id": run_log.id,
        "status": "started",
        "categories": selected,
    }


@router.get("/status", response_model=RunLogResponse | None)
async def agent_status(
    brand_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await check_brand_access(brand_id, current_user, db)

    result = await db.execute(
        select(RunLog)
        .where(RunLog.brand_id == brand_id)
        .order_by(RunLog.started_at.desc())
        .limit(1)
    )
    run_log = result.scalar_one_or_none()
    if not run_log:
        return None
    return run_log


@router.get("/history", response_model=list[RunLogResponse])
async def agent_history(
    brand_id: int,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await check_brand_access(brand_id, current_user, db)

    result = await db.execute(
        select(RunLog)
        .where(RunLog.brand_id == brand_id)
        .order_by(RunLog.started_at.desc())
        .limit(limit)
    )
    return result.scalars().all()
