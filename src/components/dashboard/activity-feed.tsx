'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const activity = [
  { who: 'María González',  action: 'closed deal',       target: 'Playa del Sol #204',       time: '2m', initials: 'MG', kind: 'success' },
  { who: 'Carlos Ruiz',     action: 'signed',            target: 'Power of Attorney',       time: '14m', initials: 'CR', kind: 'info'    },
  { who: 'AI Concierge',    action: 'qualified lead',    target: 'inbound · webchat',       time: '38m', initials: 'AI', kind: 'gold'    },
  { who: 'Sofía Hernández', action: 'rescheduled',       target: 'Booking #4821',           time: '1h',  initials: 'SH', kind: 'default' },
  { who: 'M. Sánchez',      action: 'completed',         target: 'Maintenance · Unit 7B',  time: '2h',  initials: 'MS', kind: 'success' },
  { who: 'Ana Torres',      action: 'opened',            target: 'Membership · Platinum',  time: '3h',  initials: 'AT', kind: 'gold'    },
] as const;

const kindMap = {
  success: 'success' as const,
  info: 'info' as const,
  gold: 'gold' as const,
  default: 'default' as const,
};

export function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      className="rounded-xl border border-white/[0.06] bg-card/40 p-6 backdrop-blur-xl"
    >
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-base font-medium">Live Activity</h3>
        <span className="inline-flex items-center gap-1.5 text-2xs uppercase tracking-widest text-emerald-light">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-light shadow-[0_0_6px_currentColor]" />
          Live
        </span>
      </div>

      <ol className="relative space-y-4">
        {/* vertical line */}
        <span className="absolute left-[18px] top-2 bottom-2 w-px bg-white/[0.05]" aria-hidden />

        {activity.map((a, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.05 }}
            className="relative flex items-start gap-3"
          >
            <Avatar className="h-9 w-9 ring-1 ring-white/[0.08]">
              <AvatarFallback className="text-2xs">{a.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 pt-0.5">
              <div className="text-sm leading-tight">
                <span className="text-foreground">{a.who}</span>{' '}
                <span className="text-muted-foreground">{a.action}</span>{' '}
                <span className="text-foreground">{a.target}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant={kindMap[a.kind]}>{a.kind}</Badge>
                <span className="text-2xs text-muted-foreground">{a.time} ago</span>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}
