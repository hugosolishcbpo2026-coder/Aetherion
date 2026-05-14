'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Calendar, ShoppingBag, Crown, FileText,
  MessageSquare, Workflow, BarChart3, Sparkles, Settings, Building2, Phone, Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sections: Array<{
  label: string;
  items: Array<{ href: string; label: string; icon: typeof LayoutDashboard }>;
}> = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { href: '/crm/clients',    label: 'Clients',     icon: Users },
      { href: '/crm/pipelines',  label: 'Pipelines',   icon: Workflow },
      { href: '/crm/tasks',      label: 'Tasks',       icon: FileText },
      { href: '/bookings',       label: 'Bookings',    icon: Calendar },
      { href: '/messages',       label: 'Messages',    icon: MessageSquare },
      { href: '/documents',      label: 'Documents',   icon: FileText },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { href: '/marketplace',  label: 'Marketplace',  icon: ShoppingBag },
      { href: '/memberships',  label: 'Memberships',  icon: Crown },
      { href: '/vendors',      label: 'Vendors',      icon: Building2 },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/ai',           label: 'AI Studio',    icon: Sparkles },
      { href: '/ai/voice',     label: 'Voice AI',     icon: Phone },
      { href: '/ai/agents',    label: 'Agents',       icon: Bot },
      { href: '/automations',  label: 'Automations',  icon: Workflow },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 border-r border-white/[0.04] bg-card/30 backdrop-blur-xl lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-white/[0.04] px-5">
        <div className="relative h-7 w-7">
          <div className="absolute inset-0 rounded-md bg-gradient-to-br from-gold-200 to-gold-500" />
          <div className="absolute inset-[2px] rounded-[5px] bg-ink" />
          <div className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-gold-200">A</div>
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-base tracking-tight">Aetherion</span>
          <span className="text-2xs uppercase tracking-widest text-muted-foreground">OS</span>
        </div>
      </div>

      {/* Org switcher */}
      <button className="mx-3 mt-4 flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-ruby/40 to-gold-500/40 text-2xs font-medium">N</div>
          <div className="flex flex-col leading-tight">
            <span className="text-foreground">Notaría 322</span>
            <span className="text-2xs uppercase tracking-wider text-muted-foreground">Enterprise</span>
          </div>
        </div>
        <svg className="h-3 w-3 text-muted-foreground" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.label} className="mb-6">
            <div className="px-3 mb-2 text-2xs uppercase tracking-widest text-muted-foreground/70">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link key={item.href} href={item.href} className="nav-item" data-active={active}>
                    <item.icon className="h-4 w-4" strokeWidth={1.5} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: settings + user */}
      <div className="border-t border-white/[0.04] p-3">
        <Link href="/settings" className="nav-item" data-active={pathname.startsWith('/settings')}>
          <Settings className="h-4 w-4" strokeWidth={1.5} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
