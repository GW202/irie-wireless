'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  color?: string;
}

export default function StatCard({ label, value, icon: Icon, color = 'text-accent-cyan' }: StatCardProps) {
  return (
    <div className="bg-bg-2 border border-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-1">{label}</p>
          <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
        </div>
        {Icon && <Icon size={20} className="text-text-3" />}
      </div>
    </div>
  );
}
