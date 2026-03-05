'use client';

import { Bell, Menu, Search, Terminal } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <div className="sticky top-0 z-40 bg-[rgba(5,7,10,0.8)] backdrop-blur-md border-b border-border px-8 py-4 flex items-center justify-between max-sm:px-4">
      <div className="flex items-center gap-4 flex-1">
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center text-text-2"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            className="w-full bg-white/5 border-none rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-accent-cyan/50 placeholder:text-text-3 text-text-1"
            placeholder="Search canonical objects, tenants, or adapters..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-text-3">
            System Healthy
          </span>
        </div>
        <div className="hidden sm:block h-6 w-px bg-border" />
        <button className="relative text-text-3 hover:text-accent-cyan">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-red rounded-full border-2 border-bg-0" />
        </button>
        <div className="h-8 w-8 rounded bg-accent-cyan/10 flex items-center justify-center text-accent-cyan">
          <Terminal size={18} />
        </div>
      </div>
    </div>
  );
}
