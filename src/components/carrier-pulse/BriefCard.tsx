'use client';

import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { formatDate } from '@/lib/carrier-pulse/formatters';

interface Brief {
  id: number;
  week_of: string;
  finding_count: number;
  lead_count: number;
  top_priorities: Array<{ title: string }> | string[] | null;
}

export default function BriefCard({ brief }: { brief: Brief }) {
  const router = useRouter();
  const priorities = Array.isArray(brief.top_priorities) ? brief.top_priorities : [];

  return (
    <div
      onClick={() => router.push(`/platform/services/carrier-pulse/briefs/${brief.id}`)}
      className="bg-bg-2 border border-border rounded-xl p-5 hover:border-accent-cyan/50 cursor-pointer transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-accent-cyan" />
          <span className="font-mono text-sm font-semibold">
            Week of {formatDate(brief.week_of)}
          </span>
        </div>
        <div className="flex gap-3 text-xs text-text-3">
          <span>{brief.finding_count} findings</span>
          <span>{brief.lead_count} leads</span>
        </div>
      </div>
      {priorities.length > 0 && (
        <ul className="space-y-1">
          {priorities.slice(0, 3).map((p, i) => (
            <li key={i} className="text-sm text-text-2 truncate">
              <span className="text-accent-cyan mr-1">{i + 1}.</span>
              {typeof p === 'string' ? p : p.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
