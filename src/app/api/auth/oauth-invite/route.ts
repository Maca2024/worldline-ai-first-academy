/**
 * POST /api/auth/oauth-invite
 *
 * Validates an invite code and sets a signed httpOnly cookie that the OAuth
 * callback route reads to create the user profile after first-time OAuth sign-in.
 *
 * Cookie: invite_claim (httpOnly, SameSite=lax, 10 min TTL)
 * Format: base64url(payload).hmac-sha256-sig
 */

import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';
import { validateInviteCode } from '@/lib/auth/invite-codes';

function signClaim(data: object): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const payload = Buffer.from(JSON.stringify(data)).toString('base64url');
  const sig = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export async function POST(request: Request) {
  const rl = rateLimit(getRateLimitKey(request, 'oauth-invite'), {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Te veel pogingen. Probeer het over 15 minuten opnieuw.' },
      { status: 429 }
    );
  }

  let inviteCode: string;
  try {
    const body = await request.json() as { inviteCode: string };
    inviteCode = body.inviteCode;
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 });
  }

  const claim = validateInviteCode(inviteCode);
  if (!claim) {
    return NextResponse.json({ error: 'Ongeldige invite code.' }, { status: 400 });
  }

  const token = signClaim({ ...claim, exp: Date.now() + 10 * 60 * 1000 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set('invite_claim', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });
  return response;
}
