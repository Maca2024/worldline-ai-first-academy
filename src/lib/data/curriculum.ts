export interface CurriculumWeek {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  targetAudience: string;
  days: CurriculumDay[];
  badgeName?: string;
  badgeIcon?: string;
}

export interface CurriculumDay {
  day: number;
  title: string;
  schedule: ScheduleBlock[];
  lessons: CurriculumLesson[];
}

export interface ScheduleBlock {
  time: string;
  emoji: string;
  label: string;
  type: 'checkin' | 'theory' | 'break' | 'demo' | 'lab' | 'review' | 'wrapup' | 'lunch';
}

export interface CurriculumLesson {
  id: string;
  title: string;
  type: 'theory' | 'demo' | 'lab' | 'review' | 'mixed';
  duration: number;
  description: string;
  content: string;
  exercises?: CurriculumExercise[];
}

export interface CurriculumExercise {
  id: string;
  title: string;
  instructions: string;
  type: 'prompt-craft' | 'code-review' | 'free-form' | 'multiple-choice' | 'peer-review';
  difficulty: number;
  points: number;
}

const dailySchedule: ScheduleBlock[] = [
  { time: '09:00 - 09:30', emoji: '☕', label: 'Check-in & Dag Preview', type: 'checkin' },
  { time: '09:30 - 10:00', emoji: '📚', label: 'Theorie Blok', type: 'theory' },
  { time: '10:00 - 10:15', emoji: '☕', label: 'Koffiepauze', type: 'break' },
  { time: '10:15 - 11:00', emoji: '⚡', label: 'Live Demo', type: 'demo' },
  { time: '11:00 - 12:30', emoji: '🔨', label: 'Hands-on Lab', type: 'lab' },
  { time: '12:30 - 13:30', emoji: '🍽️', label: 'Lunch', type: 'lunch' },
  { time: '13:30 - 15:30', emoji: '🔨', label: 'Hands-on Lab deel 2', type: 'lab' },
  { time: '15:30 - 15:45', emoji: '☕', label: 'Pauze', type: 'break' },
  { time: '15:45 - 16:15', emoji: '🔄', label: 'RALF Review', type: 'review' },
  { time: '16:15 - 16:30', emoji: '📋', label: 'Wrap-up & Morgen Preview', type: 'wrapup' },
];

