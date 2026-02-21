import { WORKFLOW_NODES } from '@/lib/constants';

export default function WorkflowEngine() {
  return (
    <div className="bg-bg-2 border border-border rounded-[10px] overflow-hidden">
      <div className="p-4 px-5 border-b border-border flex items-center justify-between">
        <div className="text-[0.85rem] font-semibold tracking-tight">
          Subscriber Activation Workflow
        </div>
        <span className="font-mono text-[0.55rem] px-2 py-0.5 rounded bg-accent-green/10 text-accent-green uppercase tracking-wide">
          Processing 142
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-0 py-4 overflow-x-auto">
          {WORKFLOW_NODES.map((node, i) => (
            <div key={node.label} className="contents">
              <div className="flex flex-col items-center gap-1.5 min-w-[90px] text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[0.85rem] border-2 transition-all duration-300 relative ${
                    node.status === 'done'
                      ? 'border-accent-green bg-accent-green/[0.08]'
                      : node.status === 'active'
                      ? 'border-accent-cyan bg-bg-3 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                      : 'border-border bg-bg-3'
                  }`}
                >
                  {node.status === 'active' ? (
                    <span className="animate-spin">{node.icon}</span>
                  ) : (
                    node.icon
                  )}
                </div>
                <div className="font-mono text-[0.62rem] text-text-3 uppercase tracking-[0.05em]">
                  {node.label}
                </div>
              </div>
              {i < WORKFLOW_NODES.length - 1 && (
                <div
                  className={`flex-1 h-0.5 min-w-[20px] -mt-5 ${
                    node.status === 'done' && WORKFLOW_NODES[i + 1].status === 'done'
                      ? 'bg-accent-green'
                      : node.status === 'done' && WORKFLOW_NODES[i + 1].status === 'active'
                      ? 'bg-gradient-to-r from-accent-green to-accent-cyan animate-[flowPulse_2s_ease_infinite]'
                      : 'bg-border'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
