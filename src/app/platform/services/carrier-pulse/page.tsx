'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import {
  Radio,
  Users,
  Search,
  FileText,
  TrendingUp,
  Target,
  Zap,
  Clock,
  BookOpen,
  AlertCircle,
} from 'lucide-react';

const CP_STATS = [
  { label: 'Monitored Brands', value: '6', icon: Users, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
  { label: 'Weekly Findings', value: '42', icon: Search, color: 'text-accent-green', bg: 'bg-accent-green/10' },
  { label: 'Active Trends', value: '8', icon: TrendingUp, color: 'text-accent-amber', bg: 'bg-accent-amber/10' },
  { label: 'Pending Actions', value: '12', icon: Target, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
];

const CP_MODULES = [
  { icon: Users, label: 'Brand Digital Twins', description: 'Define and manage brand profiles for intelligence monitoring', status: 'Ready for connection' },
  { icon: Zap, label: 'Research Orchestration', description: 'Autonomous AI-powered research runs across configured categories', status: 'Ready for connection' },
  { icon: Search, label: 'Findings Explorer', description: 'Browse, filter, and analyze discoveries from research runs', status: 'Ready for connection' },
  { icon: BookOpen, label: 'Weekly Briefs', description: 'AI-generated strategic intelligence summaries', status: 'Ready for connection' },
  { icon: TrendingUp, label: 'Trend Analysis', description: 'Track emerging patterns and signals across monitored categories', status: 'Ready for connection' },
  { icon: Target, label: 'Action Items & Leads', description: 'Prioritized recommendations and opportunities from intelligence', status: 'Ready for connection' },
];

export default function CarrierPulsePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 flex items-center justify-center">
              <Radio size={20} className="text-accent-cyan" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CarrierPulse</h1>
              <p className="text-text-3 text-xs">AI-Powered Brand Intelligence</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 bg-accent-cyan/10 text-accent-cyan rounded">
            <Clock size={10} /> v1.0.0
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-1 bg-accent-green/10 text-accent-green rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green" /> Healthy
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CP_STATS.map((stat) => (
          <div key={stat.label} className="bg-bg-2 p-4 rounded-xl border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-xl font-bold font-mono">{stat.value}</h3>
              </div>
              <div className={`p-1.5 rounded ${stat.bg} ${stat.color}`}>
                <stat.icon size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Connection Notice */}
      <div className="bg-accent-cyan/[0.04] border border-accent-cyan/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="text-accent-cyan mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-accent-cyan">CarrierPulse Service Mount Point</p>
            <p className="text-xs text-text-3 mt-1">
              This is the CarrierPulse service mount point within the Irie Platform Shell.
              The full CarrierPulse application will be connected from its dedicated repository.
              All platform context (auth, tenant, permissions) is available to the mounted service.
            </p>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div>
        <h2 className="text-sm font-bold mb-4">Service Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CP_MODULES.map((mod) => (
            <Card key={mod.label} hover>
              <CardBody>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-bg-3 border border-border flex items-center justify-center shrink-0">
                    <mod.icon size={16} className="text-accent-cyan" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold mb-0.5">{mod.label}</h3>
                    <p className="text-[11px] text-text-3 leading-relaxed">{mod.description}</p>
                    <span className="inline-block mt-2 text-[9px] font-mono px-1.5 py-0.5 bg-bg-3 text-text-3 rounded">
                      {mod.status}
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Placeholder Content Area */}
      <Card>
        <EmptyState
          icon={Radio}
          title="CarrierPulse Intelligence Dashboard"
          description="The full CarrierPulse service will be mounted here from its dedicated repository. Digital twins, research runs, findings, briefs, trends, and action items will be available once connected."
        />
      </Card>
    </div>
  );
}
