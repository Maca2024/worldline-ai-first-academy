import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { rateLimit, getRateLimitKey } from '@/lib/rate-limit';

const EVALUATION_PROMPT = `Je bent een exercise evaluator voor de Worldline AI-First Developer Academy.

Je beoordeelt student-inzendingen op basis van de opdracht-instructies.

Geef je beoordeling in het volgende JSON format:
{
  "score": <0-100>,
  "feedback": "<korte samenvatting in het Nederlands>",
  "strengths": ["<sterk punt 1>", "<sterk punt 2>"],
  "improvements": ["<verbeterpunt 1>", "<verbeterpunt 2>"]
}

Beoordelingscriteria:
- Volledigheid: Zijn alle gevraagde onderdelen aanwezig?
- Kwaliteit: Is het antwoord doordacht en specifiek (niet generiek)?
- Toepassing: Past de student de geleerde concepten correct toe?
- Diepgang: Gaat het antwoord verder dan het oppervlakkige?

Wees eerlijk maar bemoedigend. Geef concrete, actionable feedback.
Antwoord ALLEEN met valid JSON. Geen tekst ervoor of erna.`;

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Niet geauthenticeerd.' }, { status: 401 });
  }

  // Rate limit: 10 submissions per 5 minutes per user
  const rl = rateLimit(getRateLimitKey(request, `exercise:${user.id}`), {
    limit: 10,
    windowMs: 5 * 60 * 1000,
  });

  if (!rl.success) {
    return NextResponse.json(
      { error: `Te veel inzendingen. Wacht ${rl.retryAfterSeconds} seconden.` },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } }
    );
  }

  let exerciseId: string;
  let exerciseTitle: string;
  let exerciseInstructions: string;
  let submission: string;

  try {
    const body = await request.json();
    exerciseId = typeof body.exerciseId === 'string' ? body.exerciseId.trim() : '';
    exerciseTitle = typeof body.exerciseTitle === 'string' ? body.exerciseTitle.trim() : '';
    exerciseInstructions = typeof body.exerciseInstructions === 'string' ? body.exerciseInstructions.trim() : '';
    submission = typeof body.submission === 'string' ? body.submission.trim() : '';
  } catch {
    return NextResponse.json({ error: 'Ongeldig verzoek.' }, { status: 400 });
  }

  if (!exerciseId || !submission) {
    return NextResponse.json({ error: 'exerciseId en submission zijn verplicht.' }, { status: 400 });
  }

  if (submission.length > 10_000) {
    return NextResponse.json({ error: 'Inzending is te lang (max 10.000 tekens).' }, { status: 400 });
  }

  // Get AI evaluation
  let aiFeedback: { score: number; feedback: string; strengths: string[]; improvements: string[] } = {
    score: 0,
    feedback: 'AI evaluatie niet beschikbaar.',
    strengths: [],
    improvements: [],
  };

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6-20250514',
        max_tokens: 1024,
        system: EVALUATION_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Opdracht: ${exerciseTitle}\n\nInstructies: ${exerciseInstructions}\n\nStudent inzending:\n${submission}`,
          },
        ],
      });

      const text = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((b) => b.text)
        .join('');

      aiFeedback = JSON.parse(text);
    } catch (err) {
      console.error('AI evaluation error:', err);
    }
  }

  // Persist submission to Supabase
  const { data, error: dbError } = await supabase
    .from('exercise_submissions')
    .insert({
      user_id: user.id,
      exercise_id: exerciseId,
      submission,
      score: aiFeedback.score,
      ai_feedback: aiFeedback,
    })
    .select('id')
    .single();

  if (dbError) {
    console.error('exercise_submissions insert error:', dbError);
    // Still return AI feedback even if DB write fails
    return NextResponse.json({ ...aiFeedback, saved: false });
  }

  // Trigger badge evaluation (fire-and-forget)
  fetch(new URL('/api/badges/award', request.url).toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') ?? '',
    },
    body: JSON.stringify({ trigger: 'exercise_submit', score: aiFeedback.score }),
  }).catch(() => { /* non-critical */ });

  return NextResponse.json({ ...aiFeedback, saved: true, submissionId: data.id });
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
  const exerciseId = searchParams.get('exerciseId');

  const query = supabase
    .from('exercise_submissions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (exerciseId) {
    query.eq('exercise_id', exerciseId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: 'Inzendingen ophalen mislukt.' }, { status: 500 });
  }

  return NextResponse.json({ submissions: data });
}
