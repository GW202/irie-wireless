'use client';

import { useState } from 'react';
import { X, Sparkles, Trash2, Plus, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useOnboardBrand, useConfirmBrand, useAssistCategory } from '@/hooks/carrier-pulse/useBrands';

interface Category {
  id: string;
  name: string;
  focus: string;
  queries: string[];
}

interface Profile {
  name: string;
  slug: string;
  company_context: string;
  analysis_instructions: string;
  email_subject_prefix: string;
  suggested_categories: Category[];
}

export default function AddBrandModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'input' | 'researching' | 'review'>('input');
  const [error, setError] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [hints, setHints] = useState('');

  const [profile, setProfile] = useState<Profile | null>(null);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);

  const onboardMutation = useOnboardBrand();
  const confirmMutation = useConfirmBrand();
  const assistMutation = useAssistCategory();

  async function handleResearch(e: React.FormEvent) {
    e.preventDefault();
    if (!companyName.trim()) return;

    setStep('researching');
    setError('');

    onboardMutation.mutate(
      { name: companyName.trim(), hints: hints.trim() || null },
      {
        onSuccess: (result) => {
          setProfile(result as Profile);
          setStep('review');
        },
        onError: (err) => {
          setError(err.message || 'Onboarding agent failed');
          setStep('input');
        },
      }
    );
  }

  function updateProfile(field: string, value: string) {
    setProfile((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  function updateCategory(index: number, field: string, value: string) {
    setProfile((prev) => {
      if (!prev) return prev;
      const cats = [...prev.suggested_categories];
      cats[index] = { ...cats[index], [field]: value };
      return { ...prev, suggested_categories: cats };
    });
  }

  function removeCategory(index: number) {
    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, suggested_categories: prev.suggested_categories.filter((_, i) => i !== index) };
    });
  }

  function addCategory() {
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        suggested_categories: [
          ...prev.suggested_categories,
          { id: `custom_${Date.now()}`, name: 'New Category', queries: [''], focus: '' },
        ],
      };
    });
  }

  function updateQuery(catIndex: number, queryIndex: number, value: string) {
    setProfile((prev) => {
      if (!prev) return prev;
      const cats = [...prev.suggested_categories];
      const queries = [...cats[catIndex].queries];
      queries[queryIndex] = value;
      cats[catIndex] = { ...cats[catIndex], queries };
      return { ...prev, suggested_categories: cats };
    });
  }

  function addQuery(catIndex: number) {
    setProfile((prev) => {
      if (!prev) return prev;
      const cats = [...prev.suggested_categories];
      cats[catIndex] = { ...cats[catIndex], queries: [...cats[catIndex].queries, ''] };
      return { ...prev, suggested_categories: cats };
    });
  }

  function removeQuery(catIndex: number, queryIndex: number) {
    setProfile((prev) => {
      if (!prev) return prev;
      const cats = [...prev.suggested_categories];
      cats[catIndex] = {
        ...cats[catIndex],
        queries: cats[catIndex].queries.filter((_, i) => i !== queryIndex),
      };
      return { ...prev, suggested_categories: cats };
    });
  }

  function handleAssistCategory(index: number) {
    if (!profile) return;
    const cat = profile.suggested_categories[index];
    if ((cat.name || '').length + (cat.focus || '').length < 20) return;

    assistMutation.mutate(
      {
        brand_name: profile.name,
        company_context: profile.company_context,
        partial_name: cat.name,
        partial_focus: cat.focus,
      },
      {
        onSuccess: (result) => {
          if (result.category) {
            setProfile((prev) => {
              if (!prev) return prev;
              const cats = [...prev.suggested_categories];
              cats[index] = { ...cats[index], ...(result.category as unknown as Category) };
              return { ...prev, suggested_categories: cats };
            });
          }
        },
      }
    );
  }

  function handleConfirm() {
    if (!profile) return;
    setError('');

    confirmMutation.mutate(
      {
        slug: profile.slug,
        name: profile.name,
        company_context: profile.company_context,
        analysis_instructions: profile.analysis_instructions,
        categories: profile.suggested_categories,
        email_subject_prefix: profile.email_subject_prefix,
      },
      {
        onSuccess: () => onClose(),
        onError: (err) => setError(err.message || 'Failed to create brand'),
      }
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-2 border border-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-accent-cyan" />
            <h2 className="text-lg font-semibold">
              {step === 'input' && 'Add New Brand'}
              {step === 'researching' && 'Researching Company...'}
              {step === 'review' && 'Review Brand Profile'}
            </h2>
          </div>
          <button onClick={onClose} className="text-text-3 hover:text-text-1 p-1">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-5">
          {error ? (
            <div className="mb-4 px-3 py-2 rounded-lg bg-accent-red/10 border border-accent-red/20 text-accent-red text-sm">
              {error}
            </div>
          ) : null}

          {/* Step 1: Input */}
          {step === 'input' ? (
            <form onSubmit={handleResearch} className="space-y-4">
              <p className="text-sm text-text-3">
                Our AI agent will research this company and generate a complete intelligence profile
                with tailored monitoring categories.
              </p>
              <div>
                <label className="block text-sm text-text-2 mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm placeholder:text-text-3 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan"
                  placeholder="e.g. Acme Telecom, TechCorp Inc."
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm text-text-2 mb-1.5">
                  Additional Context <span className="text-text-3">(optional)</span>
                </label>
                <textarea
                  value={hints}
                  onChange={(e) => setHints(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm placeholder:text-text-3 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan resize-none"
                  rows={3}
                  placeholder="Any details to help the agent: industry, competitors, what you want to monitor..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm text-text-2 hover:bg-bg-3 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-accent-cyan hover:bg-accent-cyan/80 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2">
                  <Sparkles size={16} /> Research &amp; Generate
                </button>
              </div>
            </form>
          ) : null}

          {/* Step 2: Researching */}
          {step === 'researching' ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 size={40} className="text-accent-cyan animate-spin" />
              <div className="text-center">
                <p className="text-sm font-medium">Researching {companyName}...</p>
                <p className="text-xs text-text-3 mt-1">
                  The AI agent is searching the web and building a comprehensive profile.
                  This typically takes 60-90 seconds.
                </p>
              </div>
            </div>
          ) : null}

          {/* Step 3: Review */}
          {step === 'review' && profile ? (
            <div className="space-y-5">
              <p className="text-sm text-text-3">Review and edit the generated profile before activating.</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-3 mb-1 uppercase tracking-wide">Name</label>
                  <input type="text" value={profile.name} onChange={(e) => updateProfile('name', e.target.value)} className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-cyan" />
                </div>
                <div>
                  <label className="block text-xs text-text-3 mb-1 uppercase tracking-wide">Slug</label>
                  <input type="text" value={profile.slug} onChange={(e) => updateProfile('slug', e.target.value)} className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-cyan" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-text-3 mb-1 uppercase tracking-wide">Email Subject Prefix</label>
                <input type="text" value={profile.email_subject_prefix} onChange={(e) => updateProfile('email_subject_prefix', e.target.value)} className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm focus:outline-none focus:border-accent-cyan" />
              </div>

              <div>
                <label className="block text-xs text-text-3 mb-1 uppercase tracking-wide">Company Context</label>
                <textarea value={profile.company_context} onChange={(e) => updateProfile('company_context', e.target.value)} className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-accent-cyan resize-none" rows={8} />
              </div>

              <div>
                <label className="block text-xs text-text-3 mb-1 uppercase tracking-wide">Analysis Instructions</label>
                <textarea value={profile.analysis_instructions} onChange={(e) => updateProfile('analysis_instructions', e.target.value)} className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm font-mono focus:outline-none focus:border-accent-cyan resize-none" rows={4} />
              </div>

              {/* Categories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-text-3 uppercase tracking-wide font-medium">
                    Intelligence Categories ({profile.suggested_categories.length})
                  </label>
                  <button onClick={addCategory} className="inline-flex items-center gap-1 text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors">
                    <Plus size={14} /> Add Category
                  </button>
                </div>

                <div className="space-y-2">
                  {profile.suggested_categories.map((cat, i) => (
                    <div key={i} className="border border-border rounded-lg overflow-hidden">
                      <div
                        className="flex items-center justify-between px-3 py-2.5 bg-bg-1/50 cursor-pointer hover:bg-bg-2 transition-colors"
                        onClick={() => setExpandedCat(expandedCat === i ? null : i)}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {expandedCat === i ? <ChevronUp size={14} className="text-text-3 shrink-0" /> : <ChevronDown size={14} className="text-text-3 shrink-0" />}
                          <span className="text-sm font-medium truncate">{cat.name}</span>
                          <span className="text-xs text-text-3 shrink-0">{cat.queries.length} queries</span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeCategory(i); }} className="text-text-3 hover:text-accent-red transition-colors p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {expandedCat === i ? (
                        <div className="p-3 space-y-3 border-t border-border">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-text-3 mb-1">Category Name</label>
                              <input type="text" value={cat.name} onChange={(e) => updateCategory(i, 'name', e.target.value)} className="w-full px-2 py-1.5 bg-bg-1 border border-border rounded text-sm focus:outline-none focus:border-accent-cyan" />
                            </div>
                            <div>
                              <label className="block text-xs text-text-3 mb-1">ID (snake_case)</label>
                              <input type="text" value={cat.id} onChange={(e) => updateCategory(i, 'id', e.target.value)} className="w-full px-2 py-1.5 bg-bg-1 border border-border rounded text-sm font-mono focus:outline-none focus:border-accent-cyan" />
                            </div>
                          </div>

                          {((cat.name || '').length + (cat.focus || '').length) >= 20 ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleAssistCategory(i); }}
                              disabled={assistMutation.isPending}
                              className="inline-flex items-center gap-1.5 text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors disabled:opacity-50"
                            >
                              {assistMutation.isPending ? (<><Loader2 size={12} className="animate-spin" /> Generating...</>) : (<><Sparkles size={12} /> AI Assistant — complete &amp; optimize</>)}
                            </button>
                          ) : null}

                          <div>
                            <label className="block text-xs text-text-3 mb-1">Focus</label>
                            <textarea value={cat.focus} onChange={(e) => updateCategory(i, 'focus', e.target.value)} className="w-full px-2 py-1.5 bg-bg-1 border border-border rounded text-sm focus:outline-none focus:border-accent-cyan resize-none" rows={2} />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs text-text-3">Search Queries</label>
                              <button onClick={() => addQuery(i)} className="text-xs text-accent-cyan hover:text-accent-cyan/80">+ Add</button>
                            </div>
                            <div className="space-y-1.5">
                              {cat.queries.map((q, qi) => (
                                <div key={qi} className="flex items-center gap-1.5">
                                  <input type="text" value={q} onChange={(e) => updateQuery(i, qi, e.target.value)} className="flex-1 px-2 py-1 bg-bg-1 border border-border rounded text-xs focus:outline-none focus:border-accent-cyan" placeholder="Search query..." />
                                  {cat.queries.length > 1 ? (
                                    <button onClick={() => removeQuery(i, qi)} className="text-text-3 hover:text-accent-red p-0.5"><X size={12} /></button>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setStep('input'); setProfile(null); }} className="px-4 py-2.5 border border-border rounded-lg text-sm text-text-2 hover:bg-bg-3 transition-colors">
                  Start Over
                </button>
                <button type="button" onClick={onClose} className="px-4 py-2.5 border border-border rounded-lg text-sm text-text-2 hover:bg-bg-3 transition-colors">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={confirmMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-accent-cyan hover:bg-accent-cyan/80 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {confirmMutation.isPending ? (<><Loader2 size={16} className="animate-spin" /> Creating...</>) : 'Confirm & Activate'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
