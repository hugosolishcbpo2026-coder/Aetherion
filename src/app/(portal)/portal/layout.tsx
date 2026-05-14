import Link from 'next/link';
import { Home, Calendar, FileText, MessageSquare, Receipt, User, Sparkles } from 'lucide-react';

const navItems = [
  { href: '/portal',              label: 'Home',         icon: Home },
  { href: '/portal/bookings',     label: 'My Bookings',  icon: Calendar },
  { href: '/portal/documents',    label: 'Documents',    icon: FileText },
  { href: '/portal/messages',     label: 'Messages',     icon: MessageSquare },
  { href: '/portal/invoices',     label: 'Invoices',     icon: Receipt },
  { href: '/portal/assistant',    label: 'AI Assistant', icon: Sparkles },
  { href: '/portal/profile',      label: 'Profile',      icon: User },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="aurora opacity-40" aria-hidden />

      <header className="sticky top-0 z-40 border-b border-white/[0.04] bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/portal" className="flex items-center gap-2">
            <div className="relative h-7 w-7">
              <div className="absolute inset-0 rounded-md bg-gradient-to-br from-gold-200 to-gold-500" />
              <div className="absolute inset-[2px] rounded-[5px] bg-ink" />
              <div className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-gold-200">A</div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-base tracking-tight">Aetherion</span>
              <span className="text-2xs uppercase tracking-widest text-muted-foreground">Client Portal</span>
            </div>
          </Link>
        </div>

        <nav className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-6 pb-2 mask-fade-r">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
            >
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="relative mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}
