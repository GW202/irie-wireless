# CarrierPulse → Irie Wireless Platform: Feasibility & Architecture Analysis

## Context

CarrierPulse exists as a standalone full-stack app with a Python/FastAPI backend and React/Vite frontend. The Irie Wireless platform is a Next.js 16 TypeScript app that already has a **placeholder mount point** for CarrierPulse at `/platform/services/carrier-pulse` — currently showing module cards with "Ready for connection" status. The goal is to migrate CarrierPulse's actual functionality into this mount point so it becomes a real, working service within the platform.

---

## Feasibility Assessment

### Overall Verdict: FEASIBLE with significant architectural work

| Area | Feasibility | Risk | Notes |
|------|------------|------|-------|
| Frontend migration | High | Medium | JSX→TSX conversion; React Router→Next.js App Router; TanStack Query patterns transfer well |
| Backend integration | High | High | Python FastAPI backend has no equivalent in the Next.js platform — requires microservice approach |
| Auth unification | High | Low | Platform RBAC already includes `service:carrier-pulse` permission; CarrierPulse roles map cleanly |
| Multi-tenancy alignment | High | Medium | CarrierPulse "brands" map to platform "tenants"; data scoping logic exists in both |
| AI agent pipeline | High | Medium | Core value — Anthropic SDK works in both Python and TypeScript; pipeline is modular |
| Database layer | High | High | Platform has NO database; CarrierPulse uses SQLite/SQLAlchemy (8 tables) |
| Scheduling | Medium | Medium | APScheduler is Python-specific; needs replacement (cron, Vercel cron, external) |

---

## Architecture Comparison

### What CarrierPulse Has (standalone)
- **Backend:** Python 3.12, FastAPI, 11 route groups (~30+ endpoints)
- **Database:** SQLite via async SQLAlchemy (8 tables: users, brands, findings, briefs, action_items, run_logs, leads, user_brands)
- **AI Pipeline:** Anthropic SDK → researcher.py → analyzer.py → pipeline.py
- **Auth:** JWT + bcrypt, 3 roles (superadmin/admin/user)
- **Frontend:** React 19 + Vite + Tailwind v4 + TanStack Query + Recharts
- **Scheduling:** APScheduler (Friday 7 AM recurring runs)
- **Email:** aiosmtplib for brief delivery

### What Irie Wireless Platform Has
- **Framework:** Next.js 16 App Router + TypeScript + React 19 + Tailwind v4
- **Auth:** Context-based RBAC, 7 roles, 23 permissions (includes `service:carrier-pulse`)
- **Multi-tenancy:** TenantContext with tenant switching, service enablement
- **Database:** NONE — all mock data currently
- **API:** Only `/api/contact` route exists
- **CarrierPulse slot:** Placeholder page at `src/app/platform/services/carrier-pulse/page.tsx`

### Key Gaps
1. **No backend/database in the platform** — this is the biggest gap
2. **No API route pattern** beyond the single contact form endpoint
3. **Frontend tech differs:** Vite/React Router (source) vs Next.js App Router (target)
4. **Scheduling mechanism** needs replacement

---

## Recommended Architecture: Microservice Backend + Next.js Frontend

### Approach: Keep Python backend as a separate microservice, rebuild frontend in Next.js

**Why this approach:**
- The AI research pipeline (researcher, analyzer, pipeline orchestrator) is ~800 lines of well-structured Python tightly coupled to the Anthropic Python SDK — rewriting to TypeScript adds risk for no benefit
- FastAPI backend is already production-ready with async patterns, error handling, and RBAC
- Next.js API routes can proxy to the Python backend, or the frontend can call it directly
- This is the standard microservice pattern — the platform shell handles auth/tenant context, the service handles domain logic

### High-Level Architecture
```
Irie Wireless Platform (Next.js 16)
├── Platform Shell (auth, tenants, permissions, navigation)
├── /platform/services/carrier-pulse/* (Next.js pages — rebuilt frontend)
│   ├── page.tsx (dashboard)
│   ├── brands/page.tsx
│   ├── findings/page.tsx
│   ├── briefs/page.tsx
│   ├── trends/page.tsx
│   ├── actions/page.tsx
│   └── leads/page.tsx
├── /api/carrier-pulse/* (Next.js API routes — proxy to Python backend)
│
└── CarrierPulse Backend (Python/FastAPI — separate process)
    ├── All existing API endpoints
    ├── AI research pipeline
    ├── Database (SQLite → PostgreSQL for production)
    └── Scheduler
```

---

## Migration Phases

### Phase 1: Backend Preparation
**Goal:** Make the Python backend platform-ready

1. **Auth bridge:** Add middleware that accepts platform JWT tokens (forwarded from Next.js) OR keep internal JWT but add a "platform token" validation mode
2. **Tenant awareness:** Rename/alias "brand_id" scoping to accept "tenant_id" from platform context
3. **Database upgrade:** Move from SQLite to PostgreSQL for production multi-tenant support
4. **CORS update:** Allow requests from the platform's domain
5. **Health endpoint:** Already exists at `/api/health` — add service metadata

**Files to modify:**
- `backend/utils/security.py` — add platform token validation
- `backend/config.py` — add platform integration settings
- `backend/main.py` — update CORS, add platform middleware
- `backend/database.py` — PostgreSQL connection support

### Phase 2: Next.js API Proxy Layer
**Goal:** Create API routes in the platform that proxy to the Python backend

Create `/src/app/api/carrier-pulse/[...path]/route.ts` — a catch-all proxy that:
- Forwards the platform session/auth context
- Proxies all requests to the Python backend
- Handles errors gracefully

