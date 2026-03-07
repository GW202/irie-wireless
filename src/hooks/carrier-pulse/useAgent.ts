'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi, postApi } from '@/lib/carrier-pulse/api';
import { useActiveTenantId } from './useTenant';

export function useAgentStatus() {
  const tenantId = useActiveTenantId();
  return useQuery({
    queryKey: ['cp-agent', 'status', tenantId],
    queryFn: () => fetchApi<{ status: string; search_count?: number }>(`/agent/status?brand_id=${tenantId}`),
    enabled: !!tenantId,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === 'running' ? 3000 : false;
    },
  });
}

export function useAgentHistory() {
  const tenantId = useActiveTenantId();
  return useQuery({
    queryKey: ['cp-agent', 'history', tenantId],
    queryFn: () => fetchApi(`/agent/history?brand_id=${tenantId}`),
    enabled: !!tenantId,
  });
}

export function useRunAgent() {
  const tenantId = useActiveTenantId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categories?: string[] | null) =>
      postApi('/agent/run', {
        brand_id: tenantId,
        ...(categories ? { categories } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp-agent'] });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['cp-agent', 'status'] });
      }, 1000);
    },
  });
}
