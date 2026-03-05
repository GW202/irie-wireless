import { StatCardData, CarrierData, BrandData, ActivityItem, WorkflowNode, PlanDistribution, GlobeCountry } from './types';

// ---- Landing Page Data ----

export const NAV_LINKS = [
  { label: 'Platform', href: '#platform' },
  { label: 'How It Works', href: '#how' },
  { label: 'Roadmap', href: '#roadmap' },
];

export const PROBLEM_NODES = [
  'Carrier APIs',
  'Wholesale Platforms',
  'BSS / Billing Systems',
  'SIM Provisioning',
  'eSIM Platforms',
  'KYC / Fraud Systems',
];

export const PROBLEM_ITEMS = [
  {
    title: 'Direct BSS Coupling',
    description: 'Brands integrate directly with Telgoo5 or Netcracker. Switching providers means rewriting everything.',
  },
  {
    title: 'No Canonical Data Model',
    description: 'Every BSS represents subscribers, billing, and provisioning differently. No standard exists across providers.',
  },
  {
    title: 'Vendor Lock-In',
    description: 'Providers dictate how you build. Switching BSS means months of re-integration — not an adapter swap.',
  },
  {
    title: 'Integration, Not Configuration',
    description: 'Launching a new MVNO should be a tenant configuration — not a 6\u201312 month custom integration build.',
  },
];

export const API_SOURCES = [
  'Telgoo5 BSS',
  'Netcracker BSS',
  'Carrier APIs',
  'SIM / eSIM Provisioning',
  'Billing / OCS',
];

export const BRAND_OUTPUTS = [
  'MVNO Alpha',
  'MVNO Beta',
  'Sub-MVNO Gamma',
  'Digital Carrier Delta',
  'Tenant N+1',
];

export const STEPS = [
  {
    number: 'Step 01 \u2014 Abstract',
    title: 'Connect Providers',
    description: 'We abstract Telgoo5, Netcracker, and any future BSS into provider adapters. No rip-and-replace \u2014 Irie layers on top.',
  },
  {
    number: 'Step 02 \u2014 Normalize',
    title: 'Canonical Model',
    description: 'Provider payloads are transformed and normalized into a canonical telecom domain model \u2014 a stable, versioned API.',
  },
  {
    number: 'Step 03 \u2014 Configure',
    title: 'Tenant Routing',
    description: 'Brands integrate with Irie \u2014 not with providers. Multi-tenant routing, per-brand configuration, normalized data.',
  },
  {
    number: 'Step 04 \u2014 Deploy',
    title: 'Launch MVNOs',
    description: 'Adding a new MVNO becomes a configuration-level change. Switching providers becomes an adapter swap. That\u2019s leverage.',
  },
];

export const CAPABILITIES = [
  {
    icon: '\u26a1',
    title: 'BSS Abstraction Layer',
    description: 'Abstract Telgoo5, Netcracker, and any future MVNE/MNO/BSS into a canonical domain model with stable versioned APIs.',
  },
  {
    icon: '\ud83d\udd04',
    title: 'Transformation Engine',
    description: 'Provider Payload \u2192 Transform \u2192 Normalize \u2192 Store Canonical \u2192 Serve Stable API. Telecom middleware, built right.',
  },
  {
    icon: '\ud83d\udd13',
    title: 'Provider-Agnostic',
    description: 'Switching Telgoo \u2192 Netcracker is an adapter-level change. Not a frontend rewrite. Eliminate vendor lock-in permanently.',
  },
  {
    icon: '\ud83d\udcca',
    title: 'Multi-Tenant Platform',
    description: 'Tenant-based routing, per-brand provider configuration, and normalized data models. Infrastructure for multiple MVNOs.',
  },
  {
    icon: '\ud83d\udee1\ufe0f',
    title: 'Canonical Data Ownership',
    description: 'You control how messaging, provisioning, subscribers, and billing are represented. Providers adapt to you.',
  },
  {
    icon: '\ud83c\udf10',
    title: 'Rapid MVNO Deployment',
    description: 'Launch brands faster. Reduce integration cost. New MVNO deployment is configuration \u2014 not a new integration build.',
  },
];

