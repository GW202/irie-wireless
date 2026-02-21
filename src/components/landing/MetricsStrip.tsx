'use client';

import { motion } from 'framer-motion';
import { METRICS } from '@/lib/constants';
import { sectionVariants } from '@/lib/animations';

export default function MetricsStrip() {
  return (
    <section className="py-32">
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
            Scale
          </div>
          <h2 className="text-[clamp(2.6rem,5.5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.1] mb-6">
            Built for the Next Generation
            <br />
            of <span className="gradient-text">Wireless Scale</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 py-12 border-t border-b border-border"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <div className="text-[2.5rem] font-bold tracking-tight mb-1 gradient-text">
                {m.value}
              </div>
              <div className="text-[0.78rem] text-text-2 uppercase tracking-[0.08em] font-mono">
                {m.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
