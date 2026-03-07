'use client';

import { CARRIERS } from '@/lib/carrier-pulse/constants';

export default function CarrierBadge({ carrier }: { carrier: string | null | undefined }) {
  if (!carrier) return null;
  const c = CARRIERS[carrier];
  if (!c) return <span className="text-xs text-text-3">{carrier}</span>;

  return (
    <span
      className="inline-block text-xs font-bold px-2 py-0.5 rounded"
      style={{
        backgroundColor: `${c.color}20`,
        color: c.color,
        border: `1px solid ${c.color}40`,
      }}
    >
      {c.name}
    </span>
  );
}
