'use client';

import { Loader2, Play } from 'lucide-react';
import { useAgentStatus, useRunAgent } from '@/hooks/carrier-pulse/useAgent';
import { useActiveTenantId } from '@/hooks/carrier-pulse/useTenant';
import { useQueryClient } from '@tanstack/react-query';

interface RunAgentButtonProps {
  selectedCategories?: string[] | null;
}

export default function RunAgentButton({ selectedCategories = null }: RunAgentButtonProps) {
  const { data: status } = useAgentStatus();
  const tenantId = useActiveTenantId();
  const runAgent = useRunAgent();
  const queryClient = useQueryClient();
  const isRunning = status?.status === 'running';

  const handleRun = () => {
    if (isRunning || !tenantId) return;
    const categories =
      selectedCategories && selectedCategories.length > 0 ? selectedCategories : null;
    runAgent.mutate(categories, {
      onSuccess: () => {
        const poll = setInterval(async () => {
          const res = await fetch(
            `/api/carrier-pulse/agent/status?brand_id=${tenantId}`
          );
          const data = await res.json();
          if (data?.status !== 'running') {
            clearInterval(poll);
            queryClient.invalidateQueries();
          }
        }, 5000);
      },
    });
  };

  const categoryCount =
    selectedCategories && selectedCategories.length > 0 ? selectedCategories.length : 'All';

  return (
    <button
      onClick={handleRun}
      disabled={isRunning || runAgent.isPending}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isRunning
          ? 'bg-accent-cyan/20 text-accent-cyan cursor-wait'
          : 'bg-accent-cyan hover:bg-accent-cyan/80 text-white cursor-pointer'
      } disabled:opacity-50`}
    >
      {isRunning ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Running ({status?.search_count || 0} searches)
        </>
      ) : (
        <>
          <Play size={16} />
          Run Agent ({categoryCount}{' '}
          {categoryCount === 'All' ? 'categories' : categoryCount === 1 ? 'category' : 'categories'})
        </>
      )}
    </button>
  );
}
