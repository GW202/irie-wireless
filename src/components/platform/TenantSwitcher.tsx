'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, Check } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';

export default function TenantSwitcher() {
  const { activeTenant, availableTenants, switchTenant } = useTenant();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!activeTenant) return null;

  const tierColors: Record<string, string> = {
    enterprise: 'text-accent-cyan',
    growth: 'text-accent-green',
    starter: 'text-accent-amber',
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-bg-3 border border-border rounded-lg hover:border-border-light transition-colors"
      >
        <Building2 size={14} className="text-text-3" />
        <span className="text-xs font-medium max-w-[120px] truncate">{activeTenant.name}</span>
        <ChevronDown size={12} className={`text-text-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-bg-2 border border-border rounded-xl shadow-xl z-[60] overflow-hidden animate-[fadeUp_0.15s_ease]">
          <div className="p-3 border-b border-border">
            <p className="text-[10px] font-mono text-text-3 uppercase tracking-widest">Switch Tenant</p>
          </div>
          <div className="p-2">
            {availableTenants.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => { switchTenant(tenant.id); setOpen(false); }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                  tenant.id === activeTenant.id ? 'bg-accent-cyan/5' : 'hover:bg-white/5'
                }`}
              >
                <div className="w-8 h-8 rounded bg-bg-3 flex items-center justify-center text-xs font-bold border border-border shrink-0">
                  {tenant.name[0]}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-medium">{tenant.name}</p>
                  <p className={`text-[10px] font-mono ${tierColors[tenant.subscriptionTier] || 'text-text-3'}`}>
                    {tenant.subscriptionTier.toUpperCase()} &bull; {tenant.region}
                  </p>
                </div>
                {tenant.id === activeTenant.id && <Check size={14} className="text-accent-cyan" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
