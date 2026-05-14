'use client';

import { motion } from 'framer-motion';
import {
  Users, Calendar, ShoppingBag, Crown, FileText, MessageSquare,
  Workflow, BarChart3, Sparkles, Phone,
} from 'lucide-react';

const modules = [
  { icon: Users,        title: 'CRM Engine',         desc: 'Unified client database with pipelines, tasks, and AI summaries.' },
  { icon: Sparkles,     title: 'AI Engine',          desc: 'Website, CRM, sales, legal, and property assistants — all configurable.' },
  { icon: Phone,        title: 'Voice Intelligence', desc: 'Live transcription, coaching, objection detection, CRM auto-logging.' },
  { icon: Calendar,     title: 'Booking Engine',     desc: 'Appointments, viewings, signings — with payment and reminders built-in.' },
  { icon: ShoppingBag,  title: 'Marketplace',        desc: 'Properties, services, legal procedures. One catalog, infinite verticals.' },
  { icon: Crown,        title: 'Memberships',        desc: 'Recurring revenue with benefit tiers and member portals.' },
  { icon: FileText,     title: 'Document System',    desc: 'Versioned uploads, e-signing, vendor-shared folders, audit trail.' },
  { icon: Workflow,     title: 'Automation Engine',  desc: 'Event/schedule/webhook triggers. Configure, don\'t code.' },
  { icon: BarChart3,    title: 'Analytics',          desc: 'Cohort retention, revenue, pipeline velocity, AI-narrated insights.' },
  { icon: MessageSquare,title: 'Messaging',          desc: 'Email, SMS, WhatsApp, in-app — threaded against the client record.' },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] md:grid-cols-2 lg:grid-cols-3">
      {modules.map((m, i) => (
        <motion.div
          key={m.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          className="group relative bg-background p-8 transition-colors hover:bg-white/[0.02]"
        >
          <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-gold-200/20 to-gold-500/10 ring-1 ring-gold-300/20">
            <m.icon className="h-5 w-5 text-gold-300" strokeWidth={1.5} />
          </div>
          <h3 className="font-display text-xl font-medium leading-tight">{m.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">{m.desc}</p>

          {/* Reveal hairline on hover */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-300/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </motion.div>
      ))}
    </div>
  );
}
