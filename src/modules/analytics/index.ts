/**
 * Analytics engine — aggregations over CRM, bookings, transactions.
 * For real production, push these queries into Supabase views or materialized
 * views and refresh on a schedule.
 */
import { createClient } from '@/lib/supabase/server';
import type { UUID } from '@/types';

export const AnalyticsService = {
  async kpis(orgId: UUID, range: { from: string; to: string }) {
    const supabase = await createClient();

    const [{ count: clients }, { count: bookings }, { data: revenue }] = await Promise.all([
      supabase.from('clients').select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId),
      supabase.from('bookings').select('*', { count: 'exact', head: true })
        .eq('organization_id', orgId)
        .gte('start_at', range.from).lte('start_at', range.to),
      supabase.from('transactions').select('amount, currency')
        .eq('organization_id', orgId).eq('type', 'payment').eq('status', 'completed')
        .gte('created_at', range.from).lte('created_at', range.to),
    ]);

    const totalRevenue = (revenue ?? []).reduce((sum, t) => sum + Number(t.amount), 0);
    return { clients: clients ?? 0, bookings: bookings ?? 0, revenue: totalRevenue };
  },
};