export const curriculum: CurriculumWeek[] = [
  // ── WEEK 1: MANAGEMENT KICKOFF ──
  {
    id: 'week-1',
    number: 1,
    title: 'Management Kickoff',
    subtitle: 'De AI-First Mindset voor Leiders',
    description: 'Alle people managers van engineers (teamleads + directors) worden getraind in hoe zij AI-adoptie kunnen faciliteren, coachen en meten. Dit is de fundamentele cultuurshift die nodig is voordat squads van start gaan.',
    objectives: [
      'Begrijp waarom AI-first anders is dan "een tool installeren"',
      'Definieer de rol van de manager in AI-transitie',
      'Stel concrete KPIs op voor AI-adoptie in je team',
      'Ervaar de wow-factor: wat je devs straks kunnen',
    ],
    targetAudience: 'People managers, teamleads, directors',
    badgeName: 'Leadership Pioneer',
    badgeIcon: '🏛️',
    days: [
      {
        day: 1,
        title: 'AI-First Mindset — Waarom dit anders is',
        schedule: [
          { time: '09:00 - 09:30', emoji: '☕', label: 'Welkom & Introductie ronde', type: 'checkin' },
          { time: '09:30 - 10:30', emoji: '📚', label: 'De AI-Revolutie: Van Tool naar Teamgenoot', type: 'theory' },
          { time: '10:30 - 10:45', emoji: '☕', label: 'Pauze', type: 'break' },
          { time: '10:45 - 12:00', emoji: '⚡', label: 'Case Studies: Bedrijven die het goed doen', type: 'demo' },
          { time: '12:00 - 13:00', emoji: '🍽️', label: 'Lunch', type: 'lunch' },
          { time: '13:00 - 14:30', emoji: '🔨', label: 'Workshop: AI-Impact Assessment voor jouw team', type: 'lab' },
          { time: '14:30 - 15:30', emoji: '💬', label: 'Panel: Angsten, verwachtingen en realiteit', type: 'review' },
          { time: '15:30 - 16:00', emoji: '📋', label: 'Actieplan & Morgen Preview', type: 'wrapup' },
        ],
        lessons: [
          {
            id: 'w1d1-theory',
            title: 'De AI-Revolutie: Van Tool naar Teamgenoot',
            type: 'theory',
            duration: 60,
            description: 'Waarom AI-first fundamenteel anders is dan eerdere technologie-adoptie.',
            content: `# De AI-Revolutie: Van Tool naar Teamgenoot

## Waarom dit keer alles anders is

Elke paar jaar verschijnt er een nieuwe technologie die "alles gaat veranderen": cloud computing, DevOps, microservices, containers. Meestal betekent dit dat teams een nieuwe tool leren en hun workflow licht aanpassen.

**AI-first is fundamenteel anders.**

Het is niet een nieuwe tool in je toolbox — het is een nieuwe **manier van denken** over softwareontwikkeling. Vergelijk het met de overgang van waterval naar agile: het ging niet om een tool, maar om een mindset.

## De drie niveaus van AI-adoptie

### Niveau 1: AI als Autocomplete (waar de meeste teams nu zijn)
- GitHub Copilot als fancy autocomplete
- ChatGPT voor Stack Overflow-achtige vragen
- Minimale productiviteitswinst (~10-15%)

### Niveau 2: AI als Pair Programmer (waar jullie naartoe gaan)
- AI begrijpt je codebase context
- Gestructureerde prompts voor complexe taken
- AI reviewt jouw code, jij reviewt AI code
- Significante productiviteitswinst (~40-60%)

### Niveau 3: AI-First Development (het einddoel)
- AI is een volwaardige teamgenoot met eigen verantwoordelijkheden
- Workflows ontworpen rondom AI-samenwerking
- Mensen focussen op architectuur, strategie en kwaliteit
- Transformatieve productiviteitswinst (~200-400%)

## Wat dit betekent voor managers

Als manager ben je niet langer alleen verantwoordelijk voor **mensen** — je bent verantwoordelijk voor de **mens-AI samenwerking** in je team.

Dit vereist nieuwe competenties:
- **AI Literacy**: Begrijp wat AI wel en niet kan
- **Workflow Design**: Ontwerp processen die AI integreren
- **Quality Assurance**: Nieuwe review-methodes voor AI-gegenereerde code
- **Culture Building**: Creëer een omgeving waar experimenteren veilig is

## De Worldline Context

Met 900+ engineers en een missie-kritische payment infrastructure is de vraag niet *of* AI geadopteerd wordt, maar *hoe goed* het wordt begeleid.

**Slecht begeleid**: Engineers gebruiken AI willekeurig, inconsistente kwaliteit, security risico's, geen kennisdeling.

**Goed begeleid**: Gestandaardiseerde AI-workflows, peer review van AI output, shared prompt libraries, meetbare kwaliteitsverbetering.

Jullie rol als managers is het verschil tussen deze twee scenario's.`,
            exercises: [
              {
                id: 'w1d1-ex1',
                title: 'AI-Impact Assessment',
                instructions: 'Breng in kaart hoe jouw team momenteel AI gebruikt. Identificeer 3 processen die baat zouden hebben bij AI-integratie op Niveau 2 of 3. Beschrijf voor elk proces: huidige situatie, gewenste situatie, en wat er nodig is om daar te komen.',
                type: 'free-form',
                difficulty: 2,
                points: 20,
              },
            ],
          },
          {
            id: 'w1d1-cases',
            title: 'Case Studies: Bedrijven die het goed doen',
            type: 'demo',
            duration: 75,
            description: 'Concrete voorbeelden van succesvolle AI-first transities bij vergelijkbare organisaties.',
            content: `# Case Studies: AI-First Transities

## Case 1: Stripe — Developer Productivity met AI

Stripe implementeerde een bedrijfsbrede AI-strategie:
- Custom AI tooling geïntegreerd in hun eigen IDE
- Interne prompt libraries per team
- Wekelijkse "AI office hours" voor kennisdeling
- **Resultaat**: 30% snellere feature delivery, 25% minder bugs in productie

### Wat managers deden:
- Dedicated "AI experiment time" (2 uur/week) in sprint planning
- AI-gegenereerde code altijd door human review
- Progressie tracking via interne metrics

## Case 2: Shopify — "AI is your new pair programmer"

CEO Tobi Lütke maakte AI-gebruik een core competentie:
- Elk teamlid moet AI-tools beheersen
- Performance reviews bevatten AI-adoptie criteria
- Teams delen prompts en workflows via interne wiki

### Wat managers deden:
- Integreerde AI-metrics in team OKRs
- Sponsorde interne AI hackathons
- Creëerde "AI champions" per squad

## Case 3: Klarna — 700 engineers, AI-first

Klarna reduceerde hun engineering team terwijl ze meer features leverden:
- AI vervangt niet engineers — het versterkt ze
- Focus verschoof van "meer code schrijven" naar "betere architectuur"
- Juniors werden sneller productief door AI-ondersteuning

### Key Takeaway voor Worldline
De succesvolle transities hebben drie dingen gemeen:
1. **Top-down commitment** (management gelooft erin en handelt ernaar)
2. **Bottom-up enablement** (engineers krijgen tools, tijd en vrijheid)
3. **Meetbare resultaten** (geen vibes, maar data)`,
          },
        ],
      },
      {
        day: 2,
        title: 'De Manager\'s Rol — Verwachtingen, KPIs, Cultuurshift',
        schedule: [
          { time: '09:00 - 09:30', emoji: '☕', label: 'Reflectie op Dag 1 + Q&A', type: 'checkin' },
          { time: '09:30 - 10:30', emoji: '📚', label: 'KPIs voor AI-Adoptie', type: 'theory' },
          { time: '10:30 - 10:45', emoji: '☕', label: 'Pauze', type: 'break' },
          { time: '10:45 - 12:00', emoji: '⚡', label: 'Workshop: Jouw AI-Adoptie Scorecard', type: 'lab' },
          { time: '12:00 - 13:00', emoji: '🍽️', label: 'Lunch', type: 'lunch' },
          { time: '13:00 - 14:30', emoji: '🔨', label: 'Coaching Frameworks voor AI-Teams', type: 'theory' },
          { time: '14:30 - 15:30', emoji: '🔨', label: 'Rollenspel: Het moeilijke gesprek', type: 'lab' },
          { time: '15:30 - 16:00', emoji: '📋', label: 'Morgen preview: Hands-on demo', type: 'wrapup' },
        ],
        lessons: [
          {
            id: 'w1d2-kpis',
            title: 'KPIs voor AI-Adoptie',
            type: 'theory',
            duration: 60,
            description: 'Concrete meetpunten om AI-adoptie te monitoren en te sturen.',
            content: `# KPIs voor AI-Adoptie

## Waarom meten?
"What gets measured gets managed." Zonder concrete KPIs is AI-adoptie een goed bedoeld initiatief dat langzaam uitdooft.

## De AI-Adoptie Scorecard

### 1. Adoption Metrics (Gebruik)
- **AI Tool Usage Rate**: % van engineers dat dagelijks AI-tools gebruikt
  - Target Week 9: >80%
- **Prompt Quality Score**: gemiddelde kwaliteit van prompts (peer-reviewed)
  - Target: gemiddeld 7/10
- **AI Interaction Frequency**: aantal AI-interacties per dev per dag
  - Baseline: 5-10, Target: 20-30

### 2. Productivity Metrics (Output)
- **Time-to-PR**: tijd van ticket tot pull request
  - Verwachte verbetering: -25%
- **Code Review Turnaround**: tijd voor code review
  - Verwachte verbetering: -30% (AI pre-review)
- **Bug Rate**: bugs per 1000 LOC
  - Verwachte verbetering: -20%

### 3. Quality Metrics (Kwaliteit)
- **AI Code Acceptance Rate**: % AI-suggesties dat ongewijzigd geaccepteerd wordt
  - Gezond bereik: 40-60% (te hoog = blindlings accepteren)
- **Post-AI Review Comments**: aantal review comments op AI-gegenereerde code
  - Dalend = engineers worden beter in AI-sturing
- **Security Scan Results**: kwetsbaarheden in AI-gegenereerde code
  - Moet gelijk of lager zijn dan handmatige code

### 4. Culture Metrics (Cultuur)
- **Knowledge Sharing**: aantal gedeelde prompts/workflows per week
- **AI Champion Activity**: actieve bijdragen van squad AI champions
- **Team Sentiment**: maandelijkse pulse survey over AI-tools (1-10)

## Anti-Patronen

⚠️ **Niet meten**: aantal regels code gegenereerd door AI
- Meer code ≠ betere code
- Stimuleert verkeerd gedrag

⚠️ **Niet meten**: tijd besteed aan AI-tools
- Focus op output, niet op input
- Engineers die efficiënt prompten besteden MINDER tijd

⚠️ **Niet vergelijken**: engineers onderling op AI-metrics
- Iedereen leert in een ander tempo
- Vergelijk teams, niet individuen`,
            exercises: [
              {
                id: 'w1d2-ex1',
                title: 'Jouw AI-Adoptie Scorecard',
                instructions: 'Maak een scorecard voor jouw team met 6-8 KPIs. Gebruik het framework uit de les, maar pas het aan op jouw specifieke teamcontext. Definieer voor elke KPI: baseline (huidige waarde of schatting), target na 9 weken, en hoe je het gaat meten.',
                type: 'free-form',
                difficulty: 3,
                points: 30,
              },
            ],
          },
          {
            id: 'w1d2-coaching',
            title: 'Coaching Frameworks voor AI-Teams',
            type: 'theory',
            duration: 90,
            description: 'Hoe begeleid je engineers door de AI-transitie?',
            content: `# Coaching Frameworks voor AI-Teams

## Het RALF Coaching Model

RALF is niet alleen voor code — het is een universeel leer-framework:

### Review — Waar staan we?
- Wekelijks 1-on-1: "Hoe gaat het met AI-tools?"
- Observeer zonder te oordelen
- Vraag naar concrete voorbeelden

### Analyze — Wat werkt, wat niet?
- Identificeer patronen in succesvol AI-gebruik
- Herken blokkades (technisch, cultureel, persoonlijk)
- Benchmark tegen team-gemiddeldes

### Learn — Wat kunnen we verbeteren?
- Koppel aan training materiaal uit de Academy
- Peer learning: laat ervaren AI-users demo's geven
- Experimenteer: "Probeer deze week X"

### Fix — Actie ondernemen
- Concrete afspraken: "Volgende week gebruik je AI voor alle code reviews"
- Verwijder blokkades: tools installeren, tijd vrijmaken
- Vier successen: deel wins in het team

## De Adoptie Curve

Elk team heeft:
- **Pioneers** (10-15%): Enthousiast, experimenteren al. Maak ze AI Champions.
- **Early Majority** (30-35%): Open, maar hebben bewijs nodig. Laat Pioneers demo's geven.
- **Late Majority** (30-35%): Sceptisch, maar volgzaam. Maak het makkelijk en veilig.
- **Resisters** (10-15%): Actief weerstand. Respecteer, maar stel verwachtingen.

## Het Moeilijke Gesprek

Soms moet je het gesprek voeren:
> "Ik merk dat je AI-tools vermijdt. Ik wil begrijpen waarom, en hoe ik je kan helpen."

Niet:
> "Iedereen gebruikt AI behalve jij. Dat moet beter."

Het verschil? Nieuwsgierigheid vs. druk. De eerste opent een deur, de tweede sluit er een.`,
          },
        ],
      },
      {
        day: 3,
        title: 'Hands-on Demo — De Wow-Factor',
        schedule: [
          { time: '09:00 - 09:30', emoji: '☕', label: 'Check-in & verwachtingen', type: 'checkin' },
          { time: '09:30 - 10:30', emoji: '⚡', label: 'Live Demo: Van idee tot werkende feature in 30 min', type: 'demo' },
          { time: '10:30 - 10:45', emoji: '☕', label: 'Pauze', type: 'break' },
          { time: '10:45 - 12:00', emoji: '🔨', label: 'Managers proberen het zelf', type: 'lab' },
          { time: '12:00 - 13:00', emoji: '🍽️', label: 'Lunch', type: 'lunch' },
          { time: '13:00 - 14:30', emoji: '⚡', label: 'Demo: AI Code Review & Security Scanning', type: 'demo' },
          { time: '14:30 - 15:30', emoji: '🔄', label: 'Roadmap presentatie: 9 weken overview', type: 'review' },
          { time: '15:30 - 16:00', emoji: '📋', label: 'Commitment: Manager pledge & volgende stappen', type: 'wrapup' },
        ],
        lessons: [
          {
            id: 'w1d3-demo',
            title: 'Van Idee tot Feature in 30 Minuten',
            type: 'demo',
            duration: 60,
            description: 'Live demonstratie van AI-first development met Claude Code.',
            content: `# Live Demo: Van Idee tot Feature

## Wat we gaan bouwen

Een volledig werkende feature in 30 minuten — iets waar je normaal een halve dag tot een dag aan besteedt.

**De feature**: Een real-time dashboard component die payment transaction data visualiseert met filtering en zoekfunctionaliteit.

## De AI-First Workflow

### Stap 1: Intent definiëren (2 min)
\`\`\`
Bouw een React component dat:
- Real-time payment transacties toont in een tabel
- Filtering op status (pending/completed/failed)
- Zoeken op merchant name
- Pagination (20 per pagina)
- Responsive design (mobile + desktop)
\`\`\`

### Stap 2: Context laden (1 min)
\`\`\`
@src/types/transaction.ts
@src/hooks/useTransactions.ts
@src/styles/theme.ts
Gebruik onze bestaande design tokens en TypeScript strict mode.
\`\`\`

### Stap 3: AI genereert, mens reviewt (20 min)
- Claude Code schrijft de component
- Instructor reviewt elke stap
- Highlights: type safety, edge cases, accessibility

### Stap 4: RALF Review (7 min)
- **Review**: Code werkt, types kloppen, responsive
- **Analyze**: Wat deed AI goed? Waar moest ik bijsturen?
- **Learn**: Welke prompt-technieken werkten het best?
- **Fix**: Kleine aanpassingen na review

## Waarom dit indruk maakt

Managers zien met eigen ogen:
- De snelheid van AI-assisted development
- De kwaliteit van de output (TypeScript, tests, accessibility)
- Het belang van goede prompts (garbage in = garbage out)
- Dat AI de mens niet vervangt, maar versterkt`,
            exercises: [
              {
                id: 'w1d3-ex1',
                title: 'Manager Pledge',
                instructions: 'Schrijf een korte pledge (3-5 zinnen) over hoe jij AI-adoptie in je team gaat ondersteunen de komende 9 weken. Deel concrete acties die je gaat ondernemen. Dit wordt gedeeld met je team als kickoff van het programma.',
                type: 'free-form',
                difficulty: 1,
                points: 10,
              },
            ],
          },
        ],
      },
    ],
  },

  // ── WEEK 2-3: SQUAD A ──
  {
    id: 'week-2-3',
    number: 2,
    title: 'Squad A — Foundations & Pentagon',
    subtitle: 'Prompt Craft & Context Engineering',
    description: 'Eerste intensive coaching week voor Squad A. Van zero-to-hero in prompt engineering met het Pentagon Model als fundament. Focus op Prompt Craft en Context Engineering — de basis voor alles wat volgt.',
    objectives: [
      'Beheers het Pentagon Model (Role, Context, Goal, Constraints, Output Format)',
      'Schrijf L4+ prompts volgens de Prometheus schaal',
      'Pas Context Engineering toe in je eigen codebase',
      'Gebruik CLAUDE.md en MCP configuraties effectief',
    ],
    targetAudience: 'Squad A developers (~10 engineers)',
    badgeName: 'Pentagon Master',
    badgeIcon: '⭐',
    days: [
      ...generateCoachingDays(1, 'A', [
        {
          dayTitle: 'Dag 1: Foundations — Het Pentagon Model',
          theoryTitle: 'Het Pentagon Model: 5 Atomen van een Perfect Prompt',
          theoryContent: `# Het Pentagon Model

## De 5 Atomen

Elk effectief prompt bestaat uit maximaal 5 bouwstenen — de "atomen" van prompt engineering:

### 1. ROLE (Wie is de AI?)
\`\`\`
Je bent een senior TypeScript developer met 10 jaar ervaring
in payment processing systemen.
\`\`\`
**Waarom**: Definieert het expertise-niveau en perspectief van het antwoord.

### 2. CONTEXT (Wat is de situatie?)
\`\`\`
We werken aan een Next.js 14 applicatie met App Router.
De codebase gebruikt strict TypeScript en Tailwind CSS.
We moeten PCI-DSS compliant zijn.
\`\`\`
**Waarom**: Geeft de AI de informatie die het nodig heeft om relevante antwoorden te geven.

### 3. GOAL (Wat moet er gebeuren?)
\`\`\`
Schrijf een middleware functie die:
1. JWT tokens valideert
2. Rate limiting implementeert (100 req/min)
3. Request logging toevoegt
\`\`\`
**Waarom**: Een helder doel voorkomt vage of irrelevante output.

### 4. CONSTRAINTS (Wat mag niet?)
\`\`\`
- Gebruik geen externe libraries behalve jose voor JWT
- Maximaal 100 regels code
- Geen any types
- OWASP Top 10 security compliance
\`\`\`
**Waarom**: Constraints focussen de AI en voorkomen over-engineering.

### 5. OUTPUT FORMAT (Hoe moet het eruit zien?)
\`\`\`
Geef de code in een enkel TypeScript bestand.
Voeg JSDoc comments toe bij elke publieke functie.
Eindig met een voorbeeld van hoe de middleware te gebruiken.
\`\`\`
**Waarom**: Voorspelbare output maakt het makkelijker om te integreren.

## Van L1 naar L5

De Prometheus schaal meet prompt-kwaliteit:

| Level | Beschrijving | Voorbeeld |
|-------|-------------|-----------|
| L1 | Vaag, geen context | "Maak een login" |
| L2 | Basis structuur | "Maak een login form met email en wachtwoord" |
| L3 | Pentagon deels ingevuld | "Als senior dev, maak een login form met validatie" |
| L4 | Pentagon compleet | Alle 5 atomen aanwezig en specifiek |
| L5 | Pentagon + meta-instructies | L4 + chain-of-thought, voorbeelden, edge cases |

**Jullie target na deze week: consistent L4 schrijven.**`,
          labTitle: 'Lab: Prompt Craft — Van L1 naar L4',
          labContent: `# Lab: Prompt Craft

## Opdracht 1: Prompt Transformatie

Neem deze L1 prompt en transformeer hem stap voor stap naar L4:

**L1 (start)**:
\`\`\`
Maak een API endpoint
\`\`\`

Voeg toe:
1. ROLE → L2
2. CONTEXT → L3
3. GOAL + CONSTRAINTS → L4
4. OUTPUT FORMAT → L4+

## Opdracht 2: Pentagon in je Eigen Codebase

Open je eigen project in Claude Code. Kies een feature of bug die je moet bouwen/fixen.

1. Schrijf een L4 prompt met alle 5 Pentagon atomen
2. Laat Claude Code de code genereren
3. Review het resultaat
4. Itereer op je prompt als het resultaat niet goed genoeg is

**Documenteer**: Wat was je eerste prompt? Wat was je uiteindelijke prompt? Wat leerde je?

## Opdracht 3: Prompt Review

Wissel prompts uit met je buurman/vrouw.
- Review elkaars Pentagon completeness
- Geef een L-score (1-5)
- Suggereer verbeteringen`,
          exercise: {
            id: 'w2d1-ex1',
            title: 'Pentagon Prompt Transformatie',
            instructions: 'Transformeer de gegeven L1 prompt naar een L4 prompt door systematisch alle 5 Pentagon atomen toe te voegen. Toon elke tussenstap (L1→L2→L3→L4) en leg bij elke stap uit welk atoom je toevoegt en waarom.',
            type: 'prompt-craft' as const,
            difficulty: 2,
            points: 25,
          },
        },
        {
          dayTitle: 'Dag 2: Context Engineering — CLAUDE.md & Codebase Context',
          theoryTitle: 'Context Engineering: De Kunst van het Juiste Geheugen',
          theoryContent: `# Context Engineering

## Waarom Context King is

Het maakt niet uit hoe goed je prompt is als de AI niet weet waar het over gaat. Context Engineering is de kunst van het juiste geheugen bouwen voor je AI-partner.

## De Context Hiërarchie

### 1. Project Context (CLAUDE.md)
Het meest krachtige context-mechanisme. Een CLAUDE.md in je project root vertelt Claude:
- Tech stack en conventies
- Architectuurbeslissingen
- Do's en don'ts
- Team-specifieke afspraken

\`\`\`markdown
# Project: Payment Gateway

## Stack
- Next.js 14 App Router
- TypeScript strict
- PostgreSQL via Supabase
- Tailwind CSS

## Conventions
- Server Components by default
- Client components only for interactivity
- Conventional commits (feat:, fix:, etc.)
- No any types — use unknown + type guards

## Architecture
- /src/app/ — Routes (App Router)
- /src/lib/ — Shared utilities
- /src/components/ — Reusable components
\`\`\`

### 2. File Context (@-mentions)
Wijs de AI naar relevante bestanden:
\`\`\`
@src/types/transaction.ts
@src/hooks/useTransactions.ts

Voeg een "refund" status toe aan het Transaction type
en update de hook om refunds te filteren.
\`\`\`

### 3. Conversation Context
Bouw progressief context op:
1. Start breed: "Laten we werken aan de payment module"
2. Focus: "Specifiek het refund flow"
3. Detail: "De edge case waar een partial refund faalt"

### 4. MCP Context
Model Context Protocol servers geven AI toegang tot:
- Je database schema (live)
- Git history
- Documentatie
- Externe APIs

## Best Practices
- **Niet te veel**: AI heeft een context window. Geef alleen wat relevant is.
- **Niet te weinig**: Zonder context hallucineren modellen.
- **Refresh regelmatig**: Update CLAUDE.md als je project evolueert.
- **Team-breed**: Deel je CLAUDE.md in version control.`,
          labTitle: 'Lab: CLAUDE.md Opzetten & Context Laden',
          labContent: `# Lab: Context Engineering in de Praktijk

## Opdracht 1: CLAUDE.md voor je Project

Maak een CLAUDE.md voor je eigen werkproject. Gebruik het template:

\`\`\`markdown
# [Project Naam]

## Stack
[Lijst je tech stack]

## Conventions
[Code stijl, naming, patterns]

## Architecture
[Directory structuur + uitleg]

## Current Focus
[Waar werk je nu aan?]
\`\`\`

## Opdracht 2: Context Layering

Gebruik de Context Hiërarchie voor een echte taak:
1. Zorg dat CLAUDE.md op zijn plek staat
2. Gebruik @-mentions voor relevante bestanden
3. Bouw conversatie-context op in 3 stappen
4. Observeer het verschil in output kwaliteit

## Opdracht 3: Before/After Vergelijking

Voer dezelfde taak twee keer uit:
1. **Zonder context**: Vraag Claude om een feature te bouwen met alleen een korte beschrijving
2. **Met context**: Gebruik alle 4 context-niveaus

Documenteer het verschil in:
- Relevantie van de output
- Aantal iteraties nodig
- Kwaliteit van types en error handling`,
          exercise: {
            id: 'w2d2-ex1',
            title: 'CLAUDE.md voor je Eigen Project',
            instructions: 'Maak een complete CLAUDE.md voor je werkproject bij Worldline. Bevat minimaal: Stack, Conventions, Architecture, Current Focus. Toon ook een before/after vergelijking van AI output met en zonder deze context.',
            type: 'free-form' as const,
            difficulty: 3,
            points: 30,
          },
        },
        {
          dayTitle: 'Dag 3: MCP & Tool Integration',
          theoryTitle: 'Model Context Protocol: AI met Superpowers',
          theoryContent: `# Model Context Protocol (MCP)

## Wat is MCP?

MCP is een open standaard die AI-modellen verbindt met externe systemen. Denk aan het als USB-poorten voor je AI:

- **Zonder MCP**: AI kan alleen tekst lezen en genereren
- **Met MCP**: AI kan je database querien, git commits lezen, Slack berichten sturen, en meer

## Hoe werkt het?

\`\`\`
Jij → Claude Code → MCP Server → Externe Service
                                    ↓
                              Database / API / Tool
\`\`\`

### MCP Server Types
1. **filesystem** — Bestanden lezen/schrijven
2. **git** — Repository operaties
3. **postgres** — Database queries
4. **fetch** — Web requests
5. **Custom** — Alles wat je kunt bouwen

## Setup in Claude Code

In je project's \`.claude.json\`:
\`\`\`json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "$DATABASE_URL"
      }
    }
  }
}
\`\`\`

## Praktische Use Cases voor Worldline

### 1. Database-Aware Development
AI die je schema kent, schrijft betere queries en types.

### 2. Git-Integrated Reviews
AI die je commit history kent, begrijpt waarom code zo geschreven is.

### 3. Documentation-Driven
AI die je API docs kent, genereert correcte integratie code.

## Security Overwegingen

⚠️ **MCP servers hebben toegang tot echte systemen!**
- Gebruik read-only credentials waar mogelijk
- Beperk directory access tot projectmappen
- Nooit production database credentials in development
- Review MCP server code voordat je het installeert`,
          labTitle: 'Lab: Eerste MCP Configuratie',
          labContent: `# Lab: MCP Setup

## Opdracht 1: Filesystem MCP

Configureer de filesystem MCP server voor je project:

\`\`\`json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-filesystem", "./src"]
    }
  }
}
\`\`\`

Test het: vraag Claude om een overzicht van je project structuur.

## Opdracht 2: Git MCP

Voeg de git MCP server toe en:
1. Vraag Claude om je recente commit history samen te vatten
2. Laat Claude een code change uitleggen op basis van git blame
3. Gebruik git context in een prompt voor een nieuwe feature

## Opdracht 3: Custom Scenario

Bedenk een MCP server die nuttig zou zijn voor jouw specifieke werkproces.
Beschrijf:
- Welke externe service zou het verbinden?
- Welke "tools" zou het aanbieden?
- Hoe zou het je workflow verbeteren?`,
          exercise: {
            id: 'w2d3-ex1',
            title: 'MCP Configuratie & Use Case',
            instructions: 'Configureer minimaal 2 MCP servers in je project. Test ze en documenteer: de configuratie, een voorbeeld-interactie, en het verschil dat het maakt voor je productiviteit. Beschrijf daarnaast een custom MCP server die je zou willen bouwen.',
            type: 'free-form' as const,
            difficulty: 3,
            points: 30,
          },
        },
      ]),
    ],
  },

  // ── WEEK 4-5: SQUAD B ──
  {
    id: 'week-4-5',
    number: 4,
    title: 'Squad B — Intent Engineering',
    subtitle: 'Doelhiërarchieën & Trade-off Frameworks',
    description: 'Squad B duikt dieper in Intent Engineering: hoe communiceer je niet alleen WAT je wilt, maar WAAROM. Met goal hierarchies, trade-off frameworks en de lessen van Squad A verwerkt.',
    objectives: [
      'Beheers Intent Engineering — het "waarom" achter je prompts',
      'Bouw doelhiërarchieën voor complexe features',
      'Gebruik trade-off frameworks voor architectuurbeslissingen',
      'Pas lessons learned van Squad A toe',
    ],
    targetAudience: 'Squad B developers (~10 engineers)',
    badgeName: 'Intent Commander',
    badgeIcon: '🎯',
    days: [
      ...generateCoachingDays(4, 'B', [
        {
          dayTitle: 'Dag 1: Intent Engineering — Het Waarom',
          theoryTitle: 'Intent Engineering: Communiceer het Waarom',
          theoryContent: `# Intent Engineering

## Beyond "What" — Het "Why"

Prompt Engineering vertelt AI **wat** je wilt. Intent Engineering vertelt AI **waarom**.

### Het verschil:

**Prompt (wat)**:
\`\`\`
Schrijf een caching layer voor onze API responses.
\`\`\`

**Intent (waarom)**:
\`\`\`
Onze API responses zijn gemiddeld 200ms. Voor de checkout flow
is dit te traag — gebruikers haken af bij >100ms latency.
We willen een caching layer die:
- Checkout-gerelateerde endpoints prioriteert
- Stale data acceptabel is tot 30 seconden
- Cache invalidation bij payment status changes
- De bestaande Redis instance hergebruikt

Trade-off: we accepteren eventual consistency voor snelheid.
\`\`\`

## De Goal Hierarchy

Structureer je intenties van abstract naar concreet:

\`\`\`
Mission (waarom bestaat dit project?)
  └── Objective (wat willen we bereiken dit kwartaal?)
      └── Goal (wat is het specifieke doel van deze feature?)
          └── Task (welke concrete stappen zijn nodig?)
              └── Constraint (wat zijn de grenzen?)
\`\`\`

### Voorbeeld:
\`\`\`
Mission: Betrouwbare payment processing voor merchants
  └── Objective: Checkout conversie verhogen van 87% naar 95%
      └── Goal: Response time onder 100ms voor checkout flow
          └── Task: Implement Redis caching voor /api/checkout/*
              └── Constraint: Max 30s stale, invalidate op status change
\`\`\`

## Waarom dit werkt

AI-modellen genereren betere code als ze de **intentie** begrijpen:
- Ze maken betere architectuurbeslissingen
- Ze anticiperen op edge cases die relevant zijn voor je doel
- Ze kiezen passende trade-offs zonder dat je ze expliciet hoeft te noemen`,
          labTitle: 'Lab: Goal Hierarchies voor Echte Features',
          labContent: `# Lab: Intent Engineering in de Praktijk

## Opdracht 1: Goal Hierarchy Bouwen

Kies een feature uit je huidige sprint/backlog.

Bouw een complete Goal Hierarchy:
1. Mission → Objective → Goal → Tasks → Constraints
2. Identificeer de trade-offs op elk niveau
3. Gebruik deze hierarchy als input voor Claude Code

## Opdracht 2: Before/After met Intent

Dezelfde feature, twee benaderingen:
1. **Zonder intent**: Alleen de "wat" (Pentagon prompt)
2. **Met intent**: Pentagon + Goal Hierarchy + Trade-offs

Vergelijk:
- Architectuurbeslissingen
- Edge case handling
- Code kwaliteit en relevantie

## Opdracht 3: Trade-off Framework

Voor je feature, documenteer:
- Welke trade-offs heb je gemaakt?
- Waarom?
- Wat zijn de consequenties?
- Wanneer zou je deze trade-off herzien?`,
          exercise: {
            id: 'w4d1-ex1',
            title: 'Goal Hierarchy & Intent Prompt',
            instructions: 'Bouw een complete Goal Hierarchy (Mission→Constraint) voor een feature uit je eigen backlog. Schrijf vervolgens een Intent-enriched prompt en vergelijk de output met een standaard Pentagon prompt. Documenteer de verschillen.',
            type: 'prompt-craft' as const,
            difficulty: 3,
            points: 30,
          },
        },
        {
          dayTitle: 'Dag 2: Trade-off Frameworks & Decision Making',
          theoryTitle: 'Trade-off Frameworks voor AI-Assisted Development',
          theoryContent: `# Trade-off Frameworks

## Elke beslissing is een trade-off

In software engineering is er zelden een "beste" oplossing. Er zijn trade-offs. AI kan helpen met het **analyseren** van trade-offs, maar jij maakt de **beslissing**.

## Het AetherLink Trade-off Canvas

| Dimensie | Optie A | Optie B |
|----------|---------|---------|
| Performance | ⬆️ Snel | ⬇️ Langzamer |
| Complexity | ⬇️ Simpel | ⬆️ Complex |
| Maintainability | ⬆️ Leesbaar | ⬇️ Cryptisch |
| Cost | ⬇️ Goedkoop | ⬆️ Duur |
| Time to Market | ⬆️ Snel | ⬇️ Langzaam |
| Scalability | ⬇️ Beperkt | ⬆️ Onbeperkt |

## In de praktijk

### Prompt voor Trade-off Analyse:
\`\`\`
Analyseer de volgende architectuurbeslissing:

Context: [beschrijf de situatie]
Opties: [optie A] vs [optie B]

Evalueer op: performance, complexity, maintainability,
cost, time-to-market, scalability.

Geef een aanbeveling met onderbouwing.
Benoem risico's en mitigaties voor de aanbevolen optie.
\`\`\`

## Decision Records

Documenteer elke significante beslissing als ADR (Architecture Decision Record):
\`\`\`markdown
# ADR-001: Redis voor Checkout Caching

## Status: Accepted
## Context: Checkout latency >200ms, target <100ms
## Decision: Redis caching met 30s TTL
## Consequences:
- ✅ Latency naar ~50ms
- ⚠️ Eventual consistency (max 30s stale)
- ❌ Operationele complexiteit (Redis cluster)
\`\`\``,
          labTitle: 'Lab: Trade-off Analysis met AI',
          labContent: `# Lab: Trade-off Analyse

## Opdracht 1: ADR Schrijven met AI

Kies een architectuurbeslissing in je project. Gebruik Claude om:
1. Opties te brainstormen
2. Trade-offs te analyseren
3. Een ADR te schrijven

## Opdracht 2: Tegenargumenten

Vraag Claude expliciet om je beslissing aan te vallen:
\`\`\`
Speel devil's advocate. Waarom zou [jouw keuze] een slechte
beslissing kunnen zijn? Welke scenario's maken dit problematisch?
\`\`\`

## Opdracht 3: Team Decision Workshop

In duo's: elk kiest een ander standpunt voor dezelfde beslissing.
Gebruik AI om beide standpunten te onderbouwen.
Presenteer aan het team en laat het team stemmen.`,
          exercise: {
            id: 'w4d2-ex1',
            title: 'Architecture Decision Record met AI',
            instructions: 'Schrijf een ADR voor een echte architectuurbeslissing in je project. Gebruik het Trade-off Canvas. Laat Claude devil\'s advocate spelen. Documenteer het volledige proces: opties, analyse, beslissing, en de tegenargumenten.',
            type: 'free-form' as const,
            difficulty: 3,
            points: 30,
          },
        },
        {
          dayTitle: 'Dag 3: Advanced Prompting & Chain-of-Thought',
          theoryTitle: 'Advanced Prompt Techniques',
          theoryContent: `# Advanced Prompt Techniques

## Chain-of-Thought (CoT)

Laat de AI stap voor stap denken:
\`\`\`
Denk stap voor stap na over hoe je deze refactoring aanpakt:
1. Analyseer eerst de huidige code structuur
2. Identificeer de tight coupling
3. Ontwerp de nieuwe interfaces
4. Plan de migratiestappen
5. Schrijf dan pas code
\`\`\`

## Few-Shot Prompting

Geef voorbeelden van gewenste output:
\`\`\`
Hier is hoe we API endpoints structureren in dit project:

Voorbeeld 1:
// GET /api/users
export async function GET() { ... }

Voorbeeld 2:
// POST /api/users
export async function POST(request: Request) { ... }

Schrijf nu een endpoint voor:
// GET /api/transactions?status=pending&page=1
\`\`\`

## Iterative Refinement

Bouw prompts op in rondes:
1. **Ronde 1**: Genereer een eerste versie
2. **Ronde 2**: "Review deze code op [specifiek aspect]"
3. **Ronde 3**: "Optimaliseer voor [constraint]"
4. **Ronde 4**: "Voeg tests toe"

## Meta-Prompting

Vraag AI om je prompt te verbeteren:
\`\`\`
Ik wil een prompt schrijven om [doel].
Welke informatie mis je om me het beste te helpen?
Stel me 5 gerichte vragen.
\`\`\``,
          labTitle: 'Lab: Advanced Techniques in de Praktijk',
          labContent: `# Lab: Advanced Prompt Techniques

## Opdracht 1: Chain-of-Thought Refactoring

Kies een complex stuk code in je project. Gebruik CoT om Claude door een refactoring te leiden.

## Opdracht 2: Few-Shot Pattern

Verzamel 3 voorbeelden van een patroon in je codebase. Gebruik few-shot prompting om Claude een nieuw component in hetzelfde patroon te laten schrijven.

## Opdracht 3: Meta-Prompting Sessie

Start met een vaag idee. Gebruik meta-prompting om samen met Claude de perfecte prompt te bouwen. Documenteer elke iteratie.`,
          exercise: {
            id: 'w4d3-ex1',
            title: 'Advanced Technique Showcase',
            instructions: 'Kies een van de drie advanced techniques (CoT, Few-Shot, of Meta-Prompting). Pas het toe op een echte taak in je codebase. Documenteer het volledige proces en de resultaten. Bereid een 3-minuten demo voor je squad voor.',
            type: 'prompt-craft' as const,
            difficulty: 4,
            points: 35,
          },
        },
      ]),
    ],
  },

  // ── WEEK 6-7: SQUAD C ──
  {
    id: 'week-6-7',
    number: 6,
    title: 'Squad C — Specification Engineering',
    subtitle: 'Acceptance Criteria & GIVEN/WHEN/THEN',
    description: 'Squad C richt zich op Specification Engineering: hoe schrijf je AI-prompts die zo precies zijn dat de output voorspelbaar en testbaar is. Met GIVEN/WHEN/THEN frameworks, acceptance criteria, en de verfijningen van Squad A en B.',
    objectives: [
      'Beheers Specification Engineering — deterministische AI output',
      'Schrijf GIVEN/WHEN/THEN scenario\'s voor AI-taken',
      'Definieer acceptance criteria die AI kan volgen',
      'Combineer alle 4 disciplines in een integrated workflow',
    ],
    targetAudience: 'Squad C developers (~10 engineers)',
    badgeName: 'Spec Architect',
    badgeIcon: '📐',
    days: [
      ...generateCoachingDays(6, 'C', [
        {
          dayTitle: 'Dag 1: Specification Engineering — Deterministische Output',
          theoryTitle: 'Specification Engineering: Van Vaag naar Exact',
          theoryContent: `# Specification Engineering

## Het Probleem

Je schrijft de perfecte Pentagon prompt met intent en context. De AI genereert code. Maar hoe weet je of het **correct** is?

Specification Engineering lost dit op door je prompt zo te schrijven dat de output **testbaar en voorspelbaar** is.

## GIVEN/WHEN/THEN voor Prompts

Leen het BDD (Behavior-Driven Development) framework:

\`\`\`
GIVEN een authenticated user met role "student"
AND een lijst van 5 lessen waarvan 3 completed
WHEN de user het dashboard opent
THEN toon een progress bar op 60%
AND toon de eerste incomplete les als "Continue Learning" CTA
AND toon een badge als alle lessen van een week compleet zijn
\`\`\`

Dit wordt je prompt:
\`\`\`
Bouw een StudentDashboard component.

Specificatie:
GIVEN: user (Profile), lessons (Lesson[]), progress (LessonProgress[])
WHEN: component rendert
THEN:
- Progress bar toont (completed/total * 100)%
- Eerste les met status !== "completed" krijgt "Ga verder" button
- Als alle lessen van een week completed: toon week-badge

Edge cases:
- 0 lessen → "Nog geen lessen beschikbaar" placeholder
- Alle lessen completed → "Gefeliciteerd!" confetti animation
- user.squad_id is null → redirect naar /register

Type requirements:
- Props interface: StudentDashboardProps
- Geen any types
- Server Component waar mogelijk
\`\`\`

## Acceptance Criteria als Prompt Section

\`\`\`
## Acceptance Criteria
- [ ] Component compileert zonder TypeScript errors
- [ ] Props interface is volledig getypeerd
- [ ] Responsive: mobile (320px) tot desktop (1440px)
- [ ] Loading state getoond tijdens data fetch
- [ ] Error state met retry button
- [ ] Accessibility: alle interactieve elementen focusbaar
- [ ] Performance: geen unnecessary re-renders
\`\`\`

## Waarom dit werkt

1. **Testbaar**: Je kunt letterlijk checken of elk THEN-punt klopt
2. **Compleet**: Edge cases zijn vooraf bedacht
3. **Deterministisch**: Twee developers met dezelfde spec krijgen vergelijkbare output
4. **Reviewbaar**: Code review wordt een checklist-exercise`,
          labTitle: 'Lab: GIVEN/WHEN/THEN Prompt Writing',
          labContent: `# Lab: Specification Engineering

## Opdracht 1: Spec-First Development

Kies een component of feature. Schrijf EERST de volledige specificatie:
1. GIVEN/WHEN/THEN scenario's (minimaal 3)
2. Edge cases (minimaal 3)
3. Acceptance criteria (minimaal 5)

DAARNA: voer de spec uit via Claude Code. Check elk acceptance criterium.

## Opdracht 2: Spec Review

Wissel specs met je buurman. Review op:
- Zijn alle happy paths gedekt?
- Zijn edge cases realistisch?
- Zijn acceptance criteria meetbaar (niet vaag)?
- Zou een junior developer dezelfde code schrijven op basis van deze spec?

## Opdracht 3: Integrated Workflow

Combineer alle 4 disciplines:
1. **Prompt Craft**: Pentagon Model
2. **Context Engineering**: CLAUDE.md + @-mentions
3. **Intent Engineering**: Goal Hierarchy
4. **Specification Engineering**: GIVEN/WHEN/THEN + AC

Documenteer het volledige prompt en de resulterende code.`,
          exercise: {
            id: 'w6d1-ex1',
            title: 'GIVEN/WHEN/THEN Specificatie',
            instructions: 'Schrijf een complete GIVEN/WHEN/THEN specificatie voor een component uit je eigen project. Minimaal 3 scenario\'s, 3 edge cases, en 5 acceptance criteria. Voer de spec uit via Claude Code en documenteer hoeveel AC\'s in één keer slagen.',
            type: 'prompt-craft' as const,
            difficulty: 3,
            points: 30,
          },
        },
        {
          dayTitle: 'Dag 2: Testing AI Output — Automated Verification',
          theoryTitle: 'AI Output Testen: Trust but Verify',
          theoryContent: `# AI Output Testen

## De Gouden Regel

> Never trust AI output blindly. Always verify.

Maar verificatie hoeft niet handmatig te zijn.

## Geautomatiseerde Verificatie

### 1. TypeScript als Eerste Verdedigingslinie
\`\`\`
strict: true → AI-gegenereerde code met type errors faalt direct
\`\`\`

### 2. AI-Generated Tests
Vraag Claude om tests te schrijven VOORDAT het de implementatie schrijft:
\`\`\`
Schrijf eerst Vitest unit tests voor de volgende specificatie:
[GIVEN/WHEN/THEN specs]

Schrijf daarna de implementatie die alle tests laat slagen.
\`\`\`

### 3. Snapshot Testing voor UI
\`\`\`
Genereer een Playwright test die:
1. De pagina laadt
2. Een screenshot maakt
3. Vergelijkt met de vorige versie
\`\`\`

### 4. RALF Loop als Kwaliteitspoort
Na elke AI-generatie:
- **Review**: Compileert het? Passeren de tests?
- **Analyze**: Zijn er security issues? Performance problems?
- **Learn**: Wat kan ik beter prompten volgende keer?
- **Fix**: Itereer tot alle AC's groen zijn

## De "AI Test Pyramid"

\`\`\`
         /  Manual Review  \\
        /  (architectuur)    \\
       / Integration Tests    \\
      /  (Playwright/Vitest)    \\
     /     Unit Tests             \\
    /    (Vitest, auto-gen)         \\
   /  TypeScript Compiler            \\
  /    (strict mode = free tests)      \\
\`\`\`

TypeScript strict mode vangt ~60% van de fouten. Unit tests nog eens ~25%. De resterende 15% vereist menselijk oordeel.`,
          labTitle: 'Lab: Test-Driven AI Development',
          labContent: `# Lab: Test-Driven AI Development

## Opdracht 1: Test-First met AI

1. Schrijf de GIVEN/WHEN/THEN spec
2. Laat Claude de tests genereren
3. Laat Claude de implementatie schrijven
4. Run de tests — hoeveel slagen direct?

## Opdracht 2: Security Review

Laat Claude een stuk code genereren. Vraag daarna:
\`\`\`
Review deze code op OWASP Top 10 kwetsbaarheden.
Wees specifiek: regel voor regel, welke risico's zie je?
\`\`\`

## Opdracht 3: Performance Audit

\`\`\`
Analyseer deze React component op performance issues:
- Unnecessary re-renders
- Missing memoization
- Bundle size impact
- Runtime complexity
\`\`\``,
          exercise: {
            id: 'w6d2-ex1',
            title: 'Test-Driven AI Development',
            instructions: 'Gebruik de test-first aanpak: schrijf specs, laat AI tests genereren, laat AI implementatie schrijven. Documenteer: hoeveel tests slagen direct, welke faalden en waarom, en hoe je je prompt aanpaste om 100% slaagpercentage te bereiken.',
            type: 'code-review' as const,
            difficulty: 4,
            points: 35,
          },
        },
        {
          dayTitle: 'Dag 3: Full Stack Integration — 4 Disciplines Samen',
          theoryTitle: 'De 4 Disciplines Gecombineerd',
          theoryContent: `# De 4 Disciplines Gecombineerd

## Het Complete Framework

Na 6 weken beheers je:
1. **Prompt Craft** — Het Pentagon Model (WAT je vraagt)
2. **Context Engineering** — De juiste informatie laden (WAAR het over gaat)
3. **Intent Engineering** — Het waarom communiceren (WAAROM je het vraagt)
4. **Specification Engineering** — Testbare output definiëren (HOE je het verifieert)

## De Integrated Workflow

### Stap 1: Intent (2 min)
Definieer de Goal Hierarchy: Mission → Objective → Goal → Tasks

### Stap 2: Context (1 min)
Load: CLAUDE.md + relevante bestanden + MCP servers

### Stap 3: Prompt (3 min)
Pentagon: Role + Context + Goal + Constraints + Output Format

### Stap 4: Specification (3 min)
GIVEN/WHEN/THEN + Edge Cases + Acceptance Criteria

### Stap 5: Execute & Verify (15-30 min)
Run → Test → RALF → Iterate

### Totale overhead: ~9 minuten prep voor 15-30 min execution

**ROI**: 9 minuten investering bespaart gemiddeld 2-3 iteratiecycli (elk 15-30 min).
Netto tijdsbesparing: **30-80 minuten per feature**.

## De Feedback Loop

Elke keer dat je dit framework toepast:
- Je prompts worden beter (muscle memory)
- Je context wordt completer (CLAUDE.md groeit)
- Je specs worden preciezer (patronen herkennen)
- Je verificatie wordt sneller (tooling verbetert)

Na 3 maanden is dit **tweede natuur**.`,
          labTitle: 'Lab: Full Stack Feature met 4 Disciplines',
          labContent: `# Lab: Integrated Feature Development

## De Capstone Opdracht

Bouw een complete feature met alle 4 disciplines:

1. **Intent**: Schrijf de Goal Hierarchy
2. **Context**: Configureer CLAUDE.md + MCP
3. **Prompt**: Pentagon Model prompt
4. **Spec**: GIVEN/WHEN/THEN + AC

### De Feature
Kies uit:
- A) Een dashboard widget die real-time data toont
- B) Een API endpoint met volledige error handling
- C) Een form met complexe validatie

### Deliverables
1. Goal Hierarchy document
2. CLAUDE.md (updated)
3. De volledige prompt
4. GIVEN/WHEN/THEN specificatie
5. De werkende code
6. Test resultaten
7. RALF review notes`,
          exercise: {
            id: 'w6d3-ex1',
            title: 'Integrated 4-Disciplines Capstone',
            instructions: 'Bouw een complete feature met alle 4 disciplines. Lever alle 7 deliverables op: Goal Hierarchy, CLAUDE.md, volledige prompt, GIVEN/WHEN/THEN spec, werkende code, test resultaten, en RALF review notes.',
            type: 'free-form' as const,
            difficulty: 5,
            points: 50,
          },
        },
      ]),
    ],
  },

  // ── WEEK 8-9: CONSOLIDATIE ──
  {
    id: 'week-8-9',
    number: 8,
    title: 'Consolidatie — Alle Squads',
    subtitle: 'Office Hours, Kennisdeling & Capstone',
    description: 'De laatste twee weken brengen alle squads samen. Open office hours, cross-squad kennisdeling, en de mini-capstone waar elk squad hun AI-workflow improvement presenteert.',
    objectives: [
      'Deel kennis en ervaringen tussen squads',
      'Identificeer AI Champions voor Wave 2',
      'Presenteer squad capstone project',
      'RALF retrospective over het hele traject',
    ],
    targetAudience: 'Alle squads (A + B + C)',
    badgeName: 'RALF Champion',
    badgeIcon: '🏆',
    days: [
      {
        day: 1,
        title: 'Cross-Squad Kennisdeling',
        schedule: [
          { time: '09:00 - 09:30', emoji: '☕', label: 'Welcome back — alle squads samen', type: 'checkin' },
          { time: '09:30 - 10:30', emoji: '📚', label: 'Squad A: Onze top learnings', type: 'theory' },
          { time: '10:30 - 10:45', emoji: '☕', label: 'Pauze', type: 'break' },
          { time: '10:45 - 11:45', emoji: '📚', label: 'Squad B: Onze top learnings', type: 'theory' },
          { time: '11:45 - 12:30', emoji: '📚', label: 'Squad C: Onze top learnings', type: 'theory' },
          { time: '12:30 - 13:30', emoji: '🍽️', label: 'Lunch', type: 'lunch' },
          { time: '13:30 - 15:30', emoji: '🔨', label: 'Cross-squad pair programming', type: 'lab' },
          { time: '15:30 - 16:00', emoji: '🔄', label: 'Reflectie & capstone briefing', type: 'review' },
        ],
        lessons: [
          {
            id: 'w8d1-sharing',
            title: 'Cross-Squad Knowledge Sharing',
            type: 'mixed',
            duration: 180,
            description: 'Elke squad presenteert hun top 3 learnings en best practices.',
            content: `# Cross-Squad Knowledge Sharing

## Format

Elke squad krijgt 45 minuten:
- 20 min presentatie (top 3 learnings)
- 15 min live demo (beste AI-workflow)
- 10 min Q&A

## Voorbereiding per Squad

Bereid voor:
1. **Top 3 Learnings**: Wat was het meest impactvolle dat jullie geleerd hebben?
2. **Biggest Fail**: Waar ging het mis en wat leerden jullie daarvan?
3. **Best Prompt**: De prompt waar jullie het meest trots op zijn
4. **Workflow Demo**: Live demo van jullie AI-workflow in actie

## Cross-Squad Pair Programming

Na de presentaties: pair programming sessies.
- Squad A lid + Squad B lid
- Werk samen aan een kleine feature
- Combineer jullie verschillende expertises
- Documenteer wat je van elkaar geleerd hebt`,
          },
        ],
      },
      {
        day: 2,
        title: 'Office Hours & Deep Dives',
        schedule: [
          { time: '09:00 - 09:30', emoji: '☕', label: 'Check-in & agenda afstemming', type: 'checkin' },
          { time: '09:30 - 12:30', emoji: '💬', label: 'Open Office Hours (roterende thema\'s)', type: 'review' },
          { time: '12:30 - 13:30', emoji: '🍽️', label: 'Lunch', type: 'lunch' },
          { time: '13:30 - 15:30', emoji: '🔨', label: 'Capstone project werktijd', type: 'lab' },
          { time: '15:30 - 16:00', emoji: '📋', label: 'Progress check & morgen preview', type: 'wrapup' },
        ],
        lessons: [
          {
            id: 'w8d2-office',
            title: 'Office Hours — Open Q&A',
            type: 'mixed',
            duration: 180,
            description: 'Roterende thema-tafels waar engineers hun specifieke vragen kunnen stellen.',
            content: `# Office Hours

## Thema Tafels (roterend per 45 min)

### Tafel 1: Prompt Engineering Deep Dive
- Pentagon optimalisatie
- L5 prompts schrijven
- Domain-specifieke patronen

### Tafel 2: MCP & Tooling
- Custom MCP servers bouwen
- Tool chaining
- Debugging MCP issues

### Tafel 3: Code Quality & Testing
- AI-generated tests optimaliseren
- Security review workflows
- Performance monitoring

### Tafel 4: Workflow & Productivity
- CLAUDE.md best practices
- Team workflows met AI
- Knowledge sharing patronen

Engineers roteren elke 45 minuten naar een andere tafel.`,
          },
        ],
      },
      {
        day: 3,
        title: 'Capstone Presentaties & RALF Retrospective',
        schedule: [
          { time: '09:00 - 09:30', emoji: '☕', label: 'Laatste prep & setup', type: 'checkin' },
          { time: '09:30 - 11:30', emoji: '⚡', label: 'Capstone Presentaties (3 squads × 30 min)', type: 'demo' },
          { time: '11:30 - 12:00', emoji: '🏆', label: 'Awards & Badge Ceremony', type: 'wrapup' },
          { time: '12:00 - 13:00', emoji: '🍽️', label: 'Lunch', type: 'lunch' },
          { time: '13:00 - 14:30', emoji: '🔄', label: 'RALF Retrospective — Volledig Programma', type: 'review' },
          { time: '14:30 - 15:30', emoji: '📋', label: 'Wave 2 Preview & Champion Selectie', type: 'wrapup' },
          { time: '15:30 - 16:00', emoji: '🎉', label: 'Afsluiting & Borrel', type: 'checkin' },
        ],
        lessons: [
          {
            id: 'w8d3-capstone',
            title: 'Capstone Presentaties',
            type: 'demo',
            duration: 120,
            description: 'Elk squad presenteert hun AI-workflow improvement project.',
            content: `# Mini-Capstone

## De Opdracht

Elk squad heeft de afgelopen weken gewerkt aan een concreet project:
**"Verbeter één workflow in jullie dagelijks werk met AI."**

## Presentatie Format (30 min per squad)

1. **Het probleem** (5 min): Welke workflow was inefficiënt?
2. **De oplossing** (10 min): Hoe hebben jullie AI geïntegreerd?
3. **Live demo** (10 min): Toon de nieuwe workflow in actie
4. **Resultaten** (5 min): Meetbare verbetering + lessons learned

## Evaluatie Criteria

- **Impact**: Hoeveel tijd/kwaliteit wordt bespaard?
- **Reproduceerbaarheid**: Kunnen andere teams dit overnemen?
- **Creativiteit**: Innovatief gebruik van AI-tools
- **Presentatie**: Helder, beknopt, overtuigend

## Awards

- 🥇 **Best Overall**: Beste combinatie van alle criteria
- 🚀 **Most Innovative**: Meest creatieve AI-toepassing
- 📊 **Biggest Impact**: Grootste meetbare verbetering
- 🤝 **Best Team Effort**: Beste samenwerking en kennisdeling`,
            exercises: [
              {
                id: 'w8d3-ex1',
                title: 'Capstone Presentatie',
                instructions: 'Bereid de capstone presentatie voor: probleem, oplossing, live demo, en resultaten. Upload je presentatie materiaal en een kort verslag van de resultaten.',
                type: 'peer-review' as const,
                difficulty: 4,
                points: 50,
              },
            ],
          },
          {
            id: 'w8d3-retro',
            title: 'RALF Retrospective — Het Volledige Programma',
            type: 'review',
            duration: 90,
            description: 'Volledige RALF retrospective over alle 9 weken.',
            content: `# RALF Retrospective

## Review: Wat hebben we bereikt?
- Hoeveel engineers zijn getraind?
- Wat zijn de adoption metrics?
- Welke KPIs zijn verbeterd?

## Analyze: Wat werkte, wat niet?
- Welke onderdelen van het curriculum waren het meest waardevol?
- Waar hadden we meer tijd nodig?
- Wat was overbodig?

## Learn: Wat nemen we mee?
- Top 3 inzichten voor Wave 2
- Feedback voor het curriculum
- Suggesties voor tooling/infrastructure

## Fix: Wat gaan we veranderen?
- Curriculum aanpassingen voor Wave 2
- Nieuwe tools of workflows
- Organisatorische veranderingen

## Champion Selectie

Per squad worden 2-3 AI Champions geselecteerd:
- Criteria: enthousiasme, kennis, bereidheid om anderen te helpen
- Rol in Wave 2: buddy system voor nieuwe squads
- Ongoing: maandelijkse AI community meetup`,
          },
        ],
      },
    ],
  },
];

