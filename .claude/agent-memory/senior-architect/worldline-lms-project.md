---
name: worldline-lms-project
description: Worldline AI-First Academy LMS — client context, scope, Wave 1 constraints, stack decisions
type: project
---

Worldline AI-First Academy LMS is a custom LearnWorlds-light platform for Worldline (payment processor).

**Why:** Gertjan Dewaele (VP Product & Technology) contracted AetherLink (Constance van der Vlist) for Wave 1: 3 squads (~30 devs), April–June 2026, ~EUR 40K. AetherLink handles workflow transformation coaching; LLM provider handles tool training.

**Program structure:**
- Week 1: Management training (on-site Hoofddorp)
- Weeks 2–7: Squad coaching, 2 weeks per squad (A → B → C rotation)
- Weeks 8–9: Consolidation + office hours
- Hybrid: 2–3 days/week on-site + remote access

**Stack:** Next.js 14 App Router + TypeScript strict + Tailwind + shadcn/ui + Supabase (auth, DB, realtime) + Vercel

**Key compliance constraint:** EU AI Act + GDPR — all AI interaction logs anonymized, no bias in AI tutor, transparent AI use, data residency EU.

**SSO consideration:** Worldline uses enterprise identity (likely Azure AD / Entra ID). Wave 1 can start with Supabase Auth email-based, with SAML/OIDC hook planned for Wave 2.

**How to apply:** When proposing changes, always validate against EU AI Act compliance, GDPR data residency (EU Supabase region), and the squad-rotation structure. The AI tutor must have curriculum guardrails.
