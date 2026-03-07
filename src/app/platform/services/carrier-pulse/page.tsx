'use client';

import { Search, AlertTriangle, ListChecks, Activity } from 'lucide-react';
import { useDashboard } from '@/hooks/carrier-pulse/useDashboard';
import { useFindings } from '@/hooks/carrier-pulse/useFindings';
import StatCard from '@/components/carrier-pulse/StatCard';
import FindingRow from '@/components/carrier-pulse/FindingRow';
import CategoryBarChart from '@/components/carrier-pulse/charts/CategoryBarChart';

export default function CarrierPulseDashboard() {
  const { data, isLoading } = useDashboard();
  const { data: highFindings } = useFindings({ relevance: 'high', limit: 5 });

  if (isLoading) return <DashboardSkeleton />;
  if (!data) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = data as any;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Findings This Week" value={d.total_findings_this_week} icon={Search} />
        <StatCard label="High Priority" value={d.high_priority_count} icon={AlertTriangle} color="text-accent-red" />
        <StatCard label="Open Actions" value={d.open_actions_count} icon={ListChecks} color="text-accent-amber" />
        <StatCard label="Runs This Month" value={d.runs_this_month} icon={Activity} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top priorities */}
        <div className="bg-bg-2 border border-border rounded-xl p-5">
          <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-4">
            Top Priorities
          </h3>
          {d.top_priorities && d.top_priorities.length > 0 ? (
            <ul className="space-y-4">
              {d.top_priorities.map((p: { title: string; so_what?: string }, i: number) => (
                <li key={i} className="flex gap-3">
                  <span className="text-accent-cyan font-mono font-bold text-lg shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{p.title}</p>
                    {p.so_what && <p className="text-xs text-text-3 mt-1">{p.so_what}</p>}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-text-3">
              No priorities yet. Run the agent to generate the first brief.
            </p>
          )}
        </div>

        {/* Category chart */}
        <div className="bg-bg-2 border border-border rounded-xl p-5">
          <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-4">
            Findings by Category
          </h3>
          <CategoryBarChart data={d.findings_by_category} />
        </div>
      </div>

      {/* High relevance findings */}
      <div className="bg-bg-2 border border-border rounded-xl">
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest">
            High-Priority Findings
          </h3>
        </div>
        {highFindings && (highFindings as unknown[]).length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (highFindings as any[]).map((f: any) => <FindingRow key={f.id} finding={f} />)
        ) : (
          <p className="px-5 py-6 text-sm text-text-3">No high-priority findings yet.</p>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-bg-2 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-bg-2 rounded-xl animate-pulse" />
        <div className="h-64 bg-bg-2 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
