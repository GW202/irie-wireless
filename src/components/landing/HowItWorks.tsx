'use client';

import { motion } from 'framer-motion';
import { STEPS } from '@/lib/constants';
import { sectionVariants, containerVariants, cardVariants } from '@/lib/animations';

export default function HowItWorks() {
  return (
    <section className="py-32 bg-bg-1" id="how">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        <motion.div
          className="text-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-cyan mb-5 flex items-center gap-3 justify-center">
            <span className="w-8 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-green rounded-sm" />
            Process
          </div>
          <h2 className="text-[clamp(2.6rem,5.5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.1] mb-6">
            How It Works
          </h2>
          <p className="text-lg text-text-2 leading-relaxed max-w-[620px] mx-auto">
            From integration to infinite scale in four steps.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              className="group p-8 px-6 bg-bg-2 border border-border rounded-xl relative overflow-hidden transition-all duration-400 hover:border-accent-cyan/30 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
              variants={cardVariants}
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-green opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="font-mono text-[0.65rem] text-accent-cyan tracking-[0.1em] uppercase mb-5">
                {step.number}
              </div>
              <h3 className="text-[1.3rem] font-semibold mb-3 tracking-tight">{step.title}</h3>
              <p className="text-[0.85rem] text-text-2 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