export const METRICS = [
  { value: 'Multi', label: 'Tenant Architecture' },
  { value: 'Adapter', label: 'Level Provider Swap' },
  { value: 'Config', label: 'Level MVNO Launch' },
  { value: 'Zero', label: 'Vendor Lock-In' },
];

export const FUTURE_ITEMS = [
  { title: 'Phase 1: Normalize', description: 'Messaging normalization, Telgoo5 integration, multi-tenant routing.' },
  { title: 'Phase 2: Lifecycle', description: 'Subscriber lifecycle, number provisioning, plan management, billing abstraction.' },
  { title: 'Phase 3: Intelligence', description: 'Usage data normalization, reconciliation engine, cross-provider failover.' },
  { title: 'Phase 4: Marketplace', description: 'API marketplace, brand self-service onboarding, global carrier integrations.' },
  { title: 'Phase 5: Platform', description: 'White-label telecom middleware. MVNO infrastructure as a service.' },
];

export const ORGANIZATION_TYPES = [
  { value: 'MNO', label: 'MNO \u2014 Mobile Network Operator' },
  { value: 'MVNO', label: 'MVNO \u2014 Mobile Virtual Network Operator' },
  { value: 'MVNE', label: 'MVNE \u2014 Mobile Virtual Network Enabler' },
  { value: 'MVNA', label: 'MVNA \u2014 Mobile Virtual Network Aggregator' },
  { value: 'Brand', label: 'Brand \u2014 Looking to launch wireless' },
  { value: 'Investor', label: 'Investor' },
  { value: 'Other', label: 'Other' },
];

// ---- Globe Data ----

export const GLOBE_COUNTRIES: GlobeCountry[] = [
  { name: 'United States', detail: 'Primary Market', lat: 0.66, lng: -1.7, r: 6, region: 'na' },
  { name: 'New York', detail: 'Eastern Hub', lat: 0.71, lng: -1.29, r: 4, region: 'na' },
  { name: 'Los Angeles', detail: 'Western Hub', lat: 0.59, lng: -2.06, r: 4, region: 'na' },
  { name: 'Canada', detail: 'Expansion Target', lat: 0.84, lng: -1.74, r: 5, region: 'na' },
  { name: 'Mexico', detail: 'LATAM Gateway', lat: 0.34, lng: -1.73, r: 4, region: 'na' },
  { name: 'Brazil', detail: 'LATAM Market', lat: -0.27, lng: -0.85, r: 5, region: 'sa' },
  { name: 'Colombia', detail: 'Emerging Market', lat: 0.07, lng: -1.29, r: 3.5, region: 'sa' },
  { name: 'United Kingdom', detail: 'EU Gateway', lat: 0.90, lng: -0.02, r: 5, region: 'eu' },
  { name: 'Germany', detail: 'EU Infrastructure', lat: 0.88, lng: 0.18, r: 4.5, region: 'eu' },
  { name: 'France', detail: 'EU Market', lat: 0.81, lng: 0.04, r: 4, region: 'eu' },
  { name: 'Netherlands', detail: 'Connectivity Hub', lat: 0.91, lng: 0.09, r: 3.5, region: 'eu' },
  { name: 'Spain', detail: 'EU Expansion', lat: 0.70, lng: -0.06, r: 3.5, region: 'eu' },
  { name: 'Nigeria', detail: 'Africa Hub', lat: 0.16, lng: 0.06, r: 4, region: 'af' },
  { name: 'South Africa', detail: 'Southern Africa', lat: -0.52, lng: 0.49, r: 4, region: 'af' },
  { name: 'Kenya', detail: 'East Africa Hub', lat: -0.02, lng: 0.65, r: 3.5, region: 'af' },
  { name: 'Egypt', detail: 'MENA Gateway', lat: 0.47, lng: 0.55, r: 4, region: 'af' },
  { name: 'India', detail: 'Asia Major Market', lat: 0.35, lng: 1.36, r: 5.5, region: 'as' },
  { name: 'Japan', detail: 'APAC Hub', lat: 0.63, lng: 2.41, r: 5, region: 'as' },
  { name: 'South Korea', detail: '5G Leader', lat: 0.65, lng: 2.21, r: 4, region: 'as' },
  { name: 'Singapore', detail: 'SEA Gateway', lat: 0.02, lng: 1.81, r: 4, region: 'as' },
  { name: 'UAE', detail: 'Middle East Hub', lat: 0.44, lng: 0.96, r: 4, region: 'as' },
  { name: 'China', detail: 'Asia Infrastructure', lat: 0.61, lng: 1.82, r: 5, region: 'as' },
  { name: 'Australia', detail: 'Oceania Hub', lat: -0.44, lng: 2.35, r: 5, region: 'oc' },
  { name: 'New Zealand', detail: 'Oceania Market', lat: -0.72, lng: 3.04, r: 3.5, region: 'oc' },
];

