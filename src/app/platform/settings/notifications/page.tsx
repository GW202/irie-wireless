'use client';

import { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';

interface NotifPref {
  id: string;
  label: string;
  description: string;
  email: boolean;
  inApp: boolean;
  sms: boolean;
}

const INITIAL_PREFS: NotifPref[] = [
  { id: 'intelligence_brief', label: 'Intelligence Brief Ready', description: 'When CarrierPulse generates a new weekly brief', email: true, inApp: true, sms: false },
  { id: 'usage_spike', label: 'Usage Spike Detected', description: 'When abnormal usage patterns are detected', email: true, inApp: true, sms: true },
  { id: 'carrier_outage', label: 'Carrier Outage', description: 'When a carrier reports service degradation or outage', email: true, inApp: true, sms: true },
  { id: 'ai_recommendation', label: 'AI Recommendation', description: 'When AI Support generates a new recommendation', email: false, inApp: true, sms: false },
  { id: 'report_ready', label: 'Report Ready', description: 'When a scheduled report is generated', email: true, inApp: true, sms: false },
  { id: 'billing_anomaly', label: 'Billing Anomaly', description: 'When billing patterns exceed expected thresholds', email: true, inApp: true, sms: false },
  { id: 'security_alert', label: 'Security Alert', description: 'Security-related platform events', email: true, inApp: true, sms: true },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-8 h-4.5 rounded-full transition-colors relative ${checked ? 'bg-accent-cyan' : 'bg-bg-4'}`}
    >
      <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-transform ${checked ? 'left-4' : 'left-0.5'}`} />
    </button>
  );
}

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState(INITIAL_PREFS);

  const togglePref = (id: string, channel: 'email' | 'inApp' | 'sms') => {
    setPrefs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [channel]: !p[channel] } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Notification Preferences</h2>
        <p className="text-text-3 text-xs">Configure how you receive alerts and notifications</p>
      </div>

      <Card>
        <CardHeader>
          <Bell size={16} className="text-accent-cyan" />
          Alert Channels
        </CardHeader>
        <CardBody className="p-0">
          <div className="grid grid-cols-[1fr_60px_60px_60px] gap-4 px-6 py-3 border-b border-border">
            <div />
            <div className="text-center"><Mail size={14} className="mx-auto text-text-3" /><p className="text-[9px] text-text-3 mt-0.5">Email</p></div>
            <div className="text-center"><MessageSquare size={14} className="mx-auto text-text-3" /><p className="text-[9px] text-text-3 mt-0.5">In-App</p></div>
            <div className="text-center"><Smartphone size={14} className="mx-auto text-text-3" /><p className="text-[9px] text-text-3 mt-0.5">SMS</p></div>
          </div>
          {prefs.map((pref) => (
            <div key={pref.id} className="grid grid-cols-[1fr_60px_60px_60px] gap-4 px-6 py-3 border-b border-border last:border-0 hover:bg-white/[0.02]">
              <div>
                <p className="text-xs font-medium">{pref.label}</p>
                <p className="text-[10px] text-text-3">{pref.description}</p>
              </div>
              <div className="flex justify-center items-center"><Toggle checked={pref.email} onChange={() => togglePref(pref.id, 'email')} /></div>
              <div className="flex justify-center items-center"><Toggle checked={pref.inApp} onChange={() => togglePref(pref.id, 'inApp')} /></div>
              <div className="flex justify-center items-center"><Toggle checked={pref.sms} onChange={() => togglePref(pref.id, 'sms')} /></div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
