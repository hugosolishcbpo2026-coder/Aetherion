import { NextResponse } from 'next/server';
import { AIService } from '@/modules/ai';
import { requireUser, getCurrentOrg } from '@/modules/auth';
import { z } from 'zod';

const Input = z.object({
  promptKey: z.string(),
  message: z.string().min(1),
  conversationId: z.string().uuid().optional(),
  variables: z.record(z.string()).optional(),
});

export async function POST(req: Request) {
  const user = await requireUser();
  const org = await getCurrentOrg(user.id);
  if (!org) return NextResponse.json({ error: 'no_org' }, { status: 400 });

  const body = await req.json();
  const parsed = Input.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid' }, { status: 422 });

  try {
    const { conversationId, response } = await AIService.chat({
      orgId: org.organization_id,
      userId: user.id,
      promptKey: parsed.data.promptKey,
      conversationId: parsed.data.conversationId,
      userMessage: parsed.data.message,
      variables: parsed.data.variables,
    });
    return NextResponse.json({ conversationId, content: response.content });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
