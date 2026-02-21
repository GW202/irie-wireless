'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import { SUBSCRIBER_CHART_DATA } from '@/lib/constants';

type Range = '7D' | '30D' | '90D';

export default function SubscriberChart() {
  const [range, setRange] = useState<Range>('7D');

  return (
    <div className="bg-bg-2 border border-border rounded-[10px] overflow-hidden">
      <div className="p-4 px-5 border-b border-border flex items-center justify-between">
        <div className="text-[0.85rem] font-semibold tracking-tight">Subscriber Growth</div>
        <div className="flex gap-2">
          {(['7D', '30D', '90D'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`font-mono text-[0.62rem] px-2.5 py-1 rounded border cursor-pointer transition-all duration-150 ${
                range === r
                  ? 'bg-accent-cyan/[0.08] text-accent-cyan border-accent-cyan/20'
                  : 'bg-transparent text-text-3 border-border hover:text-text-2 hover:border-border-light'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="p-5">
        <div className="w-full h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={SUBSCRIBER_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,35,50,0.8)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#4a5d75', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#4a5d75', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                width={45}
              />
              <Tooltip
                contentStyle={{
                  background: '#0d1219',
                  border: '1px solid #1a2332',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontFamily: 'JetBrains Mono',
                }}
                labelStyle={{ color: '#e8edf5' }}
              />
              <defs>
                <linearGradient id="activationsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#00e5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="activations"
                fill="url(#activationsGrad)"
                stroke="#00e5ff"
                strokeWidth={2}
                dot={{ r: 3, fill: '#00e5ff' }}
                name="Activations"
              />
              <Line
                type="monotone"
                dataKey="portIns"
                stroke="#00ff9d"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="Port-Ins"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
