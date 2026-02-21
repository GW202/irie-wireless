'use client';

import { motion } from 'framer-motion';
import { CAPABILITIES } from '@/lib/constants';
import { sectionVariants, containerVariants, cardVariants } from '@/lib/animations';

export default function Capabilities() {
  return (
    <section className="py-32 bg-bg-1" id="capabilities">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-cyan mb-5 flex items-center gap-3">
            <span className="w-8 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-green rounded-sm" />
            Platform Capabilities
          </div>
          <h2 className="text-[clamp(2.6rem,5.5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.1] mb-6">
            Built for Infrastructure-Grade{' '}
            <span className="gradient-text">Orchestration</span>
          </h2>
          <p className="text-lg text-text-2 leading-relaxed max-w-[620px]">
            Everything operators and brands need to scale wireless operations without rebuilding
            from scratch.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {CAPABILITIES.map((cap) => (
            <motion.div
              key={cap.title}
              className="p-8 px-6 bg-bg-2 border border-border rounded-[10px] transition-all duration-400 relative hover:border-accent-cyan/20 hover:bg-bg-3"
              variants={cardVariants}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-cyan/[0.08] to-accent-green/[0.04] border border-accent-cyan/15 flex items-center justify-center mb-5 text-lg">
                {cap.icon}
              </div>
              <h3 className="text-[1.1rem] font-semibold mb-2.5 tracking-tight">{cap.title}</h3>
              <p className="text-[0.82rem] text-text-2 leading-relaxed">{cap.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
