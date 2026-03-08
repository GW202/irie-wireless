'use client';

import { ChevronDown } from 'lucide-react';
import { useBrands } from '@/hooks/carrier-pulse/useBrands';

interface BrandSelectorProps {
  selectedBrandId: number | null;
  onSelectBrand: (id: number) => void;
}

export default function BrandSelector({ selectedBrandId, onSelectBrand }: BrandSelectorProps) {
  const { data: brands } = useBrands();

  if (!brands || brands.length === 0) return null;

  return (
    <div className="px-4 py-3 border-b border-border">
      <label className="text-[10px] uppercase tracking-widest text-text-muted font-semibold block mb-1.5">
        Brand
      </label>
      <div className="relative">
        <select
          value={selectedBrandId || ''}
          onChange={(e) => onSelectBrand(Number(e.target.value))}
          className="w-full bg-bg-primary border border-border rounded-lg px-3 py-2 text-sm text-text-primary font-medium appearance-none cursor-pointer pr-8"
        >
          {brands.map((b: { id: number; name: string }) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
      </div>
    </div>
  );
}
