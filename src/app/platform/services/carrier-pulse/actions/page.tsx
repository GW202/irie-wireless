'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useActions, useCreateAction, useUpdateAction } from '@/hooks/carrier-pulse/useActions';
import ActionCard from '@/components/carrier-pulse/ActionCard';
import {
  ACTION_STATUSES,
  ACTION_STATUS_COLORS,
  ACTION_STATUS_LABELS,
  ACTION_TYPES,
  ACTION_PRIORITY_COLORS,
} from '@/lib/carrier-pulse/constants';

export default function ActionsPage() {
  const { data: actions, isLoading } = useActions();
  const updateAction = useUpdateAction();
  const createAction = useCreateAction();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    action_type: 'research',
    priority: 'medium',
    assigned_to: '',
    due_date: '',
  });

  const handleStatusChange = (id: number, status: string) => {
    updateAction.mutate({ id, status });
  };

  const handleDrop = (status: string) => (e: React.DragEvent) => {
    e.preventDefault();
    const actionId = e.dataTransfer.getData('action_id');
    if (actionId) {
      updateAction.mutate({ id: parseInt(actionId), status });
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = { ...formData };
    if (!payload.assigned_to) delete payload.assigned_to;
    if (!payload.due_date) delete payload.due_date;
    createAction.mutate(payload, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          action_type: 'research',
          priority: 'medium',
          assigned_to: '',
          due_date: '',
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-bg-2 rounded animate-pulse" />
        <div className="grid grid-cols-5 gap-4">
          {ACTION_STATUSES.map((s) => (
            <div key={s} className="h-64 bg-bg-2 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const grouped: Record<string, any[]> = {};
  ACTION_STATUSES.forEach((s) => (grouped[s] = []));
  if (actions) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (actions as any[]).forEach((a: any) => {
      if (grouped[a.status]) grouped[a.status].push(a);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold">Action Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-cyan hover:bg-accent-cyan/80 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New Action'}
        </button>
      </div>

      {/* Create action form */}
      {showForm ? (
        <form onSubmit={handleCreateSubmit} className="bg-bg-2 border border-border rounded-xl p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm text-text-2 mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm placeholder:text-text-3 focus:outline-none focus:border-accent-cyan"
                placeholder="What needs to be done?"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-text-2 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm placeholder:text-text-3 focus:outline-none focus:border-accent-cyan"
                placeholder="Why is this important?"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm text-text-2 mb-1">Action Type</label>
              <select
                value={formData.action_type}
                onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
                className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm"
              >
                {Object.entries(ACTION_TYPES).map(([key, type]) => (
                  <option key={key} value={key}>{type.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-2 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm"
              >
                {Object.entries(ACTION_PRIORITY_COLORS).map(([key]) => (
                  <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-text-2 mb-1">Assigned To</label>
              <input
                type="text"
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm placeholder:text-text-3 focus:outline-none focus:border-accent-cyan"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm text-text-2 mb-1">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm [color-scheme:dark] focus:outline-none focus:border-accent-cyan"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createAction.isPending}
              className="px-4 py-2 bg-accent-cyan hover:bg-accent-cyan/80 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {createAction.isPending ? 'Creating...' : 'Create Action'}
            </button>
          </div>
        </form>
      ) : null}

      <div className="grid grid-cols-5 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {ACTION_STATUSES.map((status: string) => (
          <div
            key={status}
            onDrop={handleDrop(status)}
            onDragOver={handleDragOver}
            className="bg-bg-2/50 border border-border rounded-xl p-3 min-h-48"
          >
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: ACTION_STATUS_COLORS[status] }}
              >
                {ACTION_STATUS_LABELS[status]}
              </h3>
              <span className="text-xs text-text-3 bg-bg-3 px-1.5 py-0.5 rounded">
                {grouped[status].length}
              </span>
            </div>
            <div className="space-y-2">
              {grouped[status].map((action) => (
                <ActionCard key={action.id} action={action} onStatusChange={handleStatusChange} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {actions && (actions as unknown[]).length === 0 ? (
        <div className="bg-bg-2 border border-border rounded-xl p-8 text-center">
          <p className="text-text-3">No action items yet.</p>
          <p className="text-sm text-text-3 mt-1">
            Actions are automatically generated when the agent analyzes findings, or you can create them manually.
          </p>
        </div>
      ) : null}
    </div>
  );
}
