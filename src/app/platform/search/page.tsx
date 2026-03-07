'use client';

import { useState } from 'react';
import SearchInput from '@/components/ui/SearchInput';
import Tabs from '@/components/ui/Tabs';
import { Card, CardBody } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import {
  Search,
  Radio,
  Activity,
  BarChart3,
  Bot,
  Users,
  Building2,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';

const SEARCH_RESULTS = [
  { type: 'brand', service: 'CarrierPulse', icon: Users, title: 'Bolt Mobile', description: 'Enterprise MVNO tenant with 89,241 subscribers', link: '/platform/services/carrier-pulse' },
  { type: 'brand', service: 'CarrierPulse', icon: Users, title: 'Verdant Wireless', description: 'Growth-tier MVNO with 64,102 subscribers', link: '/platform/services/carrier-pulse' },
  { type: 'alert', service: 'Platform', icon: AlertTriangle, title: 'Usage Spike - Bolt Mobile US-East', description: 'Data usage spiked 340% over 2 hours', link: '/platform/alerts' },
  { type: 'tenant', service: 'Platform', icon: Building2, title: 'NexGen Connect', description: 'Trial-tier Sub-MVNO tenant, US-Central region', link: '/platform/settings/tenant' },
  { type: 'service', service: 'Analytics', icon: BarChart3, title: 'February 2026 Analytics Report', description: 'Monthly analytics report ready for review', link: '/platform/reports' },
  { type: 'service', service: 'AI Support', icon: Bot, title: 'Plan Optimization Recommendation', description: '12% of subscribers eligible for tier migration', link: '/platform/services/ai-support' },
];

const TABS = [
  { id: 'all', label: 'All', count: 6 },
  { id: 'brands', label: 'Brands', count: 2 },
  { id: 'alerts', label: 'Alerts', count: 1 },
  { id: 'tenants', label: 'Tenants', count: 1 },
  { id: 'services', label: 'Services', count: 2 },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filtered = query.length > 0
    ? SEARCH_RESULTS.filter((r) =>
        (activeTab === 'all' || r.type === activeTab.replace(/s$/, '')) &&
        (r.title.toLowerCase().includes(query.toLowerCase()) ||
         r.description.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight mb-1">Global Search</h1>
        <p className="text-text-3 text-xs">Search across all services, tenants, brands, and platform data</p>
      </div>

      <SearchInput
        placeholder="Search brands, findings, briefs, devices, usage anomalies, reports..."
        value={query}
        onChange={setQuery}
        className="max-w-2xl"
      />

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {query.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Start searching"
          description="Type to search across CarrierPulse, Usage Engine, Analytics, AI Support, and platform data"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`No results matching "${query}" in ${activeTab === 'all' ? 'any category' : activeTab}`}
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((result, i) => (
            <Card key={i} hover>
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-bg-3 border border-border flex items-center justify-center shrink-0">
                    <result.icon size={16} className="text-accent-cyan" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{result.title}</p>
                    <p className="text-[11px] text-text-3">{result.description}</p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-bg-3 text-text-3 rounded shrink-0">
                    {result.service}
                  </span>
                  <ExternalLink size={14} className="text-text-3 shrink-0" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
