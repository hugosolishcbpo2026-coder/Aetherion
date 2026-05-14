/**
 * Auth helpers — server-side. For client-side use the supabase browser client.
 */
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { UUID } from '@/types';

/** Get the current user or redirect to login. */
export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return user;
}

/** Get the current user's default organization (first one they're a member of). */
export async function getCurrentOrg(userId: UUID) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('organization_members')
    .select('organization_id, is_default, organizations(*)')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .limit(1)
    .single();
  return data;
}

/** Check whether the current user has a permission key in an org. */
export async function hasPermission(orgId: UUID, permission: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.rpc('has_permission', { org: orgId, perm: permission });
  return !!data;
}
