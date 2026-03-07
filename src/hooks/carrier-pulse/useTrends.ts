'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/carrier-pulse/api';
import { useActiveTenantId } from './useTenant';

export function useTrendCategories() {
  const tenantId = useActiveTenantId();
  return useQuery({
    queryKey: ['cp-trends', 'categories', tenantId],
    queryFn: () => fetchApi(`/trends/categories?brand_id=${tenantId}`),
    enabled: !!tenantId,
  });
}

export function useTrendCarriers() {
  const tenantId = useActiveTenantId();
  return useQuery({
    queryKey: ['cp-trends', 'carriers', tenantId],
    queryFn: () => fetchApi(`/trends/carriers?brand_id=${tenantId}`),
    enabled: !!tenantId,
  });
}

export function useTrendRelevance() {
  const tenantId = useActiveTenantId();
  return useQuery({
    queryKey: ['cp-trends', 'relevance', tenantId],
    queryFn: () => fetchApi(`/trends/relevance?brand_id=${tenantId}`),
    enabled: !!tenantId,
  });
}

export function useTrendActions() {
  const tenantId = useActiveTenantId();
  return useQuery({
    queryKey: ['cp-trends', 'actions', tenantId],
    queryFn: () => fetchApi(`/trends/actions?brand_id=${tenantId}`),
    enabled: !!tenantId,
  });
}
