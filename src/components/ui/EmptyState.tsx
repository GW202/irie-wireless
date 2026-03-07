import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-14 h-14 rounded-xl bg-bg-3 border border-border flex items-center justify-center mb-4">
        <Icon size={24} className="text-text-3" />
      </div>
      <h3 className="font-bold text-sm mb-1">{title}</h3>
      <p className="text-text-3 text-xs max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
