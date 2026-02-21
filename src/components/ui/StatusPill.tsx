interface StatusPillProps {
  status: 'Active' | 'Scaling' | 'Paused';
}

const statusClasses = {
  Active: 'bg-accent-green/10 text-accent-green',
  Scaling: 'bg-accent-amber/10 text-accent-amber',
  Paused: 'bg-accent-red/10 text-accent-red',
};

export default function StatusPill({ status }: StatusPillProps) {
  return (
    <span className={`font-mono text-[0.6rem] px-2 py-0.5 rounded uppercase tracking-wide ${statusClasses[status]}`}>
      {status}
    </span>
  );
}
