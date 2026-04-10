import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet geauthenticeerd.' }, { status: 401 });
  }

  let lessonId: string;
  try {
    const body = await request.json();
    lessonId = typeof body.lessonId === 'string' ? body.lessonId.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 });
  }

  if (!lessonId) {
    return NextResponse.json({ error: 'lessonId is verplicht.' }, { status: 400 });
  }

  // Upsert: insert or update to completed
  const { data, error } = await supabase
    .from('lesson_progress')
    .upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        status: 'completed',
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    )
    .select()
    .single();

  if (error) {
    console.error('lesson_progress upsert error:', error);
    return NextResponse.json({ error: 'Voortgang opslaan mislukt.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, progress: data });
}

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet geauthenticeerd.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get('lessonId');

  const query = supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', user.id);

  if (lessonId) {
    query.eq('lesson_id', lessonId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: 'Voortgang ophalen mislukt.' }, { status: 500 });
  }

  return NextResponse.json({ progress: data });
}
