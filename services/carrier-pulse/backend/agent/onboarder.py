"""AI-powered brand onboarding agent — researches a company and generates a full brand profile."""

import json
import re

import anthropic

from config import settings
from agent.researcher import _api_call_with_retry

MODEL = "claude-sonnet-4-20250514"

ONBOARD_SYSTEM_PROMPT = """You are a Senior Telecom Market Intelligence Architect. Your mission is to build a "Digital Twin" profile of a target company to power an autonomous news monitoring agent.

Your objective is to transform raw corporate data into a structured intelligence matrix. This matrix must enable a downstream AI to distinguish between "noise" and "market-shifting signals" specific to this company's business model.

You have access to web search. Research exhaustively before generating the profile. Be professional, analytical, and hyper-specific. Avoid generic industry fluff."""


def _build_onboard_prompt(company_name: str, hints: str | None = None) -> str:
    """Build the prompt for the onboarding agent."""
    hint_section = ""
    if hints:
        hint_section = f"\n\nADDITIONAL CONTEXT FROM USER:\n{hints}\n"

    return f"""Research the company "{company_name}" and build a comprehensive Digital Twin intelligence profile.
{hint_section}
=== PHASE 1: DEEP RESEARCH EXECUTION ===

Perform an exhaustive search to define the company's "Value DNA":

1. CORE MECHANICS: What do they sell, and how exactly do they make money (e.g., CAPEX-heavy infrastructure vs. OPEX-light SaaS/TaaS)?
2. STRATEGIC MOATS: What are their unique capabilities? Analyze their tech stack (5G-Advanced, AI-RAN, Cloud-native cores) and IP.
3. ECOSYSTEM MAPPING: Identify primary competitors (direct), secondary disruptors (MVNOs/Hyper-scalers), and critical partners.
4. VULNERABILITY & VELOCITY: Identify current strategic hurdles (regulatory debt, churn, spectrum scarcity) and high-priority initiatives for 2025-2026.

=== PHASE 2: INTELLIGENCE MATRIX GENERATION ===

After thorough research, generate a JSON response with this exact structure:

{{
  "slug": "company-name-slug",
  "name": "{company_name}",
  "company_context": "The Company Lens — a high-density document (800-2000 words) structured with === HEADERS === covering: STRATEGIC POSITION (market standing, differentiation), BUSINESS MODEL ANALYSIS (revenue streams, cost drivers, unit economics), ECOSYSTEM MAP (competitors, partners, disruptors), VULNERABILITY PROFILE (strategic hurdles, regulatory exposure), and VELOCITY VECTORS (high-priority 2025-2026 initiatives).",
  "analysis_instructions": "Specific logic for the downstream AI analyst. Must include: (1) SIGNAL INTERPRETATION RULES — e.g., 'If {company_name} announces a partnership in [Sector], interpret as defensive move against [Competitor].' (2) SIGNAL VS NOISE FILTER — define what constitutes a High-Priority Signal (CEO quotes, regulatory filings, M&A, spectrum moves) vs Low-Value Noise (routine marketing, minor sponsorships). (3) COMPETITIVE CONTEXT — which competitor moves to flag and why. (4) TERMINOLOGY GUIDE — industry-specific terms the agent must understand.",
  "suggested_categories": [
    {{
      "id": "snake_case_category_id",
      "name": "Category Display Name",
      "carrier": null,
      "queries": ["search query 1", "search query 2", "search query 3", "search query 4", "search query 5"],
      "focus": "WHY THIS MATTERS: 2-3 sentences linking this category to a specific strategic priority or vulnerability of the company."
    }}
  ],
  "email_subject_prefix": "{company_name}"
}}

=== REQUIREMENTS ===

1. CATEGORIES (5-8 tailored intelligence categories):
   - Use specific snake_case IDs (e.g., "spectrum_portfolio_optimization", "enterprise_edge_expansion")
   - Each must include a "WHY THIS MATTERS" strategic link in the focus field
   - Category names should be specific to this company, not generic industry labels

2. SEARCH QUERIES (5-7 per category):
   - MUST include the company name and temporal markers (2025, 2026)
   - Use Boolean-style logic for precision (e.g., "{company_name}" AND ("6G" OR "Terahertz") AND 2026)
   - Mix query types: competitive, regulatory, financial, technical, partnership

3. COMPANY CONTEXT:
   - Must be hyper-specific, not generic industry overview
   - Include specific numbers where available (revenue, subscribers, market share)
   - Name specific competitors, partners, and executives

4. ANALYSIS INSTRUCTIONS:
   - Must include concrete "If X, then interpret as Y" rules
   - Define the Signal vs Noise filter explicitly
   - Reference specific competitors and strategic dynamics

Return ONLY valid JSON. No markdown, no preamble, no explanation."""


