'use client';

import { useState, useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAgentStatus, useAgentHistory } from '@/hooks/carrier-pulse/useAgent';
import { useBrandCategories } from '@/hooks/carrier-pulse/useBrandCategories';
import { useBrands } from '@/hooks/carrier-pulse/useBrands';
import { useActiveTenantId } from '@/hooks/carrier-pulse/useTenant';
import RunAgentButton from '@/components/carrier-pulse/RunAgentButton';
import AddBrandModal from '@/components/carrier-pulse/AddBrandModal';
import BrandProfileEditor from '@/components/carrier-pulse/BrandProfileEditor';
import { formatDateTime } from '@/lib/carrier-pulse/formatters';
import { fetchApi } from '@/lib/carrier-pulse/api';

interface LLMStats {
  active_provider: string;
  active_model: string;
  fallback_provider: string | null;
  fallback_model: string | null;
  openai_configured: boolean;
  anthropic_configured: boolean;
  total_calls: number;
  successful_calls: number;
  failed_calls: number;
  fallback_calls: number;
  total_input_tokens: number;
  total_output_tokens: number;
  avg_duration_ms: number;
  calls_by_provider: Record<string, number>;
  calls_by_caller: Record<string, number>;
}

export default function SettingsPage() {
  const { data: status } = useAgentStatus();
  const { data: history } = useAgentHistory();
  const { data: brands } = useBrands();
  const tenantId = useActiveTenantId();
  const { categories: CATEGORIES } = useBrandCategories();
  const [showAddBrand, setShowAddBrand] = useState(false);

  const { data: llmStats } = useQuery<LLMStats>({
    queryKey: ['llm-stats'],
    queryFn: () => fetchApi<LLMStats>('/llm/stats'),
    refetchInterval: 30000,
  });

  const allCategoryIds = Object.keys(CATEGORIES);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCategories([]);
  }, [tenantId]);

  const allSelected = selectedCategories.length === 0;

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) => {
      if (prev.length === 0) {
        return allCategoryIds.filter((id) => id !== catId);
      }
      if (prev.includes(catId)) {
        const next = prev.filter((id) => id !== catId);
        return next.length === 0 ? prev : next;
      }
      const next = [...prev, catId];
      return next.length === allCategoryIds.length ? [] : next;
    });
  };

  const selectAll = () => setSelectedCategories([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const agentStatus = status as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const runHistory = (history || []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const brandList = (brands || []) as any[];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Agent control */}
      <div className="bg-bg-2 border border-border rounded-xl p-5">
        <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-4">
          Agent Control
        </h3>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-text-2 font-medium">Categories to run</label>
            <button
              onClick={selectAll}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${
                allSelected ? 'bg-accent-cyan/20 text-accent-cyan' : 'text-text-3 hover:text-text-2'
              }`}
            >
              Select All
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const isSelected = allSelected || selectedCategories.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleCategory(key)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all border ${
                    isSelected
                      ? 'bg-bg-1 border-accent-cyan/40 text-text-1'
                      : 'bg-bg-1/50 border-border text-text-3 hover:border-border hover:text-text-2'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                      isSelected ? 'bg-accent-cyan' : 'border border-text-3/40'
                    }`}
                  >
                    {isSelected ? <Check size={12} className="text-white" /> : null}
                  </div>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-text-3 mt-2">
            {allSelected
              ? `All ${allCategoryIds.length} categories will be searched`
              : `${selectedCategories.length} of ${allCategoryIds.length} categories selected`}
          </p>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <RunAgentButton selectedCategories={allSelected ? null : selectedCategories} />
          {agentStatus ? (
            <span className="text-sm text-text-3">
              Status:{' '}
              <span
                className={
                  agentStatus.status === 'running'
                    ? 'text-accent-cyan'
                    : agentStatus.status === 'completed'
                      ? 'text-accent-green'
                      : 'text-accent-red'
                }
              >
                {agentStatus.status}
              </span>
              {agentStatus.search_count > 0 && ` (${agentStatus.search_count} searches)`}
            </span>
          ) : null}
        </div>
        <div className="text-sm text-text-2 space-y-1">
          <p>Schedule: Every Friday at 7:00 AM EST</p>
          <p>Model: {llmStats?.active_model || 'loading...'}</p>
        </div>
      </div>

      {/* Brand Management */}
      <div className="bg-bg-2 border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest">
            Brand Management
          </h3>
          <button
            onClick={() => setShowAddBrand(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-cyan hover:bg-accent-cyan/80 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Sparkles size={14} /> Add Brand
          </button>
        </div>
        <div className="space-y-2">
          {brandList.map((brand) => (
            <BrandProfileEditor key={brand.id} brand={brand} />
          ))}
          {brandList.length === 0 ? (
            <p className="text-sm text-text-3">No brands configured yet.</p>
          ) : null}
        </div>
      </div>

      {/* Run history */}
      <div className="bg-bg-2 border border-border rounded-xl p-5">
        <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-4">
          Run History
        </h3>
        {runHistory.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-3 text-left border-b border-border">
                <th className="pb-2 font-medium">Started</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Trigger</th>
                <th className="pb-2 font-medium">Searches</th>
                <th className="pb-2 font-medium">Findings</th>
              </tr>
            </thead>
            <tbody>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {runHistory.map((run: any) => (
                <tr key={run.id} className="border-b border-border/50">
                  <td className="py-2">{formatDateTime(run.started_at)}</td>
                  <td className="py-2">
                    <span
                      className={
                        run.status === 'completed'
                          ? 'text-accent-green'
                          : run.status === 'running'
                            ? 'text-accent-cyan'
                            : 'text-accent-red'
                      }
                    >
                      {run.status}
                    </span>
                  </td>
                  <td className="py-2 text-text-2">{run.trigger}</td>
                  <td className="py-2 font-mono">{run.search_count}</td>
                  <td className="py-2 font-mono">{run.finding_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-text-3">No runs yet.</p>
        )}
      </div>

      {/* LLM Provider & Usage */}
      <div className="bg-bg-2 border border-border rounded-xl p-5">
        <h3 className="text-[10px] font-mono text-text-3 uppercase tracking-widest mb-4">
          LLM Provider
        </h3>
        {llmStats ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-1 border border-border rounded-lg p-3">
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wide mb-1">Primary</p>
                <p className="text-sm font-medium">
                  {llmStats.active_provider === 'openai' ? 'OpenAI' : llmStats.active_provider === 'anthropic' ? 'Anthropic' : 'None'}
                </p>
                <p className="text-xs text-text-3 font-mono">{llmStats.active_model}</p>
              </div>
              <div className="bg-bg-1 border border-border rounded-lg p-3">
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wide mb-1">Fallback</p>
                <p className="text-sm font-medium">
                  {llmStats.fallback_provider === 'openai' ? 'OpenAI' : llmStats.fallback_provider === 'anthropic' ? 'Anthropic' : 'None'}
                </p>
                <p className="text-xs text-text-3 font-mono">{llmStats.fallback_model || '—'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-1 border border-border rounded-lg p-3">
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wide mb-1">OpenAI</p>
                <p className={`text-sm font-medium ${llmStats.openai_configured ? 'text-accent-green' : 'text-accent-red'}`}>
                  {llmStats.openai_configured ? 'Configured' : 'Not Set'}
                </p>
              </div>
              <div className="bg-bg-1 border border-border rounded-lg p-3">
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wide mb-1">Anthropic</p>
                <p className={`text-sm font-medium ${llmStats.anthropic_configured ? 'text-accent-green' : 'text-accent-red'}`}>
                  {llmStats.anthropic_configured ? 'Configured' : 'Not Set'}
                </p>
              </div>
            </div>

            {llmStats.total_calls > 0 ? (
              <div>
                <p className="text-[10px] font-mono text-text-3 uppercase tracking-wide mb-2">Usage Stats</p>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <p className="text-lg font-mono font-bold">{llmStats.total_calls}</p>
                    <p className="text-xs text-text-3">Total Calls</p>
                  </div>
                  <div>
                    <p className="text-lg font-mono font-bold text-accent-green">{llmStats.successful_calls}</p>
                    <p className="text-xs text-text-3">Successful</p>
                  </div>
                  <div>
                    <p className="text-lg font-mono font-bold text-accent-red">{llmStats.failed_calls}</p>
                    <p className="text-xs text-text-3">Failed</p>
                  </div>
                  <div>
                    <p className="text-lg font-mono font-bold text-yellow-400">{llmStats.fallback_calls}</p>
                    <p className="text-xs text-text-3">Fallbacks</p>
                  </div>
                </div>
                {Object.keys(llmStats.calls_by_provider).length > 0 ? (
                  <div className="mt-3 text-xs text-text-3">
                    {Object.entries(llmStats.calls_by_provider).map(([provider, count]) => (
                      <span key={provider} className="mr-3">
                        {provider}: <span className="text-text-2 font-mono">{count}</span>
                      </span>
                    ))}
                    {llmStats.avg_duration_ms > 0 && (
                      <span className="mr-3">
                        avg: <span className="text-text-2 font-mono">{(llmStats.avg_duration_ms / 1000).toFixed(1)}s</span>
                      </span>
                    )}
                    {(llmStats.total_input_tokens + llmStats.total_output_tokens) > 0 && (
                      <span>
                        tokens: <span className="text-text-2 font-mono">{((llmStats.total_input_tokens + llmStats.total_output_tokens) / 1000).toFixed(1)}k</span>
                      </span>
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-text-3">Loading provider info...</p>
        )}
      </div>

      {showAddBrand ? <AddBrandModal onClose={() => setShowAddBrand(false)} /> : null}
    </div>
  );
}
