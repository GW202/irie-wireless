'use client';

import { motion } from 'framer-motion';
import { API_SOURCES, BRAND_OUTPUTS } from '@/lib/constants';
import { sectionVariants } from '@/lib/animations';

export default function IrieLayer() {
  return (
    <section className="py-32 relative" id="solution">
      <div className="max-w-[1200px] mx-auto px-8">
        <motion.div
          className="text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-cyan mb-5 flex items-center gap-3 justify-center">
            <span className="w-8 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-green rounded-sm" />
            The Irie Layer
          </div>
          <h2 className="text-[clamp(2.6rem,5.5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.1] mb-6">
            One Layer. <span className="gradient-text">Total Orchestration.</span>
          </h2>
          <p className="text-lg text-text-2 leading-relaxed max-w-[620px] mx-auto">
            Abstract. Automate. Scale. — Irie sits between telecom infrastructure and modern brand
            distribution.
          </p>
        </motion.div>

        <motion.div
          className="mt-16 py-12"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 items-center max-w-[1000px] mx-auto max-lg:gap-6">
            <div className="flex flex-col gap-3">
              {API_SOURCES.map((source) => (
                <div
                  key={source}
                  className="flex items-center gap-3 py-3.5 px-5 bg-bg-2 border border-border rounded-md font-mono text-[0.95rem] text-text-2 transition-all duration-300 hover:border-accent-cyan hover:text-text-1 hover:bg-accent-cyan/[0.04]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan shrink-0" />
                  {source}
                </div>
              ))}
            </div>

            <div className="relative py-10 px-8 mx-8 max-lg:mx-0 bg-bg-2 border border-accent-cyan/20 rounded-xl text-center shadow-[0_0_40px_rgba(0,229,255,0.06),inset_0_1px_0_rgba(0,229,255,0.1)]">
              <div
                className="absolute inset-[-1px] rounded-xl p-px"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,229,255,0.3), rgba(0,255,157,0.1), rgba(0,229,255,0.3))',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
              <h3 className="text-[1.05rem] font-mono font-bold tracking-[0.1em] uppercase mb-3">
                <span className="text-accent-cyan">Irie</span> Orchestration Engine
              </h3>
              <p className="text-[0.92rem] text-text-3 font-mono">Normalize → Automate → Route</p>
            </div>

            <div className="flex flex-col gap-3">
              {BRAND_OUTPUTS.map((brand) => (
                <div
                  key={brand}
                  className="flex items-center gap-3 py-3.5 px-5 bg-bg-2 border border-border rounded-md font-mono text-[0.95rem] text-text-2 transition-all duration-300 hover:border-accent-cyan hover:text-text-1 hover:bg-accent-cyan/[0.04]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green shrink-0" />
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
