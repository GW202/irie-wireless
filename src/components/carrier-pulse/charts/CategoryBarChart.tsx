'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CATEGORIES } from '@/lib/carrier-pulse/constants';

interface CategoryData {
  category: string;
  count: number;
}

export default function CategoryBarChart({ data }: { data: CategoryData[] | null | undefined }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-text-3 text-sm">
        No category data yet
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: CATEGORIES[d.category]?.name || d.category,
    count: d.count,
    color: CATEGORIES[d.category]?.color || '#6b7280',
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={{ stroke: '#1e293b' }}
          tickLine={false}
          angle={-30}
          textAnchor="end"
          height={60}
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
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
