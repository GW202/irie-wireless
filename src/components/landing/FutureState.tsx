'use client';

import { motion } from 'framer-motion';
import { FUTURE_ITEMS } from '@/lib/constants';
import { sectionVariants, containerVariants, itemVariants } from '@/lib/animations';

export default function FutureState() {
  return (
    <section className="py-32 bg-bg-1">
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
            Roadmap
          </div>
          <h2 className="text-[clamp(2.6rem,5.5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.1] mb-6">
            The Future of Telecom
            <br />
            is <span className="gradient-text">Programmable</span>
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {FUTURE_ITEMS.map((item) => (
            <motion.div
              key={item.title}
              className="p-6 border border-border rounded-[10px] text-[0.88rem] leading-relaxed text-text-2 transition-all duration-400 bg-bg-2 hover:text-text-1 hover:border-accent-cyan/30 hover:bg-accent-cyan/[0.03]"
              variants={itemVariants}
            >
              <strong className="block text-text-1 mb-1 text-[0.78rem] font-mono tracking-[0.05em] uppercase">
                {item.title}
              </strong>
              {item.description}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
