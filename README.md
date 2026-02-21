# Irie Wireless

**The Control Plane for Global Wireless Infrastructure**

Irie Wireless is a telecom API orchestration platform that unifies carrier, wholesale, and billing systems through a single API layer — powering scalable multi-brand wireless operations.

This repository contains the full-stack Next.js web application with two surfaces:

1. **Marketing Landing Page** — Dark, high-tech animated landing page with interactive globe, constellation particle background, and contact form
2. **Admin Dashboard** — Mock orchestration control plane with live data visualizations, charts, and real-time activity feeds

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Sora + JetBrains Mono |
| Form Handling | React Hook Form + Zod |
| Email | Resend |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) for the landing page and [http://localhost:3000/dashboard](http://localhost:3000/dashboard) for the admin dashboard.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with fonts and metadata
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind config, CSS variables, animations
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   └── page.tsx            # Main dashboard view
│   └── api/
│       └── contact/
│           └── route.ts        # Contact form API endpoint
├── components/
│   ├── landing/                # 13 landing page components
│   │   ├── Navbar.tsx          # Fixed nav with mobile hamburger
│   │   ├── Hero.tsx            # Animated hero with gradient text
│   │   ├── ProblemSection.tsx  # Problem diagram + items
│   │   ├── IrieLayer.tsx       # 3-column orchestration diagram
│   │   ├── HowItWorks.tsx      # 4 step cards
│   │   ├── Capabilities.tsx    # 6 capability cards
│   │   ├── MetricsStrip.tsx    # 4 gradient metrics
│   │   ├── GlobalVision.tsx    # Interactive canvas globe (24 countries)
│   │   ├── FutureState.tsx     # 5 roadmap cards
│   │   ├── StructureClarity.tsx
│   │   ├── FinalCTA.tsx        # Call-to-action with radial glow
│   │   ├── ConstellationBg.tsx # 80-particle animated canvas mesh
│   │   └── ContactModal.tsx    # Form with validation + auto-triggers
│   ├── dashboard/              # 10 dashboard components
│   │   ├── Sidebar.tsx         # Fixed sidebar with mobile drawer
│   │   ├── TopBar.tsx          # Sticky top bar with search
│   │   ├── DemoBanner.tsx
│   │   ├── StatCard.tsx        # Cards with canvas sparklines
│   │   ├── SubscriberChart.tsx # Recharts dual-line chart
│   │   ├── CarrierStatus.tsx   # Carrier integration cards
│   │   ├── BrandTable.tsx      # Brand programs table
│   │   ├── WorkflowEngine.tsx  # 5-node activation pipeline
│   │   ├── PlanDonut.tsx       # Canvas donut chart
│   │   ├── ActivityFeed.tsx    # Live-updating feed (8s cycle)
│   │   └── PortInMetrics.tsx   # Port-in performance stats
│   └── ui/                     # Shared UI primitives
│       ├── Button.tsx
│       ├── Badge.tsx
│       ├── StatusPill.tsx
│       └── ProgressBar.tsx
├── hooks/
│   ├── useMediaQuery.ts        # Responsive breakpoint hook
│   ├── useAnimateOnScroll.ts   # Intersection observer reveal
│   └── useScrollTrigger.ts     # Modal scroll trigger
└── lib/
    ├── constants.ts            # All mock data and content
    ├── types.ts                # TypeScript interfaces
    ├── animations.ts           # Shared Framer Motion variants
    └── utils.ts                # Helper functions
```

## Features

### Landing Page
- Animated constellation particle mesh background (canvas)
- Interactive 3D globe with 24 country nodes, drag-to-rotate, touch support
- Contact modal with scroll/timer auto-triggers and Zod validation
- Framer Motion scroll-reveal animations on all sections
- Fully responsive (mobile hamburger menu, stacked layouts)

### Dashboard
- Stat cards with canvas sparkline charts
- Subscriber growth chart (Recharts) with 7D/30D/90D toggle
- Carrier integration status panel
- Brand programs table with growth progress bars
- Workflow engine pipeline visualization (animated active state)
- Plan distribution donut chart (canvas)
- Live activity feed (new entries every 8 seconds)
- Port-in performance metrics with carrier breakdown
- Collapsible sidebar with mobile slide-out drawer

## Environment Variables

```env
# Required for email sending (optional for demo)
RESEND_API_KEY=re_your_key_here

# Contact email for partner inquiries
CONTACT_EMAIL=partners@iriewireless.com

# Public site URL
NEXT_PUBLIC_SITE_URL=https://iriewireless.com
```

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

Set `RESEND_API_KEY` in your Vercel environment variables to enable contact form email delivery.

## License

Private — All rights reserved.
