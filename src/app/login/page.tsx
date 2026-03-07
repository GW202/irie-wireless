'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import IrieLogo from '@/components/ui/IrieLogo';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('alex.chen@iriewireless.com');
  const [password, setPassword] = useState('demo');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    router.push('/platform');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    const success = login(email, password);
    if (success) {
      router.push('/platform');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-accent-cyan rounded-xl flex items-center justify-center mb-4">
            <IrieLogo height={32} variant="icon" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            IRIE<span className="text-accent-cyan">.</span> Platform
          </h1>
          <p className="text-text-3 text-xs mt-1">Telecom Intelligence & Operations</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-bg-2 border border-border rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-text-3 uppercase tracking-widest mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg-3 border border-border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-accent-cyan/50 placeholder:text-text-3 text-text-1"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono text-text-3 uppercase tracking-widest mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-3 border border-border rounded-lg px-4 py-2.5 pr-10 text-sm outline-none focus:ring-1 focus:ring-accent-cyan/50 placeholder:text-text-3 text-text-1"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-accent-red text-xs">{error}</p>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-cyan to-accent-green text-bg-0 font-semibold text-sm py-3 rounded-lg hover:shadow-[0_4px_20px_rgba(0,229,255,0.25)] transition-all"
          >
            <LogIn size={16} />
            Sign In
          </button>

          <div className="pt-2 border-t border-border">
            <p className="text-[10px] text-text-3 text-center">
              Demo mode — any credentials will work
            </p>
          </div>
        </form>

        <p className="text-center text-[10px] text-text-3 mt-6 font-mono">
          &copy; 2026 IRIE WIRELESS SYSTEMS
        </p>
      </div>
    </div>
  );
}
