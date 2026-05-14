/**
 * Voice Intelligence Engine — placeholder
 *
 * Architecture (when implemented):
 *
 *   Phone provider (Twilio) ──► WebSocket stream
 *                                 │
 *                                 ▼
 *                       Deepgram (live STT)
 *                                 │
 *                                 ▼
 *                    realtime model (GPT-4o-realtime
 *                    or Vapi/Retell agent)
 *                                 │
 *                                 ▼
 *                       ElevenLabs (TTS) ──► Caller
 *                                 │
 *                                 ▼
 *                  Persist: calls, call_transcripts,
 *                  call_events, then on hangup ─►
 *                  Post-call AI: score, summary,
 *                  objections, next actions
 *                  ─► call_scores
 *                  ─► Automations.emit('call.completed', {...})
 *
 * Required env vars:
 *   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER
 *   DEEPGRAM_API_KEY  (or VAPI_API_KEY for all-in-one)
 *   ELEVENLABS_API_KEY
 *
 * Wiring guide:
 *   1. Twilio webhook ➜ /api/webhooks/twilio (creates `calls` row, opens stream)
 *   2. Audio chunks ➜ Deepgram ➜ append to `call_transcripts`
 *   3. On hangup ➜ score the call (see scoreCall below) ➜ write `call_scores`
 *   4. Emit 'call.completed' event so automations can react
 */

import { createAdminClient } from '@/lib/supabase/server';
import type { UUID } from '@/types';

export const VoiceService = {
  /** Create a call record when the phone webhook fires. */
  async startCall(input: {
    orgId: UUID;
    clientId?: UUID | null;
    direction: 'inbound' | 'outbound';
    fromNumber: string;
    toNumber: string;
    provider: string;
    providerRef: string;
  }) {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('calls')
      .insert({
        organization_id: input.orgId,
        client_id: input.clientId ?? null,
        direction: input.direction,
        from_number: input.fromNumber,
        to_number: input.toNumber,
        status: 'in_progress',
        provider: input.provider,
        provider_ref: input.providerRef,
      })
      .select('id')
      .single();
    return data;
  },

  /** Append a transcript segment as it streams in. */
  async appendTranscript(callId: UUID, orgId: UUID, segment: {
    speaker: 'agent' | 'client' | 'ai';
    startMs: number;
    endMs: number;
    text: string;
    confidence?: number;
  }) {
    const supabase = await createAdminClient();
    await supabase.from('call_transcripts').insert({
      call_id: callId,
      organization_id: orgId,
      speaker: segment.speaker,
      start_ms: segment.startMs,
      end_ms: segment.endMs,
      text: segment.text,
      confidence: segment.confidence ?? null,
    });
  },

  /** Run AI scoring after a call ends. */
  async scoreCall(callId: UUID, orgId: UUID) {
    const supabase = await createAdminClient();
    const { data: transcript } = await supabase
      .from('call_transcripts')
      .select('speaker, text')
      .eq('call_id', callId)
      .order('start_ms', { ascending: true });

    if (!transcript || transcript.length === 0) return;

    const transcriptText = transcript
      .map((t) => `${t.speaker.toUpperCase()}: ${t.text}`)
      .join('\n');

    const { AIService } = await import('@/modules/ai');
    const { response } = await AIService.chat({
      orgId,
      promptKey: 'sales_coach',
      userMessage: `Please analyze the following call transcript and return JSON with fields: overall_score (0-10), sentiment, objections (array), topics (array), summary, next_actions (array), coaching_notes.\n\nTranscript:\n${transcriptText}`,
    });

    // Try to parse the AI's JSON response
    let parsed: any = {};
    try {
      const match = response.content.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    } catch {
      parsed = { summary: response.content };
    }

    await supabase.from('call_scores').insert({
      call_id: callId,
      organization_id: orgId,
      overall_score: parsed.overall_score ?? null,
      sentiment: parsed.sentiment ?? null,
      objections: parsed.objections ?? [],
      topics: parsed.topics ?? [],
      summary: parsed.summary ?? null,
      next_actions: parsed.next_actions ?? [],
      coaching_notes: parsed.coaching_notes ?? null,
    });

    // Trigger downstream automations
    const { AutomationEngine } = await import('@/modules/automations');
    await AutomationEngine.emit(orgId, 'call.scored', { call_id: callId, ...parsed });
  },
};
