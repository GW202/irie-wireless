export default function PortInMetrics() {
  return (
    <div className="bg-bg-2 border border-border rounded-[10px] overflow-hidden">
      <div className="p-4 px-5 border-b border-border">
        <div className="text-[0.85rem] font-semibold tracking-tight">Port-In Performance</div>
      </div>
      <div className="p-5">
        <div className="flex flex-col gap-4">
          <div>
            <div className="font-mono text-[0.72rem] text-text-3 uppercase tracking-[0.06em] mb-1">
              Today&apos;s Port-Ins
            </div>
            <div className="text-2xl font-bold text-accent-cyan mt-1">1,247</div>
          </div>
          <div>
            <div className="font-mono text-[0.72rem] text-text-3 uppercase tracking-[0.06em] mb-1">
              Avg Processing Time
            </div>
            <div className="text-2xl font-bold text-accent-green mt-1">4.2 min</div>
          </div>
          <div>
            <div className="font-mono text-[0.72rem] text-text-3 uppercase tracking-[0.06em] mb-1">
              Success Rate
            </div>
            <div className="text-2xl font-bold text-accent-amber mt-1">98.6%</div>
          </div>

          <div className="mt-2 border-t border-border pt-4">
            <div className="font-mono text-[0.72rem] text-text-3 uppercase tracking-[0.06em] mb-2">
              By Carrier
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-[0.75rem]">
                <span className="text-text-3 w-9 font-mono text-[0.65rem]">TMO</span>
                <div className="flex-1 h-1 rounded-sm bg-bg-4 relative">
                  <div
                    className="h-full rounded-sm absolute top-0 left-0 bg-accent-cyan"
                    style={{ width: '74%' }}
                  />
                </div>
                <span className="font-mono text-[0.65rem] text-text-2">924</span>
              </div>
              <div className="flex items-center gap-2 text-[0.75rem]">
                <span className="text-text-3 w-9 font-mono text-[0.65rem]">ATT</span>
                <div className="flex-1 h-1 rounded-sm bg-bg-4 relative">
                  <div
                    className="h-full rounded-sm absolute top-0 left-0 bg-accent-green"
                    style={{ width: '26%' }}
                  />
                </div>
                <span className="font-mono text-[0.65rem] text-text-2">323</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
