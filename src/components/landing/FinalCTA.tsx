'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { sectionVariants } from '@/lib/animations';

interface FinalCTAProps {
  onContactClick: () => void;
}

const BENEFITS = [
  'Free discovery workshop',
  'Full API documentation access',
  'Dedicated solution engineer',
];

export default function FinalCTA({ onContactClick }: FinalCTAProps) {
  return (
    <section className="py-24 px-6 relative overflow-hidden" id="contact">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(0,229,255,0.04)_0%,transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-[2]">
        <motion.div
          className="grid lg:grid-cols-2 gap-16 items-center"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div>
            <h2 className="text-[clamp(2.8rem,5vw,3.8rem)] font-extrabold text-text-1 mb-6">
              Own the Integration Boundary
            </h2>
            <p className="text-xl text-text-2 mb-8">
              Start orchestrating your telecom future today. Our team will guide you through
              the integration process.
            </p>
            <div className="space-y-6">
              {BENEFITS.map((benefit) => (
                <div key={benefit} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-border flex items-center justify-center shrink-0">
                    <Check size={18} className="text-accent-cyan" />
                  </div>
                  <span className="text-text-1 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-bg-1/80 border border-border p-8 md:p-12 rounded-3xl backdrop-blur-xl relative">
            <div className="mb-8">
              <p className="text-xs font-mono text-accent-cyan uppercase mb-2">Get in touch</p>
              <h3 className="text-2xl font-bold text-text-1">
                Partner With <span className="text-accent-cyan">Irie</span>
              </h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-text-3 uppercase">Name *</label>
                  <input
                    className="w-full bg-white/5 border border-border rounded-lg py-3 px-4 text-sm text-text-1 outline-none transition-all focus:border-accent-cyan/40 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] placeholder:text-text-3"
                    placeholder="Your full name"
                    type="text"
                    readOnly
                    onFocus={onContactClick}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-text-3 uppercase">
                    Business Name *
                  </label>
                  <input
                    className="w-full bg-white/5 border border-border rounded-lg py-3 px-4 text-sm text-text-1 outline-none transition-all focus:border-accent-cyan/40 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] placeholder:text-text-3"
                    placeholder="Company Name"
                    type="text"
                    readOnly
                    onFocus={onContactClick}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-text-3 uppercase">Email *</label>
                  <input
                    className="w-full bg-white/5 border border-border rounded-lg py-3 px-4 text-sm text-text-1 outline-none transition-all focus:border-accent-cyan/40 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] placeholder:text-text-3"
                    placeholder="you@company.com"
                    type="email"
                    readOnly
                    onFocus={onContactClick}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-text-3 uppercase">Phone Number</label>
                  <input
                    className="w-full bg-white/5 border border-border rounded-lg py-3 px-4 text-sm text-text-1 outline-none transition-all focus:border-accent-cyan/40 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] placeholder:text-text-3"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    readOnly
                    onFocus={onContactClick}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-3 uppercase">
                  Organization Type *
                </label>
                <select
                  className="w-full bg-white/5 border border-border rounded-lg py-3 px-4 text-sm text-text-1 outline-none transition-all focus:border-accent-cyan/40 appearance-none cursor-pointer"
                  onFocus={onContactClick}
                >
                  <option>Select your type</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-3 uppercase">Notes</label>
                <textarea
                  className="w-full bg-white/5 border border-border rounded-lg py-3 px-4 text-sm text-text-1 outline-none transition-all focus:border-accent-cyan/40 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] placeholder:text-text-3 resize-none"
                  placeholder="Tell us briefly about your needs or goals..."
                  rows={4}
                  readOnly
                  onFocus={onContactClick}
                />
              </div>
              <button
                onClick={onContactClick}
                className="w-full bg-gradient-to-br from-accent-cyan to-accent-green text-bg-0 font-bold py-4 rounded-lg hover:opacity-90 transition-opacity"
                type="button"
              >
                Submit Inquiry
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
