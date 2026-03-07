'use client';

import {
  useTrendCategories,
  useTrendCarriers,
  useTrendRelevance,
  useTrendActions,
} from '@/hooks/carrier-pulse/useTrends';
import TrendLineChart from '@/components/carrier-pulse/charts/TrendLineChart';
import { CATEGORIES, CARRIERS } from '@/lib/carrier-pulse/constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function TrendsPage() {
  const { data: catData } = useTrendCategories();
  const { data: carrierData } = useTrendCarriers();
  const { data: relData } = useTrendRelevance();
  const { data: actionData } = useTrendActions();

  // Transform category data into stacked format
  const catByWeek: Record<string, Record<string, string | number>> = {};
  if (catData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (catData as any[]).forEach(({ week, category, count }: { week: string; category: string; count: number }) => {
      if (!catByWeek[week]) catByWeek[week] = { week };
      catByWeek[week][category] = count;
    });
  }
  const stackedCatData = Object.values(catByWeek);

  // Transform relevance data into line format
  const relByWeek: Record<string, { week: string; count: number }> = {};
  if (relData) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (relData as any[]).forEach(({ week, relevance, count }: { week: string; relevance: string; count: number }) => {
      if (relevance === 'high') {
        if (!relByWeek[week]) relByWeek[week] = { week, count: 0 };
        relByWeek[week].count = count;
      }
    });
  }
  const highRelData = Object.values(relByWeek);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stacked category chart */}
        <div className="bg-bg-2 border border-border rounded-xl p-5">
          <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-4">
            Findings by Category per Week
          </h3>
          {stackedCatData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stackedCatData}>
                <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {Object.entries(CATEGORIES).map(([key, cat]) => (
                  <Bar key={key} dataKey={key} stackId="a" fill={cat.color} name={cat.name} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-text-3 h-48 flex items-center justify-center">No data yet</p>
          )}
        </div>

        {/* High-priority findings trend */}
        <div className="bg-bg-2 border border-border rounded-xl p-5">
          <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-4">
            High-Priority Findings per Week
          </h3>
          <TrendLineChart data={highRelData} color="#ef4444" />
        </div>

        {/* New actions per week */}
        <div className="bg-bg-2 border border-border rounded-xl p-5">
          <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-4">
            New Actions per Week
          </h3>
          <TrendLineChart data={(actionData as { week: string; count: number }[]) || []} color="#10b981" />
        </div>

        {/* Carrier trends */}
        <div className="bg-bg-2 border border-border rounded-xl p-5">
          <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-4">
            Carrier Mentions per Week
          </h3>
          {carrierData && (carrierData as unknown[]).length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={(() => {
                  const grouped: Record<string, Record<string, string | number>> = {};
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (carrierData as any[]).forEach(({ week, carrier, count }: { week: string; carrier: string; count: number }) => {
                    if (!grouped[week]) grouped[week] = { week };
                    grouped[week][carrier] = count;
                  });
                  return Object.values(grouped);
                })()}
              >
                <XAxis dataKey="week" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#1e293b' }} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9' }} />
                {Object.entries(CARRIERS).map(([key, c]) => (
                  <Bar key={key} dataKey={key} fill={c.color} name={c.name} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-text-3 h-48 flex items-center justify-center">No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
