import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: 'cyan' | 'green' | 'amber' | 'purple' | 'red';
  hover?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className, accent, hover, onClick }: CardProps) {
  const accentBorder = accent ? `border-l-2 border-l-accent-${accent}` : '';
  return (
    <div
      className={cn(
        'bg-bg-2 rounded-xl border border-border overflow-hidden',
        accentBorder,
        hover ? 'hover:border-border-light transition-colors cursor-pointer' : '',
        className || ''
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, action }: CardHeaderProps) {
  return (
    <div className={cn('p-5 border-b border-border flex items-center justify-between', className || '')}>
      <div className="flex items-center gap-2 text-sm font-bold">{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn('p-5', className || '')}>{children}</div>;
}