export const GLOBE_LINKS = [
  [0,1],[0,2],[0,3],[0,4],[0,7],[1,7],[1,5],[5,6],[7,8],[7,9],[8,10],[9,11],
  [7,12],[12,14],[14,15],[15,16],[16,19],[16,20],[17,18],[17,21],[19,22],[22,23],
  [8,16],[0,17],[3,5],[13,15],[20,17],
];

export const REGION_COLORS: Record<string, string> = {
  na: '0, 229, 255',
  sa: '0, 200, 255',
  eu: '100, 200, 255',
  af: '255, 180, 50',
  as: '0, 255, 157',
  oc: '180, 130, 255',
};

// ---- Dashboard Data ----

export const STAT_CARDS: StatCardData[] = [
  {
    label: 'Total Subscribers',
    value: '247,892',
    change: '\u25b2 12.4%',
    changeDetail: 'vs last month',
    color: 'cyan',
    sparklineData: [180,192,188,201,210,215,224,231,240,247],
  },
  {
    label: 'Monthly Revenue',
    value: '$2.84M',
    change: '\u25b2 8.7%',
    changeDetail: 'vs last month',
    color: 'green',
    sparklineData: [2.1,2.2,2.15,2.3,2.45,2.5,2.6,2.7,2.75,2.84],
  },
  {
    label: 'Active Brands',
    value: '8',
    change: '\u25b2 2',
    changeDetail: 'this quarter',
    color: 'amber',
    sparklineData: [4,4,5,5,5,6,6,7,7,8],
  },
  {
    label: 'API Uptime',
    value: '99.97%',
    change: '\u25b2 0.02%',
    changeDetail: '30-day avg',
    color: 'purple',
    sparklineData: [99.91,99.93,99.94,99.92,99.95,99.96,99.94,99.97,99.96,99.97],
  },
];

export const CARRIERS: CarrierData[] = [
  {
    code: 'TMO',
    name: 'T-Mobile Wholesale',
    latency: '42ms',
    subscribers: '184K',
    status: 'online',
    color: 'var(--color-accent-cyan)',
    bgColor: 'rgba(0,229,255,0.08)',
  },
  {
    code: 'ATT',
    name: 'AT&T Wholesale',
    latency: '58ms',
    subscribers: '52K',
    status: 'online',
    color: 'var(--color-accent-green)',
    bgColor: 'rgba(0,255,157,0.08)',
  },
  {
    code: 'VZN',
    name: 'Verizon Wholesale',
    latency: '61ms',
    subscribers: 'Integration',
    status: 'degraded',
    color: 'var(--color-accent-purple)',
    bgColor: 'rgba(167,139,250,0.08)',
  },
];

