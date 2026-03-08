"""Eight intelligence categories tuned to USA Mobile's executive priorities."""

CATEGORIES = [
    {
        "id": "wholesale_economics",
        "name": "Carrier Wholesale Power & Margin Signals",
        "carrier": None,
        "queries": [
            "T-Mobile wholesale pricing changes MVNO 2025 2026",
            "T-Mobile MVNO prioritization QCI changes 2025 2026",
            "T-Mobile MVNO contract updates latest",
            "AT&T wholesale agreement MVNO update 2025 2026",
            "AT&T MVNO network access terms latest",
            "carrier wholesale renegotiation MVNO news 2025 2026",
            "carrier wholesale margin pressure MVNO 2025 2026",
        ],
        "focus": (
            "HIGHEST PRIORITY — directly impacts profitability. Track whether wholesale "
            "costs are rising, whether QCI priority rules are changing, and whether large "
            "MVNOs are getting better deals. Monitor T-Mobile and AT&T wholesale pricing "
            "shifts, contract renegotiations, and any signals that carrier wholesale "
            "economics are tightening or loosening. This affects USA Mobile's ability to "
            "scale to 250K subscribers profitably."
        ),
    },
    {
        "id": "brand_launches",
        "name": "Multi-Brand / White-Label Launch Activity",
        "carrier": None,
        "queries": [
            "new branded MVNO launch US 2025 2026",
            "celebrity wireless brand launch latest",
            "fintech wireless plan launch 2025 2026",
            "church or community wireless service launch 2025 2026",
            "enterprise employee wireless program latest",
            "licensed IP wireless brand launch 2025 2026",
            "influencer telecom brand partnership latest",
        ],
        "focus": (
            "Detect who is using wireless as a revenue engine and what verticals are "
            "heating up. Track any brand — celebrity, fintech, community, enterprise, "
            "IP-licensed — launching or exploring their own wireless service. Each one "
            "is either a potential USA Mobile customer or a competitive signal. Identify "
            "which segments are saturated vs. emerging opportunities. Flag every launch "
            "as a potential sales lead."
        ),
    },
    {
        "id": "competing_mvne",
        "name": "MVNE & Enablement Platform Competitive Intelligence",
        "carrier": None,
        "queries": [
            "Gigs telecom expansion US 2025 2026",
            "Reach MVNE new brand launch latest",
            "Enabler IQ partnership announcement 2025 2026",
            "Plintron US contract win latest",
            "telecom enablement platform funding round 2025 2026",
            "MVNE merger acquisition telecom latest",
        ],
        "focus": (
            "Threat monitoring. If a competitor signs 10 brands in one quarter, USA "
            "Mobile needs to know. Track Gigs, Reach, Plintron, Enabler IQ, and any "
            "new MVNE entrants — their brand partnerships, new capabilities, and pricing. "
            "Also track venture funding in connectivity-as-a-service and API-first telecom "
            "expansion. Capital inflow = competitive threat."
        ),
    },
    {
        "id": "network_technology",
        "name": "Technology That Impacts Differentiation",
        "carrier": None,
        "queries": [
            "5G network slicing MVNO access 2025 2026",
            "5G standalone core MVNO integration latest",
            "carrier API exposure MVNO 2025 2026",
            "eSIM bulk provisioning enterprise latest",
            "embedded connectivity API telecom 2025 2026",
            "telecom AI customer service automation latest",
            "telecom fraud prevention MVNO 2025 2026",
        ],
        "focus": (
            "Not generic 5G noise — focus on tech that changes USA Mobile's competitive "
            "position. Can MVNOs access network slicing? Are carriers exposing APIs that "
            "USA Mobile could leverage? Can AI reduce support costs? Is fraud rising in "
            "the MVNO space? Track embedded connectivity APIs, bulk eSIM provisioning for "
            "enterprise, and any carrier technology moves that enable or threaten the "
            "MVNE model."
        ),
    },
    {
        "id": "esim_activation",
        "name": "eSIM & Digital Activation Economics",
        "carrier": None,
        "queries": [
            "US eSIM adoption rate report 2025 2026",
            "eSIM vs physical SIM cost comparison MVNO latest",
            "eSIM provisioning cost trends 2025 2026",
            "BYOD activation trend US latest",
            "digital onboarding telecom churn impact 2025 2026",
        ],
        "focus": (
            "Operational leverage signals. If eSIM adoption spikes, customer acquisition "
            "cost drops. If physical SIM logistics costs rise, margin shrinks. Track US "
            "eSIM adoption rates, cost comparisons between eSIM and physical SIM for "
            "MVNOs, BYOD activation trends, and how digital onboarding impacts churn. "
            "These directly affect USA Mobile's Phase 1 BYOD eSIM model economics."
        ),
    },
    {
        "id": "regulatory",
        "name": "Regulatory & Risk Monitoring",
        "carrier": None,
        "queries": [
            "FCC MVNO enforcement action 2025 2026",
            "FCC wholesale access policy latest",
            "COPPA telecom enforcement cases 2025 2026",
            "kids safety telecom compliance update latest",
            "state telecom tax changes MVNO 2025 2026",
            "US telecom privacy law update latest",
        ],
        "focus": (
            "Protect the business. USA Mobile's youth/family positioning means regulatory "
            "shifts in kids safety can be existential. Track FCC enforcement actions "
            "against MVNOs, wholesale access policy changes, COPPA enforcement cases, "
            "state-level telecom tax changes that affect MVNO economics, and US telecom "
            "privacy law updates. Any of these can kill a product line overnight."
        ),
    },
    {
        "id": "capital_markets",
        "name": "Capital Markets & Consolidation",
        "carrier": None,
        "queries": [
            "MVNO acquisition US 2025 2026",
            "telecom wholesale acquisition latest",
            "carrier wholesale strategy shift 2025 2026",
            "T-Mobile wholesale revenue earnings call latest",
            "AT&T wholesale revenue earnings report latest",
            "telecom private equity MVNO investment 2025 2026",
        ],
        "focus": (
            "Strategic level intelligence. If carriers change wholesale strategy or "
            "acquire major MVNEs, USA Mobile's leverage changes instantly. Track MVNO "
            "and MVNE acquisitions, carrier earnings call commentary on wholesale revenue, "
            "private equity investment flowing into the MVNO/MVNE space, and any signals "
            "of carrier wholesale strategy shifts. M&A activity reshapes the competitive "
            "landscape."
        ),
    },
    {
        "id": "subscriber_market",
        "name": "Subscriber & Prepaid Market Health",
        "carrier": None,
        "queries": [
            "US prepaid subscriber growth 2025 2026",
            "prepaid churn trends US telecom latest",
            "ARPU trend prepaid market 2025 2026",
            "MVNO market share shift US latest",
            "multi-network MVNO trend 2025 2026",
        ],
        "focus": (
            "Macro growth signal — is the pie growing or are we fighting over scraps? "
            "Track US prepaid subscriber growth, churn trends, ARPU trajectory in the "
            "prepaid market, MVNO market share shifts among carriers, and the trend "
            "toward multi-network MVNOs. This informs USA Mobile's TAM narrative and "
            "validates whether the 250K subscriber scaling goal is realistic."
        ),
    },
]
