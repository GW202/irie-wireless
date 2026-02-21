'use client';

import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onContactClick: () => void;
}

export default function Hero({ onContactClick }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center relative pt-20 overflow-hidden" id="hero">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 w-full">
        <div className="relative z-[2] max-w-[800px]">
          <h1
            className="text-[clamp(2.8rem,6vw,4.5rem)] font-bold leading-[1.08] tracking-[-0.035em] mb-6 opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.2s]"
          >
            The Control Plane for{' '}
            <span className="gradient-text">Global Wireless</span> Infrastructure
          </h1>

          <p
            className="text-lg leading-relaxed text-text-2 max-w-[580px] mb-10 opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.4s]"
          >
            Irie Wireless orchestrates carrier, wholesale, and billing systems through a unified
            API layer — powering scalable multi-brand telecom operations worldwide.
          </p>

          <div
            className="flex gap-4 flex-wrap opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.6s] max-md:flex-col"
          >
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-accent-cyan to-accent-green text-bg-0 font-semibold text-sm rounded-lg cursor-pointer transition-all duration-300 tracking-tight hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,229,255,0.25)]"
            >
              Explore the Platform
              <ArrowRight size={16} />
            </a>
            <button
              onClick={onContactClick}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-text-1 font-medium text-sm border border-border rounded-lg cursor-pointer transition-all duration-300 hover:border-text-3 hover:bg-white/[0.02]"
            >
              Partner With Irie
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
