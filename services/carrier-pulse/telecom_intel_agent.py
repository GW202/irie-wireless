#!/usr/bin/env python3
"""
USA Mobile — Weekly Telecom Intelligence Agent (v2)
====================================================
CPO Market Intelligence Brief | Runs Every Friday

Configured with full USA Mobile company context for targeted intelligence.

USA Mobile is a hybrid MVNE + Licensed Wholesale Carrier Operator that enables
brands to launch their own wireless services via T-Mobile wholesale access,
Telgoo BSS integration, and turnkey compliance/onboarding.

Setup:
    pip install anthropic

Environment Variables:
    ANTHROPIC_API_KEY  — Your Anthropic API key
    EMAIL_TO           — Recipient email (optional, for email delivery)
    EMAIL_FROM         — Sender email (optional)
    SMTP_SERVER        — SMTP server (optional, defaults to smtp.gmail.com)
    SMTP_PORT          — SMTP port (optional, defaults to 587)
    SMTP_PASSWORD      — SMTP app password (optional)

Usage:
    python3 telecom_intel_agent.py              # Run and print to console
    python3 telecom_intel_agent.py --email      # Run and send via email
    python3 telecom_intel_agent.py --save       # Run and save to file
    python3 telecom_intel_agent.py --all        # All delivery methods
"""

import anthropic
import json
import os
import sys
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta


# ─────────────────────────────────────────────────────────────
# CONFIGURATION
# ─────────────────────────────────────────────────────────────

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "your-api-key-here")
MODEL = "claude-sonnet-4-20250514"

# ─────────────────────────────────────────────────────────────
# USA MOBILE COMPANY CONTEXT
# ─────────────────────────────────────────────────────────────

COMPANY_CONTEXT = """
=== USA MOBILE — COMPANY PROFILE ===

WHAT USA MOBILE IS:
USA Mobile is a hybrid MVNE + Licensed Wholesale Carrier Operator. They are NOT a 
retail carrier. They are a telecom enablement backend that allows brands to launch 
their own white-label wireless services on major U.S. networks.

BUSINESS MODEL:
- Backend carrier access + enablement partner
- White-label telecom brand launches
- Turnkey MVNO-in-a-Box packages with tiered pricing
- Revenue from setup fees, recurring subscriber margin, SIM activation, and future 
  device revenue share

CARRIER RELATIONSHIPS:
- Primary carrier: T-Mobile (wholesale access)
- AT&T expansion optional (Q2+)
- Operates under Blue Connect licensed carrier framework
- No Verizon access currently
- No core network ownership — wholesale model

TECHNOLOGY STACK:
- BSS/OSS: Telco / Telgoo integration (billing, provisioning, lifecycle management)
- BYOD eSIM support with digital provisioning
- SIM & eSIM activation + physical SIM fulfillment
- No public API marketplace or SDK currently

PRODUCT CAPABILITIES:
- Tiered MVNO-in-a-Box launch packages (e.g., $25K Velocity Launch)
- Co-branded support model
- Multiple 5G plan options (unlimited talk & text, data tiers: 5GB/20GB/40GB)
- Compliance handling (legal, pricing, contracts, regulatory)
- Pre-structured carrier onboarding

CURRENT PRODUCT PHASES:
- Phase 1: BYOD eSIM launches, Aura-based parental controls, youth safety positioning
- Phase 2: Custom Android device, proprietary OS layer, revenue share on device sales

TARGET MARKET:
- Brands wanting their own wireless service (NOT consumers directly)
- Family safety market
- Youth-focused brands
- Licensed brand launches (e.g., Hasbro Safe Play example)
- IP-licensed wireless opportunities
- NOT generic MVNE — brand-aligned, possibly IP-licensed wireless

KEY PEOPLE:
- Greg (CPO): Telecom technology, compliance architecture, product strategy, backend innovation
- Kayla: Legal, compliance, pricing, decks, contracts, customer issues

COMPETITIVE ADVANTAGES:
- Faster launch capability via tiered packages
- Compliance handled internally
- Pre-structured carrier onboarding
- Revenue share model flexibility
- Potential dual-carrier roadmap (T-Mobile + AT&T)

KNOWN LIMITATIONS:
- No multi-network switching currently
- No public API-first positioning (unlike competitors like Gigs)
- No global footprint
- No network slicing capability
- Dependent on T-Mobile primary relationship

STRATEGIC GOAL:
- Scale to 250K subscribers across multiple brand launches
- Growth depends on: T-Mobile wholesale economics, Telgoo scalability, compliance 
  automation, brand acquisition velocity, SIM logistics throughput, support capacity
- NOT dependent on retail DTC marketing

COMPETITIVE LANDSCAPE:
USA Mobile is NOT positioned like:
- Gigs (API-first MVNE)
- A global infrastructure operator
- A Tier-1 BSS vendor
- A retail mass-market MVNO brand
They are a structured backend operator enabling white-label brand launches.
"""

