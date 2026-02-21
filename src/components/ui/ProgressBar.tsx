interface ProgressBarProps {
  value: number;
  color: string;
  className?: string;
}

export default function ProgressBar({ value, color, className = '' }: ProgressBarProps) {
  return (
    <div className={`h-1 rounded-sm bg-bg-4 w-20 relative inline-block ${className}`}>
      <div
        className="h-full rounded-sm absolute top-0 left-0"
        style={{ width: `${value}%`, background: color }}
      />
    </div>
  );
}
