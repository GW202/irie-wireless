"""Phase 2: Synthesize collected findings into a weekly brief + structured data."""

import json
import re

import anthropic

from agent.prompts import build_analysis_prompt

MODEL = "claude-sonnet-4-20250514"


async def analyze_findings(
    client: anthropic.AsyncAnthropic,
    findings: list[dict],
    analysis_system_prompt: str,
    brand_name: str,
) -> dict:
    """Take structured findings, produce the weekly brief + structured data.

    Returns:
        {
            "brief_markdown": str,
            "top_priorities": list,
            "recommendations": list,
            "actions": list,
        }
    """
    category_ids = set(f.get("category", "") for f in findings)
    prompt = build_analysis_prompt(findings, len(findings), len(category_ids), brand_name)

    response = await client.messages.create(
        model=MODEL,
        max_tokens=8000,
        system=analysis_system_prompt,
        messages=[{"role": "user", "content": prompt}],
    )

    text = ""
    for block in response.content:
        if hasattr(block, "text"):
            text += block.text

    return _parse_analysis_response(text)


def _parse_analysis_response(text: str) -> dict:
    """Split the analysis response into brief markdown and structured JSON."""
    default_structured = {"top_priorities": [], "recommendations": [], "actions": []}

    # Strategy 1: Split on ---JSON--- separator
    if "---JSON---" in text:
        parts = text.split("---JSON---", 1)
        brief_markdown = parts[0].strip()
        json_part = parts[1].strip()

        # Clean up potential markdown fences around JSON
        json_part = re.sub(r"^```(?:json)?\s*\n?", "", json_part)
        json_part = re.sub(r"\n?```\s*$", "", json_part)

        try:
            structured = json.loads(json_part)
            return {
                "brief_markdown": brief_markdown,
                "top_priorities": structured.get("top_priorities", []),
                "recommendations": structured.get("recommendations", []),
                "actions": structured.get("actions", []),
            }
        except json.JSONDecodeError:
            pass

    # Strategy 2: Try to find JSON at end of text
    match = re.search(r'\{"top_priorities".*\}', text, re.DOTALL)
    if match:
        try:
            structured = json.loads(match.group())
            brief_end = match.start()
            brief_markdown = text[:brief_end].strip()
            return {
                "brief_markdown": brief_markdown,
                "top_priorities": structured.get("top_priorities", []),
                "recommendations": structured.get("recommendations", []),
                "actions": structured.get("actions", []),
            }
        except json.JSONDecodeError:
            pass

    # Strategy 3: Return full text as brief with empty structured data
    return {"brief_markdown": text.strip(), **default_structured}
