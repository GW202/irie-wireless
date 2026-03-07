'use client';

import { RELEVANCE_COLORS } from '@/lib/carrier-pulse/constants';

export default function RelevanceBadge({ relevance }: { relevance: string }) {
  const color = RELEVANCE_COLORS[relevance] || '#6b7280';

  return (
    <span
      className="inline-block text-xs font-medium px-2 py-0.5 rounded uppercase"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {relevance}
    </span>
  );
}
