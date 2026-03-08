"""APScheduler configuration for weekly agent runs."""

import asyncio
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from config import settings
from database import async_session
from models import Brand, RunLog

from sqlalchemy import select

scheduler = AsyncIOScheduler()


async def _scheduled_run():
    """Triggered by APScheduler on Friday mornings. Runs pipeline for each active brand."""
    from agent.pipeline import run_full_pipeline

    async with async_session() as db:
        result = await db.execute(
            select(Brand).where(Brand.is_active == True).order_by(Brand.id)
        )
        brands = result.scalars().all()

        for brand in brands:
            run_log = RunLog(
                started_at=datetime.utcnow(),
                trigger="scheduled",
                status="running",
                brand_id=brand.id,
            )
            db.add(run_log)
            await db.commit()
            await db.refresh(run_log)

            asyncio.create_task(run_full_pipeline(run_log.id, brand_id=brand.id))


def start_scheduler():
    """Start the weekly agent schedule."""
    scheduler.add_job(
        _scheduled_run,
        CronTrigger(
            day_of_week=settings.agent_schedule_day[:3],
            hour=settings.agent_schedule_hour,
            timezone=settings.agent_schedule_timezone,
        ),
        id="weekly_intel_run",
        replace_existing=True,
    )
    scheduler.start()
