'use client';

import { useState, useEffect, useRef } from 'react';

interface FeedEntry {
  time: string;
  status: 'NORMALIZED' | 'RETRYING' | 'CACHE_HIT';
  brand: string;
  action: string;
  detail: string;
}

const INITIAL_ENTRIES: FeedEntry[] = [
  { time: '14:02:11.458', status: 'NORMALIZED', brand: 'alpha-mobile', action: 'telgoo5.sub_update', detail: '{ id: "049-A", msisdn: "+1415..." }' },
  { time: '14:02:11.892', status: 'NORMALIZED', brand: 'beta-wireless', action: 'att.sim_swap', detail: '{ iccid: "89014...", status: "PENDING" }' },
  { time: '14:02:12.112', status: 'RETRYING', brand: 'gamma-connect', action: 'netcracker.bill_cycle', detail: '{ err: "CONN_TIMEOUT", retry_cnt: 2 }' },
  { time: '14:02:12.441', status: 'NORMALIZED', brand: 'alpha-mobile', action: 'telgoo5.data_topup', detail: '{ amt: "10GB", plan_id: "UL_4G" }' },
  { time: '14:02:12.785', status: 'CACHE_HIT', brand: 'system.auth', action: 'auth_srv.verify', detail: '{ token: "********", role: "admin" }' },
  { time: '14:02:13.001', status: 'NORMALIZED', brand: 'alpha-mobile', action: 'telgoo5.usage_sync', detail: '{ bucket: "intl_roam", usage: "148MB" }' },
];

const CYCLING_ENTRIES: FeedEntry[] = [
  { time: '', status: 'NORMALIZED', brand: 'alpha-mobile', action: 'telgoo5.esim_activate', detail: '{ iccid: "89001...", profile: "LTE_A" }' },
  { time: '', status: 'NORMALIZED', brand: 'beta-wireless', action: 'att.port_in', detail: '{ mdn: "+1212...", status: "COMPLETE" }' },
  { time: '', status: 'RETRYING', brand: 'gamma-connect', action: 'netcracker.sub_sync', detail: '{ err: "TIMEOUT", retry_cnt: 1 }' },
  { time: '', status: 'NORMALIZED', brand: 'alpha-mobile', action: 'telgoo5.plan_change', detail: '{ from: "5GB", to: "UL_5G" }' },
  { time: '', status: 'CACHE_HIT', brand: 'system.billing', action: 'billing_srv.charge', detail: '{ amt: "$45.00", cycle: "monthly" }' },
  { time: '', status: 'NORMALIZED', brand: 'beta-wireless', action: 'att.usage_report', detail: '{ data: "2.4GB", voice: "120min" }' },
];

const statusColors: Record<string, string> = {
  NORMALIZED: 'text-accent-green',
  RETRYING: 'text-accent-amber',
  CACHE_HIT: 'text-accent-cyan',
};

function getTimestamp(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
}

export default function LiveTransformationFeed() {
  const [entries, setEntries] = useState<FeedEntry[]>(INITIAL_ENTRIES);
  const cycleIdx = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const template = CYCLING_ENTRIES[cycleIdx.current % CYCLING_ENTRIES.length];
      const newEntry: FeedEntry = { ...template, time: getTimestamp() };
      setEntries((prev) => {
        const next = [newEntry, ...prev];
        if (next.length > 10) next.pop();
        return next;
      });
      cycleIdx.current++;
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-bg-2 rounded-[10px] border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h4 className="font-bold flex items-center gap-2 text-sm">
          <span className="text-accent-cyan">&#x2588;</span>
          Live Transformation Feed
        </h4>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 bg-bg-3 text-[10px] font-mono text-text-3 rounded">
            POST: 1.2k/min
          </span>
          <span className="px-2 py-0.5 bg-bg-3 text-[10px] font-mono text-text-3 rounded">
            GET: 450/min
          </span>
        </div>
      </div>
      <div className="bg-black/40 p-4 font-mono text-[11px] h-64 overflow-y-auto space-y-1">
        {entries.map((entry, i) => (
          <div
            key={`${entry.time}-${entry.action}-${i}`}
            className="flex items-center gap-4 group animate-[fadeDown_0.4s_ease]"
          >
            <span className="text-text-3 shrink-0">{entry.time}</span>
            <span className={`${statusColors[entry.status]} shrink-0`}>
              [{entry.status}]
            </span>
            <span className="text-text-2 truncate">
              {entry.brand} &rarr;{' '}
              <span className="text-accent-cyan">{entry.action}</span>{' '}
              {entry.detail}
            </span>
            <span className="ml-auto text-text-3 opacity-0 group-hover:opacity-100 cursor-pointer shrink-0">
              inspect
            </span>
          </div>
        ))}
        <div className="flex items-center gap-4">
          <span className="text-text-3 opacity-50 italic">
            {'// Listening for events...'}
          </span>
        </div>
      </div>
    </div>
  );
}
