import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import type { InviteClaim } from '@/lib/auth/invite-codes';

interface CookieClaim extends InviteClaim {
  exp: number;
}

function verifyInviteClaim(token: string): CookieClaim | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) return null;
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  if (sig !== expected) return null;
  const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as CookieClaim;
  if (data.exp < Date.now()) return null;
  return data;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/academy';

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const supabase = createServerSupabaseClient();
  const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !session) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Check whether this is a first-time OAuth sign-in (no profile yet)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', session.user.id)
    .maybeSingle();

  if (!existingProfile) {
    // New OAuth user — require a valid invite cookie
    const inviteToken = request.cookies.get('invite_claim')?.value;

    if (!inviteToken) {
      return NextResponse.redirect(`${origin}/register?error=invite_required`);
    }

    const claim = verifyInviteClaim(inviteToken);
    if (!claim) {
      return NextResponse.redirect(`${origin}/register?error=invite_expired`);
    }

    // Derive display name from OAuth metadata
    const meta = session.user.user_metadata as Record<string, string>;
    const fullName =
      meta.full_name ?? meta.name ?? session.user.email?.split('@')[0] ?? 'Gebruiker';

    const { error: insertError } = await supabase.from('profiles').insert({
      id: session.user.id,
      full_name: fullName,
      email: session.user.email!,
      role: claim.role,
      squad_name: claim.squad,
    });

    if (insertError) {
      console.error('[auth/callback] profile insert failed:', insertError.message);
      // Non-fatal — user can still log in, profile will be missing but not blocking
    }
  }

  const response = NextResponse.redirect(`${origin}${next}`);
  // Clear the invite cookie regardless of outcome
  response.cookies.delete('invite_claim');
  return response;
}
