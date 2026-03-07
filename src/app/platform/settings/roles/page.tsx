'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { ROLES } from '@/lib/auth';
import { Shield, Check } from 'lucide-react';

const PERMISSION_GROUPS = [
  { label: 'Platform', permissions: ['platform:admin', 'platform:read'] },
  { label: 'Tenants', permissions: ['tenant:manage', 'tenant:read'] },
  { label: 'Users', permissions: ['users:manage', 'users:read'] },
  { label: 'Roles', permissions: ['roles:manage'] },
  { label: 'Services', permissions: ['service:carrier-pulse', 'service:usage-engine', 'service:analytics', 'service:ai-support'] },
  { label: 'Settings', permissions: ['settings:manage', 'settings:read'] },
  { label: 'Reports', permissions: ['reports:read', 'reports:export'] },
  { label: 'Alerts', permissions: ['alerts:manage', 'alerts:read'] },
  { label: 'Other', permissions: ['audit:read', 'integrations:manage', 'search:global'] },
];

export default function RolesSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Roles & Permissions</h2>
        <p className="text-text-3 text-xs">Configure role-based access control for the platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ROLES.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <Shield size={16} className="text-accent-cyan" />
              {role.label}
            </CardHeader>
            <CardBody>
              <p className="text-xs text-text-3 mb-3">{role.description}</p>
              <div className="space-y-2">
                {PERMISSION_GROUPS.map((group) => {
                  const granted = group.permissions.filter((p) =>
                    role.permissions.includes(p as never)
                  );
                  if (granted.length === 0) return null;
                  return (
                    <div key={group.label}>
                      <p className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-1">{group.label}</p>
                      <div className="flex flex-wrap gap-1">
                        {granted.map((p) => (
                          <span key={p} className="text-[10px] font-mono px-1.5 py-0.5 bg-accent-cyan/5 text-accent-cyan rounded flex items-center gap-1">
                            <Check size={8} /> {p.split(':')[1]}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-[10px] font-mono text-text-3">
                  {role.permissions.length} permissions granted
                </span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
