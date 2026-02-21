export default function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-accent-cyan/[0.06] to-accent-green/[0.04] border border-accent-cyan/[0.12] rounded-lg py-2.5 px-5 flex items-center gap-3 mb-6 text-[0.78rem] text-text-2">
      <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-[pulseGlow_2s_ease_infinite]" />
      <span>
        <strong className="text-accent-cyan font-medium">Demo Mode</strong> — You&apos;re viewing
        the Irie orchestration platform with simulated data.
      </span>
    </div>
  );
}
