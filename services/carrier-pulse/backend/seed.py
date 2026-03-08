"""Seed the database with realistic sample data for UI development."""

import asyncio
import json
from datetime import datetime, timedelta

from database import async_session, init_db
from models import Finding, Brief, Lead, RunLog


async def seed():
    await init_db()

    async with async_session() as db:
        # Check if data already exists
        from sqlalchemy import select, func

        count = (await db.execute(select(func.count()).select_from(RunLog))).scalar()
        if count > 0:
            print("Database already has data. Skipping seed.")
            return

        now = datetime.utcnow()
        week_ago = now - timedelta(days=7)
        two_weeks_ago = now - timedelta(days=14)

        # Run logs
        run1 = RunLog(
            started_at=two_weeks_ago,
            completed_at=two_weeks_ago + timedelta(minutes=8),
            status="completed",
            search_count=32,
            finding_count=18,
            trigger="scheduled",
        )
        run2 = RunLog(
            started_at=week_ago,
            completed_at=week_ago + timedelta(minutes=6),
            status="completed",
            search_count=28,
            finding_count=22,
            trigger="scheduled",
        )
        db.add_all([run1, run2])
        await db.flush()

        # Findings for run 1
        findings_run1 = [
            Finding(run_id=run1.id, category="t_mobile_wholesale", carrier="t_mobile",
                    title="T-Mobile Expands MVNO Partner Program", relevance="high",
                    summary="T-Mobile announced expanded wholesale access tiers for MVNO partners, including improved 5G data prioritization. This directly impacts USA Mobile's cost structure and network quality offering.",
                    source_name="Light Reading", source_url="https://www.lightreading.com/5g/t-mobile-wholesale-mvno-partner-program", is_sales_lead=False, created_at=two_weeks_ago),
            Finding(run_id=run1.id, category="brand_launches", carrier=None,
                    title="FitBrand Explores Wireless Service Launch", relevance="high",
                    summary="Fitness brand FitBrand is reportedly exploring launching a branded wireless service targeting health-conscious consumers. They are seeking MVNE partners for a Q3 launch.",
                    source_name="FierceWireless", source_url="https://www.fiercewireless.com/wireless/fitbrand-explores-wireless-service-launch", is_sales_lead=True, created_at=two_weeks_ago),
            Finding(run_id=run1.id, category="competing_mvne", carrier=None,
                    title="Gigs Raises $50M Series B for API Platform", relevance="high",
                    summary="MVNE competitor Gigs raised $50M to expand their API-first telecom enablement platform. They plan to add eSIM provisioning and multi-carrier support.",
                    source_name="TechCrunch", source_url="https://techcrunch.com/2026/01/gigs-series-b-50m-telecom-api", is_sales_lead=False, created_at=two_weeks_ago),
            Finding(run_id=run1.id, category="esim_technology", carrier=None,
                    title="eSIM Adoption Hits 35% in US Market", relevance="medium",
                    summary="New data shows eSIM adoption in the US reached 35%, driven by iPhone and Galaxy flagship devices. This validates USA Mobile's BYOD eSIM-first strategy.",
                    source_name="GSMA Intelligence", source_url="https://www.gsma.com/solutions-and-impact/technologies/esim/esim-adoption-us-market-2026", is_sales_lead=False, created_at=two_weeks_ago),
            Finding(run_id=run1.id, category="regulatory", carrier=None,
                    title="FCC Proposes New Kids Safety Rules for Wireless", relevance="high",
                    summary="The FCC proposed new regulations requiring wireless carriers to offer parental controls by default. This aligns directly with USA Mobile's Phase 1 Aura parental controls strategy.",
                    source_name="FCC.gov", source_url="https://www.fcc.gov/document/fcc-proposes-kids-safety-rules-wireless", is_sales_lead=False, created_at=two_weeks_ago),
        ]

        # Findings for run 2
        findings_run2 = [
            Finding(run_id=run2.id, category="t_mobile_wholesale", carrier="t_mobile",
                    title="T-Mobile Updates Wholesale Data Prioritization Tiers", relevance="high",
                    summary="T-Mobile restructured data prioritization for wholesale partners. Premium tier now includes 5G UC access. USA Mobile should evaluate upgrading to maintain competitive brand experience.",
                    source_name="Light Reading", source_url="https://www.lightreading.com/5g/t-mobile-updates-wholesale-data-prioritization-tiers", is_sales_lead=False, created_at=week_ago),
            Finding(run_id=run2.id, category="att_expansion", carrier="att",
                    title="AT&T Opens Wholesale Program to New MVNO Partners", relevance="high",
                    summary="AT&T announced it's accepting new wholesale MVNO applications for Q2. This is directly relevant to USA Mobile's planned AT&T expansion timeline.",
                    source_name="FierceWireless", source_url="https://www.fiercewireless.com/wireless/att-opens-wholesale-program-new-mvno-partners", is_sales_lead=False, created_at=week_ago),
            Finding(run_id=run2.id, category="brand_launches", carrier=None,
                    title="SafeKids Wireless Announces Family Wireless Brand", relevance="high",
                    summary="SafeKids Wireless, a new family-focused wireless brand, announced plans to launch a kids-safe wireless service with built-in parental controls. This is a direct competitor or potential customer for USA Mobile.",
                    source_name="PR Newswire", source_url="https://www.prnewswire.com/news-releases/safekids-wireless-announces-family-wireless-brand.html", is_sales_lead=True, created_at=week_ago),
            Finding(run_id=run2.id, category="brand_launches", carrier=None,
                    title="GameZone Mobile: Gaming Brand Eyes Wireless Launch", relevance="medium",
                    summary="Gaming lifestyle brand GameZone is exploring a branded wireless service targeting mobile gamers. They reportedly met with multiple MVNE providers.",
                    source_name="The Verge", source_url="https://www.theverge.com/2026/2/gamezone-mobile-gaming-brand-wireless-launch", is_sales_lead=True, created_at=week_ago),
            Finding(run_id=run2.id, category="competing_mvne", carrier=None,
                    title="Plintron Launches Self-Service MVNO Portal", relevance="medium",
                    summary="Plintron launched a self-service portal allowing brands to configure and launch MVNO services in under 30 days. This competes with USA Mobile's Velocity Launch package.",
                    source_name="Telecom Lead", source_url="https://www.telecomlead.com/telecom-services/plintron-launches-self-service-mvno-portal", is_sales_lead=False, created_at=week_ago),
            Finding(run_id=run2.id, category="esim_technology", carrier=None,
                    title="Telgoo Announces BSS Platform 3.0 with eSIM Management", relevance="medium",
                    summary="Telgoo released BSS Platform 3.0 with native eSIM lifecycle management. This could improve USA Mobile's provisioning efficiency and reduce activation friction.",
                    source_name="Telgoo Blog", source_url="https://www.telgoo5.com/blog/bss-platform-3-esim-management", is_sales_lead=False, created_at=week_ago),
            Finding(run_id=run2.id, category="carrier_5g", carrier="t_mobile",
                    title="T-Mobile Expands Mid-Band 5G to 300M POPs", relevance="medium",
                    summary="T-Mobile's mid-band 5G now reaches 300 million people. Enhanced coverage improves the network quality proposition for USA Mobile's brand partners.",
                    source_name="T-Mobile Newsroom", source_url="https://www.t-mobile.com/news/network/t-mobile-mid-band-5g-300m-pops", is_sales_lead=False, created_at=week_ago),
            Finding(run_id=run2.id, category="market_trends", carrier=None,
                    title="US MVNO Subscriber Base Grows 8% YoY", relevance="medium",
                    summary="The US MVNO market grew 8% year-over-year to 85 million subscribers. Branded/white-label MVNOs are the fastest-growing segment, validating USA Mobile's market thesis.",
                    source_name="Counterpoint Research", source_url="https://www.counterpointresearch.com/insight/us-mvno-subscriber-base-grows-8-yoy", is_sales_lead=False, created_at=week_ago),
        ]

        db.add_all(findings_run1 + findings_run2)
        await db.flush()

        # Briefs
        brief1 = Brief(
            run_id=run1.id,
            week_of=(two_weeks_ago - timedelta(days=two_weeks_ago.weekday())).date(),
            brief_markdown=SAMPLE_BRIEF_1,
            top_priorities=json.dumps([
                {"title": "T-Mobile Expands MVNO Partner Program", "so_what": "Direct cost and competitive impact — USA Mobile should review new tier options"},
                {"title": "FCC Kids Safety Rules Proposed", "so_what": "Validates Phase 1 parental controls — positions USA Mobile ahead of regulatory curve"},
                {"title": "Gigs Raises $50M", "so_what": "Key competitor gaining resources — USA Mobile needs to accelerate differentiation"},
            ]),
            recommendations=json.dumps([
                {"action": "Review T-Mobile's new wholesale tiers and negotiate for premium 5G UC access", "based_on": "T-Mobile MVNO program expansion"},
                {"action": "Accelerate Phase 1 parental controls launch to capitalize on FCC regulatory momentum", "based_on": "FCC kids safety proposal"},
                {"action": "Develop competitive positioning materials against Gigs' API-first approach", "based_on": "Gigs $50M raise"},
            ]),
            finding_count=5,
            lead_count=1,
            created_at=two_weeks_ago,
        )

        brief2 = Brief(
            run_id=run2.id,
            week_of=(week_ago - timedelta(days=week_ago.weekday())).date(),
            brief_markdown=SAMPLE_BRIEF_2,
            top_priorities=json.dumps([
                {"title": "AT&T Opens Wholesale to New Partners", "so_what": "Window for Q2 expansion is open — USA Mobile should submit application now"},
                {"title": "SafeKids Wireless Brand Launch", "so_what": "Either a competitor or a prime acquisition target for USA Mobile's enablement services"},
                {"title": "T-Mobile Data Prioritization Restructure", "so_what": "Premium tier access to 5G UC could be a differentiator for brand partners"},
            ]),
            recommendations=json.dumps([
                {"action": "Submit AT&T wholesale application immediately to secure Q2 launch timeline", "based_on": "AT&T opening to new MVNO partners"},
                {"action": "Reach out to SafeKids Wireless as a potential USA Mobile customer", "based_on": "SafeKids Wireless brand launch announcement"},
                {"action": "Evaluate Telgoo BSS 3.0 upgrade for improved eSIM lifecycle management", "based_on": "Telgoo Platform 3.0 release"},
                {"action": "Contact GameZone Mobile about USA Mobile's MVNO-in-a-Box packages", "based_on": "GameZone exploring wireless launch"},
            ]),
            finding_count=8,
            lead_count=2,
            created_at=week_ago,
        )

        db.add_all([brief1, brief2])
        await db.flush()

        # Leads
        leads = [
            Lead(finding_id=findings_run1[1].id, brand_name="FitBrand",
                 description="Fitness brand exploring wireless launch targeting health-conscious consumers",
                 vertical="lifestyle", status="researching",
                 detected_at=two_weeks_ago, updated_at=week_ago),
            Lead(finding_id=findings_run2[2].id, brand_name="SafeKids Wireless",
                 description="Family-focused wireless brand with built-in parental controls",
                 vertical="family_safety", status="new",
                 detected_at=week_ago, updated_at=week_ago),
            Lead(finding_id=findings_run2[3].id, brand_name="GameZone Mobile",
                 description="Gaming lifestyle brand exploring branded wireless service for mobile gamers",
                 vertical="lifestyle", status="new",
                 detected_at=week_ago, updated_at=week_ago),
        ]

        db.add_all(leads)
        await db.commit()

        print(f"Seeded: 2 runs, {len(findings_run1) + len(findings_run2)} findings, 2 briefs, {len(leads)} leads")


