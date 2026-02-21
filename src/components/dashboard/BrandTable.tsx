import { BRANDS } from '@/lib/constants';
import StatusPill from '@/components/ui/StatusPill';
import ProgressBar from '@/components/ui/ProgressBar';

export default function BrandTable() {
  return (
    <div className="bg-bg-2 border border-border rounded-[10px] overflow-hidden">
      <div className="p-4 px-5 border-b border-border flex items-center justify-between">
        <div className="text-[0.85rem] font-semibold tracking-tight">Brand Programs</div>
        <div className="flex gap-2">
          <button className="font-mono text-[0.62rem] px-2.5 py-1 rounded border bg-accent-cyan/[0.08] text-accent-cyan border-accent-cyan/20">
            All
          </button>
          <button className="font-mono text-[0.62rem] px-2.5 py-1 rounded border bg-transparent text-text-3 border-border">
            Active
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[500px]">
          <thead>
            <tr>
              <th className="text-left font-mono text-[0.6rem] uppercase tracking-[0.08em] text-text-3 py-2.5 px-3 border-b border-border font-medium">
                Brand
              </th>
              <th className="text-left font-mono text-[0.6rem] uppercase tracking-[0.08em] text-text-3 py-2.5 px-3 border-b border-border font-medium">
                Subscribers
              </th>
              <th className="text-left font-mono text-[0.6rem] uppercase tracking-[0.08em] text-text-3 py-2.5 px-3 border-b border-border font-medium">
                MRR
              </th>
              <th className="text-left font-mono text-[0.6rem] uppercase tracking-[0.08em] text-text-3 py-2.5 px-3 border-b border-border font-medium">
                Status
              </th>
              <th className="text-left font-mono text-[0.6rem] uppercase tracking-[0.08em] text-text-3 py-2.5 px-3 border-b border-border font-medium">
                Growth
              </th>
            </tr>
          </thead>
          <tbody>
            {BRANDS.map((brand) => (
              <tr key={brand.name} className="hover:bg-accent-cyan/[0.02] last:border-b-0">
                <td className="py-3 px-3 text-[0.8rem] border-b border-border/50 align-middle">
                  <span
                    className="w-2 h-2 rounded-full inline-block mr-2"
                    style={{ background: brand.color }}
                  />
                  {brand.name}
                </td>
                <td className="py-3 px-3 text-[0.8rem] border-b border-border/50 align-middle">
                  {brand.subscribers}
                </td>
                <td className="py-3 px-3 text-[0.8rem] border-b border-border/50 align-middle">
                  {brand.mrr}
                </td>
                <td className="py-3 px-3 text-[0.8rem] border-b border-border/50 align-middle">
                  <StatusPill status={brand.status} />
                </td>
                <td className="py-3 px-3 text-[0.8rem] border-b border-border/50 align-middle">
                  <ProgressBar value={brand.growth} color={brand.color} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
