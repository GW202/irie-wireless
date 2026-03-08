'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBrands } from '@/hooks/carrier-pulse/useBrands';

interface ActiveBrandContextValue {
  activeBrandId: number | null;
  setActiveBrandId: (id: number) => void;
}

const ActiveBrandContext = createContext<ActiveBrandContextValue>({
  activeBrandId: null,
  setActiveBrandId: () => {},
});

export function ActiveBrandProvider({ children }: { children: ReactNode }) {
  const { data: brands } = useBrands();
  const [activeBrandId, setActiveBrandId] = useState<number | null>(null);

  // Auto-select first brand when brands load and none is selected
  useEffect(() => {
    if (brands && brands.length > 0 && activeBrandId === null) {
      setActiveBrandId(brands[0].id);
    }
  }, [brands, activeBrandId]);

  return (
    <ActiveBrandContext.Provider value={{ activeBrandId, setActiveBrandId }}>
      {children}
    </ActiveBrandContext.Provider>
  );
}

export function useActiveBrandId(): number | null {
  const { activeBrandId } = useContext(ActiveBrandContext);
  return activeBrandId;
}

export function useActiveBrandContext() {
  return useContext(ActiveBrandContext);
}
