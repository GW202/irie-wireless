'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { NotificationContext } from '@/contexts/NotificationContext';
import { NotificationSeverity } from '@/lib/types';

const severityStyles: Record<NotificationSeverity, string> = {
  info: 'bg-accent-cyan',
  warning: 'bg-accent-amber',
  critical: 'bg-accent-red',
  success: 'bg-accent-green',
};

export default function NotificationCenter() {
  const { notifications, unreadCount, markRead, markAllRead } = useContext(NotificationContext);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-text-3 hover:text-accent-cyan transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-red rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-bg-0">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-bg-2 border border-border rounded-xl shadow-xl z-[60] overflow-hidden animate-[fadeUp_0.15s_ease]">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <p className="text-sm font-bold">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[10px] font-medium text-accent-cyan hover:underline flex items-center gap-1"
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-text-3 text-xs">No notifications</div>
            ) : (
              notifications.slice(0, 8).map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 hover:bg-white/[0.02] transition-colors ${!notif.read ? 'bg-accent-cyan/[0.02]' : ''}`}
                  onClick={() => markRead(notif.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${severityStyles[notif.severity]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-xs font-medium ${!notif.read ? 'text-text-1' : 'text-text-2'}`}>
                          {notif.title}
                        </p>
                      </div>
                      <p className="text-[11px] text-text-3 mt-0.5 line-clamp-2">{notif.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono text-text-3">{formatTime(notif.timestamp)}</span>
                        {notif.service && (
                          <span className="text-[10px] font-mono text-text-3 px-1.5 py-0.5 bg-bg-3 rounded">
                            {notif.service}
                          </span>
                        )}
                        {notif.deepLink && (
                          <Link
                            href={notif.deepLink}
                            onClick={() => setOpen(false)}
                            className="text-accent-cyan"
                          >
                            <ExternalLink size={10} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t border-border">
            <Link
              href="/platform/alerts"
              onClick={() => setOpen(false)}
              className="block text-center text-xs text-accent-cyan hover:underline"
            >
              View All Notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
