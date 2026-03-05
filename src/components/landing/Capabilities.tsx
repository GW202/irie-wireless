'use client';

import { motion } from 'framer-motion';
import { CAPABILITIES } from '@/lib/constants';
import { sectionVariants, containerVariants, cardVariants } from '@/lib/animations';

export default function Capabilities() {
  return (
    <section className="py-24 px-6" id="capabilities">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="mb-16">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan mb-4">
              — Platform Capabilities
            </div>
            <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-[1.1] mb-4">
              Built for Provider-Agnostic{' '}
              <span className="gradient-text">MVNO Enablement</span>
            </h2>
            <p className="text-text-2 max-w-xl">
              Everything MVNOs and digital carriers need to launch, scale, and switch providers
              without rewriting a single line of frontend code.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {CAPABILITIES.map((cap) => (
            <motion.div
              key={cap.title}
              className="p-10 bg-bg-0 group hover:bg-accent-cyan/[0.03] transition-colors"
              variants={cardVariants}
            >
              <div className="text-accent-cyan mb-6 text-3xl">{cap.icon}</div>
              <h4 className="text-lg font-bold text-text-1 mb-3">{cap.title}</h4>
              <p className="text-sm text-text-2 leading-relaxed">{cap.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
