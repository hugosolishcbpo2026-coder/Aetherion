/**
 * CRM Engine — service layer
 *
 * Pattern: thin service objects that wrap Supabase queries with:
 *   - Tenancy context (org_id is set from the caller's session)
 *   - Input validation via Zod
 *   - Activity logging (audit trail)
 *
 * Server-only. Do not import this from client components.
 */

import { createClient } from '@/lib/supabase/server';
import type { Client, UUID } from '@/types';
import { z } from 'zod';

export const ClientInput = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  source: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional().nullable(),
  custom_fields: z.record(z.unknown()).default({}),
  lifecycle_stage: z.string().optional().nullable(),
  owner_id: z.string().uuid().optional().nullable(),
});

export type ClientInput = z.infer<typeof ClientInput>;

export const CrmService = {
  async list(orgId: UUID, opts?: { search?: string; limit?: number }) {
    const supabase = await createClient();
    let query = supabase
      .from('clients')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false })
      .limit(opts?.limit ?? 50);

    if (opts?.search) query = query.ilike('full_name', `%${opts.search}%`);

    const { data, error } = await query;
    if (error) throw error;
    return data as Client[];
  },

  async getById(orgId: UUID, id: UUID) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('organization_id', orgId)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Client;
  },

  async create(orgId: UUID, input: ClientInput) {
    const parsed = ClientInput.parse(input);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('clients')
      .insert({ ...parsed, organization_id: orgId })
      .select()
      .single();
    if (error) throw error;
    await logActivity(orgId, 'created', 'client', data.id);
    return data as Client;
  },

  async update(orgId: UUID, id: UUID, input: Partial<ClientInput>) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('clients')
      .update(input)
      .eq('organization_id', orgId)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    await logActivity(orgId, 'updated', 'client', id, input);
    return data as Client;
  },

  async addNote(orgId: UUID, clientId: UUID, body: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase.from('crm_logs').insert({
      organization_id: orgId,
      client_id: clientId,
      type: 'note',
      body,
      user_id: user?.id,
    });
    if (error) throw error;
  },
};

async function logActivity(
  orgId: UUID,
  action: string,
  entityType: string,
  entityId: UUID,
  changes?: unknown,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from('activity_logs').insert({
    organization_id: orgId,
    user_id: user?.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    changes: changes ?? null,
  });
}
