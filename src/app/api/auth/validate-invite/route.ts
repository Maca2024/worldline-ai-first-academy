import { NextResponse } from 'next/server';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { validateInviteCode } from '@/lib/auth/invite-codes';

// Invite codes live server-side only — never exposed to client JS

export async function POST(request: Request) {
  const rl = rateLimit(getRateLimitKey(request, 'validate-invite'), {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!rl.success) {
    return NextResponse.json(
      { valid: false, error: 'Te veel pogingen. Probeer het over 15 minuten opnieuw.' },
      { status: 429 }
    );
  }

  let inviteCode: string;
  try {
    const body = await request.json() as { inviteCode: unknown };
    inviteCode = typeof body.inviteCode === 'string' ? body.inviteCode.trim().toUpperCase() : '';
  } catch {
    return NextResponse.json({ valid: false, error: 'Ongeldig verzoek.' }, { status: 400 });
  }

  if (!inviteCode) {
    return NextResponse.json({ valid: false, error: 'Invite code is verplicht.' }, { status: 400 });
  }

  const match = validateInviteCode(inviteCode);

  if (!match) {
    return NextResponse.json(
      { valid: false, error: 'Ongeldige invite code. Neem contact op met je instructor.' },
      { status: 200 }
    );
  }

  return NextResponse.json({ valid: true, squad: match.squad, role: match.role });
}
