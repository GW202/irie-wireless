'use client';

import Link from 'next/link';
import { Radio, Activity, BarChart3, Bot, ArrowRight } from 'lucide-react';
import { ServiceDefinition } from '@/lib/types';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  Radio: <Radio size={24} />,
  Activity: <Activity size={24} />,
  BarChart3: <BarChart3 size={24} />,
  Bot: <Bot size={24} />,
};

const healthStyles: Record<string, { dot: string; label: string }> = {
  healthy: { dot: 'bg-accent-green', label: 'Healthy' },
  degraded: { dot: 'bg-accent-amber', label: 'Degraded' },
  down: { dot: 'bg-accent-red', label: 'Down' },
};

const statusBadges: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-accent-green/10 text-accent-green' },
  prod: { label: 'Prod', className: 'bg-accent-green/10 text-accent-green' },
  coming_soon: { label: 'Coming Soon', className: 'bg-bg-4 text-text-3' },
  beta: { label: 'Beta', className: 'bg-accent-purple/10 text-accent-purple' },
};

interface ServiceCardProps {
  service: ServiceDefinition;
  enabled: boolean;
}

export default function ServiceCard({ service, enabled }: ServiceCardProps) {
  const health = healthStyles[service.health];
  const badge = statusBadges[service.status];

  const card = (
    <div
      className={`bg-bg-2 rounded-xl border border-border p-6 transition-all ${
        enabled ? 'hover:border-border-light hover:shadow-lg cursor-pointer group' : 'opacity-50'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-bg-3 border border-border flex items-center justify-center text-accent-cyan">
          {SERVICE_ICONS[service.icon] || <Radio size={24} />}
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${badge.className}`}>
          {badge.label}
        </span>
      </div>
      <h3 className="font-bold text-sm mb-1">{service.name}</h3>
      <p className="text-text-3 text-xs leading-relaxed mb-4 line-clamp-2">{service.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${health.dot}`} />
          <span className="text-[10px] font-mono text-text-3">{health.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-text-3">v{service.version}</span>
          {enabled && (
            <ArrowRight size={14} className="text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>
    </div>
  );

  if (!enabled) return card;

  return <Link href={service.route}>{card}</Link>;
}
