"""Phase 1: Per-category web search research producing structured JSON findings."""

import asyncio
import json
import re
from typing import Callable

import anthropic

from agent.categories import CATEGORIES
from agent.prompts import build_research_system_prompt, build_research_prompt

MODEL = "claude-sonnet-4-20250514"

# Rate-limit retry settings
MAX_RETRIES = 5
INITIAL_BACKOFF = 30  # seconds — generous for 30k tokens/min limits


async def _api_call_with_retry(client, **kwargs):
    """Wrap API calls with exponential back-off for rate limits."""
    for attempt in range(MAX_RETRIES):
        try:
            return await client.messages.create(**kwargs)
        except anthropic.RateLimitError as e:
            if attempt == MAX_RETRIES - 1:
                raise
            wait = INITIAL_BACKOFF * (2 ** attempt)
            print(f"  Rate limited, waiting {wait}s before retry {attempt + 2}/{MAX_RETRIES}...")
            await asyncio.sleep(wait)
        except anthropic.APIStatusError as e:
            if "rate_limit" in str(e).lower() and attempt < MAX_RETRIES - 1:
                wait = INITIAL_BACKOFF * (2 ** attempt)
                print(f"  Rate limited (status), waiting {wait}s before retry {attempt + 2}/{MAX_RETRIES}...")
                await asyncio.sleep(wait)
            else:
                raise


async def research_category(
    client: anthropic.AsyncAnthropic,
    category: dict,
    research_system_prompt: str,
    brand_name: str,
    on_search: Callable | None = None,
) -> tuple[list[dict], int]:
    """Research a single category via Claude with web search.

    Returns (findings_list, search_count).
    """
    prompt = build_research_prompt(category, brand_name)
    messages = [{"role": "user", "content": prompt}]

    response = await _api_call_with_retry(
        client,
        model=MODEL,
        max_tokens=4000,
        system=research_system_prompt,
        tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}],
        messages=messages,
    )

    search_count = 0
    while response.stop_reason == "tool_use":
        assistant_content = response.content
        messages.append({"role": "assistant", "content": assistant_content})

        tool_results = []
        for block in assistant_content:
            if block.type == "tool_use":
                search_count += 1
                query = block.input.get("query", "")
                if on_search:
                    on_search(category["id"], query, search_count)
                tool_results.append(
                    {
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": "Search executed by API",
                    }
                )

        messages.append({"role": "user", "content": tool_results})
        response = await _api_call_with_retry(
            client,
            model=MODEL,
            max_tokens=4000,
            system=research_system_prompt,
            tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 5}],
            messages=messages,
        )

    # Extract text from final response
    text = ""
    for block in response.content:
        if hasattr(block, "text"):
            text += block.text

    findings = _parse_findings_json(text)

    # Stamp each finding with the category
    for f in findings:
        f["category"] = category["id"]
        if not f.get("carrier"):
            f["carrier"] = category.get("carrier")

    return findings, search_count


def _parse_findings_json(text: str) -> list[dict]:
    """Parse findings JSON with multiple fallback strategies."""
    # Strategy 1: Direct JSON parse
    try:
        data = json.loads(text)
        return data.get("findings", [])
    except json.JSONDecodeError:
        pass

    # Strategy 2: Strip markdown code fences
    cleaned = re.sub(r"^```(?:json)?\s*\n?", "", text.strip())
    cleaned = re.sub(r"\n?```\s*$", "", cleaned)
    try:
        data = json.loads(cleaned)
        return data.get("findings", [])
    except json.JSONDecodeError:
        pass

    # Strategy 3: Extract first JSON object
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            data = json.loads(match.group())
            return data.get("findings", [])
        except json.JSONDecodeError:
            pass

    # All strategies failed
    return []


async def research_all_categories(
    client: anthropic.AsyncAnthropic,
    research_system_prompt: str,
    brand_name: str,
    on_search: Callable | None = None,
    on_category_done: Callable | None = None,
    category_ids: list[str] | None = None,
    custom_categories: list[dict] | None = None,
) -> tuple[list[dict], int]:
    """Run research across categories sequentially.

    Adds a pause between categories to respect rate limits.
    Args:
        research_system_prompt: Brand-specific system prompt.
        brand_name: Brand name for prompt interpolation.
        category_ids: Optional list of category IDs to run. None means all.
        custom_categories: Per-brand category definitions. Falls back to global CATEGORIES.
    Returns (all_findings, total_search_count).
    """
    # Use per-brand categories if available, otherwise global defaults
    base_categories = custom_categories if custom_categories else CATEGORIES

    # Filter categories if specific ones were requested
    if category_ids:
        selected = [c for c in base_categories if c["id"] in category_ids]
    else:
        selected = base_categories

    all_findings = []
    total_searches = 0

    for i, category in enumerate(selected):
        print(f"Researching category {i+1}/{len(selected)}: {category['name']}...")
        findings, searches = await research_category(
            client, category, research_system_prompt, brand_name, on_search=on_search
        )
        all_findings.extend(findings)
        total_searches += searches
        if on_category_done:
            on_category_done(category["id"], len(findings), searches)

        # Pause between categories to avoid rate limits (30k tokens/min)
        if i < len(selected) - 1:
            print(f"  Found {len(findings)} findings. Pausing 15s before next category...")
            await asyncio.sleep(15)

    return all_findings, total_searches
