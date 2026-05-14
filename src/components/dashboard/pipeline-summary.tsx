'use client';

import { motion } from 'framer-motion';

const stages = [
  { name: 'Lead',        count: 48, value: 0.10, color: 'bg-ink-300' },
  { name: 'Qualified',   count: 32, value: 0.30, color: 'bg-gold-700' },
  { name: 'Viewing',     count: 18, value: 0.50, color: 'bg-gold-500' },
  { name: 'Offer',       count: 11, value: 0.75, color: 'bg-gold-300' },
  { name: 'Closed Won',  count: 6,  value: 1.00, color: 'bg-emerald-light' },
];

const total = stages.reduce((acc, s) => acc + s.count, 0);

export function PipelineSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.45 }}
      className="rounded-xl border border-white/[0.06] bg-card/40 p-6 backdrop-blur-xl"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-medium">Sales Pipeline</h3>
          <p className="text-2xs uppercase tracking-widest text-muted-foreground">
            TropicCo · {total} active records
          </p>
        </div>
        <button className="text-xs text-muted-foreground hover:text-foreground">Open →</button>
      </div>

      {/* Stage breakdown */}
      <div className="space-y-3">
        {stages.map((s, i) => {
          const pct = (s.count / total) * 100;
          return (
            <div key={s.name}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-foreground">{s.name}</span>
                <span className="font-mono text-muted-foreground">{s.count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, delay: 0.6 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full ${s.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
