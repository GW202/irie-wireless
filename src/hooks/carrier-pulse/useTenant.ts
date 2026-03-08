'use client';

import { useActiveBrandId } from '@/contexts/ActiveBrandContext';

/**
 * Returns the active brand ID (numeric) for CarrierPulse data scoping.
 * This replaces the old mock tenant ID with the real backend brand ID.
 */
export function useActiveTenantId(): string | null {
  const brandId = useActiveBrandId();
  return brandId !== null ? String(brandId) : null;
}
