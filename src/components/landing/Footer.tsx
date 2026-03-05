import { Globe, Link2, Terminal } from 'lucide-react';
import IrieLogo from '@/components/ui/IrieLogo';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <IrieLogo height={24} variant="horizontal" />
        <p className="text-sm text-text-3">
          &copy; 2026 Irie Wireless. All rights reserved. Built for the programmable telecom
          future.
        </p>
        <div className="flex gap-6 text-text-3">
          <a href="#" className="hover:text-accent-cyan transition-colors">
            <Globe size={20} />
          </a>
          <a href="#" className="hover:text-accent-cyan transition-colors">
            <Link2 size={20} />
          </a>
          <a href="#" className="hover:text-accent-cyan transition-colors">
            <Terminal size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
