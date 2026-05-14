/**
 * Document engine — uploads, e-sign, versioning.
 * Files live in Supabase Storage; metadata in the `documents` table.
 */
import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { UUID } from '@/types';

const BUCKET = 'documents';

export const DocumentService = {
  async list(orgId: UUID, opts?: { clientId?: UUID; relatedType?: string; relatedId?: UUID }) {
    const supabase = await createClient();
    let q = supabase.from('documents').select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });
    if (opts?.clientId) q = q.eq('client_id', opts.clientId);
    if (opts?.relatedType && opts?.relatedId) {
      q = q.eq('related_type', opts.relatedType).eq('related_id', opts.relatedId);
    }
    const { data, error } = await q;
    if (error) throw error;
    return data;
  },

  async createUploadUrl(orgId: UUID, fileName: string) {
    const supabase = await createAdminClient();
    const key = `${orgId}/${Date.now()}-${fileName}`;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(key);
    if (error) throw error;
    return { storagePath: key, ...data };
  },

  async finalize(orgId: UUID, input: {
    name: string;
    storagePath: string;
    mimeType: string;
    sizeBytes: number;
    category?: string;
    clientId?: UUID;
  }) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('documents').insert({
      organization_id: orgId,
      name: input.name,
      storage_path: input.storagePath,
      mime_type: input.mimeType,
      size_bytes: input.sizeBytes,
      category: input.category ?? null,
      client_id: input.clientId ?? null,
    }).select().single();
    if (error) throw error;
    return data;
  },
};
