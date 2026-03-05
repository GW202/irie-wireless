'use client';

import { motion } from 'framer-motion';
import { METRICS } from '@/lib/constants';
import { sectionVariants } from '@/lib/animations';

export default function MetricsStrip() {
  return (
    <section className="py-20 px-6 bg-accent-cyan text-bg-0">
      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {METRICS.map((m) => (
          <div key={m.label}>
            <div className="text-4xl md:text-5xl font-extrabold mb-1 tracking-tight">
              {m.value}
            </div>
            <div className="text-[10px] uppercase font-mono font-bold opacity-60">
              {m.label}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
