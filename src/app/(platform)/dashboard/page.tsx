import { StatCard } from '@/components/dashboard/stat-card';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { PipelineSummary } from '@/components/dashboard/pipeline-summary';

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Heading */}
      <header className="mb-10">
        <div className="text-2xs uppercase tracking-widest text-gold-300">— Overview</div>
        <h1 className="mt-2 font-display text-4xl font-light tracking-tightest text-balance md:text-5xl">
          Good morning, <span className="italic text-muted-foreground">Alex.</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's what's happening across your business today.
        </p>
      </header>

      {/* Stat grid */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} label="Revenue (MTD)"     value="$348K"  delta={18.4} hint="vs last month" />
        <StatCard index={1} label="Active Clients"    value="2,418"  delta={4.2}  hint="trailing 30d" />
        <StatCard index={2} label="Bookings"          value="184"    delta={12.6} hint="this week" />
        <StatCard index={3} label="AI Conversations"  value="9,231"  delta={42.3} hint="last 7 days" />
      </div>

      {/* Main grid: chart + insights */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <AIInsights />
      </div>

      {/* Second row: pipeline + activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PipelineSummary />
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
