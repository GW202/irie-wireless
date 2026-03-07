'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendData {
  week: string;
  count: number;
}

interface TrendLineChartProps {
  data: TrendData[] | null | undefined;
  dataKey?: string;
  color?: string;
  title?: string;
}

export default function TrendLineChart({
  data,
  dataKey = 'count',
  color = '#3b82f6',
  title,
}: TrendLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-text-3 text-sm">
        No trend data yet
      </div>
    );
  }

  return (
    <div>
      {title && <h4 className="text-sm font-medium text-text-2 mb-3">{title}</h4>}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <XAxis
            dataKey="week"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: '#1e293b' }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
