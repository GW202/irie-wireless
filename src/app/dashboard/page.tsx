'use client';

import dynamic from 'next/dynamic';
import { Database, Users, Gauge, CheckCircle, TrendingUp, Puzzle, RefreshCw, MoreVertical, Network } from 'lucide-react';

const LiveTransformationFeed = dynamic(
  () => import('@/components/dashboard/LiveTransformationFeed'),
  { ssr: false }
);

const STAT_CARDS = [
  {
    label: 'Normalized Records',
    value: '1,248,392',
    icon: <Database size={20} />,
    iconBg: 'bg-accent-cyan/10',
    iconColor: 'text-accent-cyan',
    sparkHeights: ['h-1/2', 'h-2/3', 'h-1/2', 'h-3/4', 'h-full', 'h-4/5', 'h-2/3'],
    sparkOpacities: ['bg-accent-cyan/10', 'bg-accent-cyan/10', 'bg-accent-cyan/20', 'bg-accent-cyan/30', 'bg-accent-cyan', 'bg-accent-cyan/60', 'bg-accent-cyan/40'],
  },
  {
    label: 'Active Tenants',
    value: '42',
    detail: '+4 this billing period',
    icon: <Users size={20} />,
    iconBg: 'bg-accent-cyan/10',
    iconColor: 'text-accent-cyan',
  },
  {
    label: 'Avg Latency (ms)',
    value: '142ms',
    detail: '+12ms spikes detected',
    detailColor: 'text-accent-red',
    icon: <Gauge size={20} />,
    iconBg: 'bg-accent-amber/10',
    iconColor: 'text-accent-amber',
  },
  {
    label: 'Provisioning Success',
    value: '99.98%',
    detail: 'Operational',
    icon: <CheckCircle size={20} />,
    iconBg: 'bg-accent-purple/10',
    iconColor: 'text-accent-purple',
  },
];

const PIPELINE_BARS = [
  { h: 'h-24', overlay: 'h-16' },
  { h: 'h-32' },
  { h: 'h-28' },
  { h: 'h-40' },
  { h: 'h-36' },
  { h: 'h-44' },
  { h: 'h-[152px]' },
  { h: 'h-48' },
  { h: 'h-[168px]' },
  { h: 'h-36' },
];

const PROVIDERS = [
  { code: 'TG5', name: 'Telgoo5 Integration', version: 'v2.4.1', protocol: 'SOAP/REST', status: 'UP', statusColor: 'bg-accent-green/10 text-accent-green', latency: '24ms' },
  { code: 'ATT', name: 'AT&T Wireless', version: 'v4.0.0', protocol: 'NATIVE', status: 'UP', statusColor: 'bg-accent-green/10 text-accent-green', latency: '82ms' },
  { code: 'NCR', name: 'Netcracker BSS', version: 'v1.2.9', protocol: 'LEGACY', status: 'WARN', statusColor: 'bg-accent-amber/10 text-accent-amber', latency: '412ms' },
];

