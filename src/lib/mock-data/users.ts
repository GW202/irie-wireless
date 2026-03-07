import { User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'user_alex',
    name: 'Alex Chen',
    email: 'alex.chen@iriewireless.com',
    role: 'superadmin',
    tenantIds: ['tenant_bolt', 'tenant_verdant', 'tenant_nexgen'],
    lastLogin: '2026-03-07T08:30:00Z',
    status: 'active',
  },
  {
    id: 'user_sarah',
    name: 'Sarah Mitchell',
    email: 'sarah@boltmobile.com',
    role: 'tenant_admin',
    tenantIds: ['tenant_bolt'],
    lastLogin: '2026-03-06T14:22:00Z',
    status: 'active',
  },
  {
    id: 'user_james',
    name: 'James Rivera',
    email: 'james@verdantwireless.com',
    role: 'analyst',
    tenantIds: ['tenant_verdant'],
    lastLogin: '2026-03-05T09:15:00Z',
    status: 'active',
  },
  {
    id: 'user_priya',
    name: 'Priya Patel',
    email: 'priya@iriewireless.com',
    role: 'operator',
    tenantIds: ['tenant_bolt', 'tenant_verdant'],
    lastLogin: '2026-03-07T07:45:00Z',
    status: 'active',
  },
  {
    id: 'user_marcus',
    name: 'Marcus Thompson',
    email: 'marcus@nexgenconnect.com',
    role: 'viewer',
    tenantIds: ['tenant_nexgen'],
    lastLogin: '2026-03-04T16:30:00Z',
    status: 'active',
  },
];

export const DEFAULT_USER = MOCK_USERS[0];
