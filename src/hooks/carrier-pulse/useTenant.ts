'use client';

import { useContext } from 'react';
import { TenantContext } from '@/contexts/TenantContext';

/** Returns the active tenant ID for CarrierPulse data scoping. */
export function useActiveTenantId(): string | null {
  const { activeTenant } = useContext(TenantContext);
  return activeTenant?.id ?? null;
}
