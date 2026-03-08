'use client';

import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  requiredRole: string;
  children: ReactNode;
}

const ROLE_LEVELS: Record<string, number> = {
  user: 1,
  admin: 2,
  superadmin: 3,
};

export default function RoleGuard({ requiredRole, children }: RoleGuardProps) {
  const { session } = useAuth();

  const userLevel = ROLE_LEVELS[session?.user?.role || ''] || 0;
  const requiredLevel = ROLE_LEVELS[requiredRole] || 0;

  if (userLevel < requiredLevel) {
    redirect('/platform/services/carrier-pulse');
  }

  return <>{children}</>;
}
