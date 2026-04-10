# Worldline AI-First Academy — System Architecture

**Client:** Worldline (Gertjan Dewaele, VP Product & Technology)
**AetherLink:** Constance van der Vlist
**Wave 1:** April–June 2026 | ~30 devs | 3 squads | EUR 40K
**Stack:** Next.js 14 App Router + TypeScript strict + Tailwind + shadcn/ui + Supabase + Vercel
**Authored by:** Senior Architect, AetherLink B.V.
**Date:** March 2026

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Database Schema](#2-database-schema)
3. [Route Structure](#3-route-structure)
4. [Component Architecture](#4-component-architecture)
5. [Auth Flow](#5-auth-flow)
6. [API Routes](#6-api-routes)
7. [AI Tutor Integration](#7-ai-tutor-integration)
8. [EU AI Act Compliance](#8-eu-ai-act-compliance)
9. [File Structure](#9-file-structure)
10. [Data Flow Diagrams](#10-data-flow-diagrams)
11. [Deployment Architecture](#11-deployment-architecture)
12. [Trade-off Log](#12-trade-off-log)

---

## 1. System Overview

### Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| `student` | Worldline developer enrolled in Wave 1 | Own progress, lessons, AI tutor, Q&A |
| `instructor` | AetherLink consultant (Constance + team) | All student data, content management, scheduling |
| `admin` | AetherLink super admin | Full system access, user management |

### Core Domains

```
┌─────────────────────────────────────────────────────────────────┐
│                    WORLDLINE AI-FIRST ACADEMY                    │
├────────────────┬───────────────┬───────────────┬────────────────┤
│  AUTH DOMAIN   │ CONTENT DOMAIN│ PROGRESS DOMAIN│  AI DOMAIN    │
│                │               │                │               │
│ Supabase Auth  │ Lessons        │ Enrollments    │ AI Tutor      │
│ Worldline SSO  │ Modules        │ Completions    │ (Anthropic)   │
│ (Wave 2)       │ Exercises      │ Exercise scores│ Interaction   │
│ RBAC           │ Videos         │ Badges         │ logs          │
│                │ Resources      │ Squad progress │ (anonymized)  │
└────────────────┴───────────────┴───────────────┴────────────────┘
```

### Squad Program Timeline

```
Week 1:   Management training (all squads present)
Week 2-3: Squad A — Intensive (on-site + remote)
Week 4-5: Squad B — Intensive (on-site + remote)
Week 6-7: Squad C — Intensive (on-site + remote)
Week 8-9: Consolidation — office hours all squads
```

---

## 2. Database Schema

### Core Tables

```sql
-- ============================================================
-- USERS & ROLES
-- ============================================================

-- Extends Supabase auth.users
create table public.profiles (
  id            uuid references auth.users(id) on delete cascade primary key,
  email         text not null unique,
  full_name     text not null,
  avatar_url    text,
  role          text not null default 'student' check (role in ('student', 'instructor', 'admin')),
  squad_id      uuid references public.squads(id) on delete set null,
  job_title     text,                          -- e.g. "Senior Backend Engineer"
  department    text,                          -- e.g. "Platform Engineering"
  -- GDPR: minimal data, Worldline employee context only
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- SQUADS (3 squads in Wave 1)
-- ============================================================

create table public.squads (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,                -- "Squad Alpha", "Squad Beta", "Squad Gamma"
  code          text not null unique,         -- "A", "B", "C"
  wave          integer not null default 1,
  intensive_start date,                       -- Week when their 2-week block starts
  intensive_end   date,
  status        text not null default 'pending'
                check (status in ('pending', 'active', 'consolidation', 'completed')),
  created_at    timestamptz not null default now()
);

-- ============================================================
-- CURRICULUM STRUCTURE
-- ============================================================

create table public.modules (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,               -- "Prompt Engineering", "Context Engineering"
  slug          text not null unique,
  description   text,
  order_index   integer not null,
  is_published  boolean not null default false,
  -- Visibility: 'all' = all squads, or specific squad phases
  target_week   integer,                     -- Which program week this unlocks
  created_by    uuid references public.profiles(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.lessons (
  id            uuid primary key default gen_random_uuid(),
  module_id     uuid not null references public.modules(id) on delete cascade,
  title         text not null,
  slug          text not null unique,
  description   text,
  content_type  text not null check (content_type in ('text', 'video', 'exercise', 'mixed')),
  content_body  jsonb,                       -- Rich text (Tiptap JSON) or video embed metadata
  video_url     text,                        -- Signed Supabase Storage URL or external CDN
  duration_min  integer,                     -- Estimated reading/watch minutes
  order_index   integer not null,
  is_published  boolean not null default false,
  requires_lesson_id uuid references public.lessons(id), -- Prerequisite
  created_by    uuid references public.profiles(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table public.exercises (
  id            uuid primary key default gen_random_uuid(),
  lesson_id     uuid not null references public.lessons(id) on delete cascade,
  title         text not null,
  instructions  text not null,
  exercise_type text not null check (exercise_type in (
    'prompt_challenge',    -- Write a prompt, AI evaluates
    'context_build',       -- Build a context window
    'intent_map',          -- Map intent to specification
    'spec_write',          -- Write a spec, AI reviews
    'reflection'           -- Free-text reflection
  )),
  rubric        jsonb,                       -- Evaluation criteria for AI scorer
  example_solution text,                    -- Shown after submission
  order_index   integer not null,
  created_at    timestamptz not null default now()
);

create table public.resources (
  id            uuid primary key default gen_random_uuid(),
  lesson_id     uuid references public.lessons(id) on delete cascade,
  module_id     uuid references public.modules(id) on delete cascade,
  title         text not null,
  resource_type text not null check (resource_type in ('pdf', 'link', 'template', 'cheatsheet')),
  url           text not null,
  is_downloadable boolean not null default true,
  created_at    timestamptz not null default now(),
  -- At least one of lesson_id or module_id must be set
  check (lesson_id is not null or module_id is not null)
);

-- ============================================================
-- PROGRESS TRACKING
-- ============================================================

create table public.enrollments (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.profiles(id) on delete cascade,
  module_id     uuid not null references public.modules(id) on delete cascade,
  enrolled_at   timestamptz not null default now(),
  completed_at  timestamptz,
  unique(student_id, module_id)
);

create table public.lesson_progress (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.profiles(id) on delete cascade,
  lesson_id     uuid not null references public.lessons(id) on delete cascade,
  status        text not null default 'not_started'
                check (status in ('not_started', 'in_progress', 'completed')),
  started_at    timestamptz,
  completed_at  timestamptz,
  time_spent_sec integer not null default 0,
  unique(student_id, lesson_id)
);

create table public.exercise_submissions (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.profiles(id) on delete cascade,
  exercise_id   uuid not null references public.exercises(id) on delete cascade,
  submission    text not null,               -- Student's answer/prompt/spec
  -- AI evaluation (stored but anonymized in analytics views)
  ai_feedback   jsonb,                       -- { score: 0-100, strengths: [], improvements: [], passed: bool }
  ai_model_used text,                        -- e.g. "claude-sonnet-4-6" — for EU AI Act transparency
  score         integer check (score between 0 and 100),
  passed        boolean,
  attempt_number integer not null default 1,
  submitted_at  timestamptz not null default now()
);

-- ============================================================
-- BADGES & ACHIEVEMENTS
-- ============================================================

create table public.badges (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,              -- "Prompt Master", "Context Architect"
  description   text not null,
  icon_url      text,
  criteria      jsonb not null,             -- { type: 'lessons_completed', threshold: 5, module_slug: 'prompt-engineering' }
  badge_type    text not null check (badge_type in ('milestone', 'excellence', 'participation', 'squad')),
  created_at    timestamptz not null default now()
);

create table public.student_badges (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.profiles(id) on delete cascade,
  badge_id      uuid not null references public.badges(id) on delete cascade,
  awarded_at    timestamptz not null default now(),
  awarded_by    text not null default 'system' check (awarded_by in ('system', 'instructor')),
  unique(student_id, badge_id)
);

-- ============================================================
-- SESSIONS & SCHEDULING
-- ============================================================

create table public.sessions (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  session_type  text not null check (session_type in ('onsite', 'remote', 'office_hours')),
  squad_id      uuid references public.squads(id) on delete set null, -- null = all squads
  instructor_id uuid not null references public.profiles(id),
  scheduled_start timestamptz not null,
  scheduled_end   timestamptz not null,
  location      text,                        -- "Hoofddorp HQ Room 3A" or Teams link
  meeting_url   text,
  recording_url text,                        -- Post-session recording
  status        text not null default 'scheduled'
                check (status in ('scheduled', 'live', 'completed', 'cancelled')),
  created_at    timestamptz not null default now()
);

create table public.session_attendance (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references public.sessions(id) on delete cascade,
  student_id    uuid not null references public.profiles(id) on delete cascade,
  attended      boolean,
  joined_at     timestamptz,
  unique(session_id, student_id)
);

-- ============================================================
-- AI TUTOR — INTERACTION LOGS (GDPR/EU AI Act compliant)
-- ============================================================

create table public.ai_interactions (
  id              uuid primary key default gen_random_uuid(),
  -- GDPR: student_id is stored but never exposed in analytics views
  -- Analytics always use anonymized_id
  student_id      uuid not null references public.profiles(id) on delete cascade,
  anonymized_id   text not null,             -- sha256(student_id + daily_salt) — regenerated daily
  lesson_id       uuid references public.lessons(id) on delete set null,
  exercise_id     uuid references public.exercises(id) on delete set null,
  interaction_type text not null check (interaction_type in (
    'tutor_question',       -- Student asks tutor a question
    'exercise_feedback',    -- AI evaluates an exercise
    'concept_explanation',  -- AI explains a concept
    'hint_request'          -- Student requests a hint
  )),
  -- GDPR: messages stored encrypted, key managed via Supabase Vault
  user_message    text not null,             -- Stored encrypted
  ai_response     text not null,             -- Stored encrypted
  model_used      text not null,             -- Transparency: which model answered
  tokens_input    integer,
  tokens_output   integer,
  latency_ms      integer,
  flagged         boolean not null default false,  -- Moderation flag
  created_at      timestamptz not null default now()
);

-- ============================================================
-- Q&A PER LESSON (Discussion)
-- ============================================================

create table public.lesson_discussions (
  id            uuid primary key default gen_random_uuid(),
  lesson_id     uuid not null references public.lessons(id) on delete cascade,
  author_id     uuid not null references public.profiles(id) on delete cascade,
  parent_id     uuid references public.lesson_discussions(id) on delete cascade, -- Threading
  body          text not null,
  is_pinned     boolean not null default false,
  is_answered   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES (key policies)
-- ============================================================

-- Students can only see their own progress
alter table public.lesson_progress enable row level security;
create policy "students_own_progress" on public.lesson_progress
  for all using (auth.uid() = student_id);
create policy "instructors_all_progress" on public.lesson_progress
  for select using (
    exists(select 1 from public.profiles where id = auth.uid() and role in ('instructor', 'admin'))
  );

-- AI interactions: students see own, analytics uses anonymized view
alter table public.ai_interactions enable row level security;
create policy "students_own_interactions" on public.ai_interactions
  for select using (auth.uid() = student_id);
create policy "instructors_anonymized_only" on public.ai_interactions
  for select using (
    exists(select 1 from public.profiles where id = auth.uid() and role in ('instructor', 'admin'))
  );

-- ============================================================
-- ANALYTICS VIEWS (anonymized for instructors)
-- ============================================================

create or replace view public.squad_progress_view as
select
  sq.id as squad_id,
  sq.name as squad_name,
  sq.code as squad_code,
  sq.status as squad_status,
  count(distinct p.id) as student_count,
  count(distinct lp.lesson_id) filter (where lp.status = 'completed') as lessons_completed,
  avg(es.score) as avg_exercise_score,
  count(distinct es.id) filter (where es.passed = true) as exercises_passed
from public.squads sq
left join public.profiles p on p.squad_id = sq.id and p.role = 'student'
left join public.lesson_progress lp on lp.student_id = p.id
left join public.exercise_submissions es on es.student_id = p.id
group by sq.id, sq.name, sq.code, sq.status;

-- Anonymized AI interaction analytics (no PII)
create or replace view public.ai_interaction_analytics as
select
  date_trunc('day', created_at) as day,
  lesson_id,
  interaction_type,
  model_used,
  count(*) as interaction_count,
  avg(tokens_input) as avg_tokens_in,
  avg(tokens_output) as avg_tokens_out,
  avg(latency_ms) as avg_latency_ms,
  count(*) filter (where flagged = true) as flagged_count
  -- student_id intentionally excluded
from public.ai_interactions
group by date_trunc('day', created_at), lesson_id, interaction_type, model_used;
```

### Indexes

```sql
create index idx_lesson_progress_student on public.lesson_progress(student_id);
create index idx_lesson_progress_lesson on public.lesson_progress(lesson_id);
create index idx_exercise_submissions_student on public.exercise_submissions(student_id);
create index idx_exercise_submissions_exercise on public.exercise_submissions(exercise_id);
create index idx_ai_interactions_student on public.ai_interactions(student_id);
create index idx_ai_interactions_lesson on public.ai_interactions(lesson_id);
create index idx_ai_interactions_created on public.ai_interactions(created_at desc);
create index idx_lessons_module on public.lessons(module_id);
create index idx_profiles_squad on public.profiles(squad_id);
create index idx_discussions_lesson on public.lesson_discussions(lesson_id);
```

---

## 3. Route Structure

```
app/
├── (auth)/
│   ├── login/                    # Supabase Auth email login
│   ├── signup/                   # Invite-only signup (instructor creates accounts)
│   └── callback/                 # OAuth/SSO callback handler
│
├── (student)/                    # Layout: student nav + sidebar
│   ├── dashboard/                # Personal home: progress, next lesson, upcoming sessions
│   ├── modules/
│   │   ├── page.tsx              # All modules overview
│   │   └── [moduleSlug]/
│   │       ├── page.tsx          # Module overview + lesson list
│   │       └── lessons/
│   │           └── [lessonSlug]/
│   │               ├── page.tsx  # Lesson content (text/video)
│   │               └── exercise/ # Interactive exercise within lesson
│   │                   └── page.tsx
│   ├── progress/                 # Personal progress dashboard
│   │   └── page.tsx
│   ├── tutor/                    # AI Tutor chat interface
│   │   └── page.tsx
│   ├── sessions/                 # Upcoming + past sessions calendar
│   │   └── page.tsx
│   └── badges/                   # Achievements & badges
│       └── page.tsx
│
├── (instructor)/                 # Layout: instructor nav + admin sidebar
│   ├── dashboard/                # Instructor home: squad overview, alerts
│   ├── students/
│   │   ├── page.tsx              # All students table
│   │   └── [studentId]/
│   │       └── page.tsx          # Individual student progress
│   ├── squads/
│   │   ├── page.tsx              # 3 squads overview
│   │   └── [squadCode]/
│   │       └── page.tsx          # Squad detail: members, progress, schedule
│   ├── content/
│   │   ├── modules/
│   │   │   ├── page.tsx          # Module list + create
│   │   │   └── [moduleId]/
│   │   │       ├── page.tsx      # Edit module
│   │   │       └── lessons/
│   │   │           ├── page.tsx  # Lesson list
│   │   │           └── [lessonId]/
│   │   │               └── page.tsx # Lesson editor (Tiptap)
│   │   └── exercises/
│   │       └── page.tsx
│   ├── sessions/
│   │   ├── page.tsx              # Schedule view
│   │   └── new/
│   │       └── page.tsx          # Create session
│   ├── analytics/
│   │   ├── page.tsx              # Overview: completion rates, AI usage
│   │   └── ai-interactions/
│   │       └── page.tsx          # Anonymized AI log viewer
│   └── users/
│       ├── page.tsx              # User management (admin only)
│       └── invite/
│           └── page.tsx
│
└── api/                          # Route Handlers
    ├── auth/
    │   └── callback/route.ts
    ├── progress/
    │   ├── lesson/route.ts
    │   └── exercise/route.ts
    ├── ai/
    │   ├── tutor/route.ts        # AI Tutor chat (streaming)
    │   └── evaluate/route.ts     # Exercise evaluation
    ├── sessions/
    │   └── route.ts
    └── badges/
        └── award/route.ts
```

---

## 4. Component Architecture

### Design System Foundation

All components use shadcn/ui primitives + Tailwind. The brand palette follows Worldline blue (`#0066FF`) with neutral grays.

```
src/components/
├── ui/                           # shadcn/ui base components (Button, Card, Badge, etc.)
│
├── layout/
│   ├── StudentLayout.tsx         # Sidebar nav + header for student views
│   ├── InstructorLayout.tsx      # Sidebar nav + header for instructor views
│   ├── AppSidebar.tsx            # Role-aware sidebar (server component)
│   └── TopBar.tsx                # Progress indicator + user menu
│
├── auth/
│   ├── LoginForm.tsx             # Email/password form
│   ├── AuthGuard.tsx             # Client-side role protection wrapper
│   └── UserAvatar.tsx
│
├── lesson/
│   ├── LessonContent.tsx         # Rich text renderer (Tiptap JSON → HTML)
│   ├── VideoPlayer.tsx           # Video embed with progress tracking
│   ├── LessonProgress.tsx        # Progress bar + completion button
│   ├── ResourceList.tsx          # Downloadable resources sidebar
│   └── LessonNavigation.tsx      # Prev/Next lesson buttons
│
├── exercise/
│   ├── ExerciseShell.tsx         # Wrapper with instructions + submission area
│   ├── PromptChallengeExercise.tsx   # Textarea + submit + streaming AI feedback
│   ├── ContextBuildExercise.tsx      # Multi-field context builder
│   ├── SpecWriteExercise.tsx         # Structured spec editor
│   ├── ReflectionExercise.tsx        # Free-text reflection
│   ├── AIFeedbackPanel.tsx           # Displays AI evaluation result
│   └── ExerciseHistory.tsx           # Past attempts
│
├── tutor/
│   ├── TutorChat.tsx             # Main chat interface ('use client')
│   ├── TutorMessage.tsx          # Individual message bubble
│   ├── TutorInput.tsx            # Input + send button
│   ├── TutorContext.tsx          # Shows which lesson/module tutor is aware of
│   └── TutorDisclaimer.tsx       # EU AI Act transparency notice
│
├── progress/
│   ├── ProgressRing.tsx          # SVG circular progress indicator
│   ├── ModuleProgressCard.tsx    # Module completion status
│   ├── StreakTracker.tsx          # Daily learning streak
│   └── BadgeGrid.tsx             # Earned badges display
│
├── dashboard/
│   ├── student/
│   │   ├── NextLessonCard.tsx    # "Continue where you left off"
│   │   ├── UpcomingSessionCard.tsx
│   │   └── SquadActivityFeed.tsx # Realtime: squad members completing lessons
│   └── instructor/
│       ├── SquadStatusGrid.tsx   # 3 squads × timeline status (server component)
│       ├── ProgressHeatmap.tsx   # Student completion matrix
│       ├── AIUsageChart.tsx      # Anonymized AI interaction volume
│       ├── ExerciseCompletionBar.tsx
│       └── AlertsList.tsx        # Students falling behind, flagged interactions
│
├── sessions/
│   ├── SessionCalendar.tsx       # Calendar view with on-site/remote indicators
│   ├── SessionCard.tsx           # Single session card
│   └── SessionForm.tsx           # Create/edit session (instructor)
│
└── discussion/
    ├── DiscussionThread.tsx       # Lesson Q&A thread
    ├── DiscussionPost.tsx         # Single post with reply
    └── DiscussionComposer.tsx     # New question form
```

### Server vs Client Component Split

| Component Type | Strategy | Examples |
|----------------|----------|---------|
| Data display | Server Component — fetch on server | LessonContent, SquadStatusGrid, ResourceList |
| Interactive UI | Client Component | TutorChat, ExerciseShell, SessionCalendar |
| Forms | Client Component | LoginForm, SessionForm, ExerciseShell |
| Realtime | Client Component + Supabase Realtime | SquadActivityFeed, AIUsageChart |
| Layout/Nav | Server Component (role check server-side) | StudentLayout, AppSidebar |

---

## 5. Auth Flow

### Wave 1: Supabase Auth (Email-based, invite-only)

```
Instructor creates student account
  → Supabase Admin API: createUser({ email, password, metadata: { role: 'student', squad_id } })
  → Supabase sends "Set your password" email
  → Student clicks link → /auth/callback → session established
  → Middleware checks profile.role → routes to (student) layout
```

### Middleware (Next.js)

```typescript
// src/middleware.ts
// Checks Supabase session on every request
// Routes:
//   No session → /login
//   student role → allow (student)/* only
//   instructor/admin role → allow both (student)/* and (instructor)/*
```

### Wave 2: Enterprise SSO (Worldline Azure AD / Entra ID)

Supabase supports SAML 2.0 via Auth0 or direct SAML provider. The migration path:
1. Add `external_id` column to `profiles` (Azure AD object ID)
2. Configure Supabase SAML provider with Worldline's IdP metadata
3. Auto-provision profiles on first SSO login via `on_auth_user_created` trigger
4. Keep email-based accounts active during transition

### Session Management

```
Token storage: Supabase PKCEflow (httpOnly cookies via @supabase/ssr)
Session refresh: Automatic via middleware
Role claim: Stored in profiles table + checked server-side on every route
```

---

## 6. API Routes

All routes validate the Supabase session via `createServerClient`. Role enforcement is server-side.

### Progress API

```typescript
// POST /api/progress/lesson
// Body: { lessonId: string, status: 'in_progress' | 'completed', timeSpentSec: number }
// Auth: student only
// Side effects: trigger badge check via /api/badges/award

// POST /api/progress/exercise
// Body: { exerciseId: string, submission: string }
// Auth: student only
// Side effects: calls /api/ai/evaluate, stores result, triggers badge check
```

### AI Routes

```typescript
// POST /api/ai/tutor (streaming)
// Body: { messages: ChatMessage[], lessonId?: string, exerciseId?: string }
// Auth: student only
// Behavior:
//   1. Validate session
//   2. Build system prompt with curriculum context (lesson content injected)
//   3. Call Anthropic API with prompt caching on system prompt
//   4. Stream response back via ReadableStream
//   5. After stream: log interaction to ai_interactions (with anonymized_id)
//   6. Run content moderation check (Anthropic's built-in + custom keyword filter)

// POST /api/ai/evaluate
// Body: { exerciseId: string, submission: string }
// Auth: student or system (called from /api/progress/exercise)
// Behavior:
//   1. Load exercise rubric from DB
//   2. Build evaluation prompt with rubric + submission
//   3. Call Anthropic API (non-streaming, structured output via tool_use)
//   4. Return: { score, passed, strengths[], improvements[], feedback }
//   5. Log to ai_interactions
```

### Sessions API

```typescript
// GET /api/sessions — list sessions (student: own squad, instructor: all)
// POST /api/sessions — create session (instructor only)
// PATCH /api/sessions/[id] — update session (instructor only)
// POST /api/sessions/[id]/attend — mark attendance
```

### Badges API

```typescript
// POST /api/badges/award
// Internal route called after lesson/exercise completion
// Checks all badge criteria against student's current progress
// Awards new badges via Supabase, triggers realtime notification
```

### Content API (instructor only)

```typescript
// CRUD /api/content/modules
// CRUD /api/content/lessons
// CRUD /api/content/exercises
// POST /api/content/publish — toggle published state
// POST /api/users/invite — invite student (sends Supabase invite email)
```

---

## 7. AI Tutor Integration

### Architecture

```
Student types question in TutorChat
  ↓
POST /api/ai/tutor (streaming route handler)
  ↓
Server: build system prompt
  [CURRICULUM CONTEXT — cached via prompt caching]
  + lesson content if lessonId provided
  + exercise rubric if exerciseId provided
  + GUARDRAILS: scope to curriculum only
  ↓
Anthropic SDK: messages.stream()
  ↓
ReadableStream → TutorChat (useChat pattern)
  ↓
After stream closes: log to ai_interactions (anonymized_id)
```

### System Prompt Architecture

```
TIER 1: Static identity + scope (CACHED — longest prefix)
  "You are the AI learning assistant for the Worldline AI-First Academy...
   You may ONLY answer questions about: prompt engineering, context engineering,
   intent engineering, specification engineering, and AI adoption in software teams.
   You must NEVER answer questions outside this curriculum scope..."

TIER 2: Curriculum content (CACHED — changes per module)
  [Injected module/lesson content summary]
  [Key concepts + definitions from current module]

TIER 3: Dynamic context (NOT cached)
  [Current lesson title + description]
  [Exercise rubric if in exercise context]
  [Conversation history]
```

### Cost Optimization

- Prompt caching on Tier 1 + Tier 2 (saves ~70% of input token cost for tutor calls)
- Model: `claude-haiku-4` for tutor questions (fast, cheap, adequate for educational Q&A)
- Model: `claude-sonnet-4-6` for exercise evaluation (requires nuanced judgment)
- Rate limit per student: 50 tutor messages/day (prevents abuse, controlled cost)

### Exercise Evaluation (Structured Output)

```typescript
// Uses Anthropic tool_use for deterministic structured output
const evaluationTool = {
  name: "evaluate_exercise",
  description: "Evaluate a student exercise submission against the rubric",
  input_schema: {
    type: "object",
    properties: {
      score: { type: "integer", minimum: 0, maximum: 100 },
      passed: { type: "boolean" },
      strengths: { type: "array", items: { type: "string" } },
      improvements: { type: "array", items: { type: "string" } },
      specific_feedback: { type: "string" },
      rubric_scores: {
        type: "object",
        description: "Score per rubric criterion"
      }
    },
    required: ["score", "passed", "strengths", "improvements", "specific_feedback"]
  }
}
```

### Guardrails

1. **Scope enforcement** — System prompt explicitly limits topics to curriculum
2. **Content moderation** — Anthropic's built-in safety + custom word filter for non-curriculum topics
3. **Hallucination mitigation** — Tutor is instructed to say "I don't know" rather than invent
4. **No PII generation** — System prompt prohibits asking for or repeating personal information
5. **Audit trail** — Every interaction logged (EU AI Act Article 13: transparency)

---

## 8. EU AI Act Compliance

The AI Tutor qualifies as a **Limited Risk AI System** (EU AI Act Article 50) — it interacts with humans and must be transparent about being AI.

### Required Measures

| Article | Requirement | Implementation |
|---------|-------------|----------------|
| Art. 50 | Disclose AI identity | TutorDisclaimer component shown at chat start |
| Art. 13 | Transparency & explainability | AIFeedbackPanel shows which criteria were evaluated |
| Art. 14 | Human oversight | Instructors can review AI interactions (anonymized) + override grades |
| Art. 9 | Risk management | Guardrails in system prompt, moderation logging |
| GDPR Art. 5 | Data minimization | Minimal PII in profiles, anonymized analytics views |
| GDPR Art. 17 | Right to erasure | Cascade deletes on profiles → all related data deleted |
| GDPR Art. 30 | Records of processing | ai_interactions table with model_used, created_at, interaction_type |

### Data Residency

- Supabase project: **EU region** (eu-west-1 or eu-central-1)
- Anthropic API: data processed in US — covered by Anthropic's Data Processing Agreement (DPA)
- No student data stored outside EU except in-transit to Anthropic for AI processing
- Document in Worldline DPA that Anthropic is a sub-processor

### Anonymization Strategy

```typescript
// Daily salt rotation for anonymized_id
// Prevents linking interactions across days while still allowing daily analytics
function generateAnonymizedId(studentId: string, date: Date): string {
  const dailySalt = process.env.ANONYMIZATION_SALT + date.toISOString().split('T')[0]
  return crypto.createHash('sha256').update(studentId + dailySalt).digest('hex').slice(0, 16)
}
```

### Bias Prevention

1. Exercise rubrics are explicit and criterion-based (not open-ended judgment)
2. AI evaluations can be challenged/overridden by instructors
3. No demographic data used in AI evaluation prompts
4. Regular audit: compare AI scores vs instructor manual spot-checks

---

## 9. File Structure

```
worldline-ai-first-academy/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── callback/route.ts
│   │   ├── (student)/
│   │   │   ├── layout.tsx           # StudentLayout
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── modules/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [moduleSlug]/
│   │   │   │       ├── page.tsx
│   │   │   │       └── lessons/[lessonSlug]/
│   │   │   │           ├── page.tsx
│   │   │   │           └── exercise/page.tsx
│   │   │   ├── progress/page.tsx
│   │   │   ├── tutor/page.tsx
│   │   │   ├── sessions/page.tsx
│   │   │   └── badges/page.tsx
│   │   ├── (instructor)/
│   │   │   ├── layout.tsx           # InstructorLayout
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── students/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [studentId]/page.tsx
│   │   │   ├── squads/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [squadCode]/page.tsx
│   │   │   ├── content/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [moduleId]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── lessons/
│   │   │   │   │           ├── page.tsx
│   │   │   │   │           └── [lessonId]/page.tsx
│   │   │   │   └── exercises/page.tsx
│   │   │   ├── sessions/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   ├── analytics/
│   │   │   │   ├── page.tsx
│   │   │   │   └── ai-interactions/page.tsx
│   │   │   └── users/
│   │   │       ├── page.tsx
│   │   │       └── invite/page.tsx
│   │   └── api/
│   │       ├── auth/callback/route.ts
│   │       ├── progress/
│   │       │   ├── lesson/route.ts
│   │       │   └── exercise/route.ts
│   │       ├── ai/
│   │       │   ├── tutor/route.ts
│   │       │   └── evaluate/route.ts
│   │       ├── sessions/route.ts
│   │       ├── badges/award/route.ts
│   │       ├── content/
│   │       │   ├── modules/route.ts
│   │       │   ├── lessons/route.ts
│   │       │   └── exercises/route.ts
│   │       └── users/invite/route.ts
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   ├── layout/
│   │   │   ├── StudentLayout.tsx
│   │   │   ├── InstructorLayout.tsx
│   │   │   └── TopBar.tsx
│   │   ├── auth/
│   │   ├── lesson/
│   │   ├── exercise/
│   │   ├── tutor/
│   │   ├── progress/
│   │   ├── dashboard/
│   │   │   ├── student/
│   │   │   └── instructor/
│   │   ├── sessions/
│   │   └── discussion/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Browser Supabase client
│   │   │   ├── server.ts            # Server Supabase client (RSC)
│   │   │   └── middleware.ts        # Session refresh helper
│   │   ├── ai/
│   │   │   ├── anthropic.ts         # Anthropic SDK instance
│   │   │   ├── tutor-prompt.ts      # System prompt builder
│   │   │   ├── evaluate-prompt.ts   # Exercise evaluation prompt
│   │   │   └── anonymize.ts         # Anonymized ID generation
│   │   ├── badges/
│   │   │   └── check-criteria.ts    # Badge awarding logic
│   │   └── utils.ts
│   │
│   ├── types/
│   │   ├── database.types.ts        # Generated from Supabase CLI: supabase gen types
│   │   ├── ai.ts                    # AI interaction types
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   ├── useProgress.ts           # Client-side progress tracking hook
│   │   ├── useRealtimeSquad.ts      # Supabase Realtime squad feed
│   │   └── useAITutor.ts            # Streaming chat hook
│   │
│   └── middleware.ts                # Auth + role-based routing
│
├── supabase/
│   ├── migrations/
│   │   ├── 0001_initial_schema.sql
│   │   ├── 0002_rls_policies.sql
│   │   ├── 0003_analytics_views.sql
│   │   └── 0004_seed_wave1.sql      # Squads, badges, initial modules
│   └── seed.sql
│
├── .env.local                       # NEVER commit
├── .env.example                     # Committed — shows required vars without values
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── ARCHITECTURE.md                  # This file
```

---

## 10. Data Flow Diagrams

### Student Lesson Completion Flow

```
Student visits /modules/prompt-engineering/lessons/intro-to-prompts
  ↓
Server Component: fetch lesson + student progress from Supabase
  ↓
Render: LessonContent + VideoPlayer + ExerciseShell
  ↓
Student watches video / reads content
  ↓
Client: POST /api/progress/lesson { status: 'completed', timeSpentSec: 420 }
  ↓
Server: update lesson_progress → check badge criteria → award badges
  ↓
Supabase Realtime: broadcast to squad channel → SquadActivityFeed updates
  ↓
Student sees badge notification + progress ring updates
```

### AI Tutor Flow

```
Student types: "What's the difference between a system prompt and a user prompt?"
  ↓
TutorChat (client) → POST /api/ai/tutor (streaming)
  ↓
Server builds prompt:
  [CACHED] System identity + curriculum scope
  [CACHED] Current module content summary
  [DYNAMIC] Conversation history + current question
  ↓
Anthropic SDK: stream with claude-haiku-4
  ↓
ReadableStream chunks → TutorMessage renders progressively
  ↓
Stream completes → log to ai_interactions (anonymized_id, NOT student name)
  ↓
Run moderation check (async, non-blocking)
```

### Instructor Analytics Flow

```
Instructor visits /instructor/analytics
  ↓
Server Component: query squad_progress_view + ai_interaction_analytics view
  ↓
Render: SquadStatusGrid + ProgressHeatmap + AIUsageChart
  ↓
Supabase Realtime subscription: live updates as students complete lessons
  ↓
No individual AI messages visible — only aggregated anonymized stats
```

---

## 11. Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       VERCEL EDGE                        │
│                                                          │
│  Next.js 14 App (EU region — iad1 or fra1)               │
│  ├── Static assets (CDN global)                          │
│  ├── Server Components (EU edge functions)               │
│  ├── API Routes (EU edge functions)                      │
│  └── Middleware (auth check, role routing)               │
└─────────────────────┬───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
  Supabase (EU)   Anthropic API   Supabase Storage
  ├── PostgreSQL   (claude-haiku   (video files,
  ├── Auth         + sonnet)       PDFs, resources)
  └── Realtime
```

### Environment Variables

```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Server-side only — never exposed to client
ANTHROPIC_API_KEY=                  # Server-side only
ANONYMIZATION_SALT=                 # Random 32-byte hex string
NEXT_PUBLIC_APP_URL=                # https://academy.aetherlink.ai
```

---

## 12. Trade-off Log

### 1. Video hosting: Supabase Storage vs. dedicated video platform

| Option | Pros | Cons |
|--------|------|------|
| Supabase Storage | Stays in EU, one platform, simple | No adaptive bitrate, no analytics, limited CDN |
| Mux / Cloudflare Stream | Adaptive streaming, built-in analytics, global CDN | Additional vendor, cost, data outside EU unless configured |

**Recommendation:** Start with Supabase Storage signed URLs for Wave 1 (low scale: ~30 students, ~10 videos). Migrate to Cloudflare Stream (EU data residency available) post-Wave 1 if performance issues arise. Reversible decision.

### 2. AI Tutor model: haiku vs. sonnet

| Option | Cost (input/output) | Quality | Latency |
|--------|---------------------|---------|---------|
| claude-haiku-4 | ~$0.25/$1.25 per MTok | Good for Q&A | ~500ms |
| claude-sonnet-4-6 | ~$3/$15 per MTok | Better reasoning | ~1.5s |

**Recommendation:** Haiku for tutor (educational Q&A is not complex reasoning), Sonnet for exercise evaluation (requires nuanced judgment against rubric). With prompt caching on the system prompt, estimated tutor cost for Wave 1: ~EUR 15-20 total.

### 3. Invite-only vs. self-signup

**Recommendation:** Invite-only for Wave 1. Instructor creates accounts via Supabase Admin API. Reason: Worldline SSO not integrated yet; prevents unauthorized access; controlled rollout. Self-signup with domain restriction (@worldline.com) can be added in Wave 2 alongside SSO.

### 4. Discussion: Supabase Realtime vs. dedicated chat (e.g. Discord)

**Recommendation:** Supabase Realtime for Wave 1. Discussion is per-lesson Q&A, not real-time chat. Real-time only needed for squad activity feed on dashboards. Dedicated chat tool adds vendor complexity and GDPR surface area.

### 5. Content editor: Tiptap vs. MDX vs. external CMS

| Option | Pros | Cons |
|--------|------|------|
| Tiptap (rich text in DB as JSON) | In-app editing, no external CMS, structured | Need to build editor UI |
| MDX files in repo | Developer-friendly, version controlled | Deployment required for content updates |
| Contentful/Sanity | Full CMS features | External vendor, GDPR, added cost |

**Recommendation:** Tiptap with content stored as JSON in `lessons.content_body`. Instructors can edit content in-app without developer involvement. Content is in Supabase (EU), no external CMS vendor. Reversible — JSON can be exported to any format later.

---

## Appendix: Wave 1 Module Structure

Based on the coaching curriculum (4 engineering disciplines):

| Module | Weeks | Type |
|--------|-------|------|
| 01 — AI Adoption Mindset | 1 | Management + all devs |
| 02 — Prompt Engineering | 2-3 | Squad intensive |
| 03 — Context Engineering | 2-3 | Squad intensive |
| 04 — Intent Engineering | 4-5 | Squad intensive |
| 05 — Specification Engineering | 6-7 | Squad intensive |
| 06 — AI Workflow Integration | 8-9 | Consolidation |

Each module: 3-5 lessons + 2-3 exercises + 1 resource pack.

---

*Document version: 1.0 | March 2026 | AetherLink B.V.*