const TENANTS = [
  { name: 'Alpha Mobile', initial: 'A', color: 'bg-accent-cyan/20 text-accent-cyan', provider: 'Telgoo5', subscribers: '14,203', health: 'w-full', healthColor: 'bg-accent-cyan' },
  { name: 'Beta Wireless', initial: 'B', color: 'bg-accent-cyan/20 text-accent-cyan', provider: 'AT&T Native', subscribers: '4,192', health: 'w-3/4', healthColor: 'bg-accent-cyan' },
  { name: 'Gamma Connect', initial: 'G', color: 'bg-accent-purple/20 text-accent-purple', provider: 'Mixed (Netcracker)', subscribers: '2,851', health: 'w-1/2', healthColor: 'bg-accent-amber' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="bg-bg-2 p-5 rounded-xl border border-border glow-border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-1">
                  {card.label}
                </p>
                <h3 className="text-2xl font-bold font-mono tracking-tighter">{card.value}</h3>
              </div>
              <div className={`p-2 ${card.iconBg} rounded ${card.iconColor}`}>
                {card.icon}
              </div>
            </div>
            {card.sparkHeights ? (
              <div className="h-12 flex items-end gap-1">
                {card.sparkHeights.map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${card.sparkOpacities?.[i] || 'bg-accent-cyan/10'} ${h} rounded-t-sm`}
                  />
                ))}
              </div>
            ) : card.detail ? (
              <p className="text-xs text-text-3">
                <span className={`font-mono ${card.detailColor || 'text-accent-cyan'}`}>
                  {card.detail.split(' ')[0]}
                </span>{' '}
                {card.detail.split(' ').slice(1).join(' ')}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      {/* Transformation Pipeline + Provider Adapters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-2 rounded-xl border border-border overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h4 className="font-bold flex items-center gap-2 text-sm">
              <TrendingUp size={16} className="text-accent-cyan" />
              Transformation Pipeline
            </h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-accent-cyan rounded-full" />
                <span className="text-[10px] font-mono text-text-3 uppercase">Normalized</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-bg-4 rounded-full" />
                <span className="text-[10px] font-mono text-text-3 uppercase">Inbound</span>
              </div>
            </div>
          </div>
          <div className="flex-1 p-6 relative">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: 'radial-gradient(var(--color-accent-cyan) 1px, transparent 0)',
                backgroundSize: '20px 20px',
              }}
            />
            <div className="w-full h-48 flex items-end gap-2 px-4 relative z-[1]">
              {PIPELINE_BARS.map((bar, i) => (
                <div key={i} className="flex-1 relative group">
                  {i === 0 && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-bg-2 px-2 py-1 rounded text-[10px] border border-border opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      12.4k
                    </div>
                  )}
                  <div className={`w-full bg-bg-4 ${bar.h} rounded-t-sm`} />
                  {bar.overlay && (
                    <div className={`w-full bg-accent-cyan ${bar.overlay} -mt-16 rounded-t-sm opacity-80`} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-[10px] font-mono text-text-3 px-4">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>23:59</span>
            </div>
          </div>
        </div>

        <div className="bg-bg-2 rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border">
            <h4 className="font-bold flex items-center gap-2 text-sm">
              <Puzzle size={16} className="text-accent-cyan" />
              Provider Adapters
            </h4>
          </div>
          <div className="p-4 space-y-3">
            {PROVIDERS.map((p) => (
              <div
                key={p.code}
                className="flex items-center gap-4 p-3 bg-white/5 border border-border rounded-lg"
              >
                <div className="w-10 h-10 rounded bg-bg-3 flex items-center justify-center border border-border shadow-sm shrink-0">
                  <span className="font-black text-xs">{p.code}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-[10px] font-mono text-text-3">
                    {p.version} &bull; {p.protocol}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-mono ${p.statusColor} px-2 py-0.5 rounded`}>
                    {p.status}
                  </span>
                  <p className="text-[10px] text-text-3 mt-1">{p.latency}</p>
                </div>
              </div>
            ))}
            <button className="w-full py-2 border border-dashed border-border rounded-lg text-text-3 text-xs font-medium hover:bg-white/5 transition-colors">
              + Add New Provider Adapter
            </button>
          </div>
        </div>
      </div>

      {/* Tenant Brands + Canonical Logic Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-2 rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h4 className="font-bold flex items-center gap-2 text-sm">
              <Users size={16} className="text-accent-cyan" />
              Tenant Brands
            </h4>
            <button className="text-xs text-accent-cyan font-medium hover:underline">
              View All Tenants
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] border-b border-border">
                  <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-text-3">
                    Brand Name
                  </th>
                  <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-text-3">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-text-3 text-right">
                    Subscribers
                  </th>
                  <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-text-3">
                    Health
                  </th>
                  <th className="px-6 py-3 text-[10px] font-mono uppercase tracking-widest text-text-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {TENANTS.map((t) => (
                  <tr key={t.name} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded ${t.color} flex items-center justify-center font-bold text-sm`}
                        >
                          {t.initial}
                        </div>
                        <span className="text-sm font-medium">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-text-2">{t.provider}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-mono">{t.subscribers}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-1.5 bg-bg-4 rounded-full overflow-hidden">
                        <div className={`h-full ${t.healthColor} ${t.health}`} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-text-3 hover:text-text-1">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-bg-2 rounded-xl border border-border flex flex-col">
          <div className="p-5 border-b border-border">
            <h4 className="font-bold flex items-center gap-2 text-sm">
              <Network size={16} className="text-accent-cyan" />
              Canonical Logic Map
            </h4>
          </div>
          <div className="flex-1 p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative z-10 w-full flex flex-col items-center gap-8">
              <div className="px-4 py-2 bg-accent-cyan/20 border border-accent-cyan text-accent-cyan rounded text-[10px] font-mono">
                CANONICAL_BSS_V1
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="grid grid-cols-2 gap-8 w-full">
                <div className="flex flex-col items-center">
                  <div className="p-2 border border-border rounded bg-bg-2 text-[10px] font-mono">
                    ACCOUNT_MGR
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="px-3 py-1 bg-white/5 border border-border rounded text-[9px] font-mono text-text-3">
                    normalized.auth
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="p-2 border border-border rounded bg-bg-2 text-[10px] font-mono">
                    PROVISION_SRV
                  </div>
                  <div className="w-px h-4 bg-border" />
                  <div className="px-3 py-1 bg-white/5 border border-border rounded text-[9px] font-mono text-text-3">
                    normalized.sim
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.03),transparent_70%)]" />
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-text-3">LAST SYNC: 2m ago</span>
              <button className="flex items-center gap-1 text-[10px] font-bold text-accent-cyan">
                <RefreshCw size={12} />
                RESYNC NODES
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Transformation Feed */}
      <LiveTransformationFeed />
    </div>
  );
}
