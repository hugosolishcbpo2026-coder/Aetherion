'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const insights = [
  {
    tag: 'Pipeline',
    headline: 'Three deals stalled in Viewing for 14+ days.',
    body: 'Consider reactivation outreach. Estimated $1.8M in stuck pipeline.',
    severity: 'warning' as const,
  },
  {
    tag: 'Operations',
    headline: 'Booking confirmation rate dropped 8% this week.',
    body: 'WhatsApp delivery has been flaky on Tuesdays — investigate.',
    severity: 'danger' as const,
  },
  {
    tag: 'Opportunity',
    headline: 'Vendor M. Sánchez has 92% completion + low cost.',
    body: 'Recommend as default for plumbing maintenance bookings.',
    severity: 'success' as const,
  },
];

const tone = {
  warning: 'border-gold-300/30 text-gold-200',
  danger: 'border-ruby-light/30 text-ruby-light',
  success: 'border-emerald-light/30 text-emerald-light',
};

export function AIInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-card/40 p-6 backdrop-blur-xl"
    >
      {/* aurora behind */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />

      <div className="relative mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Sparkles className="h-4 w-4 text-gold-300" />
            <div className="absolute inset-0 animate-glow-pulse">
              <Sparkles className="h-4 w-4 text-gold-300 opacity-60 blur-sm" />
            </div>
          </div>
          <div>
            <h3 className="font-display text-base font-medium leading-tight">AI Insights</h3>
            <p className="text-2xs uppercase tracking-widest text-muted-foreground">Updated 2m ago</p>
          </div>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground">View all</button>
      </div>

      <div className="space-y-3">
        {insights.map((insight, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
            className="group block w-full text-left rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 transition-all hover:border-white/[0.08] hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className={`chip border ${tone[insight.severity]} bg-transparent`}>
                {insight.tag}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <div className="mt-2 text-sm font-medium text-foreground text-balance">{insight.headline}</div>
            <div className="mt-1 text-xs text-muted-foreground text-pretty">{insight.body}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
