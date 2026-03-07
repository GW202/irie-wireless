'use client';

import { use } from 'react';
import Markdown from 'react-markdown';
import { useBrief, useBriefFindings } from '@/hooks/carrier-pulse/useBriefs';
import FindingRow from '@/components/carrier-pulse/FindingRow';
import { formatDate } from '@/lib/carrier-pulse/formatters';

export default function BriefViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: brief, isLoading } = useBrief(id);
  const { data: findings } = useBriefFindings(id);

  if (isLoading) {
    return <div className="h-96 bg-bg-2 rounded-xl animate-pulse" />;
  }

  if (!brief) {
    return <p className="text-text-3">Brief not found.</p>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const b = brief as any;
  const recommendations = Array.isArray(b.recommendations) ? b.recommendations : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold font-mono">
          Brief &mdash; Week of {formatDate(b.week_of)}
        </h2>
        <div className="flex gap-4 text-sm text-text-3">
          <span>{b.finding_count} findings</span>
          <span>{b.lead_count} leads</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main brief content */}
        <div className="lg:col-span-2 bg-bg-2 border border-border rounded-xl p-6">
          <div
            className="prose prose-invert prose-sm max-w-none
              [&_h1]:text-lg [&_h1]:font-bold [&_h1]:font-mono [&_h1]:mt-6 [&_h1]:mb-3
              [&_h2]:text-base [&_h2]:font-bold [&_h2]:font-mono [&_h2]:text-accent-cyan [&_h2]:mt-5 [&_h2]:mb-2
              [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
              [&_p]:text-text-2 [&_p]:leading-relaxed [&_p]:mb-3
              [&_ul]:text-text-2 [&_li]:mb-1
              [&_strong]:text-text-1
              [&_a]:text-accent-cyan [&_a]:no-underline hover:[&_a]:underline"
          >
            <Markdown>{b.brief_markdown}</Markdown>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-bg-2 border border-border rounded-xl p-4">
            <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-3">
              Metadata
            </h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-text-3">Week</dt>
                <dd>{formatDate(b.week_of)}</dd>
              </div>
              <div>
                <dt className="text-text-3">Findings</dt>
                <dd>{b.finding_count}</dd>
              </div>
              <div>
                <dt className="text-text-3">Leads Detected</dt>
                <dd>{b.lead_count}</dd>
              </div>
              <div>
                <dt className="text-text-3">Generated</dt>
                <dd>{formatDate(b.created_at)}</dd>
              </div>
            </dl>
          </div>

          {recommendations.length > 0 && (
            <div className="bg-bg-2 border border-border rounded-xl p-4">
              <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-3">
                Recommendations
              </h3>
              <ul className="space-y-2">
                {recommendations.map((r: { action: string; based_on?: string }, i: number) => (
                  <li key={i} className="text-sm">
                    <p>{r.action}</p>
                    {r.based_on && (
                      <p className="text-xs text-text-3 mt-0.5">Based on: {r.based_on}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Linked findings */}
      {findings && (findings as unknown[]).length > 0 ? (
        <div className="bg-bg-2 border border-border rounded-xl">
          <div className="px-5 py-3 border-b border-border">
            <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest">
              Linked Findings ({(findings as unknown[]).length})
            </h3>
          </div>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(findings as any[]).map((f: any) => (
            <FindingRow key={f.id} finding={f} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
