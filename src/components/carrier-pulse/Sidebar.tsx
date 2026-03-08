'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Search,
  ListChecks,
  TrendingUp,
  Settings,
  Users,
  UserCircle,
} from 'lucide-react';

const BASE_PATH = '/platform/services/carrier-pulse';

const navItems = [
  { to: '', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/briefs', icon: FileText, label: 'Briefs' },
  { to: '/findings', icon: Search, label: 'Findings' },
  { to: '/actions', icon: ListChecks, label: 'Actions' },
  { to: '/trends', icon: TrendingUp, label: 'Trends' },
  { to: '/leads', icon: UserCircle, label: 'Leads' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-bg-surface border-r border-border flex flex-col shrink-0">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold font-mono text-accent">CarrierPulse</h1>
        <p className="text-xs text-text-muted mt-0.5">AI Telecom News Agent</p>
      </div>
      <nav className="flex-1 py-2">
        {navItems.map((item) => {
          const href = `${BASE_PATH}${item.to}`;
          const isActive =
            item.to === ''
              ? pathname === BASE_PATH
              : pathname.startsWith(href);

          return (
            <Link
              key={item.to}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? 'bg-accent/10 text-accent border-r-2 border-accent'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <p className="text-xs text-text-muted">v1.0 — CarrierPulse</p>
      </div>
    </aside>
  );
}
