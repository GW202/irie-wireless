'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import {
  Activity,
  Database,
  Zap,
  AlertTriangle,
  TrendingUp,
  Clock,
  ArrowDownUp,
  Gauge,
} from 'lucide-react';

const UE_MODULES = [
  { icon: ArrowDownUp, label: 'Usage Ingestion', description: 'Real-time ingestion of usage events from carrier APIs and BSS platforms' },
  { icon: Database, label: 'Normalization', description: 'Transform raw carrier data into canonical usage event format' },
  { icon: Zap, label: 'Real-time Processing', description: 'Stream processing of usage events with sub-second latency' },
  { icon: Gauge, label: 'Aggregation', description: 'Time-series aggregation across devices, SIMs, carriers, and tenants' },
  { icon: AlertTriangle, label: 'Anomaly Detection', description: 'ML-powered detection of usage spikes, billing anomalies, and fraud patterns' },
  { icon: TrendingUp, label: 'Forecasting', description: 'Predictive models for usage trends, cost projections, and capacity planning' },
];

export default function UsageEnginePage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center">
            <Activity size={20} className="text-accent-green" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Usage Engine</h1>
            <p className="text-text-3 text-xs">Telecom Usage Processing & Visibility</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 bg-bg-4 text-text-3 rounded">
            <Clock size={10} /> v0.9.0
          </span>
          <span className="text-[10px] font-mono px-2 py-1 bg-bg-4 text-text-3 rounded">COMING SOON</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {UE_MODULES.map((mod) => (
          <Card key={mod.label}>
            <CardBody>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-bg-3 border border-border flex items-center justify-center shrink-0">
                  <mod.icon size={16} className="text-accent-green" />
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
          icon={Activity}
          title="Usage Engine Coming Soon"
          description="Usage ingestion, normalization, real-time processing, anomaly detection, and forecasting. This service is under development."
        />
      </Card>
    </div>
  );
}
