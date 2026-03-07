'use client';

import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Plug, Wifi, Database, Key, Globe } from 'lucide-react';

const INTEGRATIONS = [
  {
    name: 'T-Mobile Wholesale API',
    type: 'Carrier API',
    icon: Wifi,
    status: 'connected',
    version: 'v4.2.1',
    lastSync: '2 min ago',
  },
  {
    name: 'AT&T Wholesale API',
    type: 'Carrier API',
    icon: Wifi,
    status: 'connected',
    version: 'v3.8.0',
    lastSync: '5 min ago',
  },
  {
    name: 'Telgoo5 BSS',
    type: 'BSS Adapter',
    icon: Database,
    status: 'connected',
    version: 'v2.4.1',
    lastSync: '1 min ago',
  },
  {
    name: 'Netcracker BSS',
    type: 'BSS Adapter',
    icon: Database,
    status: 'degraded',
    version: 'v1.2.9',
    lastSync: '12 min ago',
  },
  {
    name: 'Webhook Endpoints',
    type: 'Webhook',
    icon: Globe,
    status: 'configured',
    version: '3 endpoints',
    lastSync: 'N/A',
  },
  {
    name: 'API Keys',
    type: 'Authentication',
    icon: Key,
    status: 'active',
    version: '2 keys',
    lastSync: 'N/A',
  },
];

const statusStyles: Record<string, { dot: string; label: string }> = {
  connected: { dot: 'bg-accent-green', label: 'Connected' },
  degraded: { dot: 'bg-accent-amber', label: 'Degraded' },
  configured: { dot: 'bg-accent-cyan', label: 'Configured' },
  active: { dot: 'bg-accent-green', label: 'Active' },
  disconnected: { dot: 'bg-accent-red', label: 'Disconnected' },
};

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Integrations</h2>
        <p className="text-text-3 text-xs">Carrier API connections, BSS adapters, and external integrations</p>
      </div>

      <div className="space-y-3">
        {INTEGRATIONS.map((int) => {
          const status = statusStyles[int.status] || statusStyles.disconnected;
          return (
            <Card key={int.name} hover>
              <CardBody className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-bg-3 border border-border flex items-center justify-center shrink-0">
                    <int.icon size={18} className="text-accent-cyan" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{int.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-bg-3 text-text-3 rounded">{int.type}</span>
                      <span className="text-[10px] text-text-3 font-mono">{int.version}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                      <span className="text-[10px] font-mono text-text-2">{status.label}</span>
                    </div>
                    <p className="text-[10px] text-text-3 mt-0.5">Last sync: {int.lastSync}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}

        <button className="w-full py-3 border border-dashed border-border rounded-xl text-text-3 text-xs font-medium hover:bg-white/5 transition-colors">
          + Add Integration
        </button>
      </div>
    </div>
  );
}
