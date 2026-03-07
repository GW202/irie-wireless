'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import {
  BarChart3,
  PieChart,
  FileText,
  Scale,
  Download,
  Clock,
  Layout,
  Calculator,
} from 'lucide-react';

const AN_MODULES = [
  { icon: Calculator, label: 'KPI Engine', description: 'Calculate and track subscriber count, ARPU, churn rate, and custom KPIs' },
  { icon: Layout, label: 'Dashboards', description: 'Configurable visual dashboards with real-time data widgets' },
  { icon: FileText, label: 'Reports', description: 'Scheduled and on-demand reporting with customizable templates' },
  { icon: Scale, label: 'Benchmarks', description: 'Compare performance across tenants, carriers, and industry benchmarks' },
  { icon: PieChart, label: 'Segmentation', description: 'Subscriber and device segmentation with cohort analysis' },
  { icon: Download, label: 'Exports', description: 'CSV, PDF, and API-based data export capabilities' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-amber/10 flex items-center justify-center">
            <BarChart3 size={20} className="text-accent-amber" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Analytics Engine</h1>
            <p className="text-text-3 text-xs">Decision-Grade Metrics & Reporting</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 bg-bg-4 text-text-3 rounded">
            <Clock size={10} /> v0.8.0
          </span>
          <span className="text-[10px] font-mono px-2 py-1 bg-bg-4 text-text-3 rounded">COMING SOON</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {AN_MODULES.map((mod) => (
          <Card key={mod.label}>
            <CardBody>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-bg-3 border border-border flex items-center justify-center shrink-0">
                  <mod.icon size={16} className="text-accent-amber" />
                </div>
                <div>
                  <h3 className="text-xs font-bold mb-0.5">{mod.label}</h3>
                  <p className="text-[11px] text-text-3 leading-relaxed">{mod.description}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <EmptyState
          icon={BarChart3}
          title="Analytics Engine Coming Soon"
          description="KPI engine, dashboards, reports, benchmarks, and exports. Turn raw operational data into decision-grade metrics."
        />
      </Card>
    </div>
  );
}
