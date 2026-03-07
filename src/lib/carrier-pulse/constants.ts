export const CATEGORIES: Record<string, { name: string; color: string }> = {
  wholesale_economics: { name: 'Wholesale Economics', color: '#e20074' },
  brand_launches: { name: 'Brand Launches', color: '#10b981' },
  competing_mvne: { name: 'MVNE Competition', color: '#f59e0b' },
  network_technology: { name: 'Network & Tech', color: '#06b6d4' },
  esim_activation: { name: 'eSIM & Activation', color: '#8b5cf6' },
  regulatory: { name: 'Regulatory & Risk', color: '#ef4444' },
  capital_markets: { name: 'Capital Markets', color: '#f97316' },
  subscriber_market: { name: 'Subscriber Market', color: '#3b82f6' },
};

export const CARRIERS: Record<string, { name: string; color: string }> = {
  t_mobile: { name: 'T-Mobile', color: '#e20074' },
  att: { name: 'AT&T', color: '#009fdb' },
  verizon: { name: 'Verizon', color: '#cd040b' },
};

export const RELEVANCE_COLORS: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#6b7280',
};

export const ACTION_STATUSES: string[] = ['open', 'in_progress', 'blocked', 'done', 'dismissed'];

export const ACTION_STATUS_COLORS: Record<string, string> = {
  open: '#3b82f6',
  in_progress: '#f59e0b',
  blocked: '#ef4444',
  done: '#10b981',
  dismissed: '#6b7280',
};

export const ACTION_STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  done: 'Done',
  dismissed: 'Dismissed',
};

export const ACTION_TYPES: Record<string, { name: string; color: string }> = {
  research: { name: 'Research', color: '#3b82f6' },
  inform: { name: 'Inform', color: '#8b5cf6' },
  act: { name: 'Act', color: '#f97316' },
  review: { name: 'Review', color: '#06b6d4' },
  monitor: { name: 'Monitor', color: '#10b981' },
};

export const ACTION_PRIORITY_COLORS: Record<string, string> = {
  urgent: '#ef4444',
  high: '#f97316',
  medium: '#f59e0b',
  low: '#6b7280',
};

export const LEAD_STATUSES: string[] = ['new', 'contacted', 'qualified', 'converted', 'dismissed'];

export const LEAD_STATUS_COLORS: Record<string, string> = {
  new: '#3b82f6',
  contacted: '#f59e0b',
  qualified: '#8b5cf6',
  converted: '#10b981',
  dismissed: '#6b7280',
};
