'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Check } from 'lucide-react';
import { ORGANIZATION_TYPES } from '@/lib/constants';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  business: z.string().min(1, 'Business name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  type: z.string().min(1, 'Organization type is required'),
  notes: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const handleClose = useCallback(() => {
    onClose();
    // Reset form after animation
    setTimeout(() => {
      setSubmitted(false);
      reset();
    }, 350);
  }, [onClose, reset]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, handleClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
      // Auto-close after 3s
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch {
      // Still show success in demo mode
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/70 backdrop-blur-[8px] z-[1000] flex items-center justify-center opacity-0 animate-[fadeIn_0.35s_ease_forwards]"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div className="bg-bg-1 border border-accent-cyan/20 rounded-2xl p-10 max-sm:p-7 w-[90%] max-w-[520px] relative shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(0,229,255,0.06)] max-h-[90vh] overflow-y-auto animate-[fadeUp_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards]">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 border border-border rounded-md bg-bg-2 text-text-2 flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-accent-cyan hover:text-text-1"
          aria-label="Close modal"
        >
          <X size={14} />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-accent-cyan mb-3 flex items-center gap-2">
              <span className="w-3.5 h-px bg-accent-cyan" />
              Get In Touch
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-1.5">
              Partner With <span className="gradient-text">Irie</span>
            </h2>
            <p className="text-[0.85rem] text-text-2 mb-7 leading-relaxed">
              Tell us about your operation. We&apos;ll follow up within 24 hours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-mono text-text-2 uppercase tracking-[0.08em]">
                  Name *
                </label>
                <input
                  {...register('name')}
                  placeholder="Your full name"
                  className={`py-2.5 px-3.5 bg-bg-2 border rounded-lg text-text-1 font-display text-[0.88rem] outline-none transition-all duration-200 placeholder:text-text-3 focus:border-accent-cyan/40 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] ${
                    errors.name ? 'border-accent-red' : 'border-border'
                  }`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-mono text-text-2 uppercase tracking-[0.08em]">
                  Business Name *
                </label>
                <input
                  {...register('business')}
                  placeholder="Company name"
                  className={`py-2.5 px-3.5 bg-bg-2 border rounded-lg text-text-1 font-display text-[0.88rem] outline-none transition-all duration-200 placeholder:text-text-3 focus:border-accent-cyan/40 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] ${
                    errors.business ? 'border-accent-red' : 'border-border'
                  }`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-mono text-text-2 uppercase tracking-[0.08em]">
                  Email *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@company.com"
                  className={`py-2.5 px-3.5 bg-bg-2 border rounded-lg text-text-1 font-display text-[0.88rem] outline-none transition-all duration-200 placeholder:text-text-3 focus:border-accent-cyan/40 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] ${
                    errors.email ? 'border-accent-red' : 'border-border'
                  }`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[0.72rem] font-mono text-text-2 uppercase tracking-[0.08em]">
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="py-2.5 px-3.5 bg-bg-2 border border-border rounded-lg text-text-1 font-display text-[0.88rem] outline-none transition-all duration-200 placeholder:text-text-3 focus:border-accent-cyan/40 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)]"
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[0.72rem] font-mono text-text-2 uppercase tracking-[0.08em]">
                  Organization Type *
                </label>
                <select
                  {...register('type')}
                  className={`py-2.5 px-3.5 bg-bg-2 border rounded-lg text-text-1 font-display text-[0.88rem] outline-none cursor-pointer transition-all duration-200 appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%237a8ba5' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.8rem_center] pr-9 focus:border-accent-cyan/40 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)] ${
                    errors.type ? 'border-accent-red' : 'border-border'
                  }`}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select your type
                  </option>
                  {ORGANIZATION_TYPES.map((t) => (
                    <option key={t.value} value={t.value} className="bg-bg-2 text-text-1">
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[0.72rem] font-mono text-text-2 uppercase tracking-[0.08em]">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  placeholder="Tell us briefly about your needs or goals..."
                  className="py-2.5 px-3.5 bg-bg-2 border border-border rounded-lg text-text-1 font-display text-[0.88rem] outline-none resize-y min-h-[70px] transition-all duration-200 placeholder:text-text-3 focus:border-accent-cyan/40 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.08)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-5 py-3.5 bg-gradient-to-br from-accent-cyan to-accent-green text-bg-0 font-semibold text-[0.92rem] border-none rounded-lg cursor-pointer transition-all duration-300 font-display tracking-tight hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,229,255,0.25)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-cyan/[0.08] to-accent-green/[0.04] border-2 border-accent-cyan/30 flex items-center justify-center mx-auto mb-5">
              <Check size={24} className="text-accent-cyan" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Inquiry Received</h3>
            <p className="text-[0.85rem] text-text-2">
              Our team will review your submission and reach out within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
