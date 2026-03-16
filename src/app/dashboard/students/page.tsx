'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Search, UserPlus, Download } from 'lucide-react';

export default function StudentsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-accent-blue" />
            Studenten
          </h1>
          <p className="text-gray-400 mt-1">Beheer en monitor student voortgang</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button size="sm">
            <UserPlus className="w-4 h-4" />
            Invite Student
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Zoek op naam of email..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-navy-800 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
        </div>
        <div className="flex gap-2">
          <Badge variant="blue" className="cursor-pointer px-3 py-1">Alle</Badge>
          <Badge variant="default" className="cursor-pointer px-3 py-1">Squad A</Badge>
          <Badge variant="default" className="cursor-pointer px-3 py-1">Squad B</Badge>
          <Badge variant="default" className="cursor-pointer px-3 py-1">Squad C</Badge>
        </div>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="text-center py-16">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">
            Nog geen studenten geregistreerd
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-4">
            Studenten kunnen zich registreren met een squad invite code.
            Deel de codes: SQUAD-A-2026, SQUAD-B-2026, SQUAD-C-2026
          </p>
          <Button>
            <UserPlus className="w-4 h-4" />
            Stuur Invite Emails
          </Button>
        </CardContent>
      </Card>

      {/* Invite Codes Reference */}
      <Card>
        <CardContent>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
            Invite Codes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[
              { code: 'SQUAD-A-2026', label: 'Squad A', color: 'blue' as const },
              { code: 'SQUAD-B-2026', label: 'Squad B', color: 'purple' as const },
              { code: 'SQUAD-C-2026', label: 'Squad C', color: 'green' as const },
              { code: 'INSTRUCTOR-2026', label: 'Instructors', color: 'coral' as const },
            ].map((item) => (
              <div
                key={item.code}
                className="p-3 rounded-lg bg-navy-900/50 border border-white/5"
              >
                <Badge variant={item.color} className="mb-1">{item.label}</Badge>
                <p className="font-mono text-sm text-white mt-1">{item.code}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
