'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useAuth } from '@/hooks/useAuth';
import IrieLogo from '@/components/ui/IrieLogo';
import {
  Home,
  Radio,
  Activity,
  BarChart3,
  Bot,
  Search,
  Bell,
  FileText,
  Settings,
  X,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { PLATFORM_SERVICES } from '@/lib/services';

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  Radio: <Radio size={18} />,
  Activity: <Activity size={18} />,
  BarChart3: <BarChart3 size={18} />,
  Bot: <Bot size={18} />,
};

const STATUS_BADGES: Record<string, { label: string; className: string }> = {
  prod: { label: 'PROD', className: 'bg-accent-green/10 text-accent-green' },
  coming_soon: { label: 'SOON', className: 'bg-bg-4 text-text-3' },
  beta: { label: 'BETA', className: 'bg-accent-purple/10 text-accent-purple' },
};

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function PlatformSidebar({ mobileOpen, onMobileClose, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { checkPermission } = useAuth();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const NAV_ITEMS = [
    { icon: <Home size={18} />, label: 'Home', href: '/platform' },
  ];

  const BOTTOM_NAV = [
    { icon: <Search size={18} />, label: 'Search', href: '/platform/search' },
    { icon: <Bell size={18} />, label: 'Alerts', href: '/platform/alerts' },
    { icon: <FileText size={18} />, label: 'Reports', href: '/platform/reports' },
    { icon: <Settings size={18} />, label: 'Settings', href: '/platform/settings' },
  ];

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`p-6 flex items-center gap-3 ${collapsed ? 'justify-center px-3' : ''}`}>
        <div className="w-10 h-10 bg-accent-cyan rounded flex items-center justify-center shrink-0">
          <IrieLogo height={24} variant="icon" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-lg tracking-tight">
              IRIE<span className="text-accent-cyan">.</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text-3 font-mono">
              Platform
            </p>
          </div>
        )}
      </div>

      <nav className={`mt-2 flex-1 space-y-1 ${collapsed ? 'px-2' : 'px-4'}`}>
        {/* Main Nav */}
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={isMobile ? onMobileClose : undefined}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              collapsed ? 'justify-center' : ''
            } ${
              pathname === item.href
                ? 'bg-accent-cyan/10 text-accent-cyan font-medium'
                : 'text-text-2 hover:bg-white/5'
            }`}
          >
            <span className={pathname === item.href ? 'opacity-100' : 'opacity-60'}>{item.icon}</span>
            {!collapsed && <span className="text-sm">{item.label}</span>}
          </Link>
        ))}

        {/* Services Section */}
        <div className="pt-6">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-text-3 uppercase tracking-widest mb-2">
              Services
            </p>
          )}
          {collapsed && <div className="border-t border-border mb-2" />}
          {PLATFORM_SERVICES.map((service) => {
            const hasAccess = checkPermission(service.requiredPermission);
            const active = isActive(service.route);
            const badge = STATUS_BADGES[service.status];

            return (
              <Link
                key={service.slug}
                href={hasAccess ? service.route : '#'}
                onClick={isMobile ? onMobileClose : undefined}
                title={collapsed ? service.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  collapsed ? 'justify-center' : ''
                } ${
                  !hasAccess
                    ? 'text-text-3 opacity-40 cursor-not-allowed'
                    : active
                    ? 'bg-accent-cyan/10 text-accent-cyan font-medium'
                    : 'text-text-2 hover:bg-white/5'
                }`}
              >
                <span className={active ? 'opacity-100' : 'opacity-60'}>
                  {SERVICE_ICONS[service.icon] || <Radio size={18} />}
                </span>
                {!collapsed && <span className="text-sm flex-1">{service.name}</span>}
                {!collapsed && badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${badge.className}`}>
                    {badge.label}
                  </span>
                )}
                {!collapsed && active && <ChevronRight size={14} className="text-accent-cyan" />}
              </Link>
            );
          })}
        </div>

        {/* Bottom Nav */}
        <div className="pt-6">
          {!collapsed && (
            <p className="px-3 text-[10px] font-bold text-text-3 uppercase tracking-widest mb-2">
              Platform
            </p>
          )}
          {collapsed && <div className="border-t border-border mb-2" />}
          {BOTTOM_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? onMobileClose : undefined}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                collapsed ? 'justify-center' : ''
              } ${
                isActive(item.href)
                  ? 'bg-accent-cyan/10 text-accent-cyan font-medium'
                  : 'text-text-2 hover:bg-white/5'
              }`}
            >
              <span className={isActive(item.href) ? 'opacity-100' : 'opacity-60'}>{item.icon}</span>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Collapse toggle */}
      {!isMobile && (
        <div className={`p-4 border-t border-border ${collapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={onToggleCollapse}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-text-3 hover:bg-white/5 hover:text-text-2 transition-all w-full"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      )}
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
    <aside className={`${collapsed ? 'w-[68px]' : 'w-64'} bg-bg-1 border-r border-border fixed top-0 left-0 bottom-0 z-50 overflow-y-auto transition-all duration-200`}>
      {content}
    </aside>
  );
}
