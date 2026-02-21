'use client';

import { useState, useEffect, useRef } from 'react';
import { INITIAL_ACTIVITIES, CYCLING_ACTIVITIES } from '@/lib/constants';
import { ActivityItem } from '@/lib/types';

const dotColors = {
  cyan: 'bg-accent-cyan',
  green: 'bg-accent-green',
  amber: 'bg-accent-amber',
  red: 'bg-accent-red',
};

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const cycleIdx = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = CYCLING_ACTIVITIES[cycleIdx.current % CYCLING_ACTIVITIES.length];
      setActivities((prev) => {
        const next = [newActivity, ...prev];
        if (next.length > 10) next.pop();
        return next;
      });
      cycleIdx.current++;
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-bg-2 border border-border rounded-[10px] overflow-hidden">
      <div className="p-4 px-5 border-b border-border flex items-center justify-between">
        <div className="text-[0.85rem] font-semibold tracking-tight">Orchestration Activity</div>
        <div className="flex gap-2">
          <button className="font-mono text-[0.62rem] px-2.5 py-1 rounded border bg-accent-cyan/[0.08] text-accent-cyan border-accent-cyan/20">
            All
          </button>
          <button className="font-mono text-[0.62rem] px-2.5 py-1 rounded border bg-transparent text-text-3 border-border">
            Errors
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex flex-col">
          {activities.map((item, i) => (
            <div
              key={`${item.brand}-${item.text}-${i}`}
              className="flex gap-3 py-3 border-b border-border/40 last:border-b-0 items-start animate-[fadeUp_0.4s_ease]"
            >
              <div className={`w-[7px] h-[7px] rounded-full shrink-0 mt-1.5 ${dotColors[item.dot]}`} />
              <div>
                <div className="text-[0.78rem] text-text-2 leading-relaxed">
                  <strong className="text-text-1 font-medium">{item.brand}</strong> — {item.text}
                </div>
                <div className="text-[0.6rem] text-text-3 font-mono mt-0.5">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