SAMPLE_BRIEF_1 = """# Weekly Telecom Intelligence Brief

## TOP 3 THINGS THE CPO NEEDS TO KNOW THIS WEEK

### 1. T-Mobile Expands MVNO Partner Program
T-Mobile announced expanded wholesale access tiers including improved 5G data prioritization for MVNO partners. **So What for USA Mobile:** This directly impacts cost structure and the quality of service USA Mobile can offer to brand partners. Review new tier options immediately.

### 2. FCC Proposes Kids Safety Rules for Wireless
The FCC proposed new regulations requiring wireless carriers to offer parental controls by default. **So What for USA Mobile:** This validates the Phase 1 Aura parental controls strategy and positions USA Mobile ahead of the regulatory curve. Accelerate Phase 1 launch.

### 3. Gigs Raises $50M Series B
Key competitor Gigs raised $50M to expand their API-first telecom enablement platform with eSIM and multi-carrier support. **So What for USA Mobile:** Gigs is investing heavily in the exact market USA Mobile operates in. Need to differentiate on launch speed, compliance handling, and brand partnership depth.

## T-MOBILE WHOLESALE & NETWORK
T-Mobile's expanded MVNO partner program includes new premium tiers with 5G UC access. This is a significant development that could improve the brand experience USA Mobile delivers.

## BRAND WIRELESS OPPORTUNITIES
FitBrand is exploring launching a branded wireless service targeting health-conscious consumers. They are seeking MVNE partners for a Q3 launch. **POTENTIAL LEAD** — USA Mobile should reach out.

## COMPETITIVE MVNE LANDSCAPE
Gigs' $50M raise signals serious investor confidence in the MVNE space. Their planned eSIM provisioning and multi-carrier capabilities could compete with USA Mobile's planned features.

## TECHNOLOGY & PLATFORM
eSIM adoption in the US hit 35%, validating USA Mobile's BYOD eSIM-first approach. This trend will continue to accelerate with new device launches.

## REGULATORY & COMPLIANCE
FCC's proposed kids safety rules could accelerate demand for family-focused wireless brands — a core USA Mobile target market.

## STRATEGIC RECOMMENDATIONS
1. **Review T-Mobile's new wholesale tiers** and negotiate for premium 5G UC access
2. **Accelerate Phase 1 parental controls** to capitalize on regulatory momentum
3. **Develop competitive positioning against Gigs** highlighting launch speed and compliance advantages
"""

