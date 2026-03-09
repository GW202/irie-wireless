import { LucideIcon } from 'lucide-react';

export interface FeatureFlag {
  id: string;
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  scope: 'platform' | 'service' | 'tenant';
  service?: string;
  updatedAt: string;
  updatedBy: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: 'draft' | 'published' | 'archived';
  author: string;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
