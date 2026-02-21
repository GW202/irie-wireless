'use client';

import { Bell, Settings, Menu, Search } from 'lucide-react';

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <div className="py-3.5 px-7 border-b border-border flex items-center justify-between bg-[rgba(10,14,20,0.85)] backdrop-blur-[12px] sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center text-text-2"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div className="text-base font-semibold tracking-tight">Control Plane</div>
        <div className="font-mono text-[0.6rem] px-2 py-0.5 rounded bg-accent-green/10 text-accent-green uppercase tracking-[0.08em]">
          ● Production
        </div>
      </div>
      <div className="flex items-center gap-4">
        <input
          className="hidden sm:block py-1.5 px-3 bg-bg-2 border border-border rounded-md text-text-2 text-[0.78rem] font-display outline-none w-[200px] transition-colors placeholder:text-text-3 focus:border-accent-cyan"
          placeholder="Search subscribers, brands..."
          type="text"
        />
        <button className="sm:hidden w-8 h-8 rounded-md border border-border bg-bg-2 flex items-center justify-center cursor-pointer transition-all hover:border-border-light hover:bg-bg-3">
          <Search size={15} className="text-text-2" />
        </button>
        <div className="relative w-8 h-8 rounded-md border border-border bg-bg-2 flex items-center justify-center cursor-pointer transition-all hover:border-border-light hover:bg-bg-3">
          <Bell size={15} className="text-text-2" />
          <span className="absolute top-[5px] right-[5px] w-1.5 h-1.5 rounded-full bg-accent-red" />
        </div>
        <div className="w-8 h-8 rounded-md border border-border bg-bg-2 flex items-center justify-center cursor-pointer transition-all hover:border-border-light hover:bg-bg-3">
          <Settings size={15} className="text-text-2" />
        </div>
      </div>
    </div>
  );
}
