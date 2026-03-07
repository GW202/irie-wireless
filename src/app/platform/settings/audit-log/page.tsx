'use client';

import { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import SearchInput from '@/components/ui/SearchInput';
import { MOCK_AUDIT_LOG } from '@/lib/mock-data/audit-log';
import { AuditLogEntry } from '@/lib/types';
import { ScrollText } from 'lucide-react';

const actionStyles: Record<string, string> = {
  'user.login': 'bg-accent-cyan/10 text-accent-cyan',
  'user.role_change': 'bg-accent-amber/10 text-accent-amber',
  'user.invite': 'bg-accent-green/10 text-accent-green',
  'tenant.config_update': 'bg-accent-purple/10 text-accent-purple',
  'tenant.create': 'bg-accent-green/10 text-accent-green',
  'service.enable': 'bg-accent-cyan/10 text-accent-cyan',
  'report.export': 'bg-accent-cyan/10 text-accent-cyan',
  'alert.dismiss': 'bg-accent-amber/10 text-accent-amber',
  'integration.update': 'bg-accent-purple/10 text-accent-purple',
  'data.export': 'bg-accent-cyan/10 text-accent-cyan',
};

const columns = [
  {
    key: 'timestamp',
    label: 'Time',
    render: (row: AuditLogEntry) => (
      <span className="text-xs font-mono text-text-3">
        {new Date(row.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </span>
    ),
  },
  {
    key: 'userName',
    label: 'User',
    render: (row: AuditLogEntry) => <span className="text-xs font-medium">{row.userName}</span>,
  },
  {
    key: 'action',
    label: 'Action',
    render: (row: AuditLogEntry) => (
      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${actionStyles[row.action] || 'bg-bg-3 text-text-3'}`}>
        {row.action}
      </span>
    ),
  },
  {
    key: 'details',
    label: 'Details',
    render: (row: AuditLogEntry) => <span className="text-xs text-text-2">{row.details}</span>,
  },
  {
    key: 'ipAddress',
    label: 'IP',
    align: 'right' as const,
    render: (row: AuditLogEntry) => <span className="text-[10px] font-mono text-text-3">{row.ipAddress}</span>,
  },
];

export default function AuditLogPage() {
  const [search, setSearch] = useState('');

  const filtered = MOCK_AUDIT_LOG.filter(
    (entry) =>
      entry.userName.toLowerCase().includes(search.toLowerCase()) ||
      entry.action.toLowerCase().includes(search.toLowerCase()) ||
      entry.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Audit Log</h2>
        <p className="text-text-3 text-xs">Platform activity history and change tracking</p>
      </div>

      <SearchInput
        placeholder="Filter by user, action, or details..."
        value={search}
        onChange={setSearch}
        className="max-w-md"
      />

      <Card>
        <CardHeader>
          <ScrollText size={16} className="text-accent-cyan" />
          Activity Log ({filtered.length} entries)
        </CardHeader>
        <Table columns={columns} data={filtered as AuditLogEntry[]} />
      </Card>
    </div>
  );
}
