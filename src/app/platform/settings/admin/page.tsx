'use client';

import { useState } from 'react';
import {
  ToggleLeft,
  ToggleRight,
  Plus,
  Pencil,
  Trash2,
  FileText,
  Zap,
  Eye,
  Archive,
  Send,
  ChevronDown,
  ChevronUp,
  Clock,
  Tag,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { FeatureFlag, BlogPost } from '@/lib/admin-types';
import { MOCK_FEATURES, MOCK_BLOG_POSTS } from '@/lib/mock-data/admin';

type Tab = 'features' | 'blog';

const SCOPE_STYLES: Record<string, string> = {
  platform: 'bg-accent-cyan/10 text-accent-cyan',
  service: 'bg-accent-purple/10 text-accent-purple',
  tenant: 'bg-accent-amber/10 text-accent-amber',
};

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  published: { dot: 'bg-accent-green', label: 'Published' },
  draft: { dot: 'bg-accent-amber', label: 'Draft' },
  archived: { dot: 'bg-bg-4', label: 'Archived' },
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Feature Flag Row
// ---------------------------------------------------------------------------

function FeatureRow({
  feature,
  onToggle,
}: {
  feature: FeatureFlag;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-bg-2 border border-border rounded-xl hover:border-border-light transition-colors">
      <button
        onClick={() => onToggle(feature.id)}
        className="shrink-0"
        title={feature.enabled ? 'Disable' : 'Enable'}
      >
        {feature.enabled ? (
          <ToggleRight size={28} className="text-accent-green" />
        ) : (
          <ToggleLeft size={28} className="text-text-3" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium truncate">{feature.label}</p>
          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${SCOPE_STYLES[feature.scope]}`}>
            {feature.scope.toUpperCase()}
          </span>
          {feature.service && (
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-bg-3 text-text-3">
              {feature.service}
            </span>
          )}
        </div>
        <p className="text-xs text-text-3 leading-relaxed">{feature.description}</p>
      </div>
      <div className="text-right shrink-0 hidden sm:block">
        <p className="text-[10px] text-text-3 font-mono">{formatDateTime(feature.updatedAt)}</p>
        <p className="text-[10px] text-text-3">by {feature.updatedBy}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Blog Post Row
// ---------------------------------------------------------------------------

function BlogRow({
  post,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (post: BlogPost) => void;
}) {
  const status = STATUS_STYLES[post.status];
  return (
    <div className="p-4 bg-bg-2 border border-border rounded-xl hover:border-border-light transition-colors">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-bg-3 border border-border flex items-center justify-center shrink-0">
          <FileText size={18} className="text-accent-cyan" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-medium truncate">{post.title}</p>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              <span className="text-[10px] font-mono text-text-2">{status.label}</span>
            </div>
          </div>
          <p className="text-xs text-text-3 leading-relaxed mb-2">{post.excerpt}</p>
          <div className="flex items-center gap-3 flex-wrap">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-bg-3 text-text-3">
                {tag}
              </span>
            ))}
            <span className="text-[10px] text-text-3 flex items-center gap-1">
              <Clock size={10} />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="text-[10px] text-text-3">{post.author}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onToggleStatus(post)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-white/5 hover:text-text-1 transition-colors"
            title={post.status === 'published' ? 'Unpublish' : post.status === 'draft' ? 'Publish' : 'Restore'}
          >
            {post.status === 'published' ? <Archive size={14} /> : <Send size={14} />}
          </button>
          <button
            onClick={() => onEdit(post)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-white/5 hover:text-text-1 transition-colors"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-3 hover:bg-accent-red/10 hover:text-accent-red transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Blog Editor Modal
// ---------------------------------------------------------------------------

function BlogEditorModal({
  open,
  onClose,
  post,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  post: BlogPost | null;
  onSave: (data: Partial<BlogPost>) => void;
}) {
  const [title, setTitle] = useState(post?.title || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [body, setBody] = useState(post?.body || '');
  const [tagsInput, setTagsInput] = useState(post?.tags.join(', ') || '');
  const [status, setStatus] = useState<'draft' | 'published'>(
    post?.status === 'published' ? 'published' : 'draft'
  );

  const handleSave = () => {
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    const slug =
      post?.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    onSave({
      id: post?.id,
      title,
      slug,
      excerpt,
      body,
      tags,
      status,
      publishedAt: status === 'published' ? new Date().toISOString() : post?.publishedAt || null,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={post ? 'Edit Post' : 'New Blog Post'} size="lg">
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-mono text-text-3 uppercase tracking-wide mb-1.5">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm focus:border-accent-cyan focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-text-3 uppercase tracking-wide mb-1.5">
            Excerpt
          </label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short summary for cards and previews"
            className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm focus:border-accent-cyan focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-mono text-text-3 uppercase tracking-wide mb-1.5">
            Body (Markdown)
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your post content in Markdown..."
            rows={12}
            className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm font-mono leading-relaxed focus:border-accent-cyan focus:outline-none resize-y"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono text-text-3 uppercase tracking-wide mb-1.5">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="product, ai, update"
              className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm focus:border-accent-cyan focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-text-3 uppercase tracking-wide mb-1.5">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="w-full px-3 py-2 bg-bg-1 border border-border rounded-lg text-sm focus:border-accent-cyan focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-border rounded-lg text-sm text-text-2 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 py-2.5 bg-accent-cyan hover:bg-accent-cyan/80 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {post ? 'Save Changes' : 'Create Post'}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Admin Page
// ---------------------------------------------------------------------------

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('features');
  const [features, setFeatures] = useState<FeatureFlag[]>(MOCK_FEATURES);
  const [posts, setPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [featureFilter, setFeatureFilter] = useState<'all' | 'platform' | 'service'>('all');

  // Feature toggles
  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, enabled: !f.enabled, updatedAt: new Date().toISOString() } : f
      )
    );
  };

  const filteredFeatures =
    featureFilter === 'all' ? features : features.filter((f) => f.scope === featureFilter);

  // Blog CRUD
  const openNewPost = () => {
    setEditingPost(null);
    setEditorOpen(true);
  };

  const openEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setEditorOpen(true);
  };

  const savePost = (data: Partial<BlogPost>) => {
    if (data.id) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === data.id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
        )
      );
    } else {
      const newPost: BlogPost = {
        id: `bp${Date.now()}`,
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        body: data.body || '',
        status: data.status || 'draft',
        author: 'Alex Chen',
        tags: data.tags || [],
        publishedAt: data.publishedAt || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPosts((prev) => [newPost, ...prev]);
    }
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePostStatus = (post: BlogPost) => {
    const nextStatus = post.status === 'published' ? 'draft' : 'published';
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              status: nextStatus,
              publishedAt: nextStatus === 'published' ? new Date().toISOString() : p.publishedAt,
              updatedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const enabledCount = features.filter((f) => f.enabled).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold mb-1">Admin Panel</h2>
        <p className="text-text-3 text-xs">Manage feature flags and blog content</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-bg-2 border border-border rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('features')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
            tab === 'features'
              ? 'bg-accent-cyan/10 text-accent-cyan font-medium'
              : 'text-text-2 hover:bg-white/5'
          }`}
        >
          <Zap size={14} />
          Features
          <span className="text-[10px] font-mono bg-bg-3 px-1.5 py-0.5 rounded">
            {enabledCount}/{features.length}
          </span>
        </button>
        <button
          onClick={() => setTab('blog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
            tab === 'blog'
              ? 'bg-accent-cyan/10 text-accent-cyan font-medium'
              : 'text-text-2 hover:bg-white/5'
          }`}
        >
          <FileText size={14} />
          Blog Posts
          <span className="text-[10px] font-mono bg-bg-3 px-1.5 py-0.5 rounded">{posts.length}</span>
        </button>
      </div>

      {/* Features Tab */}
      {tab === 'features' && (
        <div className="space-y-4">
          {/* Stats bar */}
          <div className="flex items-center gap-6 text-xs text-text-3">
            <span>
              <span className="text-accent-green font-mono font-bold">{enabledCount}</span> enabled
            </span>
            <span>
              <span className="text-text-2 font-mono font-bold">{features.length - enabledCount}</span> disabled
            </span>
          </div>

          {/* Scope filter */}
          <div className="flex items-center gap-2">
            {(['all', 'platform', 'service'] as const).map((scope) => (
              <button
                key={scope}
                onClick={() => setFeatureFilter(scope)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  featureFilter === scope
                    ? 'bg-accent-cyan/10 text-accent-cyan font-medium'
                    : 'text-text-3 hover:bg-white/5'
                }`}
              >
                {scope === 'all' ? 'All' : scope.charAt(0).toUpperCase() + scope.slice(1)}
              </button>
            ))}
          </div>

          {/* Feature list */}
          <div className="space-y-2">
            {filteredFeatures.map((feature) => (
              <FeatureRow key={feature.id} feature={feature} onToggle={toggleFeature} />
            ))}
          </div>
        </div>
      )}

      {/* Blog Tab */}
      {tab === 'blog' && (
        <div className="space-y-4">
          {/* Stats bar + Add button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs text-text-3">
              <span>
                <span className="text-accent-green font-mono font-bold">{publishedCount}</span> published
              </span>
              <span>
                <span className="text-accent-amber font-mono font-bold">{draftCount}</span> drafts
              </span>
            </div>
            <button
              onClick={openNewPost}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-cyan hover:bg-accent-cyan/80 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Plus size={14} />
              New Post
            </button>
          </div>

          {/* Post list */}
          <div className="space-y-2">
            {posts.map((post) => (
              <BlogRow
                key={post.id}
                post={post}
                onEdit={openEditPost}
                onDelete={deletePost}
                onToggleStatus={togglePostStatus}
              />
            ))}
            {posts.length === 0 && (
              <div className="text-center py-12 text-text-3 text-sm">
                No blog posts yet. Create your first post to get started.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Blog Editor Modal */}
      <BlogEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        post={editingPost}
        onSave={savePost}
      />
    </div>
  );
}
