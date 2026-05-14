import { NextResponse } from 'next/server';
/**
 * Twilio voice webhook. Receives call status updates and incoming-call requests.
 * Validate the X-Twilio-Signature header in production before trusting payloads.
 */
export async function POST(req: Request) {
  const formData = await req.formData();
  const event = Object.fromEntries(formData.entries());
  console.log('[twilio] event', event);
  // TODO: pipe through VoiceService.startCall / appendTranscript / scoreCall
  return NextResponse.json({ ok: true });
}
