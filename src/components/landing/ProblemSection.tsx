'use client';

import { motion } from 'framer-motion';
import { PROBLEM_ITEMS } from '@/lib/constants';
import { containerVariants, itemVariants } from '@/lib/animations';

const LEGACY_NODES = [
  'Carrier APIs',
  'Wholesale Platforms',
  'BSS / Billing Systems',
  'SIM Provisioning',
];

export default function ProblemSection() {
  return (
    <section className="py-24 px-6 border-y border-border bg-bg-1" id="platform">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="grid lg:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <motion.div variants={itemVariants}>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan mb-4">
              — The Problem
            </div>
            <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-[1.1] mb-6">
              Telecom Infrastructure Was Never Designed for{' '}
              <span className="gradient-text">Multi-Brand Scale</span>
            </h2>
            <p className="text-text-2 mb-8 leading-relaxed">
              Every new brand launch requires custom integrations across fragmented systems.
              Manual workflows. Brittle connections. Months of engineering for what should be
              simple API calls.
            </p>
            <ul className="space-y-4">
              {PROBLEM_ITEMS.slice(0, 2).map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-4 p-4 rounded-xl bg-bg-0 border border-border"
                >
                  <span className="text-accent-cyan text-xl mt-0.5 shrink-0">&#x26A0;</span>
                  <div>
                    <h4 className="font-bold text-text-1">{item.title}</h4>
                    <p className="text-sm text-text-3">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="relative" variants={itemVariants}>
            <div className="bg-bg-0 border border-border rounded-2xl p-8 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                <span className="text-xs font-mono text-text-3">LEGACY_NODES.JSON</span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-red/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-amber/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-green/20" />
                </div>
              </div>
              {LEGACY_NODES.map((node) => (
                <div
                  key={node}
                  className="p-4 rounded border border-border bg-white/5 flex items-center justify-between"
                >
                  <span className="text-sm font-mono text-text-2">{node}</span>
                  <span className="text-[10px] text-accent-red/50 uppercase">Fragmented</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
