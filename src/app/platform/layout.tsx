'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { TenantProvider } from '@/contexts/TenantContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { useAuth } from '@/hooks/useAuth';
import PlatformSidebar from '@/components/platform/PlatformSidebar';
import PlatformTopBar from '@/components/platform/PlatformTopBar';

function PlatformShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg-0 flex items-center justify-center">
        <div className="animate-pulse text-text-3 text-sm font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <TenantProvider>
      <NotificationProvider>
        <div className="flex min-h-screen overflow-x-hidden relative">
          <PlatformSidebar
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          />
          <div className={`${sidebarCollapsed ? 'md:ml-[68px]' : 'md:ml-64'} flex-1 min-h-screen flex flex-col transition-all duration-200`}>
            <PlatformTopBar onMenuClick={() => setMobileMenuOpen(true)} />
            <main className="p-8 max-sm:p-4 flex-1">{children}</main>
            <footer className="px-8 py-3 border-t border-border flex items-center justify-between text-[10px] font-mono text-text-3 bg-bg-0/50 max-sm:flex-col max-sm:gap-2 max-sm:py-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                  <span>PLATFORM_SHELL_v1</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                  <span>AUTH_LAYER</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                  <span>SERVICE_REGISTRY</span>
                </div>
              </div>
              <div>&copy; 2026 IRIE WIRELESS SYSTEMS &bull; PLATFORM SHELL</div>
            </footer>
          </div>
        </div>
      </NotificationProvider>
    </TenantProvider>
  );
}

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <PlatformShell>{children}</PlatformShell>;
}
