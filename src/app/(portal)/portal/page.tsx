import Link from 'next/link';
import { Calendar, FileText, Receipt, MessageSquare, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const quickActions = [
  { href: '/portal/bookings',   icon: Calendar,      label: 'Book an appointment', desc: 'Schedule a consultation or viewing' },
  { href: '/portal/documents',  icon: FileText,      label: 'Upload documents',    desc: 'Securely share files with your team' },
  { href: '/portal/messages',   icon: MessageSquare, label: 'Message us',          desc: 'Reach your account manager' },
  { href: '/portal/assistant',  icon: Sparkles,      label: 'Ask the AI',          desc: 'Get instant answers, 24/7' },
];

export default function PortalHome() {
  return (
    <div>
      <header className="mb-10">
        <div className="text-2xs uppercase tracking-widest text-gold-300">— Welcome back</div>
        <h1 className="mt-2 font-display text-4xl font-light tracking-tightest md:text-5xl">
          Hello, <span className="italic">María.</span>
        </h1>
        <p className="mt-2 text-muted-foreground">Here's an overview of your account.</p>
      </header>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((a) => (
          <Link key={a.href} href={a.href}>
            <Card className="group relative h-full p-6 transition-all hover:border-gold-300/20 hover:shadow-gold-glow cursor-pointer">
              <a.icon className="mb-4 h-5 w-5 text-gold-300" strokeWidth={1.5} />
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-medium leading-tight">{a.label}</h3>
                  <p className="mt-1 text-xs text-muted-foreground text-pretty">{a.desc}</p>
                </div>
                <ArrowRight className="mt-1 h-3.5 w-3.5 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="mb-1 font-display text-base font-medium">Upcoming bookings</h3>
          <p className="text-xs text-muted-foreground mb-6">Your next scheduled appointments</p>
          <p className="text-sm text-muted-foreground">No upcoming bookings.</p>
        </Card>

        <Card className="p-6">
          <h3 className="mb-1 font-display text-base font-medium">Account status</h3>
          <p className="text-xs text-muted-foreground mb-6">Membership · Platinum</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Member since</span><span>Mar 2024</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Open invoices</span><span>0</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Documents</span><span>14</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
