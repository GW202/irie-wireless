'use client';

import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import {
  Building2,
  Users,
  Shield,
  Plug,
  Bell,
  ScrollText,
  ChevronRight,
} from 'lucide-react';

const SECTIONS = [
  { icon: Building2, label: 'Tenant Management', description: 'Manage tenant profiles, configurations, and feature flags', href: '/platform/settings/tenant', color: 'text-accent-cyan' },
  { icon: Users, label: 'User Management', description: 'Manage platform users, roles, and tenant access', href: '/platform/settings/users', color: 'text-accent-green' },
  { icon: Shield, label: 'Role & Permissions', description: 'Configure RBAC roles and permission sets', href: '/platform/settings/roles', color: 'text-accent-amber' },
  { icon: Plug, label: 'Integrations', description: 'Carrier API connections, BSS adapters, and webhooks', href: '/platform/settings/integrations', color: 'text-accent-purple' },
  { icon: Bell, label: 'Notification Preferences', description: 'Configure alert thresholds and notification channels', href: '/platform/settings/notifications', color: 'text-accent-cyan' },
  { icon: ScrollText, label: 'Audit Log', description: 'View platform activity history and change tracking', href: '/platform/settings/audit-log', color: 'text-accent-green' },
];

export default function SettingsOverviewPage() {
  return (
    <div className="space-y-6">
      <p className="text-text-3 text-xs">Platform configuration and administration</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card hover>
              <CardBody>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-bg-3 border border-border flex items-center justify-center shrink-0">
                    <section.icon size={18} className={section.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{section.label}</p>
                    <p className="text-[11px] text-text-3">{section.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-text-3" />
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
