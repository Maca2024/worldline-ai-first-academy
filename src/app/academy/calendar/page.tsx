'use client';

import { curriculum } from '@/lib/data/curriculum';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, MapPin, Monitor, Users } from 'lucide-react';

const sessionTypes = {
  onsite: { icon: MapPin, label: 'On-site Hoofddorp', color: 'blue' as const },
  remote: { icon: Monitor, label: 'Remote', color: 'green' as const },
  hybrid: { icon: Users, label: 'Hybrid', color: 'purple' as const },
};

export default function CalendarPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <Calendar className="w-7 h-7 text-accent-cyan" />
          Sessie Agenda
        </h1>
        <p className="text-gray-400 mt-1">
          On-site en remote sessies gedurende de 9 weken
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        {Object.entries(sessionTypes).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <div key={key} className="flex items-center gap-1.5">
              <Icon className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">{config.label}</span>
            </div>
          );
        })}
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Alle Weken</TabsTrigger>
          <TabsTrigger value="onsite">On-site</TabsTrigger>
          <TabsTrigger value="remote">Remote</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-6">
            {curriculum.map((week) => (
              <Card key={week.id}>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="blue">Week {week.number}</Badge>
                    <h2 className="font-semibold text-white">{week.title}</h2>
                    <Badge variant="default">{week.targetAudience}</Badge>
                  </div>

                  <div className="space-y-3">
                    {week.days.map((day) => (
                      <div
                        key={day.day}
                        className="flex items-start gap-4 p-3 rounded-lg bg-navy-900/50"
                      >
                        <div className="text-center shrink-0 w-14">
                          <p className="text-xs text-gray-500 uppercase">Dag</p>
                          <p className="text-2xl font-bold text-white">{day.day}</p>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white text-sm">{day.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-accent-blue" />
                            <span className="text-xs text-gray-400">
                              On-site — Worldline Hoofddorp
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            09:00 - 16:30
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="blue">
                            {day.lessons.length} lessen
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="onsite">
          <Card>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Alle coaching sessies vinden on-site plaats bij Worldline Hoofddorp.
                Reis- en verblijfinformatie wordt apart gecommuniceerd.
              </p>
              <div className="mt-4 p-4 rounded-lg bg-navy-900/50">
                <h3 className="font-medium text-white text-sm mb-2">Locatie Details</h3>
                <p className="text-sm text-gray-400">Worldline Netherlands</p>
                <p className="text-sm text-gray-400">Hoofddorp, Nederland</p>
                <p className="text-sm text-gray-400 mt-2">Coaching dagen: 2-3 per week</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remote">
          <Card>
            <CardContent>
              <p className="text-gray-400 text-sm">
                Async lessen en oefeningen zijn altijd beschikbaar via dit platform.
                Je kunt op je eigen tempo werken buiten de on-site coaching dagen.
              </p>
              <div className="mt-4 p-4 rounded-lg bg-navy-900/50">
                <h3 className="font-medium text-white text-sm mb-2">Remote Resources</h3>
                <ul className="space-y-1 text-sm text-gray-400">
                  <li>• AI Tutor — altijd beschikbaar voor vragen</li>
                  <li>• Alle lesmateriaal — 24/7 toegankelijk</li>
                  <li>• Oefeningen — inleveren wanneer je wilt</li>
                  <li>• Office Hours (Week 8-9) — remote deelname mogelijk</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
