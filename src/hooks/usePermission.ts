'use client';

import { useAuth } from './useAuth';
import { Permission } from '@/lib/types';

export function usePermission(permission: Permission): boolean {
  const { checkPermission } = useAuth();
  return checkPermission(permission);
}