# ─────────────────────────────────────────────────────────────
# INTELLIGENCE CATEGORIES — Tuned to USA Mobile's actual model
# ─────────────────────────────────────────────────────────────

RESEARCH_CATEGORIES = [
    {
        "category": "T-Mobile Wholesale & MVNO Ecosystem",
        "queries": [
            "T-Mobile MVNO wholesale partner program 2025 2026",
            "T-Mobile wholesale rates MVNO changes",
            "T-Mobile new MVNO brand launches",
            "T-Mobile 5G wholesale access network prioritization MVNO",
        ],
        "focus": "T-Mobile is USA Mobile's primary carrier. Track ANY changes to their "
                 "wholesale program, pricing, data prioritization policies, new MVNO partners "
                 "they're signing, or shifts in how they treat wholesale brands. This directly "
                 "impacts USA Mobile's cost structure and competitive positioning."
    },
    {
        "category": "AT&T Wholesale & Expansion Opportunity",
        "queries": [
            "AT&T MVNO wholesale partner program 2025 2026",
            "AT&T FirstNet MVNO reseller opportunities",
            "AT&T wholesale wireless new partners",
            "AT&T 5G network expansion coverage",
        ],
        "focus": "USA Mobile has AT&T as an optional expansion carrier for Q2+. Track AT&T's "
                 "wholesale program changes, new MVNO partnerships, pricing moves, and network "
                 "quality developments that would inform the timing and value of adding AT&T."
    },
    {
        "category": "Brand Wireless & White-Label Launches",
        "queries": [
            "brand wireless service launch MVNO 2025 2026",
            "white label wireless service brand partnership telecom",
            "celebrity brand MVNO wireless launch",
            "licensed brand wireless service kids family",
            "enterprise branded wireless service launch",
        ],
        "focus": "This is USA Mobile's direct addressable market. Track any brand (consumer, "
                 "enterprise, celebrity, IP-licensed) launching or announcing their own wireless "
                 "service. Each one is either a potential USA Mobile customer or a competitive "
                 "signal. Pay special attention to family/youth brands and IP-licensed plays "
                 "similar to the Hasbro Safe Play model."
    },
    {
        "category": "Competing MVNE/Enablement Platforms",
        "queries": [
            "MVNE platform telecom enablement 2025 2026",
            "Gigs telecom MVNE API platform",
            "MVNO-in-a-box platform launch",
            "telecom enablement platform brand wireless",
            "Reach Mobile Plintron MVNE news",
        ],
        "focus": "Track competing MVNE and enablement platforms — Gigs, Plintron, Reach, "
                 "and any new entrants. What are they offering? New API capabilities? New brand "
                 "partnerships? Pricing changes? This helps USA Mobile understand competitive "
                 "positioning and potential differentiation opportunities."
    },
    {
        "category": "eSIM, BSS & Telecom Technology",
        "queries": [
            "eSIM adoption US market trends 2025 2026",
            "Telgoo BSS telecom platform updates",
            "telecom BSS billing platform MVNO",
            "eSIM BYOD activation telecom trends",
            "parental controls wireless kids safety telecom",
        ],
        "focus": "Track eSIM adoption trends (critical for USA Mobile's BYOD model), BSS/OSS "
                 "platform developments (especially Telgoo and competitors), and parental control "
                 "/ kids safety technology in wireless — all directly tied to USA Mobile's "
                 "product roadmap and Phase 1/Phase 2 strategy."
    },
    {
        "category": "Carrier 5G Strategy & Network Moves",
        "queries": [
            "T-Mobile 5G network expansion 2025 2026",
            "AT&T Verizon 5G coverage deployment latest",
            "carrier 5G standalone core network upgrades",
            "T-Mobile AT&T spectrum deployment mid-band",
        ],
        "focus": "Network quality directly impacts the brand experience USA Mobile enables. "
                 "Track T-Mobile and AT&T 5G expansion, coverage improvements, and spectrum "
                 "deployments. Also monitor Verizon as a potential future carrier option."
    },
    {
        "category": "Regulatory & Compliance",
        "queries": [
            "FCC wireless regulation MVNO 2025 2026",
            "FCC kids online safety wireless",
            "telecom compliance regulation changes",
            "COPPA wireless kids privacy regulation",
            "FCC spectrum auction wholesale access",
        ],
        "focus": "USA Mobile handles compliance internally — track FCC regulatory changes, "
                 "especially around kids/family safety (directly relevant to Phase 1 parental "
                 "controls), MVNO wholesale access rules, spectrum policy, and any compliance "
                 "requirements that affect brand wireless launches."
    },
    {
        "category": "Market Sizing & Industry Trends",
        "queries": [
            "MVNO market growth US 2025 2026",
            "branded wireless service market opportunity",
            "telecom brand partnership trends",
            "MVNO subscriber growth prepaid market",
        ],
        "focus": "Track overall MVNO market growth, subscriber trends, and the broader shift "
                 "toward branded/white-label wireless. This informs USA Mobile's TAM narrative "
                 "and helps validate the 250K subscriber scaling goal."
    },
]

