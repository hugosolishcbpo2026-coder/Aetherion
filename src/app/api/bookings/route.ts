import { NextResponse } from 'next/server';
import { BookingService, BookingInput } from '@/modules/bookings';
import { requireUser, getCurrentOrg } from '@/modules/auth';
import { AutomationEngine } from '@/modules/automations';

export async function GET(req: Request) {
  const user = await requireUser();
  const org = await getCurrentOrg(user.id);
  if (!org) return NextResponse.json({ error: 'no_org' }, { status: 400 });

  const url = new URL(req.url);
  const data = await BookingService.list(org.organization_id, {
    from: url.searchParams.get('from') ?? undefined,
    to: url.searchParams.get('to') ?? undefined,
  });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const user = await requireUser();
  const org = await getCurrentOrg(user.id);
  if (!org) return NextResponse.json({ error: 'no_org' }, { status: 400 });

  const body = await req.json();
  const parsed = BookingInput.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'invalid', issues: parsed.error.issues }, { status: 422 });

  const created = await BookingService.create(org.organization_id, parsed.data);
  // Fire automation event so workflows can react
  await AutomationEngine.emit(org.organization_id, 'booking.created', created as any);
  return NextResponse.json({ data: created }, { status: 201 });
}
