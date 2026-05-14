import { NextResponse } from 'next/server';
/**
 * Stripe webhook. Use stripe.webhooks.constructEvent + STRIPE_WEBHOOK_SECRET
 * to verify before acting. Then map events to transactions / memberships.
 */
export async function POST(req: Request) {
  const body = await req.text();
  console.log('[stripe] webhook body length', body.length);
  // TODO: verify signature, parse event, update transactions/memberships
  return NextResponse.json({ ok: true });
}
