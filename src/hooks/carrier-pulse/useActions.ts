'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi, postApi, patchApi } from '@/lib/carrier-pulse/api';
import { useActiveTenantId } from './useTenant';

export function useActions(filters: Record<string, string | undefined> = {}) {
  const tenantId = useActiveTenantId();
  const params = new URLSearchParams();
  if (tenantId) params.set('brand_id', tenantId);
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, value);
    }
  });
  const qs = params.toString();

  return useQuery({
    queryKey: ['cp-actions', tenantId, filters],
    queryFn: () => fetchApi(`/actions${qs ? `?${qs}` : ''}`),
    enabled: !!tenantId,
  });
}

export function useCreateAction() {
  const tenantId = useActiveTenantId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      postApi('/actions', { ...data, brand_id: tenantId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp-actions'] });
      queryClient.invalidateQueries({ queryKey: ['cp-dashboard'] });
    },
  });
}

export function useUpdateAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; [key: string]: unknown }) =>
      patchApi(`/actions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp-actions'] });
      queryClient.invalidateQueries({ queryKey: ['cp-dashboard'] });
    },
  });
}
