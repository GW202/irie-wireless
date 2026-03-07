'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/carrier-pulse/api';
import { useActiveTenantId } from './useTenant';
import { CATEGORIES } from '@/lib/carrier-pulse/constants';

export function useBrandCategories() {
  const tenantId = useActiveTenantId();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: brandDetail, isLoading } = useQuery<any>({
    queryKey: ['cp-brand-detail', tenantId],
    queryFn: () => fetchApi(`/brands/${tenantId}`),
    enabled: !!tenantId,
  });

  if (brandDetail?.categories) {
    try {
      const parsed = JSON.parse(brandDetail.categories);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const PALETTE = [
          '#e20074', '#10b981', '#f59e0b', '#06b6d4',
          '#8b5cf6', '#ef4444', '#f97316', '#3b82f6',
          '#ec4899', '#14b8a6', '#a855f7', '#84cc16',
        ];
        const categories: Record<string, { name: string; color: string }> = {};
        parsed.forEach((cat: { id: string; name: string }, i: number) => {
          categories[cat.id] = {
            name: cat.name,
            color: PALETTE[i % PALETTE.length],
          };
        });
        return { categories, isCustom: true, isLoading };
      }
    } catch {
      // Fall through to global defaults
    }
  }

  return { categories: CATEGORIES, isCustom: false, isLoading };
}
