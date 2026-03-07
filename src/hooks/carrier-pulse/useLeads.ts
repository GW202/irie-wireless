'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi, patchApi } from '@/lib/carrier-pulse/api';

export function useLeads(filters: Record<string, string | undefined> = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, value);
    }
  });
  const qs = params.toString();

  return useQuery({
    queryKey: ['cp-leads', filters],
    queryFn: () => fetchApi(`/leads${qs ? `?${qs}` : ''}`),
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; [key: string]: unknown }) =>
      patchApi(`/leads/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp-leads'] });
      queryClient.invalidateQueries({ queryKey: ['cp-dashboard'] });
    },
  });
}
