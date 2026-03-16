'use client';

import { useAuth } from '@/lib/auth/context';
import { curriculum, getAllLessons, getAllExercises } from '@/lib/data/curriculum';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  Users,
  BookOpen,
  Trophy,
  Activity,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';

export default function InstructorDashboard() {
  const { profile } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Instructor Dashboard</h1>
        <p className="text-gray-400 mt-1">
          Welkom, {profile?.full_name ?? 'Instructor'} — Wave 1 Overview
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="Studenten"
          value="0"
          subtitle="3 squads"
          color="blue"
        />
        <MetricCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Lessen"
          value={getAllLessons().length.toString()}
          subtitle={`${curriculum.length} weken`}
          color="purple"
        />
        <MetricCard
          icon={<Trophy className="w-5 h-5" />}
          label="Oefeningen"
          value={getAllExercises().length.toString()}
          subtitle="Inzendingen: 0"
          color="green"
        />
        <MetricCard
          icon={<Activity className="w-5 h-5" />}
          label="AI Tutor"
          value="0"
          subtitle="Interacties vandaag"
          color="cyan"
        />
      </div>

      {/* Squad Overview */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Squad Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Squad A', 'Squad B', 'Squad C'].map((squad, i) => (
            <Card key={squad}>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <CardTitle>{squad}</CardTitle>
                  <Badge variant={i === 0 ? 'green' : 'default'}>
                    {i === 0 ? 'Week 2-3' : i === 1 ? 'Wacht' : 'Wacht'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Studenten</span>
                    <span className="text-white">0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Gem. voortgang</span>
                    <span className="text-white">0%</span>
                  </div>
                  <ProgressBar value={0} size="sm" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Inzendingen</span>
                    <span className="text-white">0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-green" />
              Recente Activiteit
            </h2>
            <div className="text-center py-8">
              <Clock className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Nog geen activiteit — studenten moeten zich eerst registreren
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-accent-coral" />
              Aandachtspunten
            </h2>
            <div className="space-y-3">
              <AlertItem
                type="info"
                message="Curriculum volledig geladen: 9 weken, dag-voor-dag"
              />
              <AlertItem
                type="warning"
                message="Supabase nog niet geconfigureerd — stel .env.local in"
              />
              <AlertItem
                type="info"
                message="AI Tutor operationeel (vereist ANTHROPIC_API_KEY)"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Curriculum Overview */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-white mb-4">
            Curriculum Overview
          </h2>
          <div className="space-y-3">
            {curriculum.map((week) => (
              <div
                key={week.id}
                className="flex items-center justify-between p-3 rounded-lg bg-navy-900/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{week.badgeIcon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Week {week.number}: {week.title}
                    </p>
                    <p className="text-xs text-gray-500">{week.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default">
                    {week.days.length} dagen
                  </Badge>
                  <Badge variant="default">
                    {week.days.flatMap((d) => d.lessons).length} lessen
                  </Badge>
                  <Badge variant="purple">
                    {week.days.flatMap((d) => d.lessons).flatMap((l) => l.exercises ?? []).length} oefeningen
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  color: 'blue' | 'purple' | 'green' | 'cyan';
}) {
  const colorMap = {
    blue: 'bg-accent-blue/10 text-accent-blue',
    purple: 'bg-accent-purple/10 text-accent-purple',
    green: 'bg-accent-green/10 text-accent-green',
    cyan: 'bg-accent-cyan/10 text-accent-cyan',
  };

  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AlertItem({ type, message }: { type: 'info' | 'warning' | 'error'; message: string }) {
  const colors = {
    info: 'text-accent-blue bg-accent-blue/5 border-accent-blue/20',
    warning: 'text-accent-coral bg-accent-coral/5 border-accent-coral/20',
    error: 'text-red-400 bg-red-500/5 border-red-500/20',
  };

  return (
    <div className={`text-sm px-3 py-2 rounded-lg border ${colors[type]}`}>
      {message}
    </div>
  );
}
