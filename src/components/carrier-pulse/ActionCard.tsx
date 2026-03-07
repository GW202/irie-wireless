'use client';

import {
  ACTION_STATUS_COLORS,
  ACTION_TYPES,
  ACTION_PRIORITY_COLORS,
  ACTION_STATUS_LABELS,
} from '@/lib/carrier-pulse/constants';
import { formatDate } from '@/lib/carrier-pulse/formatters';

interface Action {
  id: number;
  title: string;
  description: string | null;
  action_type: string;
  priority: string;
  status: string;
  assigned_to: string | null;
  due_date: string | null;
  created_at: string;
}

interface ActionCardProps {
  action: Action;
  onStatusChange: (id: number, status: string) => void;
}

export default function ActionCard({ action, onStatusChange }: ActionCardProps) {
  const typeInfo = ACTION_TYPES[action.action_type] || { name: action.action_type, color: '#6b7280' };

  return (
    <div
      className="bg-bg-2 border border-border rounded-xl p-3 hover:border-border transition-colors"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('action_id', String(action.id))}
    >
      <h4 className="text-sm font-semibold leading-tight mb-2">{action.title}</h4>

      <div className="flex items-center gap-1.5 mb-2">
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{ color: typeInfo.color, backgroundColor: `${typeInfo.color}15` }}
        >
          {typeInfo.name}
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
          style={{
            color: ACTION_PRIORITY_COLORS[action.priority],
            backgroundColor: `${ACTION_PRIORITY_COLORS[action.priority]}15`,
          }}
        >
          {action.priority}
        </span>
      </div>

      {action.description && (
        <p className="text-xs text-text-2 line-clamp-2 mb-2">{action.description}</p>
      )}

      {action.assigned_to && (
        <div className="text-xs text-text-3 mb-2">&rarr; {action.assigned_to}</div>
      )}

      <div className="flex items-center justify-between">
        <select
          value={action.status}
          onChange={(e) => onStatusChange(action.id, e.target.value)}
          className="text-xs bg-bg-1 border border-border rounded px-1.5 py-0.5 text-text-2"
          style={{ color: ACTION_STATUS_COLORS[action.status] }}
        >
          {Object.entries(ACTION_STATUS_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <div className="text-right">
          {action.due_date && (
            <div className="text-[10px] text-text-3">Due: {formatDate(action.due_date)}</div>
          )}
          <div className="text-[10px] text-text-3">{formatDate(action.created_at)}</div>
        </div>
      </div>
    </div>
  );
}