**Files to create:**
- `src/app/api/carrier-pulse/[...path]/route.ts`

### Phase 3: Frontend Migration
**Goal:** Rebuild CarrierPulse UI as Next.js pages within the platform

Convert each page from React Router (JSX) → Next.js App Router (TSX):

| Source (irie-carrier-pulse) | Target (irie-wireless) |
|---|---|
| `frontend/src/pages/Dashboard.jsx` | `src/app/platform/services/carrier-pulse/page.tsx` |
| `frontend/src/pages/Findings.jsx` | `src/app/platform/services/carrier-pulse/findings/page.tsx` |
| `frontend/src/pages/BriefHistory.jsx` | `src/app/platform/services/carrier-pulse/briefs/page.tsx` |
| `frontend/src/pages/BriefView.jsx` | `src/app/platform/services/carrier-pulse/briefs/[id]/page.tsx` |
| `frontend/src/pages/Trends.jsx` | `src/app/platform/services/carrier-pulse/trends/page.tsx` |
| `frontend/src/pages/Actions.jsx` | `src/app/platform/services/carrier-pulse/actions/page.tsx` |
| `frontend/src/pages/Settings.jsx` | Merge into platform settings |

Migrate shared components:

| Source | Target |
|---|---|
| `frontend/src/components/FindingRow.jsx` | `src/components/carrier-pulse/FindingRow.tsx` |
| `frontend/src/components/BriefCard.jsx` | `src/components/carrier-pulse/BriefCard.tsx` |
| `frontend/src/components/ActionCard.jsx` | `src/components/carrier-pulse/ActionCard.tsx` |
| `frontend/src/components/RunAgentButton.jsx` | `src/components/carrier-pulse/RunAgentButton.tsx` |
| `frontend/src/components/BrandSelector.jsx` | Replaced by platform TenantContext |
| `frontend/src/components/charts/*` | `src/components/carrier-pulse/charts/*` |
| `frontend/src/hooks/*` | `src/hooks/carrier-pulse/*` |

**Key conversions:**
- `useNavigate()` → Next.js `useRouter()`
- `useParams()` → Next.js `useParams()`
- `AuthContext` → Platform's `useAuth()` + `usePermission()`
- `BrandContext` → Platform's `useTenant()`
- `fetchApi()` → New API client pointing to `/api/carrier-pulse/*`
- All JSX → TSX with proper type annotations

### Phase 4: Integration & Polish
**Goal:** Wire everything together

1. **Update service definition** in `src/lib/services.ts` — already registered, update version/status
2. **Add sub-navigation** — CarrierPulse needs its own sidebar/tabs within the service area (Dashboard, Findings, Briefs, Trends, Actions)
3. **Connect platform notifications** — Agent run completions → platform notification center
4. **Tenant-service enablement** — Ensure CarrierPulse respects `tenant.enabledServices` array

---

## Auth Mapping

| CarrierPulse Role | Platform Role(s) | Notes |
|---|---|---|
| `superadmin` | `superadmin` | Full access, all brands/tenants |
| `admin` | `tenant_admin`, `operator` | Can run agent, manage brands |
| `user` | `analyst`, `viewer` | Read-only findings/briefs |

The platform already grants `service:carrier-pulse` permission to: superadmin, tenant_admin, analyst, operator. This covers all needed access patterns.

---

## Data Model Alignment

| CarrierPulse | Platform Equivalent | Migration |
|---|---|---|
| `brands` table | `Tenant` entity | Map brand → tenant; `brand.slug` → `tenant.slug` |
| `users` table | `User` entity | Platform auth replaces this entirely |
| `user_brands` table | `user.tenantIds[]` | Platform handles user-tenant mapping |
| `findings` table | New — keep as-is | Scope by `tenant_id` instead of `brand_id` |
| `briefs` table | New — keep as-is | Scope by `tenant_id` |
| `action_items` table | New — keep as-is | Scope by `tenant_id` |
| `run_logs` table | New — keep as-is | Scope by `tenant_id` |
| `leads` table | New — keep as-is | Scope by `tenant_id` |

---

## Decisions Made

1. **Backend deployment model:** Keep Python/FastAPI as a separate microservice. Next.js API routes proxy to it.
2. **Database:** PostgreSQL for production (upgrade from SQLite)
3. **Scheduling:** Keep APScheduler in the Python process for now; revisit based on deployment target
4. **Brand vs Tenant:** Keep "brands" as a CarrierPulse domain concept scoped within each tenant — a tenant (MVNO company) can monitor multiple brands

---

## Verification Plan

1. **Backend health:** `curl http://localhost:8000/api/health` returns `{"status": "ok"}`
2. **Proxy works:** `curl http://localhost:3000/api/carrier-pulse/health` proxies to Python backend
3. **Auth flow:** Login via platform → navigate to CarrierPulse → see dashboard with real data
4. **Data flow:** Run agent → findings appear → brief generated → visible in UI
5. **Tenant scoping:** Switch tenant → CarrierPulse data changes accordingly
6. **Permissions:** Viewer role can see findings but cannot run agent; admin can do both
7. **Build:** `npm run build` succeeds with no TypeScript errors
8. **Lint:** `npm run lint` passes

---

## Summary

The migration is **fully feasible**. The platform was clearly designed with CarrierPulse in mind — it already has the service slot, permission, and module descriptions ready. The main work is:

1. **~20% effort:** Backend prep (auth bridge, tenant awareness)
2. **~10% effort:** API proxy layer in Next.js
3. **~50% effort:** Frontend migration (9 pages, ~15 components, 9 hooks → TypeScript + Next.js patterns)
4. **~20% effort:** Integration, testing, and polish
