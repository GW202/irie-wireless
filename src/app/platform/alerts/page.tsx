'use client';

import { useState, useContext } from 'react';
import Tabs from '@/components/ui/Tabs';
import { Card, CardBody } from '@/components/ui/Card';
import { NotificationContext } from '@/contexts/NotificationContext';
import { NotificationSeverity } from '@/lib/types';
import { Bell, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const severityStyles: Record<NotificationSeverity, { dot: string; label: string }> = {
  info: { dot: 'bg-accent-cyan', label: 'Info' },
  warning: { dot: 'bg-accent-amber', label: 'Warning' },
  critical: { dot: 'bg-accent-red', label: 'Critical' },
  success: { dot: 'bg-accent-green', label: 'Success' },
};

export default function AlertsPage() {
  const { notifications, markRead, markAllRead } = useContext(NotificationContext);
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter((n) => !n.read).length },
    { id: 'critical', label: 'Critical', count: notifications.filter((n) => n.severity === 'critical').length },
    { id: 'warning', label: 'Warning', count: notifications.filter((n) => n.severity === 'warning').length },
  ];

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    return n.severity === activeTab;
  });

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight mb-1">Alerts & Notifications</h1>
          <p className="text-text-3 text-xs">Platform-wide alerts, intelligence briefs, and system notifications</p>
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center gap-1.5 text-xs text-accent-cyan hover:underline"
        >
          <Check size={14} /> Mark all read
        </button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-text-3 text-sm">No notifications in this category</div>
        ) : (
          filtered.map((notif) => {
            const severity = severityStyles[notif.severity];
            return (
              <Card key={notif.id} hover onClick={() => markRead(notif.id)}>
                <CardBody className="p-4">
                  <div className="flex items-start gap-4">
                    <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${severity.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-medium ${!notif.read ? 'text-text-1' : 'text-text-2'}`}>
                          {notif.title}
                        </p>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-3">{notif.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-mono text-text-3">{formatTime(notif.timestamp)}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${notif.severity === 'critical' ? 'bg-accent-red/10 text-accent-red' : notif.severity === 'warning' ? 'bg-accent-amber/10 text-accent-amber' : 'bg-bg-3 text-text-3'}`}>
                          {severity.label}
                        </span>
                        {notif.service && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-3 text-text-3 rounded">
                            {notif.service}
                          </span>
                        )}
                        {notif.deepLink && (
                          <Link href={notif.deepLink} className="text-accent-cyan hover:underline text-[10px] flex items-center gap-1">
                            View <ExternalLink size={10} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
