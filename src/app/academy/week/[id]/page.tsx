'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getWeekById } from '@/lib/data/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  BookOpen,
  Beaker,
  Clock,
  CheckCircle2,
  PlayCircle,
  Target,
} from 'lucide-react';

export default function WeekPage() {
  const params = useParams();
  const weekId = params.id as string;
  const week = getWeekById(weekId);

  if (!week) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-white">Week niet gevonden</h1>
        <Link href="/academy">
          <Button variant="secondary" className="mt-4">Terug naar dashboard</Button>
        </Link>
      </div>
    );
  }

  const totalLessons = week.days.flatMap((d) => d.lessons).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back */}
      <Link href="/academy" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Terug naar dashboard</span>
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge variant="blue">Week {week.number}</Badge>
          {week.badgeIcon && <span className="text-2xl">{week.badgeIcon}</span>}
        </div>
        <h1 className="text-3xl font-bold text-white">{week.title}</h1>
        <p className="text-lg text-gray-400 mt-1">{week.subtitle}</p>
        <p className="text-gray-500 mt-3">{week.description}</p>
      </div>

      {/* Objectives */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-accent-blue" />
            <h2 className="text-lg font-semibold text-white">Leerdoelen</h2>
          </div>
          <ul className="space-y-2">
            {week.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-accent-green mt-0.5 shrink-0" />
                <span className="text-sm">{obj}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Week voortgang</span>
            <span className="text-sm font-medium text-white">0 / {totalLessons} lessen</span>
          </div>
          <ProgressBar value={0} max={totalLessons} size="md" />
        </CardContent>
      </Card>

      {/* Days */}
      <div className="space-y-6">
        {week.days.map((day) => (
          <div key={day.day}>
            <h2 className="text-xl font-bold text-white mb-4">
              Dag {day.day}: {day.title}
            </h2>

            {/* Schedule */}
            <Card className="mb-4">
              <CardContent>
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
                  Dagschema
                </h3>
                <div className="space-y-2">
                  {day.schedule.map((block, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 py-1.5 text-sm"
                    >
                      <span className="text-gray-500 font-mono text-xs w-28 shrink-0">
                        {block.time}
                      </span>
                      <span className="text-base">{block.emoji}</span>
                      <span className="text-gray-300">{block.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lessons */}
            <div className="space-y-3">
              {day.lessons.map((lesson) => (
                <Link key={lesson.id} href={`/academy/lesson/${lesson.id}`}>
                  <Card variant="interactive" className="mb-3">
                    <CardContent className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-navy-700 flex items-center justify-center shrink-0">
                          {lesson.type === 'theory' && <BookOpen className="w-5 h-5 text-accent-blue" />}
                          {lesson.type === 'lab' && <Beaker className="w-5 h-5 text-accent-green" />}
                          {lesson.type === 'demo' && <PlayCircle className="w-5 h-5 text-accent-purple" />}
                          {lesson.type === 'review' && <CheckCircle2 className="w-5 h-5 text-accent-coral" />}
                          {lesson.type === 'mixed' && <BookOpen className="w-5 h-5 text-accent-cyan" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{lesson.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant={
                              lesson.type === 'theory' ? 'blue' :
                              lesson.type === 'lab' ? 'green' :
                              lesson.type === 'demo' ? 'purple' :
                              'default'
                            }>
                              {lesson.type}
                            </Badge>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.duration} min
                            </span>
                            {lesson.exercises && lesson.exercises.length > 0 && (
                              <Badge variant="coral">
                                {lesson.exercises.length} oefening{lesson.exercises.length > 1 ? 'en' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <PlayCircle className="w-5 h-5 text-gray-500" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
