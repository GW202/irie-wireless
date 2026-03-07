'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import { MOCK_TENANTS } from '@/lib/mock-data/tenants';
import { Tenant } from '@/lib/types';
import { Building2 } from 'lucide-react';

const columns = [
  {
    key: 'name',
    label: 'Tenant',
    render: (row: Tenant) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-bg-3 border border-border flex items-center justify-center text-xs font-bold">
          {row.name[0]}
        </div>
        <div>
          <p className="text-sm font-medium">{row.name}</p>
          <p className="text-[10px] text-text-3 font-mono">{row.slug}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'industry',
    label: 'Industry',
    render: (row: Tenant) => <span className="text-xs font-mono text-text-2">{row.industry}</span>,
  },
  {
    key: 'region',
    label: 'Region',
    render: (row: Tenant) => <span className="text-xs text-text-2">{row.region}</span>,
  },
  {
    key: 'subscriptionTier',
    label: 'Tier',
    render: (row: Tenant) => {
      const colors: Record<string, string> = {
        enterprise: 'bg-accent-cyan/10 text-accent-cyan',
        growth: 'bg-accent-green/10 text-accent-green',
        starter: 'bg-accent-amber/10 text-accent-amber',
      };
      return (
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${colors[row.subscriptionTier] || ''}`}>
          {row.subscriptionTier}
        </span>
      );
    },
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: Tenant) => {
      const colors: Record<string, string> = {
        active: 'bg-accent-green/10 text-accent-green',
        trial: 'bg-accent-amber/10 text-accent-amber',
        suspended: 'bg-accent-red/10 text-accent-red',
      };
      return (
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${colors[row.status] || ''}`}>
          {row.status}
        </span>
      );
    },
  },
  {
    key: 'enabledServices',
    label: 'Services',
    render: (row: Tenant) => (
      <span className="text-xs text-text-3">{row.enabledServices.length} enabled</span>
    ),
  },
];

export default function TenantSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Tenant Management</h2>
        <p className="text-text-3 text-xs">Manage tenant profiles, configurations, and service enablement</p>
      </div>

      <Card>
        <CardHeader action={
          <button className="text-xs text-accent-cyan font-medium hover:underline">+ Add Tenant</button>
        }>
          <Building2 size={16} className="text-accent-cyan" />
          Tenants
        </CardHeader>
        <Table columns={columns} data={MOCK_TENANTS as Tenant[]} />
      </Card>
    </div>
  );
}