# ─────────────────────────────────────────────────────────────
# SYSTEM PROMPT — Tuned for USA Mobile's actual business model
# ─────────────────────────────────────────────────────────────

SYSTEM_PROMPT = f"""You are a senior telecom market intelligence analyst reporting directly 
to Greg, the Chief Product Officer of USA Mobile.

{COMPANY_CONTEXT}

YOUR MISSION:
Produce a weekly intelligence brief that helps the CPO make product, partnership, and 
strategic decisions for USA Mobile. Every insight must be analyzed through the lens of 
USA Mobile's specific business model as a hybrid MVNE + Licensed Wholesale Carrier Operator 
enabling brand wireless launches.

BRIEF STRUCTURE:

1. 🔑 TOP 3 THINGS THE CPO NEEDS TO KNOW THIS WEEK
   - The most important developments with a clear "So What for USA Mobile" for each
   - Connect each item to a specific aspect of the business (wholesale economics, brand 
     pipeline, platform capability, competitive threat, regulatory impact)

2. 📡 T-MOBILE WHOLESALE & NETWORK
   - T-Mobile moves that impact USA Mobile's wholesale costs, network quality, or 
     competitive position
   - Any signals about T-Mobile's MVNO/wholesale strategy

3. 📱 AT&T EXPANSION INTELLIGENCE
   - AT&T developments relevant to USA Mobile's Q2+ expansion decision
   - Is now the right time to add AT&T? What changed this week?

4. 🏢 BRAND WIRELESS OPPORTUNITIES
   - New brands launching or exploring wireless services
   - Potential USA Mobile customers or competitive signals
   - Special attention to family/youth/IP-licensed brands

5. ⚔️ COMPETITIVE MVNE LANDSCAPE
   - What Gigs, Plintron, Reach, and other enablement platforms are doing
   - Competitive threats or gaps USA Mobile can exploit

6. 🔧 TECHNOLOGY & PLATFORM
   - eSIM trends, BSS developments, parental control tech
   - Anything affecting USA Mobile's Phase 1 (BYOD eSIM + parental controls) or 
     Phase 2 (custom Android device)

7. 📜 REGULATORY & COMPLIANCE
   - FCC actions, kids safety regulations, MVNO policy changes
   - Compliance implications for USA Mobile and their brand customers

8. 📊 MARKET & INDUSTRY TRENDS
   - MVNO market growth signals
   - Data points relevant to the 250K subscriber scaling goal

9. 🎯 STRATEGIC RECOMMENDATIONS
   - 3-5 specific, actionable recommendations for the CPO
   - Each tied to a concrete development from this week's research
   - Frame as: "Based on [finding], USA Mobile should consider [action]"

ANALYSIS GUIDELINES:
- Always connect findings to USA Mobile's SPECIFIC situation — not generic telecom advice
- Flag anything that impacts the T-Mobile wholesale relationship as HIGH PRIORITY
- Flag any new brand wireless launches as POTENTIAL LEADS for sales pipeline
- Note competitive moves by Gigs specifically since they're the API-first competitor
- Consider scalability implications for the 250K subscriber goal
- Assess any findings against the Phase 1 / Phase 2 product roadmap
- When you find something uncertain, note it and suggest how to verify

Use web search extensively. Focus on the past 7 days but include significant developments 
from the past 2 weeks if highly relevant."""


