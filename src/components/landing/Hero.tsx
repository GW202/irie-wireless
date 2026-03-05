'use client';

import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onContactClick: () => void;
}

export default function Hero({ onContactClick }: HeroProps) {
  return (
    <section
      className="relative pt-40 pb-20 px-6 overflow-hidden"
      id="hero"
      style={{
        backgroundImage:
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}
    >
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-[radial-gradient(circle,rgba(0,229,255,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-[1]">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent-cyan/20 bg-accent-cyan/5 text-accent-cyan text-xs font-mono mb-8 uppercase tracking-widest opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.1s]">
          <span className="flex h-2 w-2 rounded-full bg-accent-cyan animate-pulse" />
          Telecom Integration Platform
        </div>

        <h1 className="text-[clamp(2.8rem,6vw,4.5rem)] font-extrabold text-text-1 leading-[1.1] mb-8 max-w-4xl mx-auto opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.2s]">
          The Integration Layer That Decouples{' '}
          <span className="gradient-text">Brands From Legacy BSS</span>
        </h1>

        <p className="text-lg md:text-xl text-text-2 max-w-2xl mx-auto mb-12 opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.4s]">
          Irie Wireless orchestrates carrier, wholesale, and billing systems through a unified
          API layer — powering scalable multi-brand telecom operations worldwide.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.6s]">
          <a
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-accent-cyan to-accent-green text-bg-0 font-bold rounded-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
          >
            Explore the Platform <ArrowRight size={16} />
          </a>
          <button
            onClick={onContactClick}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-border font-bold rounded-lg hover:bg-white/10 transition-all"
          >
            Partner With Irie
          </button>
        </div>
      </div>
    </section>
  );
}
