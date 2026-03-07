'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useFindings } from '@/hooks/carrier-pulse/useFindings';
import FindingRow from '@/components/carrier-pulse/FindingRow';
import { CATEGORIES, CARRIERS } from '@/lib/carrier-pulse/constants';

export default function FindingsPage() {
  const [filters, setFilters] = useState<Record<string, string | boolean | undefined>>({});
  const { data: findings, isLoading } = useFindings(filters);

  const updateFilter = (key: string, value: string | boolean | undefined) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value === '' || value === undefined) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });
  };

  const hasDateFilter = filters.from_date || filters.to_date;
  const clearDateFilter = () => {
    setFilters((prev) => {
      const next = { ...prev };
      delete next.from_date;
      delete next.to_date;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 bg-bg-2 border border-border rounded-xl p-4">
        <select
          value={(filters.category as string) || ''}
          onChange={(e) => updateFilter('category', e.target.value)}
          className="bg-bg-1 border border-border rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">All Categories</option>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={(filters.carrier as string) || ''}
          onChange={(e) => updateFilter('carrier', e.target.value)}
          className="bg-bg-1 border border-border rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">All Carriers</option>
          {Object.entries(CARRIERS).map(([key, c]) => (
            <option key={key} value={key}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={(filters.relevance as string) || ''}
          onChange={(e) => updateFilter('relevance', e.target.value)}
          className="bg-bg-1 border border-border rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">All Relevance</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-text-2">
          <input
            type="checkbox"
            checked={filters.is_sales_lead === true}
            onChange={(e) => updateFilter('is_sales_lead', e.target.checked || undefined)}
            className="rounded"
          />
          Has Action Items
        </label>

        <input
          type="text"
          placeholder="Search findings..."
          value={(filters.search as string) || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="bg-bg-1 border border-border rounded-lg px-3 py-1.5 text-sm flex-1 min-w-48"
        />
      </div>

      {/* Date filter */}
      <div className="flex flex-wrap items-center gap-3 bg-bg-2 border border-border rounded-xl p-4">
        <span className="text-sm text-text-2 font-medium shrink-0">Pull Date:</span>
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-3">From</label>
          <input
            type="datetime-local"
            value={(filters.from_date as string) || ''}
            onChange={(e) => updateFilter('from_date', e.target.value)}
            className="bg-bg-1 border border-border rounded-lg px-3 py-1.5 text-sm [color-scheme:dark]"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-3">To</label>
          <input
            type="datetime-local"
            value={(filters.to_date as string) || ''}
            onChange={(e) => updateFilter('to_date', e.target.value)}
            className="bg-bg-1 border border-border rounded-lg px-3 py-1.5 text-sm [color-scheme:dark]"
          />
        </div>
        {hasDateFilter && (
          <button
            onClick={clearDateFilter}
            className="flex items-center gap-1 text-xs text-text-3 hover:text-text-2 transition-colors px-2 py-1 rounded border border-border hover:border-text-3"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>

      {/* Findings list */}
      <div className="bg-bg-2 border border-border rounded-xl">
        {isLoading ? (
          <div className="space-y-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 border-b border-border animate-pulse bg-bg-3/30" />
            ))}
          </div>
        ) : findings && (findings as unknown[]).length > 0 ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (findings as any[]).map((f: any) => <FindingRow key={f.id} finding={f} />)
        ) : (
          <p className="px-5 py-8 text-sm text-text-3 text-center">
            No findings match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
