/** Membership engine. Plans + active memberships + Stripe-backed subscriptions. */
import { createClient } from '@/lib/supabase/server';
import type { UUID } from '@/types';

export const MembershipService = {
  async listPlans(orgId: UUID) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('membership_plans')
      .select('*')
      .eq('organization_id', orgId)
      .eq('active', true)
      .order('price');
    if (error) throw error;
    return data;
  },

  async enrollClient(orgId: UUID, clientId: UUID, planId: UUID) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('memberships')
      .insert({ organization_id: orgId, client_id: clientId, plan_id: planId, status: 'active' })
      .select()
      .single();
    if (error) throw error;
    // TODO: create Stripe subscription, save provider_ref
    return data;
  },
};
