'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Settings,
  Building2,
  Users,
  Shield,
  Plug,
  Bell,
  ScrollText,
  Wrench,
} from 'lucide-react';

const SETTINGS_NAV = [
  { icon: Settings, label: 'Overview', href: '/platform/settings' },
  { icon: Building2, label: 'Tenant', href: '/platform/settings/tenant' },
  { icon: Users, label: 'Users', href: '/platform/settings/users' },
  { icon: Shield, label: 'Roles', href: '/platform/settings/roles' },
  { icon: Plug, label: 'Integrations', href: '/platform/settings/integrations' },
  { icon: Bell, label: 'Notifications', href: '/platform/settings/notifications' },
  { icon: ScrollText, label: 'Audit Log', href: '/platform/settings/audit-log' },
  { icon: Wrench, label: 'Admin', href: '/platform/settings/admin' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-8 max-lg:flex-col">
      <nav className="w-52 shrink-0 max-lg:w-full">
        <h1 className="text-xl font-bold tracking-tight mb-4">Settings</h1>
        <div className="flex flex-col gap-1 max-lg:flex-row max-lg:flex-wrap max-lg:gap-2">
          {SETTINGS_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-accent-cyan/10 text-accent-cyan font-medium'
                    : 'text-text-2 hover:bg-white/5'
                }`}
              >
                <item.icon size={16} className={active ? 'opacity-100' : 'opacity-50'} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
