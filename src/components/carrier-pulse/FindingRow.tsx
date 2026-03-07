'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import CarrierBadge from './CarrierBadge';
import RelevanceBadge from './RelevanceBadge';
import { formatDate } from '@/lib/carrier-pulse/formatters';

interface Finding {
  id: number;
  title: string;
  summary: string;
  category: string;
  carrier: string | null;
  relevance: string;
  is_sales_lead: boolean;
  source_url: string | null;
  source_name: string | null;
  published_date: string | null;
  created_at: string;
}

function formatArticleDate(publishedDate: string | null, fallbackCreatedAt: string): string {
  if (publishedDate) {
    const d = new Date(publishedDate + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }
  return formatDate(fallbackCreatedAt);
}

export default function FindingRow({ finding }: { finding: Finding }) {
  const [expanded, setExpanded] = useState(false);
  const articleDate = formatArticleDate(finding.published_date, finding.created_at);

  return (
    <div className="border-b border-border">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 px-4 py-3 hover:bg-bg-2 cursor-pointer"
      >
        {expanded ? (
          <ChevronDown size={14} className="text-text-3 shrink-0" />
        ) : (
          <ChevronRight size={14} className="text-text-3 shrink-0" />
        )}
        <CategoryBadge category={finding.category} />
        <CarrierBadge carrier={finding.carrier} />
        <span className="flex-1 text-sm truncate">{finding.title}</span>
        <RelevanceBadge relevance={finding.relevance} />
        {finding.is_sales_lead && (
          <span className="text-xs text-accent-amber font-medium px-2 py-0.5 bg-accent-amber/10 rounded shrink-0">
            LEAD
          </span>
        )}
        {finding.source_url && (
          <a
            href={finding.source_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={finding.source_name || finding.source_url}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-cyan hover:text-accent-cyan/80 px-2.5 py-1 rounded-md border border-accent-cyan/30 hover:border-accent-cyan/60 hover:bg-accent-cyan/5 transition-colors shrink-0"
          >
            Source <ExternalLink size={12} />
          </a>
        )}
        <span className="text-xs text-text-3 shrink-0">{articleDate}</span>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pl-10">
          <p className="text-sm text-text-2 leading-relaxed">{finding.summary}</p>
          <div className="flex items-center gap-4 mt-3">
            {finding.source_url && (
              <a
                href={finding.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-accent-cyan hover:underline"
              >
                {finding.source_name || 'Read full article'} <ExternalLink size={12} />
              </a>
            )}
            {finding.published_date && (
              <span className="text-xs text-text-3">Published: {articleDate}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
