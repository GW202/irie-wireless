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
    setTimeout(() => {
      setSubmitted(false);
      reset();
    }, 350);
  }, [onClose, reset]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, handleClose]);

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
      setTimeout(() => handleClose(), 3000);
    } catch {
      setSubmitted(true);
      setTimeout(() => handleClose(), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 opacity-0 animate-[fadeIn_0.35s_ease_forwards]"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div className="bg-bg-1/80 backdrop-blur-[12px] border border-border w-full max-w-[560px] rounded-2xl shadow-2xl relative overflow-hidden animate-[fadeUp_0.35s_cubic-bezier(0.16,1,0.3,1)_forwards] max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-text-3 hover:text-text-1 transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {!submitted ? (
          <>
            <div className="px-8 pt-10 pb-6 text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-accent-cyan" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent-cyan">
                  Get in touch
                </span>
                <div className="h-px w-8 bg-accent-cyan" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Partner With <span className="text-accent-cyan">Irie</span>
              </h2>
              <p className="text-text-2 text-sm">
                Tell us about your operation. We&apos;ll follow up within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="px-10 pb-10 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-3 ml-1">
                    Your Full Name <span className="text-accent-cyan">*</span>
                  </label>
                  <input
                    {...register('name')}
                    placeholder="Jane Doe"
                    className={`w-full bg-bg-2/50 border rounded-lg text-sm py-3 px-4 transition-all outline-none text-text-1 placeholder:text-text-3 focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20 ${
                      errors.name ? 'border-accent-red' : 'border-border'
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-3 ml-1">
                    Business Name <span className="text-accent-cyan">*</span>
                  </label>
                  <input
                    {...register('business')}
                    placeholder="Company Name"
                    className={`w-full bg-bg-2/50 border rounded-lg text-sm py-3 px-4 transition-all outline-none text-text-1 placeholder:text-text-3 focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20 ${
                      errors.business ? 'border-accent-red' : 'border-border'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-3 ml-1">
                    Email <span className="text-accent-cyan">*</span>
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@company.com"
                    className={`w-full bg-bg-2/50 border rounded-lg text-sm py-3 px-4 transition-all outline-none text-text-1 placeholder:text-text-3 focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20 ${
                      errors.email ? 'border-accent-red' : 'border-border'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-accent-red font-medium mt-1 ml-1">
                      Please enter a valid business email address.
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-text-3 ml-1">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-bg-2/50 border border-border rounded-lg text-sm py-3 px-4 transition-all outline-none text-text-1 placeholder:text-text-3 focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-3 ml-1">
                  Organization Type <span className="text-accent-cyan">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register('type')}
                    className={`w-full appearance-none bg-bg-2/50 border rounded-lg text-sm py-3 px-4 pr-10 transition-all outline-none text-text-1 focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20 ${
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
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-text-3 ml-1">
                  Notes
                </label>
                <textarea
                  {...register('notes')}
                  placeholder="Tell us briefly about your needs or goals..."
                  rows={4}
                  className="w-full bg-bg-2/50 border border-border rounded-lg text-sm py-3 px-4 transition-all outline-none text-text-1 placeholder:text-text-3 resize-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan/20"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent-cyan hover:bg-[#00ccdd] text-bg-0 font-extrabold py-4 rounded-lg transition-all transform active:scale-[0.98] shadow-[0_0_20px_rgba(0,229,255,0.2)] mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>

              <p className="text-center text-[10px] text-text-3 mt-4 leading-relaxed">
                By submitting this form, you agree to our{' '}
                <a className="text-accent-cyan hover:underline" href="#">
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a className="text-accent-cyan hover:underline" href="#">
                  Terms of Service
                </a>
                .
              </p>
            </form>

            {/* Decorative glow effects */}
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-cyan/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent-cyan/10 blur-[80px] rounded-full pointer-events-none" />
          </>
        ) : (
          <div className="text-center py-16 px-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-cyan/[0.08] to-accent-green/[0.04] border-2 border-accent-cyan/30 flex items-center justify-center mx-auto mb-5">
              <Check size={24} className="text-accent-cyan" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Inquiry Received</h3>
            <p className="text-sm text-text-2">
              Our team will review your submission and reach out within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
