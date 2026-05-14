/**
 * Automation Engine — data-driven workflow runner
 *
 * Automations are stored as JSON in the `automations` table:
 *   trigger_type:  'event' | 'schedule' | 'webhook' | 'manual'
 *   trigger_config: { event_name?: 'booking.created', cron?: '0 9 * * *' }
 *   conditions:     [{ field, op, value }]
 *   actions:        [{ type, params }]
 *
 * Action types are registered below. Add new ones by extending the registry.
 */

import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { Automation, AutomationAction, AutomationCondition, UUID } from '@/types';

// ============================================================================
// Action registry — each action is a (params, context) => Promise<result>
// ============================================================================
type ActionContext = {
  organizationId: UUID;
  payload: Record<string, unknown>;
};

type ActionHandler = (params: Record<string, unknown>, ctx: ActionContext) => Promise<unknown>;

const actions: Record<string, ActionHandler> = {
  // ----- Notifications -----
  'send_email': async (params, ctx) => {
    // TODO: integrate Resend / Sendgrid
    console.log('[automation] send_email', params, ctx.payload);
    return { ok: true };
  },

  'send_sms': async (params, ctx) => {
    // TODO: integrate Twilio
    console.log('[automation] send_sms', params, ctx.payload);
    return { ok: true };
  },

  'send_whatsapp': async (params, ctx) => {
    // TODO: integrate WhatsApp Business API
    console.log('[automation] send_whatsapp', params, ctx.payload);
    return { ok: true };
  },

  // ----- CRM operations -----
  'create_task': async (params, ctx) => {
    const supabase = await createAdminClient();
    const { data } = await supabase
      .from('tasks')
      .insert({
        organization_id: ctx.organizationId,
        title: String(params.title ?? 'Auto-generated task'),
        description: String(params.description ?? ''),
        priority: String(params.priority ?? 'normal'),
        due_date: params.due_date ?? null,
        assignee_id: params.assignee_id ?? null,
      })
      .select()
      .single();
    return data;
  },

  'update_client': async (params, ctx) => {
    const supabase = await createAdminClient();
    const { client_id, ...updates } = params as any;
    const { data } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', client_id)
      .eq('organization_id', ctx.organizationId)
      .select()
      .single();
    return data;
  },

  // ----- AI -----
  'ai_complete': async (params, ctx) => {
    const { AIService } = await import('@/modules/ai');
    return AIService.chat({
      orgId: ctx.organizationId,
      promptKey: String(params.prompt_key),
      userMessage: String(params.user_message),
      variables: (params.variables ?? {}) as Record<string, string>,
    });
  },

  // ----- External -----
  'webhook': async (params, ctx) => {
    const res = await fetch(String(params.url), {
      method: String(params.method ?? 'POST'),
      headers: { 'Content-Type': 'application/json', ...(params.headers as object ?? {}) },
      body: JSON.stringify({ ...ctx.payload, ...(params.body as object ?? {}) }),
    });
    return { status: res.status, body: await res.text() };
  },

  'delay': async (params) => {
    await new Promise((r) => setTimeout(r, Number(params.ms ?? 1000)));
    return { ok: true };
  },
};

export function registerAction(type: string, handler: ActionHandler) {
  actions[type] = handler;
}

// ============================================================================
// Condition evaluation
// ============================================================================
function evalCondition(condition: AutomationCondition, payload: Record<string, unknown>): boolean {
  const value = getPath(payload, condition.field);
  switch (condition.op) {
    case 'eq':       return value === condition.value;
    case 'neq':      return value !== condition.value;
    case 'gt':       return Number(value) > Number(condition.value);
    case 'lt':       return Number(value) < Number(condition.value);
    case 'gte':      return Number(value) >= Number(condition.value);
    case 'lte':      return Number(value) <= Number(condition.value);
    case 'in':       return Array.isArray(condition.value) && condition.value.includes(value as never);
    case 'contains': return String(value).includes(String(condition.value));
    default:         return false;
  }
}

function getPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce<any>((acc, key) => acc?.[key], obj);
}

// ============================================================================
// Runner
// ============================================================================
export const AutomationEngine = {
  /**
   * Emit an event. Finds enabled automations with matching trigger,
   * evaluates conditions, runs actions sequentially.
   */
  async emit(orgId: UUID, eventName: string, payload: Record<string, unknown>) {
    const supabase = await createAdminClient();
    const { data: matched } = await supabase
      .from('automations')
      .select('*')
      .eq('organization_id', orgId)
      .eq('enabled', true)
      .eq('trigger_type', 'event');

    if (!matched) return;

    for (const auto of matched as Automation[]) {
      const triggerEvent = (auto.trigger_config as any)?.event_name;
      if (triggerEvent !== eventName) continue;

      const conditions = auto.conditions ?? [];
      const passes = conditions.every((c) => evalCondition(c, payload));
      if (!passes) continue;

      await this.run(auto, payload);
    }
  },

  /** Run a specific automation with a payload. */
  async run(auto: Automation, payload: Record<string, unknown>) {
    const supabase = await createAdminClient();
    const { data: run } = await supabase
      .from('automation_runs')
      .insert({
        automation_id: auto.id,
        organization_id: auto.organization_id,
        status: 'running',
        trigger_payload: payload,
      })
      .select('id')
      .single();

    const start = Date.now();
    const result: unknown[] = [];

    try {
      for (const action of auto.actions ?? []) {
        const handler = actions[(action as AutomationAction).type];
        if (!handler) throw new Error(`Unknown action: ${action.type}`);
        result.push(await handler(action.params, { organizationId: auto.organization_id, payload }));
      }
      await supabase
        .from('automation_runs')
        .update({
          status: 'success',
          result,
          duration_ms: Date.now() - start,
          finished_at: new Date().toISOString(),
        })
        .eq('id', run!.id);

      await supabase
        .from('automations')
        .update({ last_run_at: new Date().toISOString(), run_count: auto.run_count + 1 })
        .eq('id', auto.id);
    } catch (error: any) {
      await supabase
        .from('automation_runs')
        .update({
          status: 'failed',
          error: error.message,
          duration_ms: Date.now() - start,
          finished_at: new Date().toISOString(),
        })
        .eq('id', run!.id);
    }
  },
};
