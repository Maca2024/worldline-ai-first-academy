import { NextResponse } from 'next/server';

// Invite codes live server-side only — never exposed to client JS
const INVITE_CODES: Record<string, { squad: string; role: 'student' | 'instructor' }> = {
  'SQUAD-A-2026': { squad: 'Squad A', role: 'student' },
  'SQUAD-B-2026': { squad: 'Squad B', role: 'student' },
  'SQUAD-C-2026': { squad: 'Squad C', role: 'student' },
  'INSTRUCTOR-2026': { squad: 'Instructors', role: 'instructor' },
};

// Simple in-memory rate limiter (per IP, resets on server restart)
// For production: use Upstash Redis or Supabase rate limit table
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getRateLimitKey(request: Request): string {
  return request.headers.get('x-forwarded-for') ?? 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now > record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  record.count += 1;
  if (record.count > MAX_ATTEMPTS) return true;

  return false;
}

export async function POST(request: Request) {
  const ip = getRateLimitKey(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { valid: false, error: 'Te veel pogingen. Probeer het over 15 minuten opnieuw.' },
      { status: 429 }
    );
  }

  let inviteCode: string;
  try {
    const body = await request.json();
    inviteCode = typeof body.inviteCode === 'string' ? body.inviteCode.trim().toUpperCase() : '';
  } catch {
    return NextResponse.json({ valid: false, error: 'Ongeldig verzoek.' }, { status: 400 });
  }

  if (!inviteCode) {
    return NextResponse.json({ valid: false, error: 'Invite code is verplicht.' }, { status: 400 });
  }

  const match = INVITE_CODES[inviteCode];

  if (!match) {
    return NextResponse.json(
      { valid: false, error: 'Ongeldige invite code. Neem contact op met je instructor.' },
      { status: 200 }
    );
  }

  return NextResponse.json({ valid: true, squad: match.squad, role: match.role });
}
