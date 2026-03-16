'use client';

import { useAuth } from '@/lib/auth/context';
import { curriculum, getAllLessons, getAllExercises } from '@/lib/data/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Trophy, Star, Target, BookOpen, Zap } from 'lucide-react';

const badges = [
  { id: 'leadership-pioneer', name: 'Leadership Pioneer', icon: '🏛️', description: 'Week 1 Management Kickoff voltooid', earned: false },
  { id: 'pentagon-master', name: 'Pentagon Master', icon: '⭐', description: 'Alle Pentagon Model oefeningen voltooid', earned: false },
  { id: 'context-king', name: 'Context King', icon: '🧠', description: 'CLAUDE.md en MCP configuratie opgezet', earned: false },
  { id: 'intent-commander', name: 'Intent Commander', icon: '🎯', description: 'Goal Hierarchy en Trade-off Framework beheerst', earned: false },
  { id: 'spec-architect', name: 'Spec Architect', icon: '📐', description: 'GIVEN/WHEN/THEN specificaties schrijven', earned: false },
  { id: 'ralf-champion', name: 'RALF Champion', icon: '🏆', description: 'Capstone project gepresenteerd', earned: false },
  { id: 'ai-whisperer', name: 'AI Whisperer', icon: '🤖', description: '100+ AI Tutor interacties', earned: false },
  { id: 'first-blood', name: 'First Blood', icon: '⚡', description: 'Eerste oefening ingeleverd', earned: false },
  { id: 'perfect-score', name: 'Perfect Score', icon: '💯', description: '100/100 op een oefening', earned: false },
  { id: 'streak-master', name: 'Streak Master', icon: '🔥', description: '5 dagen op rij actief', earned: false },
];

export default function ProgressPage() {
  useAuth();
  const totalLessons = getAllLessons().length;
  const totalExercises = getAllExercises().length;
  const totalPoints = getAllExercises().reduce((sum, e) => sum + e.points, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-7 h-7 text-accent-purple" />
          Voortgang & Achievements
        </h1>
        <p className="text-gray-400 mt-1">
          Track je leerpad door de AI-First Academy
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center">
            <BookOpen className="w-6 h-6 text-accent-blue mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">0/{totalLessons}</p>
            <p className="text-xs text-gray-500">Lessen voltooid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <Target className="w-6 h-6 text-accent-green mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">0/{totalExercises}</p>
            <p className="text-xs text-gray-500">Oefeningen voltooid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <Star className="w-6 h-6 text-accent-coral mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">0/{totalPoints}</p>
            <p className="text-xs text-gray-500">Punten behaald</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center">
            <Zap className="w-6 h-6 text-accent-purple mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">0/{badges.length}</p>
            <p className="text-xs text-gray-500">Badges verdiend</p>
          </CardContent>
        </Card>
      </div>

      {/* Week-by-week progress */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Per Week</h2>
        <div className="space-y-3">
          {curriculum.map((week) => {
            const weekLessons = week.days.flatMap((d) => d.lessons).length;
            return (
              <Card key={week.id}>
                <CardContent className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{week.badgeIcon}</span>
                    <div>
                      <h3 className="font-medium text-white">
                        Week {week.number}: {week.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {weekLessons} lessen &bull; {week.targetAudience}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ProgressBar value={0} max={weekLessons} className="w-32" size="sm" />
                    <Badge variant="default">0%</Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {badges.map((badge) => (
            <Card
              key={badge.id}
              className={badge.earned ? 'border-accent-purple/30' : 'opacity-40'}
            >
              <CardContent className="text-center py-4">
                <span className="text-3xl block mb-2">{badge.icon}</span>
                <p className="text-sm font-medium text-white">{badge.name}</p>
                <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
