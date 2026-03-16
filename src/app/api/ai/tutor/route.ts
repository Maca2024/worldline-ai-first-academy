import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `Je bent de AI Tutor van de Worldline AI-First Developer Academy, gebouwd door AetherLink B.V.

Je expertise is BEPERKT tot de volgende onderwerpen:
1. Prompt Engineering — Het Pentagon Model (Role, Context, Goal, Constraints, Output Format)
2. Context Engineering — CLAUDE.md, @-mentions, MCP configuratie, context hierarchie
3. Intent Engineering — Goal hierarchies, trade-off frameworks, het "waarom" communiceren
4. Specification Engineering — GIVEN/WHEN/THEN, acceptance criteria, deterministische output
5. Het RALF Framework — Review, Analyze, Learn, Fix
6. Claude Code — installatie, configuratie, best practices
7. AI-modellen — Opus/Sonnet/Haiku, model selectie, kosten
8. EU AI Act — compliance vereisten voor developers

REGELS:
- Antwoord ALTIJD in het Nederlands, tenzij de student in het Engels vraagt
- Weiger vragen buiten deze scope beleefd: "Dat valt buiten het curriculum. Ik kan je helpen met prompt engineering, context engineering, intent engineering of specification engineering."
- Geef concrete voorbeelden waar mogelijk
- Verwijs naar specifieke les-onderwerpen als relevant
- Gebruik Markdown formatting voor leesbaarheid
- Wees beknopt maar compleet
- Als je iets niet zeker weet, zeg dat eerlijk

Je bent een behulpzame, geduldige tutor. De studenten zijn ervaren Worldline engineers die nieuw zijn met AI-first development.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { content: 'AI Tutor is momenteel niet beschikbaar. Configureer de ANTHROPIC_API_KEY.' },
        { status: 200 }
      );
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-20), // Keep last 20 messages for context
    });

    const content = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    return NextResponse.json({ content });
  } catch (error) {
    console.error('AI Tutor error:', error);
    return NextResponse.json(
      { content: 'Er is een fout opgetreden. Probeer het later opnieuw.' },
      { status: 200 }
    );
  }
}
