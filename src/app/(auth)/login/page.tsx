'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type Mode = 'email' | 'phone' | 'magic';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const supabase = createClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else window.location.href = '/dashboard';
  }

  async function handleOAuth(provider: 'google' | 'azure') {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success('Check your email for the magic link.');
  }

  async function handlePhoneOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success('OTP sent. Check your phone.');
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-md"
    >
      <div className="glass rounded-2xl p-8">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-gold-200 to-gold-500" />
            <div className="absolute inset-[2px] rounded-[5px] bg-ink" />
            <div className="absolute inset-0 flex items-center justify-center font-display text-base font-bold text-gold-200">A</div>
          </div>
        </div>

        <h1 className="text-center font-display text-3xl font-light tracking-tightest">
          Welcome back
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to your Aetherion workspace
        </p>

        {/* OAuth */}
        <div className="mt-8 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => handleOAuth('google')} disabled={loading}>
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .5 4 1.5l3-3C17.3 1.7 14.8.6 12 .6 7.4.6 3.4 3.2 1.4 7.1l3.5 2.7C5.9 7 8.7 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4c-.3 1.5-1.2 2.7-2.5 3.5l3.8 3c2.3-2.1 3.8-5.2 3.8-8.7z" />
              <path fill="#FBBC04" d="M4.9 14.3c-.3-.8-.4-1.6-.4-2.4s.1-1.6.4-2.4l-3.5-2.7C.5 8.4 0 10.1 0 12s.5 3.6 1.4 5.2l3.5-2.9z" />
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 7.9-2.9l-3.8-3c-1.1.7-2.4 1.1-4.1 1.1-3.3 0-6.1-2.1-7.1-5.1l-3.5 2.9C3.4 20.8 7.4 23.5 12 23.5z" />
            </svg>
            Google
          </Button>
          <Button variant="secondary" onClick={() => handleOAuth('azure')} disabled={loading}>
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path fill="#F25022" d="M1 1h10v10H1z" />
              <path fill="#7FBA00" d="M13 1h10v10H13z" />
              <path fill="#00A4EF" d="M1 13h10v10H1z" />
              <path fill="#FFB900" d="M13 13h10v10H13z" />
            </svg>
            Microsoft
          </Button>
        </div>

        <div className="my-6 flex items-center gap-3 text-2xs uppercase tracking-widest text-muted-foreground">
          <div className="hairline flex-1" />
          <span>or</span>
          <div className="hairline flex-1" />
        </div>

        {/* Mode tabs */}
        <div className="mb-6 flex gap-1 rounded-md border border-white/[0.06] bg-white/[0.02] p-1 text-xs">
          {([
            { key: 'email', label: 'Email', icon: Mail },
            { key: 'phone', label: 'Phone OTP', icon: Phone },
            { key: 'magic', label: 'Magic link', icon: ArrowRight },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setMode(t.key)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1.5 transition-colors ${
                mode === t.key
                  ? 'bg-white/[0.06] text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="h-3 w-3" />
              {t.label}
            </button>
          ))}
        </div>

        {mode === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <Input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>
        )}

        {mode === 'phone' && (
          <form onSubmit={handlePhoneOTP} className="space-y-3">
            <Input type="tel" placeholder="+52 664 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send code'}
            </Button>
          </form>
        )}

        {mode === 'magic' && (
          <form onSubmit={handleMagicLink} className="space-y-3">
            <Input type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send magic link'}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="text-gold-300 hover:text-gold-200">
            Request access
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
