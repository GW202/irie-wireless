'use client';

import { motion } from 'framer-motion';
import { PROBLEM_NODES, PROBLEM_ITEMS } from '@/lib/constants';
import { sectionVariants, containerVariants, itemVariants } from '@/lib/animations';

export default function ProblemSection() {
  return (
    <section className="py-32 bg-bg-1 relative" id="platform">
      <div className="max-w-[1200px] mx-auto px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-cyan mb-5 flex items-center gap-3 text-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <span className="w-8 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-green rounded-sm" />
            The Problem
          </div>
          <h2 className="text-[clamp(2.6rem,5.5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.1] mb-6">
            Telecom Infrastructure Was Never
            <br />
            Designed for <span className="gradient-text">Multi-Brand Scale</span>
          </h2>
          <p className="text-lg text-text-2 leading-relaxed max-w-[620px]">
            Every new brand launch requires custom integrations across fragmented systems. Manual
            workflows. Brittle connections. Months of engineering.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div className="flex flex-col gap-2 p-8" variants={itemVariants}>
            {PROBLEM_NODES.map((node, i) => (
              <div
                key={node}
                className="flex items-center gap-4 py-4 px-6 bg-bg-2 border border-border rounded-lg font-mono text-[0.95rem] text-text-2 relative transition-all duration-300"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-accent-red shrink-0 shadow-[0_0_8px_rgba(255,68,68,0.4)]" />
                {node}
                {i % 2 === 0 && (
                  <span
                    className="absolute -right-7 top-1/2 w-7 h-px"
                    style={{
                      background:
                        'repeating-linear-gradient(90deg, #ff4444 0, #ff4444 4px, transparent 4px, transparent 8px)',
                    }}
                  />
                )}
              </div>
            ))}
          </motion.div>

          <motion.div className="flex flex-col gap-5" variants={containerVariants}>
            {PROBLEM_ITEMS.map((item) => (
              <motion.div
                key={item.title}
                className="flex items-start gap-4 py-4 px-5 border-l-2 border-border transition-colors duration-300 hover:border-l-accent-red"
                variants={itemVariants}
              >
                <div>
                  <h4 className="text-[1.05rem] font-semibold mb-1.5">{item.title}</h4>
                  <p className="text-[0.95rem] text-text-2 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
