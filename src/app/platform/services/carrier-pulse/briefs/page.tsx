'use client';

import { useBriefs } from '@/hooks/carrier-pulse/useBriefs';
import BriefCard from '@/components/carrier-pulse/BriefCard';

export default function BriefsPage() {
  const { data: briefs, isLoading } = useBriefs();

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-bg-2 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : briefs && (briefs as unknown[]).length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(briefs as any[]).map((brief: any) => (
            <BriefCard key={brief.id} brief={brief} />
          ))}
        </div>
      ) : (
        <div className="bg-bg-2 border border-border rounded-xl p-8 text-center">
          <p className="text-text-3">No briefs generated yet.</p>
          <p className="text-sm text-text-3 mt-1">
            Run the agent to generate your first weekly intelligence brief.
          </p>
        </div>
      )}
    </div>
  );
}
