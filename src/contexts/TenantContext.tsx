'use client';

import { createContext, useCallback, useState, useEffect, ReactNode, useContext } from 'react';
import { Tenant } from '@/lib/types';
import { MOCK_TENANTS } from '@/lib/mock-data/tenants';
import { AuthContext } from './AuthContext';

interface TenantContextType {
  activeTenant: Tenant | null;
  availableTenants: Tenant[];
  switchTenant: (tenantId: string) => void;
  isServiceEnabled: (serviceSlug: string) => boolean;
  getFeatureFlag: (flag: string) => boolean;
}

export const TenantContext = createContext<TenantContextType>({
  activeTenant: null,
  availableTenants: [],
  switchTenant: () => {},
  isServiceEnabled: () => false,
  getFeatureFlag: () => false,
});

export function TenantProvider({ children }: { children: ReactNode }) {
  const { session } = useContext(AuthContext);

  const availableTenants = session
    ? MOCK_TENANTS.filter((t) => session.user.tenantIds.includes(t.id))
    : [];

  const [activeTenantId, setActiveTenantId] = useState<string | null>(
    session?.activeTenantId || null
  );

  useEffect(() => {
    if (session?.activeTenantId) {
      setActiveTenantId(session.activeTenantId);
    }
  }, [session?.activeTenantId]);

  const activeTenant = MOCK_TENANTS.find((t) => t.id === activeTenantId) || null;

  const switchTenant = useCallback((tenantId: string) => {
    setActiveTenantId(tenantId);
  }, []);

  const isServiceEnabled = useCallback(
    (serviceSlug: string) => {
      if (!activeTenant) return false;
      return activeTenant.enabledServices.includes(serviceSlug);
    },
    [activeTenant]
  );

  const getFeatureFlag = useCallback(
    (flag: string) => {
      if (!activeTenant) return false;
      return activeTenant.config.features[flag] ?? false;
    },
    [activeTenant]
  );

  return (
    <TenantContext.Provider
      value={{
        activeTenant,
        availableTenants,
        switchTenant,
        isServiceEnabled,
        getFeatureFlag,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}
