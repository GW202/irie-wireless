'use client';

import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export default function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 border-b border-border', className || '')}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2.5 text-xs font-medium transition-colors relative',
            activeTab === tab.id
              ? 'text-accent-cyan'
              : 'text-text-3 hover:text-text-2'
          )}
        >
          <span className="flex items-center gap-2">
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                'px-1.5 py-0.5 rounded text-[10px] font-mono',
                activeTab === tab.id ? 'bg-accent-cyan/10 text-accent-cyan' : 'bg-bg-3 text-text-3'
              )}>
                {tab.count}
              </span>
            )}
          </span>
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-px bg-accent-cyan" />
          )}
        </button>
      ))}
    </div>
  );
}
