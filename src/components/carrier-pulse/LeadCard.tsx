'use client';

import { LEAD_STATUS_COLORS } from '@/lib/carrier-pulse/constants';
import { formatDate } from '@/lib/carrier-pulse/formatters';

interface Lead {
  id: number;
  brand_name: string;
  vertical: string | null;
  description: string | null;
  status: string;
  detected_at: string;
}

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (id: number, status: string) => void;
}

export default function LeadCard({ lead, onStatusChange }: LeadCardProps) {
  return (
    <div
      className="bg-bg-2 border border-border rounded-xl p-3 hover:border-border transition-colors"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('lead_id', String(lead.id))}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold truncate">{lead.brand_name}</h4>
        {lead.vertical ? (
          <span className="text-xs text-text-3 bg-bg-3 px-1.5 py-0.5 rounded">{lead.vertical}</span>
        ) : null}
      </div>
      {lead.description ? (
        <p className="text-xs text-text-2 line-clamp-2 mb-2">{lead.description}</p>
      ) : null}
      <div className="flex items-center justify-between">
        <select
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value)}
          className="text-xs bg-bg-1 border border-border rounded px-1.5 py-0.5 text-text-2"
          style={{ color: LEAD_STATUS_COLORS[lead.status] }}
        >
          {Object.keys(LEAD_STATUS_COLORS).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-xs text-text-3">{formatDate(lead.detected_at)}</span>
      </div>
    </div>
  );
}
