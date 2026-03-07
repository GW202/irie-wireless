'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/carrier-pulse/api';
import { useActiveTenantId } from './useTenant';

export function useBriefs() {
  const tenantId = useActiveTenantId();
  return useQuery({
    queryKey: ['cp-briefs', tenantId],
    queryFn: () => fetchApi(`/briefs?brand_id=${tenantId}`),
    enabled: !!tenantId,
  });
}

export function useBrief(id: string | undefined) {
  return useQuery({
    queryKey: ['cp-brief', id],
    queryFn: () => fetchApi(`/briefs/${id}`),
    enabled: !!id,
  });
}

export function useLatestBrief() {
  const tenantId = useActiveTenantId();
  return useQuery({
    queryKey: ['cp-brief', 'latest', tenantId],
    queryFn: () => fetchApi(`/briefs/latest?brand_id=${tenantId}`),
    enabled: !!tenantId,
    retry: false,
  });
}

export function useBriefFindings(briefId: string | undefined) {
  return useQuery({
    queryKey: ['cp-brief', briefId, 'findings'],
    queryFn: () => fetchApi(`/briefs/${briefId}/findings`),
    enabled: !!briefId,
  });
}
