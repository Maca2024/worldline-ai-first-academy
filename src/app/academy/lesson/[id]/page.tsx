'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import { getLessonById, curriculum } from '@/lib/data/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-white">Les niet gevonden</h1>
        <Link href="/academy">
          <Button variant="secondary" className="mt-4">Terug naar dashboard</Button>
        </Link>
      </div>
    );
  }

  // Find week and day for this lesson
  const parentWeek = curriculum.find((w) =>
    w.days.some((d) => d.lessons.some((l) => l.id === lessonId))
  );
  const parentDay = parentWeek?.days.find((d) =>
    d.lessons.some((l) => l.id === lessonId)
  );

  // Find prev/next lessons
  const allLessons = curriculum.flatMap((w) =>
    w.days.flatMap((d) => d.lessons)
  );
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Link href="/academy" className="hover:text-white transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        {parentWeek && (
          <>
            <Link
              href={`/academy/week/${parentWeek.id}`}
              className="hover:text-white transition-colors"
            >
              Week {parentWeek.number}
            </Link>
            <span>/</span>
          </>
        )}
        {parentDay && (
          <>
            <span>Dag {parentDay.day}</span>
            <span>/</span>
          </>
        )}
        <span className="text-white">{lesson.title}</span>
      </div>

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={
            lesson.type === 'theory' ? 'blue' :
            lesson.type === 'lab' ? 'green' :
            lesson.type === 'demo' ? 'purple' :
            'default'
          }>
            {lesson.type}
          </Badge>
          <span className="text-sm text-gray-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {lesson.duration} minuten
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white">{lesson.title}</h1>
        <p className="text-gray-400 mt-2">{lesson.description}</p>
      </div>

      {/* Mark Complete Button */}
      <div className="flex items-center gap-3">
        <Button variant="primary" size="sm">
          <CheckCircle2 className="w-4 h-4" />
          Markeer als voltooid
        </Button>
      </div>

      {/* Lesson Content */}
      <Card>
        <CardContent>
          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-8
            prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6
            prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-strong:text-white
            prose-code:text-accent-cyan prose-code:bg-navy-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-navy-900 prose-pre:border prose-pre:border-white/5 prose-pre:rounded-lg
            prose-li:text-gray-300
            prose-table:border-collapse
            prose-th:text-left prose-th:text-gray-300 prose-th:border-b prose-th:border-white/10 prose-th:pb-2
            prose-td:text-gray-400 prose-td:border-b prose-td:border-white/5 prose-td:py-2
            prose-blockquote:border-accent-blue prose-blockquote:text-gray-300
          ">
            <ReactMarkdown
              rehypePlugins={[rehypeHighlight]}
              remarkPlugins={[remarkGfm]}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      {/* Exercises */}
      {lesson.exercises && lesson.exercises.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Oefeningen
          </h2>
          <div className="space-y-3">
            {lesson.exercises.map((exercise) => (
              <Link key={exercise.id} href={`/academy/exercise/${exercise.id}`}>
                <Card variant="interactive" className="mb-3">
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">{exercise.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="purple">{exercise.type}</Badge>
                        <span className="text-xs text-gray-500">
                          {exercise.points} punten
                        </span>
                        <span className="text-xs text-gray-500">
                          Moeilijkheid: {'★'.repeat(exercise.difficulty)}{'☆'.repeat(5 - exercise.difficulty)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-500" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        {prevLesson ? (
          <Link href={`/academy/lesson/${prevLesson.id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              {prevLesson.title}
            </Button>
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link href={`/academy/lesson/${nextLesson.id}`}>
            <Button variant="secondary" size="sm">
              {nextLesson.title}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
