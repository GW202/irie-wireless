interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'warn' | 'live';
}

const variantClasses = {
  default: 'bg-accent-cyan/10 text-accent-cyan',
  warn: 'bg-accent-amber/10 text-accent-amber',
  live: 'bg-accent-green/[0.12] text-accent-green',
};

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span className={`font-mono text-[0.6rem] px-1.5 py-0.5 rounded ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
