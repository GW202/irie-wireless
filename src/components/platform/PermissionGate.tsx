'use client';

import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/lib/types';

interface PermissionGateProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PermissionGate({ permission, children, fallback = null }: PermissionGateProps) {
  const { checkPermission } = useAuth();

  if (!checkPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
