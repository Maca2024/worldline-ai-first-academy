'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getAllExercises, getAllLessons } from '@/lib/data/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, Bot, CheckCircle2 } from 'lucide-react';

export default function ExercisePage() {
  const params = useParams();
  const exerciseId = params.id as string;
  const exercise = getAllExercises().find((e) => e.id === exerciseId);
  const [submission, setSubmission] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    feedback: string;
    strengths: string[];
    improvements: string[];
  } | null>(null);

  if (!exercise) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-white">Oefening niet gevonden</h1>
        <Link href="/academy">
          <Button variant="secondary" className="mt-4">Terug naar dashboard</Button>
        </Link>
      </div>
    );
  }

  // Find parent lesson
  const parentLesson = getAllLessons().find((l) =>
    l.exercises?.some((e) => e.id === exerciseId)
  );

  const handleSubmit = async () => {
    if (!submission.trim()) return;
    setSubmitting(true);

    try {
      const response = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: exercise.id,
          exerciseTitle: exercise.title,
          exerciseInstructions: exercise.instructions,
          submission,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFeedback(data);
      } else {
        setFeedback({
          score: 0,
          feedback: 'Er is een fout opgetreden bij het evalueren. Probeer het opnieuw.',
          strengths: [],
          improvements: [],
        });
      }
    } catch {
      setFeedback({
        score: 0,
        feedback: 'Kan geen verbinding maken met de AI evaluatie service.',
        strengths: [],
        improvements: [],
      });
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      {parentLesson && (
        <Link
          href={`/academy/lesson/${parentLesson.id}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Terug naar les</span>
        </Link>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="purple">{exercise.type}</Badge>
          <span className="text-sm text-gray-400">
            {exercise.points} punten
          </span>
          <span className="text-sm text-gray-400">
            Moeilijkheid: {'★'.repeat(exercise.difficulty)}{'☆'.repeat(5 - exercise.difficulty)}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white">{exercise.title}</h1>
      </div>

      {/* Instructions */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-white mb-3">Opdracht</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {exercise.instructions}
          </p>
        </CardContent>
      </Card>

      {/* Submission */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-white mb-3">Jouw Antwoord</h2>
          <textarea
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            placeholder="Schrijf je antwoord hier... Je kunt Markdown gebruiken voor opmaak en code blocks."
            className="w-full min-h-[300px] rounded-lg bg-navy-900 border border-white/10 p-4 text-gray-300 text-sm font-mono placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent resize-y"
          />
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-gray-500">
              {submission.length} tekens
            </p>
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={!submission.trim()}
            >
              <Send className="w-4 h-4" />
              Inleveren & AI Feedback
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Feedback */}
      {feedback && (
        <Card className="border-accent-purple/20">
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-accent-purple" />
              <h2 className="text-lg font-semibold text-white">AI Feedback</h2>
              <Badge variant={feedback.score >= 70 ? 'green' : feedback.score >= 40 ? 'blue' : 'coral'}>
                Score: {feedback.score}/100
              </Badge>
            </div>

            <p className="text-gray-300 mb-4">{feedback.feedback}</p>

            {feedback.strengths.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-accent-green mb-2">Sterke punten</h3>
                <ul className="space-y-1">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-accent-green mt-0.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedback.improvements.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-accent-coral mb-2">Verbeterpunten</h3>
                <ul className="space-y-1">
                  {feedback.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <ArrowLeft className="w-3.5 h-3.5 text-accent-coral mt-0.5 shrink-0 rotate-180" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-4 border-t border-white/5 pt-3">
              Dit is een AI-gegenereerde evaluatie. Je instructor kan een aanvullende beoordeling geven.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
