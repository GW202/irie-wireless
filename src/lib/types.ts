export interface StatCardData {
  label: string;
  value: string;
  change: string;
  changeDetail: string;
  color: 'cyan' | 'green' | 'amber' | 'purple';
  sparklineData: number[];
}

export interface CarrierData {
  code: string;
  name: string;
  latency: string;
  subscribers: string;
  status: 'online' | 'degraded' | 'offline';
  color: string;
  bgColor: string;
}

export interface BrandData {
  name: string;
  subscribers: string;
  mrr: string;
  status: 'Active' | 'Scaling' | 'Paused';
  growth: number;
  color: string;
}

export interface ActivityItem {
  dot: 'cyan' | 'green' | 'amber' | 'red';
  brand: string;
  text: string;
  time: string;
}

export interface WorkflowNode {
  label: string;
  icon: string;
  status: 'done' | 'active' | 'pending';
}

export interface PlanDistribution {
  name: string;
  percentage: number;
  color: string;
}

export interface GlobeCountry {
  name: string;
  detail: string;
  lat: number;
  lng: number;
  r: number;
  region: 'na' | 'sa' | 'eu' | 'af' | 'as' | 'oc';
}

export interface ContactFormData {
  name: string;
  business: string;
  email: string;
  phone?: string;
  type: string;
  notes?: string;
}

export interface SidebarItem {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
  badgeVariant?: 'default' | 'warn' | 'live';
}
