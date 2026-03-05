'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import IrieLogo from '@/components/ui/IrieLogo';
import {
  LayoutGrid,
  BarChart3,
  Network,
  GitBranch,
  Briefcase,
  CreditCard,
  Key,
  Settings,
  X,
  LogOut,
  Menu,
} from 'lucide-react';

interface SidebarNavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const MAIN_NAV: SidebarNavItem[] = [
  { icon: <LayoutGrid size={18} />, label: 'Dashboard', active: true },
  { icon: <BarChart3 size={18} />, label: 'Real-time Analytics' },
  { icon: <Network size={18} />, label: 'Provider Adapters' },
  { icon: <GitBranch size={18} />, label: 'Transformation Map' },
];

const NETWORK_NAV: SidebarNavItem[] = [
  { icon: <Briefcase size={18} />, label: 'Tenant Brands' },
  { icon: <CreditCard size={18} />, label: 'Inventory (SIM/eSIM)' },
];

const SECURITY_NAV: SidebarNavItem[] = [
  { icon: <Key size={18} />, label: 'API Credentials' },
  { icon: <Settings size={18} />, label: 'System Config' },
];

function NavItem({ icon, label, active }: SidebarNavItem) {
  return (
    <a
      href="#"
      className={`flex items-center gap-3 px-3 py-2.5 transition-all ${
        active
          ? 'bg-accent-cyan/10 text-accent-cyan border-l-2 border-accent-cyan font-medium'
          : 'text-text-2 hover:bg-white/5'
      }`}
    >
      <span className={active ? 'opacity-100' : 'opacity-60'}>{icon}</span>
      <span className="text-sm">{label}</span>
    </a>
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
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-accent-cyan rounded flex items-center justify-center">
          <span className="text-bg-0 font-black text-xl tracking-tighter">IW</span>
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">
            IRIE<span className="text-accent-cyan">.</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-3 font-mono">
            Control Plane
          </p>
        </div>
      </div>

      <nav className="mt-4 px-4 space-y-1 flex-1">
        <p className="px-3 text-[10px] font-bold text-text-3 uppercase tracking-widest mb-2">
          Main Navigation
        </p>
        {MAIN_NAV.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}

        <div className="pt-6">
          <p className="px-3 text-[10px] font-bold text-text-3 uppercase tracking-widest mb-2">
            Network Assets
          </p>
          {NETWORK_NAV.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>

        <div className="pt-6">
          <p className="px-3 text-[10px] font-bold text-text-3 uppercase tracking-widest mb-2">
            Security
          </p>
          {SECURITY_NAV.map((item) => (
            <NavItem key={item.label} {...item} />
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 bg-bg-3/50 p-3 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-bg-4 flex items-center justify-center text-xs font-semibold text-accent-cyan font-mono shrink-0">
            AC
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold truncate">Alex Chen</p>
            <p className="text-[10px] text-text-3 font-mono">ADMIN_ROLE_01</p>
          </div>
          <button className="text-text-3 hover:text-text-1">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    if (!mobileOpen) return null;
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-[49]" onClick={onMobileClose} />
        <aside className="fixed top-0 left-0 bottom-0 w-64 bg-bg-1 border-r border-border z-50 overflow-y-auto animate-[fadeIn_0.2s_ease]">
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
    <aside className="w-64 bg-bg-1 border-r border-border fixed top-0 left-0 bottom-0 z-50 overflow-y-auto">
      {content}
    </aside>
  );
}
