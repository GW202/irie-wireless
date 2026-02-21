'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { sectionVariants } from '@/lib/animations';

interface FinalCTAProps {
  onContactClick: () => void;
}

export default function FinalCTA({ onContactClick }: FinalCTAProps) {
  return (
    <section className="text-center py-40 relative" id="contact">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse,rgba(0,229,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-8 relative z-[2]">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="font-mono text-[0.8rem] uppercase tracking-[0.18em] text-accent-cyan mb-5 flex items-center gap-3 justify-center">
            <span className="w-8 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-green rounded-sm" />
            Get Started
          </div>
          <h2 className="text-[clamp(2.6rem,5.5vw,4rem)] font-bold tracking-[-0.035em] leading-[1.1] mb-6">
            Orchestrate the Future
            <br />
            of <span className="gradient-text">Wireless</span>
          </h2>
          <p className="text-lg text-text-2 leading-relaxed max-w-[620px] mx-auto">
            Whether you&apos;re a telecom operator, a brand, or an investor — let&apos;s build the
            infrastructure layer together.
          </p>
          <div className="flex justify-center mt-10">
            <button
              onClick={onContactClick}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-accent-cyan to-accent-green text-bg-0 font-semibold text-sm rounded-lg cursor-pointer transition-all duration-300 tracking-tight hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,229,255,0.25)]"
            >
              Partner With Irie
              <ArrowRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
