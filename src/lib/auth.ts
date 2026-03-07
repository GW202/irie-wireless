import { Role, RoleName, Permission, User } from './types';

export const ROLES: Role[] = [
  {
    id: 'role_superadmin',
    name: 'superadmin',
    label: 'Platform Superadmin',
    description: 'Full platform access across all tenants and services',
    permissions: [
      'platform:admin', 'platform:read',
      'tenant:manage', 'tenant:read',
      'users:manage', 'users:read',
      'roles:manage',
      'service:carrier-pulse', 'service:usage-engine', 'service:analytics', 'service:ai-support',
      'settings:manage', 'settings:read',
      'audit:read',
      'reports:read', 'reports:export',
      'alerts:manage', 'alerts:read',
      'integrations:manage',
      'search:global',
    ],
  },
  {
    id: 'role_tenant_admin',
    name: 'tenant_admin',
    label: 'Tenant Admin',
    description: 'Full access within assigned tenants',
    permissions: [
      'platform:read',
      'tenant:manage', 'tenant:read',
      'users:manage', 'users:read',
      'service:carrier-pulse', 'service:usage-engine', 'service:analytics', 'service:ai-support',
      'settings:manage', 'settings:read',
      'audit:read',
      'reports:read', 'reports:export',
      'alerts:manage', 'alerts:read',
      'integrations:manage',
      'search:global',
    ],
  },
  {
    id: 'role_analyst',
    name: 'analyst',
    label: 'Analyst',
    description: 'Read access to intelligence, analytics, and reports',
    permissions: [
      'platform:read',
      'tenant:read',
      'service:carrier-pulse', 'service:analytics',
      'settings:read',
      'reports:read', 'reports:export',
      'alerts:read',
      'search:global',
    ],
  },
  {
    id: 'role_operator',
    name: 'operator',
    label: 'Operator',
    description: 'Operational access to services and alert management',
    permissions: [
      'platform:read',
      'tenant:read',
      'service:carrier-pulse', 'service:usage-engine', 'service:analytics',
      'settings:read',
      'reports:read',
      'alerts:manage', 'alerts:read',
      'search:global',
    ],
  },
  {
    id: 'role_finance',
    name: 'finance',
    label: 'Finance User',
    description: 'Access to billing, usage, and financial reports',
    permissions: [
      'platform:read',
      'tenant:read',
      'service:usage-engine', 'service:analytics',
      'reports:read', 'reports:export',
      'alerts:read',
      'search:global',
    ],
  },
  {
    id: 'role_support',
    name: 'support',
    label: 'Support User',
    description: 'Access to AI support and basic platform features',
    permissions: [
      'platform:read',
      'tenant:read',
      'service:ai-support',
      'alerts:read',
      'search:global',
    ],
  },
  {
    id: 'role_viewer',
    name: 'viewer',
    label: 'Viewer',
    description: 'Read-only access to platform overview',
    permissions: [
      'platform:read',
      'tenant:read',
      'alerts:read',
      'search:global',
    ],
  },
];

export function getRoleByName(name: RoleName): Role | undefined {
  return ROLES.find((r) => r.name === name);
}

export function hasPermission(user: User, permission: Permission): boolean {
  const role = getRoleByName(user.role);
  if (!role) return false;
  return role.permissions.includes(permission);
}

export function hasRole(user: User, roleName: RoleName): boolean {
  return user.role === roleName;
}

export function hasAnyPermission(user: User, permissions: Permission[]): boolean {
  const role = getRoleByName(user.role);
  if (!role) return false;
  return permissions.some((p) => role.permissions.includes(p));
}
