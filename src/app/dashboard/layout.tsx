'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen overflow-x-hidden relative">
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
      <div className="md:ml-64 flex-1 min-h-screen flex flex-col">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-8 max-sm:p-4 flex-1">{children}</main>

        {/* Dashboard Footer */}
        <footer className="px-8 py-3 border-t border-border flex items-center justify-between text-[10px] font-mono text-text-3 bg-bg-0/50 max-sm:flex-col max-sm:gap-2 max-sm:py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              <span>API_v4_STABLE</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              <span>NORM_CORE_v2</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-amber" />
              <span>LEGACY_BRIDGE</span>
            </div>
          </div>
          <div>&copy; 2026 IRIE WIRELESS SYSTEMS &bull; US-EAST-1 &bull; CLUSTER_A_42</div>
        </footer>
      </div>

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="scanline" />
      </div>
    </div>
  );
}
