const ENV = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';

const envStyles: Record<string, string> = {
  DEV: 'bg-accent-amber/10 text-accent-amber',
  STAGING: 'bg-accent-purple/10 text-accent-purple',
  PROD: 'bg-accent-green/10 text-accent-green',
};

export default function EnvironmentIndicator() {
  return (
    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${envStyles[ENV] || envStyles.DEV}`}>
      {ENV}
    </span>
  );
}
