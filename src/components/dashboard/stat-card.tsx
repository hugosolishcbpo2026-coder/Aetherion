'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  index?: number;
}

export function StatCard({ label, value, delta, hint, index = 0 }: StatCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-card/40 p-6 backdrop-blur-xl transition-all hover:border-gold-300/20 hover:shadow-gold-glow"
    >
      <div className="text-2xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-4xl font-light tracking-tightest text-foreground">{value}</div>
      <div className="mt-3 flex items-center gap-2">
        {delta !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-2xs font-medium',
              positive
                ? 'bg-emerald-light/15 text-emerald-light'
                : 'bg-ruby/20 text-ruby-light',
            )}
          >
            {positive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            {positive ? '+' : ''}
            {delta}%
          </span>
        )}
        {hint && <span className="text-2xs text-muted-foreground">{hint}</span>}
      </div>

      {/* subtle gold sweep on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity group-hover:opacity-100">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold-300/0 via-gold-300/10 to-gold-300/0" />
      </div>
    </motion.div>
  );
}
