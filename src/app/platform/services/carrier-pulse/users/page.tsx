'use client';

import { useState } from 'react';
import {
  UserPlus,
  Shield,
  ShieldCheck,
  User as UserIcon,
  ToggleLeft,
  ToggleRight,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  useUsers,
  useUpdateUser,
  useDeactivateUser,
  useAssignBrand,
  useUnassignBrand,
} from '@/hooks/carrier-pulse/useUsers';
import { useBrands } from '@/hooks/carrier-pulse/useBrands';
import { useAuth } from '@/contexts/AuthContext';
import InviteUserModal from '@/components/carrier-pulse/InviteUserModal';

interface Brand {
  id: number;
  slug: string;
  name: string;
}

interface UserRecord {
  id: number;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
  brands: Brand[];
}

const ROLE_CONFIG: Record<string, { label: string; icon: typeof Shield; color: string }> = {
  superadmin: { label: 'Super Admin', icon: ShieldCheck, color: 'text-accent' },
  admin: { label: 'Admin', icon: Shield, color: 'text-lead' },
  user: { label: 'Viewer', icon: UserIcon, color: 'text-text-secondary' },
};

const ROLE_OPTIONS = ['user', 'admin', 'superadmin'];

function RoleBadge({ role }: { role: string }) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.user;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${config.color}`}>
      <Icon size={14} />
      {config.label}
    </span>
  );
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function UserRow({
  user: u,
  allBrands,
  currentUserId,
}: {
  user: UserRecord;
  allBrands: Brand[];
  currentUserId: number | undefined;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editingRole, setEditingRole] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(u.name);
  const updateUser = useUpdateUser();
  const deactivateUser = useDeactivateUser();
  const assignBrand = useAssignBrand();
  const unassignBrand = useUnassignBrand();

  const isSelf = u.id === currentUserId;
  const userBrandIds = u.brands.map((b) => b.id);
  const unassignedBrands = allBrands.filter((b) => !userBrandIds.includes(b.id));

  const handleNameSave = async () => {
    if (nameValue.trim() && nameValue.trim() !== u.name) {
      await updateUser.mutateAsync({ id: u.id, name: nameValue.trim() });
    }
    setEditingName(false);
  };

  const handleRoleChange = async (newRole: string) => {
    await updateUser.mutateAsync({ id: u.id, role: newRole });
    setEditingRole(false);
  };

  const handleToggleActive = async () => {
    if (isSelf) return;
    if (u.is_active) {
      await deactivateUser.mutateAsync(u.id);
    } else {
      await updateUser.mutateAsync({ id: u.id, is_active: true });
    }
  };

  const handleAssignBrand = async (brandId: number) => {
    await assignBrand.mutateAsync({ userId: u.id, brandId });
  };

  const handleUnassignBrand = async (brandId: number) => {
    await unassignBrand.mutateAsync({ userId: u.id, brandId });
  };

  return (
    <>
      <tr
        className={`border-b border-border/50 hover:bg-bg-hover/50 transition-colors cursor-pointer ${
          !u.is_active ? 'opacity-50' : ''
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="py-3 pr-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-medium">
              {u.name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">{u.name}</div>
              <div className="text-xs text-text-muted">{u.email}</div>
            </div>
          </div>
        </td>
        <td className="py-3 pr-3">
          <RoleBadge role={u.role} />
        </td>
        <td className="py-3 pr-3">
          <div className="flex flex-wrap gap-1">
            {u.role === 'superadmin' ? (
              <span className="text-xs text-text-muted italic">All brands</span>
            ) : u.brands.length > 0 ? (
              u.brands.map((b) => (
                <span
                  key={b.id}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-bg-primary border border-border text-text-secondary"
                >
                  {b.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-text-muted italic">No brands</span>
            )}
          </div>
        </td>
        <td className="py-3 pr-3">
          <span className={`text-xs ${u.is_active ? 'text-lead' : 'text-high'}`}>
            {u.is_active ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className="py-3 pr-3 text-xs text-text-muted">{formatDate(u.last_login)}</td>
        <td className="py-3 text-right">
          {expanded ? (
            <ChevronUp size={16} className="text-text-muted" />
          ) : (
            <ChevronDown size={16} className="text-text-muted" />
          )}
        </td>
      </tr>
      {expanded ? (
        <tr className="border-b border-border">
          <td colSpan={6} className="p-4 bg-bg-primary/50">
            <div className="flex flex-wrap gap-6">
              {/* Name */}
              <div>
                <h4 className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">Name</h4>
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNameSave();
                        if (e.key === 'Escape') setEditingName(false);
                      }}
                      className="px-2 py-1 bg-bg-primary border border-border rounded text-sm text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent w-48"
                      autoFocus
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNameSave(); }}
                      disabled={updateUser.isPending}
                      className="text-xs text-accent hover:underline"
                    >
                      Save
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingName(false); setNameValue(u.name); }}
                      className="text-xs text-text-muted hover:text-text-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingName(true); }}
                    className="text-sm text-text-primary hover:text-accent"
                  >
                    {u.name || <span className="italic text-text-muted">No name</span>}
                    <span className="ml-2 text-xs text-text-muted">(edit)</span>
                  </button>
                )}
              </div>

              {/* Role */}
              <div>
                <h4 className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">Role</h4>
                {editingRole ? (
                  <div className="flex gap-2">
                    {ROLE_OPTIONS.map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRoleChange(r)}
                        disabled={updateUser.isPending}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                          r === u.role
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-border text-text-secondary hover:bg-bg-hover'
                        }`}
                      >
                        {ROLE_CONFIG[r]?.label || r}
                      </button>
                    ))}
                    <button
                      onClick={() => setEditingRole(false)}
                      className="text-xs text-text-muted hover:text-text-secondary px-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingRole(true); }}
                    disabled={isSelf}
                    className={`text-sm hover:underline ${isSelf ? 'text-text-muted cursor-not-allowed' : 'text-accent'}`}
                  >
                    <RoleBadge role={u.role} />
                    {!isSelf ? <span className="ml-2 text-xs text-text-muted">(edit)</span> : null}
                  </button>
                )}
              </div>

              {/* Brands */}
              {u.role !== 'superadmin' ? (
                <div>
                  <h4 className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">Brands</h4>
                  <div className="flex flex-wrap gap-2">
                    {u.brands.map((b) => (
                      <span
                        key={b.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20"
                      >
                        {b.name}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUnassignBrand(b.id); }}
                          className="hover:text-high transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    {unassignedBrands.length > 0 ? (
                      <div className="relative group">
                        <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border border-dashed border-border text-text-muted hover:border-accent hover:text-accent transition-colors">
                          <Plus size={12} />
                          Add
                        </button>
                        <div className="absolute top-full left-0 mt-1 bg-bg-surface border border-border rounded-lg shadow-lg py-1 hidden group-hover:block z-10 min-w-[140px]">
                          {unassignedBrands.map((b) => (
                            <button
                              key={b.id}
                              onClick={(e) => { e.stopPropagation(); handleAssignBrand(b.id); }}
                              className="w-full text-left px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-hover transition-colors"
                            >
                              {b.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* Status toggle */}
              <div>
                <h4 className="text-xs font-medium text-text-muted mb-2 uppercase tracking-wide">Status</h4>
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleActive(); }}
                  disabled={isSelf || deactivateUser.isPending || updateUser.isPending}
                  className={`inline-flex items-center gap-2 text-sm transition-colors ${
                    isSelf ? 'text-text-muted cursor-not-allowed' : 'hover:text-text-primary'
                  } ${u.is_active ? 'text-lead' : 'text-high'}`}
                >
                  {u.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  {u.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const { data: brands } = useBrands();
  const { user: currentUser } = useAuth();
  const [showInvite, setShowInvite] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-mono">Users</h2>
          <p className="text-sm text-text-muted mt-1">
            {(users as UserRecord[] | undefined)?.length || 0} user{(users as UserRecord[] | undefined)?.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          <UserPlus size={16} />
          Invite User
        </button>
      </div>

      <div className="bg-bg-surface border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-text-muted text-left border-b border-border bg-bg-primary/50">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Brands</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium w-8"></th>
            </tr>
          </thead>
          <tbody>
            {(users as UserRecord[] | undefined)?.map((u) => (
              <UserRow
                key={u.id}
                user={u}
                allBrands={brands || []}
                currentUserId={currentUser?.id}
              />
            ))}
          </tbody>
        </table>
      </div>

      {showInvite ? <InviteUserModal onClose={() => setShowInvite(false)} /> : null}
    </div>
  );
}
