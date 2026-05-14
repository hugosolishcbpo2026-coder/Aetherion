/**
 * Marketplace Engine — listings (properties, services, legal procedures).
 * Same engine powers TropicCo (properties) and Notaría 322 (legal procedures).
 */
import { createClient } from '@/lib/supabase/server';
import type { UUID } from '@/types';

export const MarketplaceService = {
  async list(orgId: UUID, opts?: { type?: string; status?: string; limit?: number }) {
    const supabase = await createClient();
    let q = supabase
      .from('listings')
      .select('*, vendor:vendors(id, name)')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
      .limit(opts?.limit ?? 50);
    if (opts?.type) q = q.eq('type', opts.type);
    if (opts?.status) q = q.eq('status', opts.status);
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async getBySlug(orgId: UUID, slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('organization_id', orgId)
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  },
};