# ─────────────────────────────────────────────────────────────
# AGENT CORE
# ─────────────────────────────────────────────────────────────

def build_research_prompt():
    """Build the research prompt with all categories and today's date context."""
    today = datetime.now()
    week_ago = today - timedelta(days=7)
    
    prompt = f"""Today is {today.strftime('%A, %B %d, %Y')}. 
Please produce the Weekly Telecom Intelligence Brief for USA Mobile.

Search extensively across the following intelligence categories. For each category, 
use the suggested search queries as starting points, but follow leads and dig deeper 
when you find significant developments. You have up to 30 web searches — use them.

"""
    for cat in RESEARCH_CATEGORIES:
        prompt += f"\n### {cat['category']}\n"
        prompt += f"Focus: {cat['focus']}\n"
        prompt += f"Suggested queries: {', '.join(cat['queries'])}\n"
    
    prompt += f"""

IMPORTANT INSTRUCTIONS:
- Focus on news from {week_ago.strftime('%B %d')} to {today.strftime('%B %d, %Y')}
- Search each category thoroughly — use multiple searches per category if needed
- If a category has no significant news this week, say so briefly and move on
- Prioritize developments that directly impact USA Mobile's specific business model
- When you find a brand launching wireless, assess if they could be a USA Mobile customer
- Include specific company names, dates, and figures when available
- End with 3-5 concrete strategic recommendations tied to this week's findings

Produce the full Weekly Telecom Intelligence Brief now."""
    
    return prompt


def run_agent():
    """Execute the intelligence agent and return the brief."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    
    print("🚀 USA Mobile Telecom Intelligence Agent v2")
    print("=" * 55)
    print(f"📅 Running for week of {datetime.now().strftime('%B %d, %Y')}")
    print(f"🔍 Researching {len(RESEARCH_CATEGORIES)} intelligence categories...")
    print(f"🏢 Company context: USA Mobile (MVNE + Wholesale Carrier Operator)")
    print()
    
    research_prompt = build_research_prompt()
    
    # Use Claude with web search tool for active research
    print("📡 Searching the web for telecom intelligence...\n")
    
    messages = [{"role": "user", "content": research_prompt}]
    
    response = client.messages.create(
        model=MODEL,
        max_tokens=12000,
        system=SYSTEM_PROMPT,
        tools=[
            {
                "type": "web_search_20250305",
                "name": "web_search",
                "max_uses": 30,
            }
        ],
        messages=messages,
    )
    
    # Agentic loop — keep going while Claude is using tools
    search_count = 0
    while response.stop_reason == "tool_use":
        assistant_content = response.content
        messages.append({"role": "assistant", "content": assistant_content})
        
        tool_results = []
        for block in assistant_content:
            if block.type == "tool_use":
                search_count += 1
                query = block.input.get("query", "N/A")
                print(f"  🔎 [{search_count}] Searching: {query}")
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": "Search executed by API"
                })
        
        messages.append({"role": "user", "content": tool_results})
        
        response = client.messages.create(
            model=MODEL,
            max_tokens=12000,
            system=SYSTEM_PROMPT,
            tools=[
                {
                    "type": "web_search_20250305",
                    "name": "web_search",
                    "max_uses": 30,
                }
            ],
            messages=messages,
        )
    
    print(f"\n✅ Research complete — {search_count} web searches performed")
    
    # Extract the final text response
    brief = ""
    for block in response.content:
        if hasattr(block, "text"):
            brief += block.text
    
    return brief


# ─────────────────────────────────────────────────────────────
# DELIVERY METHODS
# ─────────────────────────────────────────────────────────────

def save_to_file(brief):
    """Save the brief to a markdown file."""
    today = datetime.now().strftime("%Y-%m-%d")
    filename = f"usa_mobile_intel_brief_{today}.md"
    
    header = f"""# USA Mobile — Weekly Telecom Intelligence Brief
