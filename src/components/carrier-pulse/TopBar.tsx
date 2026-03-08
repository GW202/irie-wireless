'use client';

import { LogOut, User } from 'lucide-react';
import RunAgentButton from './RunAgentButton';
import { useAgentStatus } from '@/hooks/carrier-pulse/useAgent';
import { useAuth } from '@/hooks/useAuth';
import { timeAgo } from '@/lib/carrier-pulse/formatters';

export default function TopBar() {
  const { data: status } = useAgentStatus();
  const { session, logout } = useAuth();

  return (
    <header className="h-14 bg-bg-surface border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary">
          AI Telecom News Agent
        </span>
        {status?.completed_at && status.status !== 'running' ? (
          <span className="text-xs text-text-muted">
            Last run: {timeAgo(status.completed_at)}
          </span>
        ) : null}
      </div>
      <div className="flex items-center gap-4">
        <RunAgentButton />
        {session?.user ? (
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <User size={14} className="text-text-muted" />
              {session.user.name || session.user.email}
            </div>
            <button
              onClick={logout}
              title="Sign out"
              className="flex items-center gap-1 text-xs text-text-muted hover:text-high transition-colors px-2 py-1 rounded hover:bg-bg-hover"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
