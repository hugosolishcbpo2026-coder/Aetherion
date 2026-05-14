import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroOrnament } from '@/components/marketing/hero-ornament';
import { FeatureGrid } from '@/components/marketing/feature-grid';
import { ModuleShowcase } from '@/components/marketing/module-showcase';

export default function LandingPage() {
  return (
    <main className="relative">
      {/* ==================== HERO ==================== */}
      <section className="relative isolate min-h-screen overflow-hidden">
        <div className="aurora" aria-hidden />
        <div className="absolute inset-0 noise" aria-hidden />

        {/* Top nav */}
        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-7 w-7">
              <div className="absolute inset-0 rounded-md bg-gradient-to-br from-gold-200 to-gold-500" />
              <div className="absolute inset-[2px] rounded-[5px] bg-ink" />
              <div className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-gold-200">
                M
              </div>
            </div>
            <span className="font-display text-lg tracking-tight">Aetherion</span>
            <span className="ml-1 text-2xs uppercase tracking-widest text-muted-foreground">OS</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <Link href="#modules" className="hover:text-foreground transition-colors">Modules</Link>
            <Link href="#platform" className="hover:text-foreground transition-colors">Platform</Link>
            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Sign in</Link>
          </div>

          <Button asChild size="sm">
            <Link href="/register">
              Get access
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 pt-24 pb-32 md:pt-32">
          <div className="flex flex-col items-start gap-8 md:max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-gold-300" />
              <span>An operating system, not a CRM.</span>
            </div>

            <h1 className="font-display text-5xl font-light leading-[0.95] tracking-tightest text-balance md:text-7xl lg:text-8xl">
              The quiet
              <br />
              <span className="text-gold italic">infrastructure</span>
              <br />
              behind serious businesses.
            </h1>

            <p className="max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
              Aetherion unifies your CRM, bookings, marketplace, memberships, documents,
              and AI assistants into a single, configurable operating system.
              Built for organizations who outgrow tools.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button asChild size="lg">
                <Link href="/register">
                  Start free trial
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="#modules">
                  Explore modules
                </Link>
              </Button>
            </div>
          </div>

          <HeroOrnament />
        </div>

        {/* Hairline divider at bottom */}
        <div className="hairline absolute bottom-0 left-0 right-0" />
      </section>

      {/* ==================== MODULES ==================== */}
      <section id="modules" className="relative border-t border-white/[0.04] py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between mb-20">
            <div className="max-w-2xl">
              <div className="text-2xs uppercase tracking-widest text-gold-300 mb-4">— Modules</div>
              <h2 className="font-display text-4xl font-light tracking-tightest md:text-6xl text-balance">
                Ten engines.
                <br />
                <span className="italic text-muted-foreground">One platform.</span>
              </h2>
            </div>
            <p className="max-w-md text-muted-foreground text-pretty">
              Each module is independent but composable. Activate what you need.
              Configure without code. Extend with code when ready.
            </p>
          </div>

          <FeatureGrid />
        </div>
      </section>

      {/* ==================== PLATFORM ==================== */}
      <section id="platform" className="relative border-t border-white/[0.04] py-32">
        <div className="mx-auto max-w-7xl px-6">
          <ModuleShowcase />
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="relative border-t border-white/[0.04] py-32">
        <div className="aurora opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-5xl font-light tracking-tightest md:text-7xl text-balance">
            Run your business
            <br />
            <span className="text-gold italic">with intention.</span>
          </h2>
          <p className="mt-8 text-lg text-muted-foreground text-balance">
            Trusted by Notaría Pública 322, TropicCo Property Management,
            and a growing roster of operators who refuse to settle.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">
                Get started
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/contact">Talk to us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-white/[0.04] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-5 w-5 rounded bg-gradient-to-br from-gold-200 to-gold-500" />
            <span>Aetherion</span>
            <span className="text-2xs uppercase tracking-widest">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/security" className="hover:text-foreground">Security</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
