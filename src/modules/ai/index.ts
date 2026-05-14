/**
 * AI Engine — provider-agnostic orchestrator
 *
 * Currently supports OpenAI. To add Claude / Mistral / local models,
 * implement the `AIProvider` interface and register in the providers map.
 *
 * Conversations and messages are persisted to ai_conversations + ai_messages
 * so every interaction is auditable and replayable.
 */

import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import type { AIPrompt, UUID } from '@/types';

// ============================================================================
// Provider interface
// ============================================================================
export interface ChatRequest {
  systemPrompt: string;
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  model?: string;
  temperature?: number;
  tools?: unknown[];
}

export interface ChatResponse {
  content: string;
  tokensIn: number;
  tokensOut: number;
  model: string;
  toolCalls?: unknown[];
}

export interface AIProvider {
  chat(req: ChatRequest): Promise<ChatResponse>;
}

// ============================================================================
// OpenAI implementation
// ============================================================================
class OpenAIProvider implements AIProvider {
  private client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async chat(req: ChatRequest): Promise<ChatResponse> {
    const resp = await this.client.chat.completions.create({
      model: req.model ?? 'gpt-4o-mini',
      temperature: req.temperature ?? 0.7,
      messages: [{ role: 'system', content: req.systemPrompt }, ...req.messages],
    });
    const msg = resp.choices[0].message;
    return {
      content: msg.content ?? '',
      tokensIn: resp.usage?.prompt_tokens ?? 0,
      tokensOut: resp.usage?.completion_tokens ?? 0,
      model: resp.model,
      toolCalls: msg.tool_calls ? Array.from(msg.tool_calls) : undefined,
    };
  }
}

// Placeholder — wire up @anthropic-ai/sdk here when needed.
class ClaudeProvider implements AIProvider {
  async chat(_req: ChatRequest): Promise<ChatResponse> {
    throw new Error('Claude provider not yet wired. See modules/ai/providers/claude.ts');
  }
}

const providers: Record<string, AIProvider> = {
  openai: new OpenAIProvider(),
  claude: new ClaudeProvider(),
};

export function getProvider(name: 'openai' | 'claude' = 'openai'): AIProvider {
  return providers[name];
}

// ============================================================================
// High-level service: load a configured prompt, run it, persist the exchange
// ============================================================================
export const AIService = {
  async loadPrompt(promptKey: string, orgId?: UUID): Promise<AIPrompt> {
    const supabase = await createClient();
    // Prefer org-specific prompt; fall back to system default.
    const { data: orgPrompt } = await supabase
      .from('ai_prompts')
      .select('*')
      .eq('key', promptKey)
      .eq('organization_id', orgId ?? null)
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orgPrompt) return orgPrompt as AIPrompt;

    const { data: systemPrompt, error } = await supabase
      .from('ai_prompts')
      .select('*')
      .eq('key', promptKey)
      .is('organization_id', null)
      .eq('is_active', true)
      .order('version', { ascending: false })
      .limit(1)
      .single();
    if (error) throw new Error(`Prompt "${promptKey}" not found`);
    return systemPrompt as AIPrompt;
  },

  async chat(opts: {
    orgId: UUID;
    userId?: UUID | null;
    clientId?: UUID | null;
    promptKey: string;
    conversationId?: UUID;
    userMessage: string;
    variables?: Record<string, string>;
  }) {
    const supabase = await createClient();
    const prompt = await this.loadPrompt(opts.promptKey, opts.orgId);

    // Substitute template variables in the system prompt
    let systemPrompt = prompt.system_prompt;
    if (opts.variables) {
      for (const [k, v] of Object.entries(opts.variables)) {
        systemPrompt = systemPrompt.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), v);
      }
    }

    // Get or create the conversation
    let conversationId = opts.conversationId;
    if (!conversationId) {
      const { data: conv } = await supabase
        .from('ai_conversations')
        .insert({
          organization_id: opts.orgId,
          user_id: opts.userId ?? null,
          client_id: opts.clientId ?? null,
          prompt_key: opts.promptKey,
        })
        .select('id')
        .single();
      conversationId = conv!.id;
    }

    // Load conversation history
    const { data: history } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    // Save the user turn
    await supabase.from('ai_messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: opts.userMessage,
    });

    // Call the provider
    const provider = getProvider('openai');
    const response = await provider.chat({
      systemPrompt,
      messages: [
        ...(history ?? []).map((m) => ({ role: m.role as any, content: m.content ?? '' })),
        { role: 'user', content: opts.userMessage },
      ],
      model: prompt.model,
      temperature: prompt.temperature,
    });

    // Save the assistant turn
    await supabase.from('ai_messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: response.content,
      tokens_in: response.tokensIn,
      tokens_out: response.tokensOut,
      model: response.model,
    });

    return { conversationId, response };
  },
};
