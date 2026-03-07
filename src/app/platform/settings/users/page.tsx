'use client';

import { Card, CardHeader } from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Avatar from '@/components/ui/Avatar';
import { MOCK_USERS } from '@/lib/mock-data/users';
import { MOCK_TENANTS } from '@/lib/mock-data/tenants';
import { User } from '@/lib/types';
import { getRoleByName } from '@/lib/auth';
import { Users } from 'lucide-react';

const columns = [
  {
    key: 'name',
    label: 'User',
    render: (row: User) => (
      <div className="flex items-center gap-3">
        <Avatar name={row.name} size="sm" />
        <div>
          <p className="text-sm font-medium">{row.name}</p>
          <p className="text-[10px] text-text-3">{row.email}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'role',
    label: 'Role',
    render: (row: User) => {
      const role = getRoleByName(row.role);
      return <span className="text-xs font-mono text-text-2">{role?.label || row.role}</span>;
    },
  },
  {
    key: 'tenantIds',
    label: 'Tenants',
    render: (row: User) => (
      <div className="flex flex-wrap gap-1">
        {row.tenantIds.map((id) => {
          const tenant = MOCK_TENANTS.find((t) => t.id === id);
          return (
            <span key={id} className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-3 text-text-3 rounded">
              {tenant?.name || id}
            </span>
          );
        })}
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    render: (row: User) => (
      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
        row.status === 'active' ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'
      }`}>
        {row.status}
      </span>
    ),
  },
  {
    key: 'lastLogin',
    label: 'Last Login',
    render: (row: User) => (
      <span className="text-xs text-text-3 font-mono">
        {new Date(row.lastLogin).toLocaleDateString()}
      </span>
    ),
  },
];

export default function UsersSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">User Management</h2>
        <p className="text-text-3 text-xs">Manage platform users, role assignments, and tenant access</p>
      </div>

      <Card>
        <CardHeader action={
          <button className="text-xs text-accent-cyan font-medium hover:underline">+ Invite User</button>
        }>
          <Users size={16} className="text-accent-cyan" />
          Users ({MOCK_USERS.length})
        </CardHeader>
        <Table columns={columns} data={MOCK_USERS as User[]} />
      </Card>
    </div>
  );
}