**Week of {datetime.now().strftime('%B %d, %Y')}**  
**Prepared for:** Greg, Chief Product Officer  
**Agent:** USA Mobile Telecom Intelligence System v2  
**Categories Researched:** {len(RESEARCH_CATEGORIES)}

---

"""
    with open(filename, "w") as f:
        f.write(header + brief)
    
    print(f"\n💾 Brief saved to: {filename}")
    return filename


def send_email(brief):
    """Send the brief via email."""
    email_to = os.environ.get("EMAIL_TO")
    email_from = os.environ.get("EMAIL_FROM")
    smtp_server = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_password = os.environ.get("SMTP_PASSWORD")
    
    if not all([email_to, email_from, smtp_password]):
        print("\n⚠️  Email not configured. Set EMAIL_TO, EMAIL_FROM, and SMTP_PASSWORD.")
        print("   Skipping email delivery.")
        return
    
    today = datetime.now().strftime("%B %d, %Y")
    
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"📡 USA Mobile Weekly Intel Brief — {today}"
    msg["From"] = email_from
    msg["To"] = email_to
    
    # Plain text version
    text_part = MIMEText(brief, "plain")
    msg.attach(text_part)
    
    # HTML version
    html_brief = brief.replace("\n\n", "</p><p>").replace("\n", "<br>")
    html_content = f"""
    <html>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
                 max-width: 800px; margin: 0 auto; padding: 20px; color: #1a1a1a;">
        <div style="border-bottom: 3px solid #0066cc; padding-bottom: 15px; margin-bottom: 25px;">
            <h1 style="margin: 0; color: #0066cc;">📡 USA Mobile</h1>
            <h2 style="margin: 5px 0 0 0; color: #444; font-weight: normal;">
                Weekly Telecom Intelligence Brief — {today}
            </h2>
            <p style="color: #888; margin: 5px 0 0 0;">
                Prepared for Greg, Chief Product Officer | {len(RESEARCH_CATEGORIES)} categories researched
            </p>
        </div>
        <p>{html_brief}</p>
        <div style="border-top: 1px solid #ddd; margin-top: 30px; padding-top: 15px; color: #888;">
            <small>Generated by USA Mobile Telecom Intelligence Agent v2</small>
        </div>
    </body>
    </html>
    """
    html_part = MIMEText(html_content, "html")
    msg.attach(html_part)
    
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(email_from, smtp_password)
            server.sendmail(email_from, email_to, msg.as_string())
        print(f"\n📧 Brief emailed to: {email_to}")
    except Exception as e:
        print(f"\n❌ Email failed: {e}")


# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────

def main():
    args = set(sys.argv[1:])
    
    # Run the agent
    try:
        brief = run_agent()
    except anthropic.AuthenticationError:
        print("❌ Invalid API key. Set ANTHROPIC_API_KEY environment variable.")
        print("   Get your key at: https://console.anthropic.com/settings/keys")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Agent error: {e}")
        sys.exit(1)
    
    # Always print to console
    print("\n" + "=" * 55)
    print("📋 USA MOBILE — WEEKLY TELECOM INTELLIGENCE BRIEF")
    print("=" * 55 + "\n")
    print(brief)
    
    # Optional delivery methods
    if "--save" in args or "--all" in args:
        save_to_file(brief)
    
    if "--email" in args or "--all" in args:
        send_email(brief)
    
    if not args:
        print("\n" + "-" * 55)
        print("💡 Tip: Use --save to save to file, --email to send via email, --all for both")


if __name__ == "__main__":
    main()
