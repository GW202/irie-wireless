'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import IrieLogo from '@/components/ui/IrieLogo';

interface NavbarProps {
  onContactClick: () => void;
}

export default function Navbar({ onContactClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-all duration-300 border-b border-border backdrop-blur-[20px] ${
          scrolled
            ? 'py-3 px-4 md:px-8 bg-[rgba(6,8,12,0.95)]'
            : 'py-5 px-4 md:px-8 bg-[rgba(6,8,12,0.8)]'
        }`}
      >
        <IrieLogo height={30} variant="full" />

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-2 text-[0.85rem] font-normal tracking-wide hover:text-text-1 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={onContactClick}
            className="px-5 py-2 bg-transparent border border-accent-cyan text-accent-cyan rounded-md font-medium text-[0.85rem] transition-all duration-300 hover:bg-accent-cyan/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]"
          >
            Partner With Irie
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center text-text-2"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] bg-bg-0/95 backdrop-blur-lg flex flex-col animate-[fadeIn_0.2s_ease]">
          <div className="flex items-center justify-between p-6">
            <IrieLogo height={30} variant="full" />
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-text-2"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-text-1 text-xl font-medium hover:text-accent-cyan transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileOpen(false);
                onContactClick();
              }}
              className="mt-4 inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-accent-cyan to-accent-green text-bg-0 font-semibold text-sm rounded-lg"
            >
              Partner With Irie
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
