'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  BookOpen,
  Code,
  Palette,
  Shield,
} from 'lucide-react';

const resources = [
  {
    category: 'Cheatsheets',
    icon: FileText,
    items: [
      { title: 'Pentagon Model Cheatsheet', description: 'Quick reference voor de 5 atomen', type: 'PDF' },
      { title: 'Prometheus Prompt Levels (L1-L5)', description: 'Kwaliteitsschaal met voorbeelden', type: 'PDF' },
      { title: 'RALF Loop Framework', description: 'Review, Analyze, Learn, Fix stappen', type: 'PDF' },
      { title: 'GIVEN/WHEN/THEN Template', description: 'BDD-style specification template', type: 'PDF' },
    ],
  },
  {
    category: 'Code Templates',
    icon: Code,
    items: [
      { title: 'CLAUDE.md Template', description: 'Project context file template', type: 'MD' },
      { title: 'MCP Server Config', description: '.claude.json configuratie voorbeelden', type: 'JSON' },
      { title: 'TypeScript Strict Config', description: 'tsconfig.json best practices', type: 'JSON' },
      { title: 'ADR Template', description: 'Architecture Decision Record template', type: 'MD' },
    ],
  },
  {
    category: 'AI Tools Reference',
    icon: Palette,
    items: [
      { title: 'Claude Code Quick Start', description: 'Installatie en eerste stappen', type: 'Guide' },
      { title: 'Model Comparison Guide', description: 'Opus vs Sonnet vs Haiku — wanneer welk model', type: 'Guide' },
      { title: 'MCP Server Directory', description: 'Overzicht van beschikbare MCP servers', type: 'Guide' },
      { title: 'Prompt Library', description: 'Verzameling van L4+ prompts per use case', type: 'Library' },
    ],
  },
  {
    category: 'Compliance & Security',
    icon: Shield,
    items: [
      { title: 'EU AI Act — Developer Guide', description: 'Wat je moet weten als developer', type: 'PDF' },
      { title: 'AI Security Checklist', description: 'OWASP AI/ML Top 10 checklist', type: 'PDF' },
      { title: 'Data Privacy Guidelines', description: 'GDPR compliance bij AI-gebruik', type: 'PDF' },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-accent-blue" />
          Bronnen & Referentiemateriaal
        </h1>
        <p className="text-gray-400 mt-1">
          Cheatsheets, templates en guides voor tijdens en na de Academy
        </p>
      </div>

      <div className="space-y-8">
        {resources.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.category}>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icon className="w-5 h-5 text-gray-400" />
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.items.map((item) => (
                  <Card key={item.title} variant="interactive">
                    <CardContent className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-white text-sm">{item.title}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                      <Badge variant="default">{item.type}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
