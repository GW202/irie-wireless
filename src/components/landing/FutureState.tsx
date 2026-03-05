'use client';

import { motion } from 'framer-motion';
import { FUTURE_ITEMS } from '@/lib/constants';
import { sectionVariants, containerVariants, itemVariants } from '@/lib/animations';

export default function FutureState() {
  return (
    <section className="py-24 px-6 overflow-hidden" id="roadmap">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cyan mb-4">
            — Roadmap
          </div>
          <h2 className="text-[clamp(2.2rem,4vw,3.2rem)] font-bold leading-[1.1]">
            The Long-Term{' '}
            <span className="gradient-text">Vision Roadmap</span>
          </h2>
        </motion.div>

        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="absolute top-1/2 left-0 w-full h-px bg-border hidden md:block" />
          <div className="grid md:grid-cols-5 gap-8 relative">
            {FUTURE_ITEMS.map((item, i) => (
              <motion.div
                key={item.title}
                className={`relative ${i > 0 ? 'opacity-60' : ''}`}
                variants={itemVariants}
              >
                <div
                  className={`w-4 h-4 rounded-full absolute -top-2 md:top-1/2 md:-translate-y-2 left-1/2 -translate-x-2 z-10 ${
                    i === 0
                      ? 'bg-accent-cyan shadow-[0_0_15px_rgba(0,229,255,0.6)]'
                      : 'bg-bg-4'
                  }`}
                />
                <div className="pt-12 md:pt-16 text-center">
                  <h4 className="font-bold text-text-1 mb-2">{item.title}</h4>
                  <p className="text-xs text-text-3">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
