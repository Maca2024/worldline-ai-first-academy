'use client';

import { curriculum } from '@/lib/data/curriculum';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { GraduationCap, Users, Calendar, BookOpen } from 'lucide-react';

const squads = [
  {
    name: 'Squad A',
    description: 'Prompt Craft & Context Engineering',
    weeks: 'Week 2-3',
    status: 'upcoming' as string,
    students: 0,
    focus: 'Foundations, Pentagon Model, Context Engineering, MCP',
  },
  {
    name: 'Squad B',
    description: 'Intent Engineering & Trade-offs',
    weeks: 'Week 4-5',
    status: 'upcoming' as string,
    students: 0,
    focus: 'Intent Engineering, Goal Hierarchies, Trade-off Frameworks',
  },
  {
    name: 'Squad C',
    description: 'Specification Engineering',
    weeks: 'Week 6-7',
    status: 'upcoming' as string,
    students: 0,
    focus: 'GIVEN/WHEN/THEN, Acceptance Criteria, Test-Driven AI',
  },
];

export default function SquadsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-accent-purple" />
          Squad Management
        </h1>
        <p className="text-gray-400 mt-1">3 squads, 9 weken, ~30 developers</p>
      </div>

      {/* Squad Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {squads.map((squad) => (
          <Card key={squad.name} className="border-white/5">
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>{squad.name}</CardTitle>
                <Badge variant={squad.status === 'active' ? 'green' : 'default'}>
                  {squad.status === 'active' ? 'Actief' : 'Upcoming'}
                </Badge>
              </div>

              <p className="text-sm text-gray-400 mb-4">{squad.description}</p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">{squad.weeks}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">{squad.students} studenten</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-400">{squad.focus}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Voortgang</span>
                  <span>0%</span>
                </div>
                <ProgressBar value={0} size="sm" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-white mb-4">
            9-Weken Timeline
          </h2>
          <div className="space-y-4">
            {curriculum.map((week, i) => (
              <div key={week.id} className="flex items-center gap-4">
                <div className="w-24 shrink-0">
                  <Badge variant={i === 0 ? 'green' : 'default'}>
                    Week {week.number}{week.number === 2 ? '-3' : week.number === 4 ? '-5' : week.number === 6 ? '-7' : week.number === 8 ? '-9' : ''}
                  </Badge>
                </div>
                <div className="flex-1 h-px bg-white/5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{week.title}</p>
                  <p className="text-xs text-gray-500">{week.targetAudience}</p>
                </div>
                <span className="text-xl">{week.badgeIcon}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
