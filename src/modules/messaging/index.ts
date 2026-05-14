/**
 * Messaging engine — unified inbox across email, SMS, WhatsApp, in-app.
 * Each channel has a provider adapter (TODO).
 */
import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { UUID } from '@/types';

export const MessagingService = {
  async send(opts: {
    orgId: UUID;
    channel: 'email' | 'sms' | 'whatsapp' | 'in_app';
    fromUserId?: UUID;
    toUserId?: UUID;
    clientId?: UUID;
    subject?: string;
    body: string;
  }) {
    const supabase = await createAdminClient();
    const { data, error } = await supabase.from('messages').insert({
      organization_id: opts.orgId,
      channel: opts.channel,
      from_user_id: opts.fromUserId ?? null,
      to_user_id: opts.toUserId ?? null,
      client_id: opts.clientId ?? null,
      subject: opts.subject ?? null,
      body: opts.body,
    }).select().single();
    if (error) throw error;

    // TODO: dispatch to provider (Resend for email, Twilio for SMS, ...)
    return data;
  },

  async listThread(orgId: UUID, threadId: UUID) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('organization_id', orgId)
      .eq('thread_id', threadId)
      .order('created_at');
    if (error) throw error;
    return data;
  },
};