// Helper function to generate coaching day structure
function generateCoachingDays(
  weekStart: number,
  _squad: string,
  dayConfigs: Array<{
    dayTitle: string;
    theoryTitle: string;
    theoryContent: string;
    labTitle: string;
    labContent: string;
    exercise: CurriculumExercise;
  }>
): CurriculumDay[] {
  return dayConfigs.map((config, index) => ({
    day: index + 1,
    title: config.dayTitle,
    schedule: dailySchedule,
    lessons: [
      {
        id: `w${weekStart}d${index + 1}-theory`,
        title: config.theoryTitle,
        type: 'theory' as const,
        duration: 30,
        description: `Theorie sessie: ${config.theoryTitle}`,
        content: config.theoryContent,
      },
      {
        id: `w${weekStart}d${index + 1}-lab`,
        title: config.labTitle,
        type: 'lab' as const,
        duration: 240,
        description: `Hands-on lab: ${config.labTitle}`,
        content: config.labContent,
        exercises: [config.exercise],
      },
    ],
  }));
}

// Get all lessons flat
export function getAllLessons(): CurriculumLesson[] {
  return curriculum.flatMap((week) =>
    week.days.flatMap((day) => day.lessons)
  );
}

// Get all exercises flat
export function getAllExercises(): CurriculumExercise[] {
  return getAllLessons().flatMap((lesson) => lesson.exercises ?? []);
}

// Find week by ID
export function getWeekById(id: string): CurriculumWeek | undefined {
  return curriculum.find((w) => w.id === id);
}

// Find lesson by ID
export function getLessonById(id: string): CurriculumLesson | undefined {
  return getAllLessons().find((l) => l.id === id);
}
