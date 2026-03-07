'use client';

import { useLeads, useUpdateLead } from '@/hooks/carrier-pulse/useLeads';
import LeadCard from '@/components/carrier-pulse/LeadCard';
import { LEAD_STATUSES, LEAD_STATUS_COLORS } from '@/lib/carrier-pulse/constants';

export default function LeadsPage() {
  const { data: leads, isLoading } = useLeads();
  const updateLead = useUpdateLead();

  const handleStatusChange = (id: number, status: string) => {
    updateLead.mutate({ id, status });
  };

  const handleDrop = (status: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('lead_id');
    if (leadId) {
      updateLead.mutate({ id: parseInt(leadId), status });
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 bg-bg-2 rounded animate-pulse" />
        <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {LEAD_STATUSES.map((s) => (
            <div key={s} className="h-64 bg-bg-2 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped: Record<string, any[]> = {};
  LEAD_STATUSES.forEach((s) => (grouped[s] = []));
  if (leads) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (leads as any[]).forEach((l: any) => {
      if (grouped[l.status]) grouped[l.status].push(l);
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {LEAD_STATUSES.map((status: string) => (
          <div
            key={status}
            onDrop={handleDrop(status)}
            onDragOver={handleDragOver}
            className="bg-bg-2/50 border border-border rounded-xl p-3 min-h-48"
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: LEAD_STATUS_COLORS[status] }}
              >
                {status}
              </h3>
              <span className="text-xs text-text-3 bg-bg-3 px-1.5 py-0.5 rounded">
                {grouped[status].length}
              </span>
            </div>
            <div className="space-y-2">
              {grouped[status].map((lead) => (
                <LeadCard key={lead.id} lead={lead} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {leads && (leads as unknown[]).length === 0 ? (
        <div className="bg-bg-2 border border-border rounded-xl p-8 text-center">
          <p className="text-text-3">No sales leads detected yet.</p>
          <p className="text-sm text-text-3 mt-1">
            Leads are automatically extracted when the agent finds brands entering wireless.
          </p>
        </div>
      ) : null}
    </div>
  );
}
