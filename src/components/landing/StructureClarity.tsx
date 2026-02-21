'use client';

import { motion } from 'framer-motion';
import { sectionVariants } from '@/lib/animations';

export default function StructureClarity() {
  return (
    <section className="py-20">
      <div className="max-w-[1200px] mx-auto px-8">
        <motion.div
          className="text-center max-w-[700px] mx-auto"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-cyan mb-5 flex items-center gap-3 justify-center">
            <span className="w-8 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-green rounded-sm" />
            Structure
          </div>
          <h2 className="text-[2.2rem] font-bold tracking-[-0.035em] leading-[1.1] mb-6">
            Built for Licensed Operators.
            <br />
            Designed for Scale.
          </h2>
          <p className="text-text-2 text-[0.92rem] leading-relaxed mt-4">
            Irie does not replace carriers or operators. We abstract infrastructure to accelerate
            growth and automation. We operate alongside licensed telecom entities, enabling
            orchestration without regulatory duplication.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
