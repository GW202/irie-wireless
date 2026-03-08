"""Orchestrator: runs the full research → analyze → store pipeline."""

import asyncio
import json
from datetime import datetime

import anthropic

from config import settings
from database import async_session
from models import Brand, Finding, Brief, ActionItem, RunLog
from agent.researcher import research_all_categories
from agent.analyzer import analyze_findings
from agent.prompts import build_research_system_prompt, build_analysis_system_prompt

# Guard against concurrent runs
_current_task: asyncio.Task | None = None


def _get_monday_of_week() -> datetime:
    """Get the Monday of the current week."""
    today = datetime.utcnow()
    monday = today.date() - __import__("datetime").timedelta(days=today.weekday())
    return monday


async def run_full_pipeline(
    run_id: int, brand_id: int, category_ids: list[str] | None = None
):
    """Full agent pipeline: research → analyze → store → email.

    Called via asyncio.create_task() from the API endpoint.
    Args:
        run_id: The RunLog ID to update with progress/results.
        brand_id: The Brand ID to scope research and output.
        category_ids: Optional list of category IDs to run. None means all.
    """
    async with async_session() as db:
        run_log = await db.get(RunLog, run_id)
        if not run_log:
            return

        # Load brand profile
        brand = await db.get(Brand, brand_id)
        if not brand:
            run_log.status = "failed"
            run_log.error_message = f"Brand {brand_id} not found"
            run_log.completed_at = datetime.utcnow()
            await db.commit()
            return

        # Build dynamic prompts from brand context
        research_sys_prompt = build_research_system_prompt(
            brand.company_context, brand.name
        )
        analysis_sys_prompt = build_analysis_system_prompt(
            brand.company_context, brand.name, brand.analysis_instructions
        )

        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

        # Load per-brand categories if available
        custom_categories = None
        if brand.categories:
            try:
                custom_categories = json.loads(brand.categories)
            except json.JSONDecodeError:
                print(f"  Warning: Failed to parse brand categories JSON for {brand.name}")

        try:
            # Phase 1: Research all categories
            search_total = 0

            def on_search(cat_id, query, count):
                nonlocal search_total
                search_total += 1

            def on_category_done(cat_id, finding_count, searches):
                pass

            all_findings_raw, total_searches = await research_all_categories(
                client,
                research_system_prompt=research_sys_prompt,
                brand_name=brand.name,
                on_search=on_search,
                on_category_done=on_category_done,
                category_ids=category_ids,
                custom_categories=custom_categories,
            )

            # Update search count
            run_log.search_count = total_searches
            await db.commit()

            # Store findings in DB
            today_str = datetime.utcnow().strftime("%Y-%m-%d")
            db_findings = []
            for f in all_findings_raw:
                # Use published_date from agent, fall back to today
                pub_date = f.get("published_date") or today_str
                finding = Finding(
                    run_id=run_id,
                    brand_id=brand_id,
                    category=f.get("category", "unknown"),
                    carrier=f.get("carrier"),
                    title=f.get("title", "Untitled"),
                    summary=f.get("summary", ""),
                    source_url=f.get("source_url"),
                    source_name=f.get("source_name"),
                    published_date=pub_date,
                    relevance=f.get("relevance", "medium"),
                    is_sales_lead=bool(f.get("is_sales_lead", False)),
                    raw_data=json.dumps(f),
                )
                db.add(finding)
                db_findings.append(finding)
            await db.flush()

            # Phase 2: Analyze findings and generate brief
            result = await analyze_findings(
                client,
                all_findings_raw,
                analysis_system_prompt=analysis_sys_prompt,
                brand_name=brand.name,
            )

            # Store brief
            brief = Brief(
                run_id=run_id,
                brand_id=brand_id,
                week_of=_get_monday_of_week(),
                brief_markdown=result["brief_markdown"],
                top_priorities=json.dumps(result["top_priorities"]),
                recommendations=json.dumps(result["recommendations"]),
                finding_count=len(db_findings),
                action_count=len(result["actions"]),
            )
            db.add(brief)

            # Create action item records from extracted actions
            for action_data in result.get("actions", []):
                # Try to match to a finding by title
                matching_finding = _find_matching_finding(
                    db_findings, action_data.get("title", "")
                )
                action = ActionItem(
                    finding_id=matching_finding.id if matching_finding else None,
                    brand_id=brand_id,
                    title=action_data.get("title", "Untitled Action"),
                    description=action_data.get("description", ""),
                    action_type=action_data.get("action_type", "research"),
                    priority=action_data.get("priority", "medium"),
                    source_url=action_data.get("source_url"),
                )
                db.add(action)

            # Mark run as completed
            run_log.status = "completed"
            run_log.completed_at = datetime.utcnow()
            run_log.finding_count = len(db_findings)
            await db.commit()

            # Send email if configured
            if settings.email_to and settings.smtp_password:
                try:
                    from services.email_service import send_brief_email

                    await send_brief_email(result["brief_markdown"], brand.name)
                except Exception:
                    pass  # Don't fail the run for email issues

        except Exception as e:
            run_log.status = "failed"
            run_log.error_message = str(e)[:500]
            run_log.completed_at = datetime.utcnow()
            await db.commit()


def _find_matching_finding(findings: list[Finding], action_title: str) -> Finding | None:
    """Try to match an action's title keywords to a finding."""
    if not action_title:
        return None
    title_lower = action_title.lower()
    # Check if any significant words from the action title appear in finding text
    words = [w for w in title_lower.split() if len(w) > 3]
    for f in findings:
        text = f"{(f.title or '')} {(f.summary or '')}".lower()
        if any(w in text for w in words):
            return f
    return None
