import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Badge IDs match supabase/migrations/002_seed_static.sql
const BADGE_IDS = {
  firstSteps: '10000000-0000-0000-0000-000000000010',
  exerciseChampion: '10000000-0000-0000-0000-000000000011',
  perfectScore: '10000000-0000-0000-0000-000000000012',
  weekBadges: {
    1: '10000000-0000-0000-0000-000000000001',
    2: '10000000-0000-0000-0000-000000000002',
    3: '10000000-0000-0000-0000-000000000003',
    4: '10000000-0000-0000-0000-000000000004',
    5: '10000000-0000-0000-0000-000000000005',
    6: '10000000-0000-0000-0000-000000000006',
    7: '10000000-0000-0000-0000-000000000007',
    8: '10000000-0000-0000-0000-000000000008',
    9: '10000000-0000-0000-0000-000000000009',
  } as Record<number, string>,
};

async function awardBadge(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  userId: string,
  badgeId: string
): Promise<{ awarded: boolean; badgeId: string }> {
  const { error } = await supabase
    .from('student_badges')
    .insert({ user_id: userId, badge_id: badgeId });

  // 23505 = unique_violation — badge already earned, not an error
  if (error && error.code !== '23505') {
    console.error(`Badge award error (${badgeId}):`, error.message);
    return { awarded: false, badgeId };
  }

  return { awarded: !error, badgeId };
}

/**
 * POST /api/badges/award
 *
 * Called after lesson completion or exercise submission.
 * Evaluates all eligible badges for the current user and awards new ones.
 *
 * Body: { trigger: 'lesson_complete' | 'exercise_submit', weekNumber?: number, score?: number }
 */
export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet geauthenticeerd.' }, { status: 401 });
  }

  let trigger: string;
  let weekNumber: number | undefined;
  let score: number | undefined;

  try {
    const body = await request.json();
    trigger = typeof body.trigger === 'string' ? body.trigger : '';
    weekNumber = typeof body.weekNumber === 'number' ? body.weekNumber : undefined;
    score = typeof body.score === 'number' ? body.score : undefined;
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 });
  }

  const awarded: string[] = [];

  // ── Badge: First Steps — eerste les voltooid ──────────────────────────────
  if (trigger === 'lesson_complete') {
    const { count } = await supabase
      .from('lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');

    if (count === 1) {
      const result = await awardBadge(supabase, user.id, BADGE_IDS.firstSteps);
      if (result.awarded) awarded.push(BADGE_IDS.firstSteps);
    }

    // ── Badge: Week badge — alle lessen van een week voltooid ──────────────
    if (weekNumber !== undefined && BADGE_IDS.weekBadges[weekNumber]) {
      // Get all lesson IDs for this week from DB
      const { data: weekLessons } = await supabase
        .from('lessons')
        .select('id, week_id, weeks!inner(number)')
        .eq('weeks.number', weekNumber);

      if (weekLessons && weekLessons.length > 0) {
        const lessonIds = weekLessons.map((l) => l.id);
        const { count: completedCount } = await supabase
          .from('lesson_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .in('lesson_id', lessonIds);

        if (completedCount === lessonIds.length) {
          const result = await awardBadge(supabase, user.id, BADGE_IDS.weekBadges[weekNumber]);
          if (result.awarded) awarded.push(BADGE_IDS.weekBadges[weekNumber]);
        }
      }
    }
  }

  // ── Badge: Exercise Champion — 10 oefeningen ingeleverd ───────────────────
  if (trigger === 'exercise_submit') {
    const { count } = await supabase
      .from('exercise_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (count !== null && count >= 10) {
      const result = await awardBadge(supabase, user.id, BADGE_IDS.exerciseChampion);
      if (result.awarded) awarded.push(BADGE_IDS.exerciseChampion);
    }

    // ── Badge: Perfect Score — 100/100 op een oefening ────────────────────
    if (score === 100) {
      const result = await awardBadge(supabase, user.id, BADGE_IDS.perfectScore);
      if (result.awarded) awarded.push(BADGE_IDS.perfectScore);
    }
  }

  return NextResponse.json({ awarded });
}

/**
 * GET /api/badges/award
 * Returns all earned badges for the current user.
 */
export async function GET() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet geauthenticeerd.' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('student_badges')
    .select('*, badges(*)')
    .eq('user_id', user.id)
    .order('earned_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Badges ophalen mislukt.' }, { status: 500 });
  }

  return NextResponse.json({ badges: data });
}
