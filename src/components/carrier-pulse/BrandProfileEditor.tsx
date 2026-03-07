'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Trash2,
  Plus,
  Loader2,
  Pencil,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useBrandDetail, useSaveBrand, useDeleteBrand, useAssistCategory } from '@/hooks/carrier-pulse/useBrands';

interface Brand {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  focus?: string;
  queries?: string[];
}

interface FormState {
  name: string;
  company_context: string;
  analysis_instructions: string;
  email_subject_prefix: string;
  categories: Category[];
}

export default function BrandProfileEditor({ brand }: { brand: Brand }) {
  const [expanded, setExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { data: detail, isLoading } = useBrandDetail(expanded ? brand.id : null);
  const saveMutation = useSaveBrand();
  const deleteMutation = useDeleteBrand();
  const assistMutation = useAssistCategory();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [expandedCat, setExpandedCat] = useState<number | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function initForm(d: any) {
    let cats: Category[] = [];
    if (d.categories) {
      try {
        cats = JSON.parse(d.categories);
      } catch {
        cats = [];
      }
    }
    setForm({
      name: d.name || '',
      company_context: d.company_context || '',
      analysis_instructions: d.analysis_instructions || '',
      email_subject_prefix: d.email_subject_prefix || '',
      categories: cats,
    });
  }

  useEffect(() => {
    if (detail && !form) initForm(detail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail]);

  function handleSave() {
    if (!form) return;
    const payload: Record<string, unknown> = {
      id: brand.id,
      name: form.name,
      company_context: form.company_context,
      analysis_instructions: form.analysis_instructions,
      email_subject_prefix: form.email_subject_prefix,
    };
    if (form.categories && form.categories.length > 0) {
      payload.categories = JSON.stringify(form.categories);
    }
    saveMutation.mutate(payload as { id: number; [key: string]: unknown }, {
      onSuccess: () => setEditing(false),
    });
  }

  function handleCancel() {
    if (detail) initForm(detail);
    setEditing(false);
  }

  function handleDelete() {
    deleteMutation.mutate(brand.id, {
      onSuccess: () => setShowDeleteConfirm(false),
    });
  }

  function updateCategory(index: number, field: string, value: string) {
    setForm((prev) => {
      if (!prev) return prev;
      const cats = [...prev.categories];
      cats[index] = { ...cats[index], [field]: value };
      return { ...prev, categories: cats };
    });
  }

  function removeCategory(index: number) {
    setForm((prev) => {
      if (!prev) return prev;
      return { ...prev, categories: prev.categories.filter((_, i) => i !== index) };
    });
  }

  function addCategory() {
    setForm((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: [
          ...prev.categories,
          { id: `custom_${Date.now()}`, name: 'New Category', queries: [''], focus: '' },
        ],
      };
    });
  }

  function updateQuery(catIndex: number, queryIndex: number, value: string) {
    setForm((prev) => {
      if (!prev) return prev;
      const cats = [...prev.categories];
      const queries = [...(cats[catIndex].queries || [])];
      queries[queryIndex] = value;
      cats[catIndex] = { ...cats[catIndex], queries };
      return { ...prev, categories: cats };
    });
  }

  function addQuery(catIndex: number) {
    setForm((prev) => {
      if (!prev) return prev;
      const cats = [...prev.categories];
      cats[catIndex] = { ...cats[catIndex], queries: [...(cats[catIndex].queries || []), ''] };
      return { ...prev, categories: cats };
    });
  }

  function removeQuery(catIndex: number, queryIndex: number) {
    setForm((prev) => {
      if (!prev) return prev;
      const cats = [...prev.categories];
      cats[catIndex] = {
        ...cats[catIndex],
        queries: (cats[catIndex].queries || []).filter((_, i) => i !== queryIndex),
      };
      return { ...prev, categories: cats };
    });
  }

  async function handleAssistCategory(index: number) {
    if (!form) return;
    const cat = form.categories[index];
    const charCount = (cat.name || '').length + (cat.focus || '').length;
    if (charCount < 20) return;

    assistMutation.mutate(
      {
        brand_name: form.name,
        company_context: form.company_context,
        partial_name: cat.name,
        partial_focus: cat.focus || '',
      },
      {
        onSuccess: (result) => {
          if (result.category) {
            setForm((prev) => {
              if (!prev) return prev;
              const cats = [...prev.categories];
              cats[index] = { ...cats[index], ...(result.category as unknown as Category) };
              return { ...prev, categories: cats };
            });
          }
        },
      }
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-bg-1 hover:bg-bg-2 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {expanded ? <ChevronUp size={14} className="text-text-3" /> : <ChevronDown size={14} className="text-text-3" />}
          <span className="text-sm font-medium">{brand.name}</span>
          <span className="text-xs text-text-3 font-mono">/{brand.slug}</span>
        </div>
        <span className={`text-xs ${brand.is_active ? 'text-accent-green' : 'text-accent-red'}`}>
          {brand.is_active ? 'Active' : 'Inactive'}
        </span>
      </button>

      {expanded ? (
        <div className="border-t border-border bg-bg-2">
          {isLoading || !form ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="text-accent-cyan animate-spin" />
            </div>
          ) : (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {detail?.onboarded_at ? (
                    <span className="text-xs text-text-3">
                      Onboarded {new Date(detail.onboarded_at).toLocaleDateString()}
                    </span>
                  ) : null}
                </div>
                {!editing ? (
                  <div className="flex items-center gap-3">
                    <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 text-xs text-accent-cyan hover:text-accent-cyan/80 transition-colors">
                      <Pencil size={12} /> Edit Profile
                    </button>
                    <button onClick={() => setShowDeleteConfirm(true)} className="inline-flex items-center gap-1.5 text-xs text-text-3 hover:text-accent-red transition-colors">
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={handleCancel} className="inline-flex items-center gap-1 text-xs text-text-3 hover:text-text-1 transition-colors">
                      <X size={12} /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saveMutation.isPending}
                      className="inline-flex items-center gap-1 text-xs bg-accent-cyan hover:bg-accent-cyan/80 text-white px-2.5 py-1 rounded transition-colors disabled:opacity-50"
                    >
                      {saveMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {saveMutation.isError ? (
                <div className="px-3 py-2 rounded bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs">
                  {saveMutation.error?.message || 'Failed to save'}
                </div>
              ) : null}

              {/* Name & Email Prefix */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-text-3 mb-1 uppercase tracking-wide">Brand Name</label>
                  {editing ? (
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-2.5 py-1.5 bg-bg-1 border border-border rounded text-sm focus:outline-none focus:border-accent-cyan" />
                  ) : (
                    <p className="text-sm">{form.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-text-3 mb-1 uppercase tracking-wide">Email Subject Prefix</label>
                  {editing ? (
                    <input type="text" value={form.email_subject_prefix} onChange={(e) => setForm({ ...form, email_subject_prefix: e.target.value })} className="w-full px-2.5 py-1.5 bg-bg-1 border border-border rounded text-sm focus:outline-none focus:border-accent-cyan" />
                  ) : (
                    <p className="text-sm">{form.email_subject_prefix || '\u2014'}</p>
                  )}
                </div>
              </div>

              {/* Company Context */}
              <div>
                <label className="block text-xs text-text-3 mb-1 uppercase tracking-wide">Company Context</label>
                {editing ? (
                  <textarea value={form.company_context} onChange={(e) => setForm({ ...form, company_context: e.target.value })} className="w-full px-2.5 py-1.5 bg-bg-1 border border-border rounded text-sm font-mono focus:outline-none focus:border-accent-cyan resize-none" rows={10} />
                ) : (
                  <pre className="text-xs text-text-2 font-mono whitespace-pre-wrap bg-bg-1 rounded p-3 border border-border max-h-60 overflow-y-auto">{form.company_context || '\u2014'}</pre>
                )}
              </div>

              {/* Analysis Instructions */}
              <div>
                <label className="block text-xs text-text-3 mb-1 uppercase tracking-wide">Analysis Instructions</label>
                {editing ? (
                  <textarea value={form.analysis_instructions} onChange={(e) => setForm({ ...form, analysis_instructions: e.target.value })} className="w-full px-2.5 py-1.5 bg-bg-1 border border-border rounded text-sm font-mono focus:outline-none focus:border-accent-cyan resize-none" rows={5} />
                ) : (
                  <pre className="text-xs text-text-2 font-mono whitespace-pre-wrap bg-bg-1 rounded p-3 border border-border max-h-40 overflow-y-auto">{form.analysis_instructions || '\u2014'}</pre>
                )}
              </div>

              {/* Categories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-text-3 uppercase tracking-wide font-medium">
                    Intelligence Categories {form.categories.length > 0 && `(${form.categories.length})`}
                  </label>
                  {editing ? (
                    <button onClick={addCategory} className="inline-flex items-center gap-1 text-xs text-accent-cyan hover:text-accent-cyan/80">
                      <Plus size={12} /> Add
                    </button>
                  ) : null}
                </div>

                {form.categories.length === 0 ? (
                  <p className="text-xs text-text-3 italic">No custom categories — using global defaults.</p>
                ) : (
                  <div className="space-y-1.5">
                    {form.categories.map((cat, i) => (
                      <div key={i} className="border border-border rounded overflow-hidden">
                        <div
                          className="flex items-center justify-between px-3 py-2 bg-bg-1/50 cursor-pointer hover:bg-bg-2 transition-colors"
                          onClick={() => setExpandedCat(expandedCat === i ? null : i)}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {expandedCat === i ? <ChevronUp size={12} className="text-text-3 shrink-0" /> : <ChevronDown size={12} className="text-text-3 shrink-0" />}
                            <span className="text-xs font-medium truncate">{cat.name}</span>
                            <span className="text-[10px] text-text-3 font-mono shrink-0">{cat.id}</span>
                            <span className="text-[10px] text-text-3 shrink-0">{cat.queries?.length || 0} queries</span>
                          </div>
                          {editing ? (
                            <button onClick={(e) => { e.stopPropagation(); removeCategory(i); }} className="text-text-3 hover:text-accent-red transition-colors p-0.5">
                              <Trash2 size={12} />
                            </button>
                          ) : null}
                        </div>

                        {expandedCat === i ? (
                          <div className="p-3 space-y-2.5 border-t border-border">
                            {editing ? (
                              <>
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] text-text-3 mb-0.5">Name</label>
                                    <input type="text" value={cat.name} onChange={(e) => updateCategory(i, 'name', e.target.value)} className="w-full px-2 py-1 bg-bg-1 border border-border rounded text-xs focus:outline-none focus:border-accent-cyan" />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] text-text-3 mb-0.5">ID</label>
                                    <input type="text" value={cat.id} onChange={(e) => updateCategory(i, 'id', e.target.value)} className="w-full px-2 py-1 bg-bg-1 border border-border rounded text-xs font-mono focus:outline-none focus:border-accent-cyan" />
                                  </div>
                                </div>

                                {((cat.name || '').length + (cat.focus || '').length) >= 20 ? (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleAssistCategory(i); }}
                                    disabled={assistMutation.isPending}
                                    className="inline-flex items-center gap-1.5 text-[11px] text-accent-cyan hover:text-accent-cyan/80 transition-colors disabled:opacity-50"
                                  >
                                    {assistMutation.isPending ? (<><Loader2 size={12} className="animate-spin" /> Generating...</>) : (<><Sparkles size={12} /> AI Assistant — complete &amp; optimize this category</>)}
                                  </button>
                                ) : null}
                                {assistMutation.isError && expandedCat === i ? (
                                  <p className="text-[11px] text-accent-red">{assistMutation.error?.message}</p>
                                ) : null}

                                <div>
                                  <label className="block text-[10px] text-text-3 mb-0.5">Focus</label>
                                  <textarea value={cat.focus || ''} onChange={(e) => updateCategory(i, 'focus', e.target.value)} className="w-full px-2 py-1 bg-bg-1 border border-border rounded text-xs focus:outline-none focus:border-accent-cyan resize-none" rows={2} />
                                </div>

                                <div>
                                  <div className="flex items-center justify-between mb-0.5">
                                    <label className="text-[10px] text-text-3">Search Queries</label>
                                    <button onClick={() => addQuery(i)} className="text-[10px] text-accent-cyan hover:text-accent-cyan/80">+ Add</button>
                                  </div>
                                  <div className="space-y-1">
                                    {(cat.queries || []).map((q, qi) => (
                                      <div key={qi} className="flex items-center gap-1">
                                        <input type="text" value={q} onChange={(e) => updateQuery(i, qi, e.target.value)} className="flex-1 px-2 py-0.5 bg-bg-1 border border-border rounded text-[11px] focus:outline-none focus:border-accent-cyan" />
                                        {(cat.queries?.length || 0) > 1 ? (
                                          <button onClick={() => removeQuery(i, qi)} className="text-text-3 hover:text-accent-red p-0.5"><X size={10} /></button>
                                        ) : null}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <span className="text-[10px] text-text-3 uppercase tracking-wide">Focus</span>
                                  <p className="text-xs text-text-2 mt-0.5">{cat.focus || '\u2014'}</p>
                                </div>
                                <div>
                                  <span className="text-[10px] text-text-3 uppercase tracking-wide">Search Queries</span>
                                  <ul className="mt-0.5 space-y-0.5">
                                    {(cat.queries || []).map((q, qi) => (
                                      <li key={qi} className="text-xs text-text-2 font-mono pl-2 border-l-2 border-border">{q}</li>
                                    ))}
                                  </ul>
                                </div>
                              </>
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Delete confirmation modal */}
      {showDeleteConfirm ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-2 border border-border rounded-xl w-full max-w-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-accent-red/10 flex items-center justify-center">
                <AlertTriangle size={20} className="text-accent-red" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Delete Brand</h3>
                <p className="text-xs text-text-3">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-text-2 mb-5">
              Are you sure you want to delete <strong>{brand.name}</strong>?
            </p>
            {deleteMutation.isError ? (
              <div className="mb-4 px-3 py-2 rounded bg-accent-red/10 border border-accent-red/20 text-accent-red text-xs">
                {deleteMutation.error?.message || 'Failed to delete brand'}
              </div>
            ) : null}
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm text-text-2 hover:bg-bg-3 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-accent-red hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {deleteMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Delete Brand
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
