'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/carrier-pulse/api';
import { useActiveTenantId } from './useTenant';

export function useFindings(filters: Record<string, string | boolean | number | undefined> = {}) {
  const tenantId = useActiveTenantId();
  const params = new URLSearchParams();
  if (tenantId) params.set('brand_id', tenantId);
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();

  return useQuery({
    queryKey: ['cp-findings', tenantId, filters],
    queryFn: () => fetchApi(`/findings${qs ? `?${qs}` : ''}`),
    enabled: !!tenantId,
  });
}