export const BRANDS: BrandData[] = [
  { name: 'Bolt Mobile', subscribers: '89,241', mrr: '$982K', status: 'Active', growth: 78, color: 'var(--color-accent-cyan)' },
  { name: 'Verdant Wireless', subscribers: '64,102', mrr: '$704K', status: 'Active', growth: 65, color: 'var(--color-accent-green)' },
  { name: 'NexGen Connect', subscribers: '42,887', mrr: '$471K', status: 'Active', growth: 52, color: 'var(--color-accent-amber)' },
  { name: 'Prism Mobile', subscribers: '28,440', mrr: '$312K', status: 'Active', growth: 40, color: 'var(--color-accent-purple)' },
  { name: 'Aura Connect', subscribers: '14,210', mrr: '$156K', status: 'Scaling', growth: 88, color: '#ff7eb3' },
  { name: 'Everlink', subscribers: '9,012', mrr: '$99K', status: 'Scaling', growth: 92, color: '#64d8cb' },
];

export const WORKFLOW_NODES: WorkflowNode[] = [
  { label: 'KYC', icon: '\u2713', status: 'done' },
  { label: 'Provision', icon: '\u2713', status: 'done' },
  { label: 'SIM Assign', icon: '\u2713', status: 'done' },
  { label: 'Activate', icon: '\u27f3', status: 'active' },
  { label: 'Billing', icon: '\u2192', status: 'pending' },
];

export const PLAN_DISTRIBUTION: PlanDistribution[] = [
  { name: 'Unlimited', percentage: 42, color: '#00e5ff' },
  { name: '10GB', percentage: 28, color: '#00ff9d' },
  { name: '5GB', percentage: 18, color: '#ffb800' },
  { name: 'eSIM Only', percentage: 12, color: '#a78bfa' },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  { dot: 'green', brand: 'Bolt Mobile', text: '34 subscribers activated via T-Mobile wholesale', time: '2 min ago' },
  { dot: 'cyan', brand: 'Verdant Wireless', text: 'Plan catalog updated: 3 new SKUs deployed', time: '8 min ago' },
  { dot: 'amber', brand: 'NexGen Connect', text: 'Port-in batch #4821 processing (142 numbers)', time: '12 min ago' },
  { dot: 'green', brand: 'Prism Mobile', text: 'eSIM provisioning completed for 89 subscribers', time: '18 min ago' },
  { dot: 'cyan', brand: 'API Gateway', text: 'AT&T wholesale endpoint latency normalized', time: '24 min ago' },
  { dot: 'red', brand: 'Aura Connect', text: 'KYC verification timeout (3 records) \u2014 auto-retry queued', time: '31 min ago' },
  { dot: 'green', brand: 'Everlink', text: 'Brand program deployed to production environment', time: '45 min ago' },
];

export const CYCLING_ACTIVITIES: ActivityItem[] = [
  { dot: 'green', brand: 'Bolt Mobile', text: '12 eSIM activations completed', time: 'Just now' },
  { dot: 'cyan', brand: 'API Gateway', text: 'T-Mobile provisioning batch processed (0.8s)', time: 'Just now' },
  { dot: 'green', brand: 'Verdant Wireless', text: '28 subscribers migrated to new plan tier', time: 'Just now' },
  { dot: 'amber', brand: 'NexGen Connect', text: 'Usage threshold alert: 5 subscribers at 90% data', time: 'Just now' },
  { dot: 'cyan', brand: 'Prism Mobile', text: 'Billing cycle completed for 28,440 subscribers', time: 'Just now' },
  { dot: 'green', brand: 'Everlink', text: 'New brand SKU "Everlink Unlimited+" pushed to production', time: 'Just now' },
  { dot: 'red', brand: 'Aura Connect', text: 'SIM assignment retry succeeded (2/2 recovered)', time: 'Just now' },
  { dot: 'green', brand: 'Bolt Mobile', text: 'Port-in batch #4822 completed (67 numbers)', time: 'Just now' },
];

export const SUBSCRIBER_CHART_DATA = [
  { label: 'Mon', activations: 1842, portIns: 412 },
  { label: 'Tue', activations: 2104, portIns: 380 },
  { label: 'Wed', activations: 1956, portIns: 445 },
  { label: 'Thu', activations: 2341, portIns: 501 },
  { label: 'Fri', activations: 2780, portIns: 468 },
  { label: 'Sat', activations: 1680, portIns: 290 },
  { label: 'Sun', activations: 1420, portIns: 245 },
];
