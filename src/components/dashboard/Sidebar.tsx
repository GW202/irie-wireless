'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import IrieLogo from '@/components/ui/IrieLogo';
import {
  LayoutGrid,
  BarChart3,
  Settings2,
  Users,
  Briefcase,
  Wrench,
  Flag,
  CreditCard,
  Shield,
  X,
  Menu,
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  badgeVariant?: 'default' | 'warn' | 'live';
  onClick?: () => void;
}

function SidebarItem({ icon, label, active, badge, badgeVariant = 'default', onClick }: SidebarItemProps) {
  const badgeClasses = {
    default: 'bg-accent-cyan/10 text-accent-cyan',
    warn: 'bg-accent-amber/10 text-accent-amber',
    live: 'bg-accent-green/[0.12] text-accent-green',
  };

  return (
    <div
      className={`flex items-center gap-2.5 py-2 px-2.5 rounded-md text-[0.82rem] cursor-pointer transition-all duration-150 mb-0.5 relative ${
        active
          ? 'bg-accent-cyan/[0.08] text-accent-cyan'
          : 'text-text-2 hover:bg-bg-3 hover:text-text-1'
      }`}
      onClick={onClick}
    >
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-accent-cyan rounded-r-sm" />
      )}
      <span className={`w-4 h-4 shrink-0 ${active ? 'opacity-100' : 'opacity-60'}`}>{icon}</span>
      {label}
      {badge && (
        <span
          className={`ml-auto text-[0.6rem] font-mono px-1.5 py-0.5 rounded ${badgeClasses[badgeVariant]}`}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border flex items-center gap-2.5 font-bold text-[0.95rem] tracking-tight">
        <IrieLogo size={28} showText />
        <span className="ml-auto text-text-3 font-normal text-[0.7rem] font-mono">v2.4</span>
      </div>

      {/* Overview */}
      <div className="py-4 px-3">
        <div className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-text-3 px-2 mb-2">
          Overview
        </div>
        <SidebarItem icon={<LayoutGrid size={16} />} label="Dashboard" active onClick={onMobileClose} />
        <SidebarItem icon={<BarChart3 size={16} />} label="Analytics" onClick={onMobileClose} />
      </div>

      {/* Orchestration */}
      <div className="py-4 px-3">
        <div className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-text-3 px-2 mb-2">
          Orchestration
        </div>
        <SidebarItem
          icon={<Settings2 size={16} />}
          label="Carrier APIs"
          badge="3 live"
          badgeVariant="live"
          onClick={onMobileClose}
        />
        <SidebarItem icon={<Users size={16} />} label="Subscribers" badge="247K" onClick={onMobileClose} />
        <SidebarItem icon={<Briefcase size={16} />} label="Brand Programs" badge="8" onClick={onMobileClose} />
        <SidebarItem
          icon={<Wrench size={16} />}
          label="Workflows"
          badge="2 alerts"
          badgeVariant="warn"
          onClick={onMobileClose}
        />
      </div>

      {/* Infrastructure */}
      <div className="py-4 px-3">
        <div className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-text-3 px-2 mb-2">
          Infrastructure
        </div>
        <SidebarItem icon={<Flag size={16} />} label="BSS Integrations" onClick={onMobileClose} />
        <SidebarItem icon={<CreditCard size={16} />} label="SIM / eSIM" onClick={onMobileClose} />
        <SidebarItem icon={<Shield size={16} />} label="Security" onClick={onMobileClose} />
      </div>

      {/* User */}
      <div className="mt-auto p-4 border-t border-border">
        <div className="flex items-center gap-2.5 p-2 rounded-md">
          <div className="w-[30px] h-[30px] rounded-md bg-bg-4 flex items-center justify-center text-[0.65rem] font-semibold text-accent-cyan font-mono">
            GA
          </div>
          <div className="text-[0.75rem]">
            Greg A.
            <span className="block text-text-3 text-[0.6rem] font-mono">Platform Admin</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    if (!mobileOpen) return null;
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-[49]" onClick={onMobileClose} />
        <aside className="fixed top-0 left-0 bottom-0 w-60 bg-bg-1 border-r border-border z-50 overflow-y-auto animate-[fadeIn_0.2s_ease]">
          <button
            onClick={onMobileClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-text-2 z-10"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
          {content}
        </aside>
      </>
    );
  }

  return (
    <aside className="w-60 bg-bg-1 border-r border-border fixed top-0 left-0 bottom-0 z-50 overflow-y-auto">
      {content}
    </aside>
  );
}
