import { ReactNode } from 'react';

interface ModulePageProps {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function ModulePage({ eyebrow, title, description, actions, children }: ModulePageProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <header className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="text-2xs uppercase tracking-widest text-gold-300">— {eyebrow}</div>
          <h1 className="mt-2 font-display text-4xl font-light tracking-tightest md:text-5xl text-balance">
            {title}
          </h1>
          {description && <p className="mt-2 max-w-2xl text-muted-foreground text-pretty">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      {children}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function ModuleEmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-card/40 p-12 text-center backdrop-blur-xl">
      <div className="aurora opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-md">
        {icon && (
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-200/20 to-gold-500/10 ring-1 ring-gold-300/20">
            {icon}
          </div>
        )}
        <h3 className="font-display text-2xl font-light tracking-tightest">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground text-pretty">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}
