'use client';

import { useAuth } from '@/lib/auth/context';
import { curriculum } from '@/lib/data/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import Link from 'next/link';
import {
  BookOpen,
  Clock,
  Users,
  Trophy,
  ArrowRight,
  Bot,
  Calendar,
} from 'lucide-react';

export default function AcademyDashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welkom terug, {profile?.full_name?.split(' ')[0] ?? 'Student'}
        </h1>
        <p className="text-gray-400 mt-1">
          AI-First Developer Academy — Wave 1
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Lessen"
          value="0 / 24"
          color="blue"
        />
        <StatCard
          icon={<Trophy className="w-5 h-5" />}
          label="Punten"
          value="0"
          color="purple"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Studietijd"
          value="0 uur"
          color="cyan"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Squad Rank"
          value="#—"
          color="green"
        />
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Totale Voortgang</h2>
            <span className="text-sm text-gray-400">0%</span>
          </div>
          <ProgressBar value={0} size="lg" />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/academy/ai-tutor">
          <Card variant="interactive" className="h-full">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-purple/20 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-accent-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Tutor</h3>
                <p className="text-sm text-gray-400">Stel vragen over het curriculum</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/academy/calendar">
          <Card variant="interactive" className="h-full">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/20 flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-accent-cyan" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Agenda</h3>
                <p className="text-sm text-gray-400">Bekijk je sessie planning</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/academy/progress">
          <Card variant="interactive" className="h-full">
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent-green/20 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-accent-green" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Badges</h3>
                <p className="text-sm text-gray-400">Bekijk je achievements</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Curriculum Weeks */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Curriculum</h2>
        <div className="space-y-4">
          {curriculum.map((week) => (
            <Link key={week.id} href={`/academy/week/${week.id}`}>
              <Card variant="interactive" className="mb-4">
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="blue">Week {week.number}{week.number === 2 ? '-3' : week.number === 4 ? '-5' : week.number === 6 ? '-7' : week.number === 8 ? '-9' : ''}</Badge>
                        {week.badgeIcon && (
                          <span className="text-lg">{week.badgeIcon}</span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white mt-1">
                        {week.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {week.subtitle}
                      </p>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {week.description}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="text-xs text-gray-500">
                          {week.days.length} dagen
                        </span>
                        <span className="text-xs text-gray-500">
                          {week.days.flatMap((d) => d.lessons).length} lessen
                        </span>
                        <span className="text-xs text-gray-500">
                          {week.targetAudience}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <ProgressBar value={0} className="w-24" size="sm" />
                      <ArrowRight className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'purple' | 'cyan' | 'green';
}) {
  const colorMap = {
    blue: 'bg-accent-blue/10 text-accent-blue',
    purple: 'bg-accent-purple/10 text-accent-purple',
    cyan: 'bg-accent-cyan/10 text-accent-cyan',
    green: 'bg-accent-green/10 text-accent-green',
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-lg font-bold text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      <div className="h-10 bg-navy-700 rounded w-64" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-navy-700 rounded-xl" />
        ))}
      </div>
      <div className="h-16 bg-navy-700 rounded-xl" />
    </div>
  );
}
