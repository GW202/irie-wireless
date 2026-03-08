'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Radio,
  LayoutDashboard,
  Search,
  BookOpen,
  TrendingUp,
  Target,
  Users,
  UserCircle,
  Settings,
  Clock,
} from 'lucide-react';
import RunAgentButton from '@/components/carrier-pulse/RunAgentButton';

const CP_TABS = [
  { href: '/platform/services/carrier-pulse', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/platform/services/carrier-pulse/findings', label: 'Findings', icon: Search },
  { href: '/platform/services/carrier-pulse/briefs', label: 'Briefs', icon: BookOpen },
  { href: '/platform/services/carrier-pulse/trends', label: 'Trends', icon: TrendingUp },
  { href: '/platform/services/carrier-pulse/actions', label: 'Actions', icon: Target },
  { href: '/platform/services/carrier-pulse/leads', label: 'Leads', icon: UserCircle },
  { href: '/platform/services/carrier-pulse/users', label: 'Users', icon: Users },
  { href: '/platform/services/carrier-pulse/settings', label: 'Settings', icon: Settings },
];

export default function CarrierPulseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
            <Radio size={20} className="text-accent-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">CarrierPulse</h1>
            <p className="text-text-3 text-xs">AI-Powered Brand Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RunAgentButton />
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded">
            <Clock size={10} /> v1.0.0
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 bg-accent-green/10 text-accent-green rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green" /> Healthy
          </span>
        </div>
      </div>

      {/* Tab navigation */}
      <nav className="flex gap-1 border-b border-border">
        {CP_TABS.map((tab) => {
          const isActive =
            tab.href === '/platform/services/carrier-pulse'
              ? pathname === tab.href
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-accent-cyan text-accent-cyan'
                  : 'border-transparent text-text-3 hover:text-text-1 hover:border-border'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Page content */}
      {children}
    </div>
  );
}
