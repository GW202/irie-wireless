'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi, patchApi, postApi, deleteApi } from '@/lib/carrier-pulse/api';
import { useActiveTenantId } from './useTenant';

export function useBrands() {
  const tenantId = useActiveTenantId();
  return useQuery({
    queryKey: ['cp-brands', tenantId],
    queryFn: () => fetchApi<Array<{ id: number; name: string; slug: string; is_active: boolean }>>('/brands'),
    enabled: !!tenantId,
  });
}

export function useBrandDetail(brandId: number | null | undefined) {
  return useQuery({
    queryKey: ['cp-brand-detail', brandId],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryFn: () => fetchApi<any>(`/brands/${brandId}`),
    enabled: !!brandId,
  });
}

export function useSaveBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; [key: string]: unknown }) =>
      patchApi(`/brands/${id}`, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cp-brand-detail', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['cp-brands'] });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteApi(`/brands/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp-brands'] });
    },
  });
}

export function useOnboardBrand() {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: { name: string; hints?: string | null }) => postApi<any>('/brands/onboard', data),
  });
}

export function useConfirmBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => postApi('/brands/confirm', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cp-brands'] });
    },
  });
}

export function useAssistCategory() {
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: { brand_name: string; company_context: string; partial_name: string; partial_focus: string }) =>
      postApi<{ category?: Record<string, unknown> }>('/brands/assist-category', data),
  });
}
