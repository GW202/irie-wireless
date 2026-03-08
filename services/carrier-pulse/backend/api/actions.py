"""Action items API routes."""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from models import ActionItem
from models.user import User
from schemas import ActionItemResponse, ActionItemCreate, ActionItemUpdate
from utils.security import get_current_user, require_role, check_brand_access

router = APIRouter(prefix="/api/actions", tags=["actions"])

VALID_ACTION_TYPES = {"research", "inform", "act", "review", "monitor"}
VALID_PRIORITIES = {"urgent", "high", "medium", "low"}
VALID_STATUSES = {"open", "in_progress", "blocked", "done", "dismissed"}


@router.get("", response_model=list[ActionItemResponse])
async def list_actions(
    brand_id: int,
    status: str | None = None,
    action_type: str | None = None,
    priority: str | None = None,
    assigned_to: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await check_brand_access(brand_id, current_user, db)

    stmt = select(ActionItem).where(ActionItem.brand_id == brand_id).order_by(ActionItem.created_at.desc())
    if status:
        stmt = stmt.where(ActionItem.status == status)
    if action_type:
        stmt = stmt.where(ActionItem.action_type == action_type)
    if priority:
        stmt = stmt.where(ActionItem.priority == priority)
    if assigned_to:
        stmt = stmt.where(ActionItem.assigned_to == assigned_to)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("", response_model=ActionItemResponse, status_code=201)
async def create_action(
    data: ActionItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    await check_brand_access(data.brand_id, current_user, db)

    if data.action_type not in VALID_ACTION_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid action_type. Must be one of: {', '.join(VALID_ACTION_TYPES)}",
        )
    if data.priority not in VALID_PRIORITIES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid priority. Must be one of: {', '.join(VALID_PRIORITIES)}",
        )

    action = ActionItem(
        title=data.title,
        description=data.description,
        action_type=data.action_type,
        priority=data.priority,
        assigned_to=data.assigned_to,
        due_date=data.due_date,
        finding_id=data.finding_id,
        source_url=data.source_url,
        brand_id=data.brand_id,
    )
    db.add(action)
    await db.commit()
    await db.refresh(action)
    return action


@router.patch("/{action_id}", response_model=ActionItemResponse)
async def update_action(
    action_id: int,
    update: ActionItemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    action = await db.get(ActionItem, action_id)
    if not action:
        raise HTTPException(status_code=404, detail="Action item not found")

    # Check brand access for the action's brand
    await check_brand_access(action.brand_id, current_user, db)

    if update.status is not None:
        if update.status not in VALID_STATUSES:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}",
            )
        action.status = update.status
    if update.notes is not None:
        action.notes = update.notes
    if update.assigned_to is not None:
        action.assigned_to = update.assigned_to
    if update.due_date is not None:
        action.due_date = update.due_date
    if update.priority is not None:
        action.priority = update.priority
    if update.title is not None:
        action.title = update.title
    if update.description is not None:
        action.description = update.description
    if update.action_type is not None:
        action.action_type = update.action_type

    action.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(action)
    return action
