'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  TrendingUp,
  Users,
  Bot,
  BookOpen,
  Clock,
  Target,
} from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-accent-green" />
          Analytics
        </h1>
        <p className="text-gray-400 mt-1">
          Completion rates, AI usage, en student engagement metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Completion Rate', value: '—', subtitle: 'Gemiddeld over alle squads', color: 'bg-accent-blue/10 text-accent-blue' },
          { icon: Bot, label: 'AI Tutor Sessions', value: '0', subtitle: 'Totaal deze week', color: 'bg-accent-purple/10 text-accent-purple' },
          { icon: BookOpen, label: 'Exercises Submitted', value: '0', subtitle: 'Wachtend op review: 0', color: 'bg-accent-green/10 text-accent-green' },
          { icon: Clock, label: 'Gem. Studietijd', value: '—', subtitle: 'Per student per week', color: 'bg-accent-cyan/10 text-accent-cyan' },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <CardContent className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-xl font-bold text-white">{kpi.value}</p>
                  <p className="text-xs text-gray-500">{kpi.subtitle}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-green" />
              Voortgang per Week
            </h2>
            <div className="h-64 flex items-center justify-center rounded-lg bg-navy-900/50 border border-white/5">
              <p className="text-sm text-gray-500">
                Grafiek beschikbaar zodra studenten actief zijn
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5 text-accent-purple" />
              AI Tutor Gebruik
            </h2>
            <div className="h-64 flex items-center justify-center rounded-lg bg-navy-900/50 border border-white/5">
              <p className="text-sm text-gray-500">
                AI interactie data wordt hier gevisualiseerd
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent-coral" />
              Exercise Scores Distributie
            </h2>
            <div className="h-64 flex items-center justify-center rounded-lg bg-navy-900/50 border border-white/5">
              <p className="text-sm text-gray-500">
                Score distributie per oefening
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-accent-blue" />
              Squad Vergelijking
            </h2>
            <div className="h-64 flex items-center justify-center rounded-lg bg-navy-900/50 border border-white/5">
              <p className="text-sm text-gray-500">
                Cross-squad performance vergelijking
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EU AI Act Compliance Note */}
      <Card className="border-accent-purple/20 bg-accent-purple/5">
        <CardContent className="flex items-start gap-3">
          <Badge variant="purple" className="shrink-0 mt-0.5">EU AI Act</Badge>
          <div>
            <p className="text-sm text-gray-300">
              AI Tutor interacties worden geanonimiseerd opgeslagen conform de EU AI Act.
              Instructeurs zien alleen geaggregeerde statistieken, nooit individuele gesprekken.
              Dagelijks roterende anonymisatie-salt voorkomt cross-day correlatie.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
