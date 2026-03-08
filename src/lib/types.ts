// ---- Existing Dashboard Types ----

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

// ---- Platform Shell Types ----

export type RoleName =
  | 'superadmin'
  | 'tenant_admin'
  | 'analyst'
  | 'operator'
  | 'finance'
  | 'support'
  | 'viewer';

export type Permission =
  | 'platform:admin'
  | 'platform:read'
  | 'tenant:manage'
  | 'tenant:read'
  | 'users:manage'
  | 'users:read'
  | 'roles:manage'
  | 'service:carrier-pulse'
  | 'service:usage-engine'
  | 'service:analytics'
  | 'service:ai-support'
  | 'settings:manage'
  | 'settings:read'
  | 'audit:read'
  | 'reports:read'
  | 'reports:export'
  | 'alerts:manage'
  | 'alerts:read'
  | 'integrations:manage'
  | 'search:global';

export interface Role {
  id: string;
  name: RoleName;
  label: string;
  description: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  tenantIds: string[];
  avatarUrl?: string;
  lastLogin: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Session {
  user: User;
  activeTenantId: string;
  loginAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  industry: string;
  region: string;
  subscriptionTier: 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'suspended' | 'trial';
  createdAt: string;
  enabledServices: string[];
  config: TenantConfig;
}

export interface TenantConfig {
  primaryColor?: string;
  logoUrl?: string;
  features: Record<string, boolean>;
  carriers: string[];
  timezone: string;
  dataRetentionDays: number;
}

export type ServiceHealth = 'healthy' | 'degraded' | 'down';

export interface ServiceDefinition {
  name: string;
  slug: string;
  description: string;
  icon: string;
  route: string;
  requiredPermission: Permission;
  health: ServiceHealth;
  version: string;
  status: 'active' | 'coming_soon' | 'beta' | 'prod';
}

export type NotificationSeverity = 'info' | 'warning' | 'critical' | 'success';

export interface PlatformNotification {
  id: string;
  tenantId: string;
  type: string;
  severity: NotificationSeverity;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  deepLink?: string;
  service?: string;
}

export interface AuditLogEntry {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

// ---- Canonical Telecom Data Model ----

export interface TenantEntity {
  tenant_id: string;
  tenant_name: string;
  industry: string;
  region: string;
  subscription_tier: 'starter' | 'growth' | 'enterprise';
  created_at: string;
  status: 'active' | 'suspended' | 'trial';
}

export interface DeviceEntity {
  device_id: string;
  tenant_id: string;
  imei: string;
  device_type: 'smartphone' | 'tablet' | 'iot' | 'hotspot' | 'wearable';
  manufacturer: string;
  model: string;
  firmware_version: string;
  status: 'active' | 'inactive' | 'suspended' | 'decommissioned';
  assigned_sim?: string;
  activation_date: string;
}

export interface SIMEntity {
  sim_id: string;
  tenant_id: string;
  iccid: string;
  imsi: string;
  carrier_id: string;
  status: 'active' | 'inactive' | 'suspended' | 'porting';
  activation_date: string;
  assigned_device?: string;
  plan_id: string;
  region: string;
}

export interface CarrierEntity {
  carrier_id: string;
  carrier_name: string;
  region: string;
  network_type: '4G' | '5G' | 'LTE' | 'mixed';
  api_provider: string;
  status: 'online' | 'degraded' | 'offline';
}

export interface UsageEvent {
  usage_id: string;
  tenant_id: string;
  device_id: string;
  sim_id: string;
  carrier_id: string;
  timestamp: string;
  usage_type: 'data' | 'voice' | 'sms' | 'roaming';
  data_volume_mb?: number;
  session_duration_sec?: number;
  region: string;
  roaming: boolean;
}

export interface BillingRecord {
  billing_id: string;
  tenant_id: string;
  carrier_id: string;
  device_id: string;
  sim_id: string;
  usage_id?: string;
  cost: number;
  currency: string;
  billing_period: string;
  rate_plan: string;
}

export interface DeviceTelemetry {
  telemetry_id: string;
  device_id: string;
  tenant_id: string;
  timestamp: string;
  signal_strength_dbm: number;
  latency_ms: number;
  packet_loss_pct: number;
  network_type: string;
  location?: { lat: number; lng: number };
}

export interface AlertEntity {
  alert_id: string;
  tenant_id: string;
  device_id?: string;
  sim_id?: string;
  alert_type: 'usage_spike' | 'connectivity_loss' | 'billing_anomaly' | 'security_threat' | 'carrier_outage' | 'threshold_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  description: string;
  status: 'open' | 'acknowledged' | 'resolved' | 'dismissed';
}

export interface AnalyticsMetric {
  metric_id: string;
  tenant_id: string;
  metric_type: 'subscriber_count' | 'revenue' | 'churn_rate' | 'arpu' | 'data_usage' | 'activation_rate' | 'port_in_rate';
  value: number;
  timestamp: string;
  dimension?: string;
  aggregation_level: 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export interface CarrierIntelligence {
  intelligence_id: string;
  carrier_id: string;
  event_type: 'rate_change' | 'coverage_update' | 'outage' | 'regulatory' | 'partnership' | 'technology_update';
  timestamp: string;
  region: string;
  description: string;
  impact_level: 'low' | 'medium' | 'high';
  source: string;
}
