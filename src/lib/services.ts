import { ServiceDefinition } from './types';

export const PLATFORM_SERVICES: ServiceDefinition[] = [
  {
    name: 'CarrierPulse',
    slug: 'carrier-pulse',
    description: 'AI-powered telecom market and brand intelligence. Digital twins, research orchestration, findings, briefs, and trend analysis.',
    icon: 'Radio',
    route: '/platform/services/carrier-pulse',
    requiredPermission: 'service:carrier-pulse',
    health: 'healthy',
    version: '1.0.0',
    status: 'active',
  },
  {
    name: 'Usage Engine',
    slug: 'usage-engine',
    description: 'Telecom usage processing and visibility. Ingestion, normalization, real-time processing, anomaly detection, and forecasting.',
    icon: 'Activity',
    route: '/platform/services/usage-engine',
    requiredPermission: 'service:usage-engine',
    health: 'healthy',
    version: '0.9.0',
    status: 'coming_soon',
  },
  {
    name: 'Analytics Engine',
    slug: 'analytics',
    description: 'Turn raw operational data into decision-grade metrics. KPI engine, dashboards, reports, benchmarks, and exports.',
    icon: 'BarChart3',
    route: '/platform/services/analytics',
    requiredPermission: 'service:analytics',
    health: 'healthy',
    version: '0.8.0',
    status: 'coming_soon',
  },
  {
    name: 'AI Support',
    slug: 'ai-support',
    description: 'AI assistant for telecom operations and insight. Knowledge retrieval, troubleshooting, predictive recommendations, and incident explanation.',
    icon: 'Bot',
    route: '/platform/services/ai-support',
    requiredPermission: 'service:ai-support',
    health: 'healthy',
    version: '0.7.0',
    status: 'beta',
  },
];

export function getServiceBySlug(slug: string): ServiceDefinition | undefined {
  return PLATFORM_SERVICES.find((s) => s.slug === slug);
}
