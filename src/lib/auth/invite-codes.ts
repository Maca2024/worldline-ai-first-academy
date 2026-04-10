export interface InviteClaim {
  squad: string;
  role: 'student' | 'instructor';
}

export const INVITE_CODES: Record<string, InviteClaim> = {
  'SQUAD-A-2026': { squad: 'Squad A', role: 'student' },
  'SQUAD-B-2026': { squad: 'Squad B', role: 'student' },
  'SQUAD-C-2026': { squad: 'Squad C', role: 'student' },
  'INSTRUCTOR-2026': { squad: 'Instructors', role: 'instructor' },
};

export function validateInviteCode(code: string): InviteClaim | null {
  return INVITE_CODES[code?.trim().toUpperCase()] ?? null;
}
