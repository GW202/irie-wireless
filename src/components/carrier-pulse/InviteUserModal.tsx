'use client';

import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useCreateUser } from '@/hooks/carrier-pulse/useUsers';
import { useBrands } from '@/hooks/carrier-pulse/useBrands';

const ROLES = [
  { value: 'user', label: 'Viewer', description: 'Read-only access to assigned brands' },
  { value: 'admin', label: 'Admin', description: 'Can run agent and manage actions' },
  { value: 'superadmin', label: 'Super Admin', description: 'Full access to everything' },
];

interface InviteUserModalProps {
  onClose: () => void;
}

export default function InviteUserModal({ onClose }: InviteUserModalProps) {
  const { data: brands } = useBrands();
  const createUser = useCreateUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [error, setError] = useState('');

  const toggleBrand = (brandId: number) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      return;
    }

    if (role !== 'superadmin' && selectedBrands.length === 0) {
      setError('Select at least one brand for non-superadmin users');
      return;
    }

    try {
      await createUser.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        brand_ids: role === 'superadmin' ? [] : selectedBrands,
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create user';
      setError(message);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-surface border border-border rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary">Invite User</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error ? (
            <div className="px-3 py-2 rounded-lg bg-high/10 border border-high/20 text-high text-sm">
              {error}
            </div>
          ) : null}

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="Full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-bg-primary border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="user@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 bg-bg-primary border border-border rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="Temporary password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary p-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Role</label>
            <div className="space-y-2">
              {ROLES.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    role === r.value
                      ? 'border-accent/50 bg-accent/5'
                      : 'border-border hover:border-border hover:bg-bg-hover'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r.value}
                    checked={role === r.value}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-0.5 accent-accent"
                  />
                  <div>
                    <div className="text-sm font-medium text-text-primary">{r.label}</div>
                    <div className="text-xs text-text-muted">{r.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {role !== 'superadmin' && brands ? (
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Brand Access
              </label>
              <div className="space-y-2">
                {brands.map((brand: { id: number; name: string }) => (
                  <label
                    key={brand.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedBrands.includes(brand.id)
                        ? 'border-accent/50 bg-accent/5'
                        : 'border-border hover:bg-bg-hover'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand.id)}
                      onChange={() => toggleBrand(brand.id)}
                      className="accent-accent"
                    />
                    <span className="text-sm text-text-primary">{brand.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm text-text-secondary hover:bg-bg-hover transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createUser.isPending}
              className="flex-1 px-4 py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {createUser.isPending ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
