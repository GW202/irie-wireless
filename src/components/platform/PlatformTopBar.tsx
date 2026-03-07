'use client';

import { Menu } from 'lucide-react';
import TenantSwitcher from './TenantSwitcher';
import NotificationCenter from './NotificationCenter';
import UserMenu from './UserMenu';
import EnvironmentIndicator from './EnvironmentIndicator';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function PlatformTopBar({ onMenuClick }: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-[rgba(5,7,10,0.8)] backdrop-blur-md border-b border-border px-8 py-3 flex items-center justify-between max-sm:px-4">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center text-text-2"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <EnvironmentIndicator />
      </div>

      <div className="flex items-center gap-4">
        <TenantSwitcher />
        <div className="h-6 w-px bg-border hidden sm:block" />
        <NotificationCenter />
        <UserMenu />
      </div>
    </div>
  );
}