SAMPLE_BRIEF_2 = """# Weekly Telecom Intelligence Brief

## TOP 3 THINGS THE CPO NEEDS TO KNOW THIS WEEK

### 1. AT&T Opens Wholesale to New MVNO Partners
AT&T announced it's accepting new wholesale MVNO applications for Q2. **So What for USA Mobile:** The window for the planned AT&T expansion is now open. Submit application immediately to secure the Q2 timeline.

### 2. SafeKids Wireless Announces Family Brand Launch
A new family-focused wireless brand, SafeKids Wireless, announced plans for a kids-safe service with built-in parental controls. **So What for USA Mobile:** This is either a direct competitor to USA Mobile's brand partners OR a prime acquisition target for USA Mobile's enablement services.

### 3. T-Mobile Restructures Data Prioritization
T-Mobile updated wholesale data prioritization tiers with premium 5G UC access. **So What for USA Mobile:** Upgrading to the premium tier could be a key differentiator when pitching to brand partners.

## T-MOBILE WHOLESALE & NETWORK
T-Mobile's data prioritization restructure affects all wholesale partners. The new premium tier includes 5G UC access, which significantly improves the end-user experience. USA Mobile should evaluate the cost-benefit of upgrading.

T-Mobile's mid-band 5G now reaches 300M POPs, further improving the network quality proposition.

## AT&T EXPANSION INTELLIGENCE
AT&T is actively accepting new wholesale MVNO applications. This is the signal USA Mobile has been waiting for to initiate the Q2 AT&T expansion. Application process and timeline details should be obtained immediately.

## BRAND WIRELESS OPPORTUNITIES
**SafeKids Wireless** — New family-focused wireless brand with parental controls. **POTENTIAL LEAD** — directly aligned with USA Mobile's target market.

**GameZone Mobile** — Gaming lifestyle brand exploring wireless. Met with multiple MVNE providers. **POTENTIAL LEAD** — reach out with MVNO-in-a-Box offering.

## COMPETITIVE MVNE LANDSCAPE
Plintron launched a self-service portal for 30-day MVNO launches. This competes with USA Mobile's Velocity Launch package. Differentiation through compliance handling and brand partnership depth remains key.

## TECHNOLOGY & PLATFORM
Telgoo released BSS Platform 3.0 with native eSIM lifecycle management. This could improve USA Mobile's provisioning efficiency. Evaluate upgrade path.

## MARKET & INDUSTRY TRENDS
US MVNO market grew 8% YoY to 85M subscribers. Branded/white-label MVNOs are the fastest-growing segment — strong validation for USA Mobile's thesis.

## STRATEGIC RECOMMENDATIONS
1. **Submit AT&T wholesale application now** to secure Q2 expansion timeline
2. **Contact SafeKids Wireless** as a potential USA Mobile enablement customer
3. **Evaluate Telgoo BSS 3.0 upgrade** for improved eSIM management
4. **Reach out to GameZone Mobile** about MVNO-in-a-Box packages
"""


if __name__ == "__main__":
    asyncio.run(seed())