async def onboard_brand(company_name: str, hints: str | None = None) -> dict:
    """Run the onboarding agent to research a company and generate a brand profile.

    Returns the generated profile dict with keys:
        slug, name, company_context, analysis_instructions, suggested_categories, email_subject_prefix
    """
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    prompt = _build_onboard_prompt(company_name, hints)
    messages = [{"role": "user", "content": prompt}]

    # Initial call with web search — 16k tokens for rich profiles
    response = await _api_call_with_retry(
        client,
        model=MODEL,
        max_tokens=16000,
        system=ONBOARD_SYSTEM_PROMPT,
        tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 10}],
        messages=messages,
    )

    # Agentic loop — let Claude search until done
    while response.stop_reason == "tool_use":
        assistant_content = response.content
        messages.append({"role": "assistant", "content": assistant_content})

        tool_results = []
        for block in assistant_content:
            if block.type == "tool_use":
                query = block.input.get("query", "")
                print(f"  [onboarder] Searching: {query}")
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
            max_tokens=16000,
            system=ONBOARD_SYSTEM_PROMPT,
            tools=[{"type": "web_search_20250305", "name": "web_search", "max_uses": 10}],
            messages=messages,
        )

    # Check if response was truncated
    if response.stop_reason == "max_tokens":
        print("  [onboarder] WARNING: Response was truncated at max_tokens!")

    # Extract text from final response
    text = ""
    for block in response.content:
        if hasattr(block, "text"):
            text += block.text

    print(f"  [onboarder] Raw response length: {len(text)} chars, stop_reason: {response.stop_reason}")

    # Parse JSON with fallback strategies
    profile = _parse_profile_json(text)

    # Validate required fields
    if not profile.get("company_context"):
        raise ValueError("Onboarding agent failed to generate company_context")
    if not profile.get("suggested_categories"):
        raise ValueError("Onboarding agent failed to generate categories")

    return profile


def _parse_profile_json(text: str) -> dict:
    """Parse the profile JSON from agent output with fallback strategies."""
    # Strategy 1: Direct parse
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Strategy 2: Strip markdown code fences
    cleaned = re.sub(r"^```(?:json)?\s*\n?", "", text.strip())
    cleaned = re.sub(r"\n?```\s*$", "", cleaned)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass

    # Strategy 3: Find the outermost JSON object using brace matching
    start = text.find("{")
    if start != -1:
        depth = 0
        end = start
        in_string = False
        escape_next = False
        for i in range(start, len(text)):
            ch = text[i]
            if escape_next:
                escape_next = False
                continue
            if ch == "\\":
                escape_next = True
                continue
            if ch == '"' and not escape_next:
                in_string = not in_string
                continue
            if in_string:
                continue
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break

        candidate = text[start:end]
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            pass

        # Strategy 4: Truncated JSON — try to repair by closing open structures
        if depth > 0:
            print(f"  [onboarder] Attempting truncated JSON repair (depth={depth})")
            # Close any open strings, arrays, objects
            repair = candidate
            # Count open quotes
            quote_count = repair.count('"') - repair.count('\\"')
            if quote_count % 2 != 0:
                repair += '"'
            # Close brackets/braces
            for _ in range(depth):
                # Check last meaningful character
                stripped = repair.rstrip()
                if stripped.endswith(","):
                    repair = stripped[:-1]
                repair += "]}" if ("[" in repair[repair.rfind("{"):]) else "}"
            try:
                return json.loads(repair)
            except json.JSONDecodeError:
                pass

    # Strategy 5: Regex fallback (greedy match)
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    # Log first 500 chars for debugging
    print(f"  [onboarder] JSON parse FAILED. First 500 chars: {text[:500]}")
    raise ValueError("Failed to parse onboarding agent response as JSON")


# ---------------------------------------------------------------------------
# AI Category Assistant — lightweight, single-call category completion
# ---------------------------------------------------------------------------

ASSIST_CATEGORY_SYSTEM_PROMPT = """You are a Telecom Intelligence Category Architect. Given a company context and a user's partial category input, generate a complete, optimized intelligence monitoring category.

You must return ONLY valid JSON with no markdown, no preamble, no explanation."""


def _build_assist_prompt(brand_name: str, company_context: str, partial_name: str, partial_focus: str) -> str:
    """Build the prompt for the category assistant."""
    return f"""Given the following brand context, complete and optimize the intelligence category that the user has started drafting.

BRAND: {brand_name}

COMPANY CONTEXT:
{company_context[:3000]}

USER'S PARTIAL INPUT:
- Category name (draft): "{partial_name}"
- Focus/description (draft): "{partial_focus}"

Generate a complete, optimized intelligence monitoring category. Return JSON with this exact structure:

{{
  "id": "snake_case_id_derived_from_name",
  "name": "Polished Category Display Name",
  "queries": [
    "query 1 — include \\"{brand_name}\\" AND temporal markers (2025, 2026) AND Boolean logic",
    "query 2",
    "query 3",
    "query 4",
    "query 5"
  ],
  "focus": "WHY THIS MATTERS: 2-3 sentences linking this category to a specific strategic priority or vulnerability of {brand_name}.",
  "carrier": null
}}

REQUIREMENTS:
1. The category ID must be snake_case, specific, and descriptive (e.g., "spectrum_portfolio_moves" not "general_tech")
2. The name should be polished and specific to this company, building on the user's draft
3. Generate exactly 5-7 search queries that:
   - Include "{brand_name}" in most queries
   - Use temporal markers (2025, 2026)
   - Use Boolean-style logic (AND, OR, quotes) for precision
   - Mix query types: competitive, regulatory, financial, technical, partnership
4. The focus must explain WHY this category matters strategically for {brand_name}
5. Build upon and refine the user's partial input — do not ignore what they typed

Return ONLY valid JSON."""


async def assist_category(
    brand_name: str,
    company_context: str,
    partial_name: str,
    partial_focus: str,
) -> dict:
    """Generate an optimized category from partial user input + brand context.

    Lightweight, fast (no web search). Returns a single category dict.
    """
    client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
    prompt = _build_assist_prompt(brand_name, company_context, partial_name, partial_focus)

    response = await _api_call_with_retry(
        client,
        model=MODEL,
        max_tokens=2000,
        system=ASSIST_CATEGORY_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )

    text = ""
    for block in response.content:
        if hasattr(block, "text"):
            text += block.text

    print(f"  [assist-category] Response length: {len(text)} chars")

    return _parse_profile_json(text)
