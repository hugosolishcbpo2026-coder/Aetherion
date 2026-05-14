import { NextResponse } from 'next/server';
import { CrmService, ClientInput } from '@/modules/crm';
import { requireUser, getCurrentOrg } from '@/modules/auth';

export async function GET(req: Request) {
  const user = await requireUser();
  const org = await getCurrentOrg(user.id);
  if (!org) return NextResponse.json({ error: 'no_org' }, { status: 400 });

  const url = new URL(req.url);
  const search = url.searchParams.get('search') ?? undefined;
  const data = await CrmService.list(org.organization_id, { search });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const user = await requireUser();
  const org = await getCurrentOrg(user.id);
  if (!org) return NextResponse.json({ error: 'no_org' }, { status: 400 });

  const body = await req.json();
  const parsed = ClientInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid', issues: parsed.error.issues }, { status: 422 });
  }
  const created = await CrmService.create(org.organization_id, parsed.data);
  return NextResponse.json({ data: created }, { status: 201 });
}
