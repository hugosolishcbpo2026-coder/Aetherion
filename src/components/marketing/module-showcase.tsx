'use client';

import { motion } from 'framer-motion';

export function ModuleShowcase() {
  return (
    <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
      <div>
        <div className="text-2xs uppercase tracking-widest text-gold-300 mb-4">— The Platform</div>
        <h2 className="font-display text-4xl font-light tracking-tightest md:text-6xl text-balance">
          Configurable
          <br />
          <span className="italic text-muted-foreground">to the core.</span>
        </h2>
        <p className="mt-6 max-w-md text-muted-foreground text-pretty">
          Roles, permissions, pipelines, automations, AI prompts, even your brand colors — every
          aspect lives as data. Change the business without changing the code.
        </p>
        <ul className="mt-8 space-y-4 text-sm">
          {[
            'Multi-tenant by design — each organization is fully isolated.',
            'Row-Level Security on every table. Audit trail on every change.',
            'AI prompts versioned and per-org overridable.',
            'Webhook + event automation engine — connect anything.',
            'Type-safe end-to-end. Generated Supabase types.',
          ].map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <span className="mt-2 h-px w-4 bg-gold-300/60" />
              <span className="text-muted-foreground">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Decorative architecture diagram */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative aspect-square overflow-hidden rounded-2xl border border-white/[0.06] bg-card/30 backdrop-blur-xl"
      >
        <div className="aurora" aria-hidden />
        <div className="relative grid h-full grid-cols-3 gap-3 p-6">
          {[
            'Auth', 'CRM', 'AI',
            'Voice', 'Bookings', 'Marketplace',
            'Memberships', 'Automations', 'Analytics',
          ].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
              className="flex aspect-square items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs text-muted-foreground transition-all hover:border-gold-300/30 hover:text-gold-200 hover:shadow-gold-glow"
            >
              {label}
            </motion.div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </motion.div>
    </div>
  );
}
