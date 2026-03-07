'use client';

import { createContext, useCallback, useState, ReactNode } from 'react';
import { User, Session, Permission, RoleName } from '@/lib/types';
import { hasPermission, hasRole } from '@/lib/auth';
import { DEFAULT_USER, MOCK_USERS } from '@/lib/mock-data/users';
import { MOCK_TENANTS } from '@/lib/mock-data/tenants';

interface AuthContextType {
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  checkPermission: (permission: Permission) => boolean;
  checkRole: (role: RoleName) => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
  checkPermission: () => false,
  checkRole: () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('irie_session');
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });

  const login = useCallback((email: string, _password: string) => {
    const user = MOCK_USERS.find((u) => u.email === email) || DEFAULT_USER;
    const firstTenant = MOCK_TENANTS.find((t) => user.tenantIds.includes(t.id));
    const newSession: Session = {
      user,
      activeTenantId: firstTenant?.id || user.tenantIds[0],
      loginAt: new Date().toISOString(),
    };
    setSession(newSession);
    localStorage.setItem('irie_session', JSON.stringify(newSession));
    return true;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    localStorage.removeItem('irie_session');
  }, []);

  const checkPermission = useCallback(
    (permission: Permission) => {
      if (!session) return false;
      return hasPermission(session.user, permission);
    },
    [session]
  );

  const checkRole = useCallback(
    (role: RoleName) => {
      if (!session) return false;
      return hasRole(session.user, role);
    },
    [session]
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        login,
        logout,
        checkPermission,
        checkRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
