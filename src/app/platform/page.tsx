'use client';

import { useAuth } from '@/hooks/useAuth';
import { useTenant } from '@/hooks/useTenant';
import ServiceLauncher from '@/components/platform/ServiceLauncher';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import {
  Building2,
  Smartphone,
  AlertTriangle,
  Activity,
  Radio,
  BarChart3,
  Bot,
  TrendingUp,
} from 'lucide-react';

const PLATFORM_STATS = [
  { label: 'Active Tenants', value: '3', icon: Building2, color: 'text-accent-cyan', bgColor: 'bg-accent-cyan/10' },
  { label: 'Total Devices', value: '24,891', icon: Smartphone, color: 'text-accent-green', bgColor: 'bg-accent-green/10' },
  { label: 'Open Alerts', value: '7', icon: AlertTriangle, color: 'text-accent-amber', bgColor: 'bg-accent-amber/10' },
  { label: 'Services Active', value: '4', icon: Activity, color: 'text-accent-purple', bgColor: 'bg-accent-purple/10' },
];

const RECENT_ACTIVITY = [
  { icon: Radio, color: 'text-accent-cyan', text: 'CarrierPulse generated weekly brief for Bolt Mobile', time: '2h ago' },
  { icon: AlertTriangle, color: 'text-accent-amber', text: 'Usage spike detected for Verdant Wireless US-West', time: '4h ago' },
  { icon: BarChart3, color: 'text-accent-green', text: 'Analytics Engine processed 1.2M records for February', time: '6h ago' },
  { icon: Bot, color: 'text-accent-purple', text: 'AI Support resolved 23 automated tickets', time: '8h ago' },
  { icon: TrendingUp, color: 'text-accent-cyan', text: 'New trend signal: 5G migration acceleration', time: '12h ago' },
  { icon: Building2, color: 'text-accent-green', text: 'NexGen Connect tenant provisioned (trial)', time: '1d ago' },
];

export default function PlatformHomePage() {
  const { session } = useAuth();
  const { activeTenant } = useTenant();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, <span className="text-accent-cyan">{session?.user.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-text-3 text-sm mt-1">
          {activeTenant ? `Managing ${activeTenant.name}` : 'Irie Platform Overview'} &bull; {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLATFORM_STATS.map((stat) => (
          <div key={stat.label} className="bg-bg-2 p-5 rounded-xl border border-border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold font-mono tracking-tighter">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded ${stat.bgColor} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div>
        <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
          <Activity size={16} className="text-accent-cyan" />
          Services
        </h2>
        <ServiceLauncher />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <TrendingUp size={16} className="text-accent-cyan" />
          Recent Platform Activity
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-border">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
                <div className={`p-1.5 rounded bg-bg-3 ${item.color}`}>
                  <item.icon size={14} />
                </div>
                <p className="text-xs text-text-2 flex-1">{item.text}</p>
                <span className="text-[10px] font-mono text-text-3 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
