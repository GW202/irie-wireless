import { CARRIERS } from '@/lib/constants';

export default function CarrierStatus() {
  return (
    <div className="bg-bg-2 border border-border rounded-[10px] overflow-hidden">
      <div className="p-4 px-5 border-b border-border">
        <div className="text-[0.85rem] font-semibold tracking-tight">Carrier Integrations</div>
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-3">
          {CARRIERS.map((carrier) => (
            <div
              key={carrier.code}
              className="flex items-center gap-3 py-3 px-3.5 bg-bg-3 rounded-lg border border-transparent transition-all duration-200 hover:border-border"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-mono text-[0.6rem] font-bold shrink-0"
                style={{ background: carrier.bgColor, color: carrier.color }}
              >
                {carrier.code}
              </div>
              <div className="flex-1">
                <div className="text-[0.82rem] font-medium mb-0.5">{carrier.name}</div>
                <div className="text-[0.65rem] text-text-3 font-mono">
                  Latency: {carrier.latency} · {carrier.subscribers} subs
                </div>
              </div>
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  carrier.status === 'online'
                    ? 'bg-accent-green shadow-[0_0_8px_rgba(0,255,157,0.4)]'
                    : 'bg-accent-amber shadow-[0_0_8px_rgba(255,184,0,0.4)]'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
