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
    <div className="flex min-h-screen overflow-x-hidden">
      <Sidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
      <div className="md:ml-60 flex-1 min-h-screen">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="p-7 max-sm:p-4">{children}</main>
      </div>
    </div>
  );
}
