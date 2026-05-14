'use client';

import { Bell, Search, Command } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/[0.04] bg-background/60 px-6 backdrop-blur-xl">
      {/* Search */}
      <div className="flex flex-1 items-center gap-3">
        <button className="flex w-full max-w-md items-center gap-2.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04]">
          <Search className="h-4 w-4" strokeWidth={1.5} />
          <span className="flex-1 text-left">Search clients, bookings, documents...</span>
          <kbd className="hidden items-center gap-1 rounded border border-white/[0.06] bg-white/[0.04] px-1.5 py-0.5 font-mono text-2xs sm:inline-flex">
            <Command className="h-3 w-3" /> K
          </kbd>
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground">
          <Bell className="h-4 w-4" strokeWidth={1.5} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(200,169,107,0.8)]" />
        </button>

        <div className="mx-1 h-6 w-px bg-white/[0.06]" />

        <button className="flex items-center gap-2.5 rounded-md p-1 pr-2 transition-colors hover:bg-white/[0.04]">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-2xs">AM</AvatarFallback>
          </Avatar>
          <div className="hidden flex-col leading-tight text-left md:flex">
            <span className="text-xs">Alex Martínez</span>
            <span className="text-2xs uppercase tracking-wider text-muted-foreground">Admin</span>
          </div>
        </button>
      </div>
    </header>
  );
}
