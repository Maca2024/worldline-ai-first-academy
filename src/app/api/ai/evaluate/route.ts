import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const EVALUATION_PROMPT = `Je bent een exercise evaluator voor de Worldline AI-First Developer Academy.

Je beoordeelt student-inzendingen op basis van de opdracht-instructies.

Geef je beoordeling in het volgende JSON format:
{
  "score": <0-100>,
  "feedback": "<korte samenvatting in het Nederlands>",
  "strengths": ["<sterk punt 1>", "<sterk punt 2>"],
  "improvements": ["<verbeterpunt 1>", "<verbeterpunt 2>"]
}

Beoordelingscriteria:
- Volledigheid: Zijn alle gevraagde onderdelen aanwezig?
- Kwaliteit: Is het antwoord doordacht en specifiek (niet generiek)?
- Toepassing: Past de student de geleerde concepten correct toe?
- Diepgang: Gaat het antwoord verder dan het oppervlakkige?

Wees eerlijk maar bemoedigend. Geef concrete, actionable feedback.
Antwoord ALLEEN met valid JSON. Geen tekst ervoor of erna.`;

export async function POST(request: Request) {
  try {
    const { exerciseTitle, exerciseInstructions, submission } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        score: 0,
        feedback: 'AI evaluatie is momenteel niet beschikbaar.',
        strengths: [],
        improvements: [],
      });
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 1024,
      system: EVALUATION_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Opdracht: ${exerciseTitle}\n\nInstructies: ${exerciseInstructions}\n\nStudent inzending:\n${submission}`,
        },
      ],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('');

    const evaluation = JSON.parse(text);
    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Evaluation error:', error);
    return NextResponse.json({
      score: 0,
      feedback: 'Er is een fout opgetreden bij de evaluatie.',
      strengths: [],
      improvements: [],
    });
  }
}
