'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/carrier-pulse/api';
import { useActiveTenantId } from './useTenant';

export function useDashboard() {
  const tenantId = useActiveTenantId();
  return useQuery({
    queryKey: ['cp-dashboard', tenantId],
    queryFn: () => fetchApi(`/dashboard?brand_id=${tenantId}`),
    enabled: !!tenantId,
  });
}
