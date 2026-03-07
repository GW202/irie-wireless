'use client';

import { useState, useRef, useEffect } from 'react';
import { LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/hooks/useTenant';
import { getRoleByName } from '@/lib/auth';
import Avatar from '@/components/ui/Avatar';

export default function UserMenu() {
  const { session, logout } = useAuth();
  const { activeTenant } = useTenant();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!session) return null;

  const role = getRoleByName(session.user.role);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2">
        <Avatar name={session.user.name} size="md" />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-bg-2 border border-border rounded-xl shadow-xl z-[60] overflow-hidden animate-[fadeUp_0.15s_ease]">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar name={session.user.name} size="lg" />
              <div>
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-[11px] text-text-3">{session.user.email}</p>
              </div>
            </div>
          </div>
          <div className="p-3 space-y-1">
            <div className="flex items-center gap-3 px-3 py-2 text-text-2">
              <Shield size={14} className="text-text-3" />
              <div>
                <p className="text-xs">{role?.label || session.user.role}</p>
                <p className="text-[10px] text-text-3 font-mono">{role?.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-text-2">
              <User size={14} className="text-text-3" />
              <div>
                <p className="text-xs">Active Tenant</p>
                <p className="text-[10px] text-text-3 font-mono">{activeTenant?.name || 'None'}</p>
              </div>
            </div>
          </div>
          <div className="p-2 border-t border-border">
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2 text-text-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <LogOut size={14} className="text-text-3" />
              <span className="text-xs">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
