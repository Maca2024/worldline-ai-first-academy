# Worldline AI-First Developer Academy

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)
![Claude](https://img.shields.io/badge/Claude_Code-Opus_4.6-orange?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

**Transform 900 engineers into AI-native developers in 8 weeks.**

[Live Site](https://worldline-ai-first-academy.vercel.app) · [Curriculum](#-8-week-curriculum) · [Labs](#-hands-on-labs) · [Contact](#contact)

</div>

---

## What Is This?

A complete **AI-First transformation program** designed for Worldline's 900+ developer team. Built by [AetherLink B.V.](https://aetherlink.ai) — Europe's AI One-Stop-Shop.

This repository contains:
- **The Academy Website** — Interactive curriculum overview (this Next.js app)
- **The Skill Engine** — Claude Code skill with full curriculum content
- **Reference Materials** — Cheatsheets, exercises, and hands-on lab guides

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   PROMPT CRAFT ──→ CONTEXT ──→ INTENT ──→ SPECIFICATION    │
│       L1-L3          L4-L5      L5-L6        L6-L7         │
│                                                              │
│   "Fix bug"    "Full stack"   "Goal         "Autonomous     │
│                 configured"    hierarchies"   systems"       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎓 8-Week Curriculum

| Week | Topic | Level | Instructor |
|------|-------|-------|------------|
| 1 | **Foundations** — AI-First mindset, tokens, prompt stack | L1-L2 | Prof. Prometheus + Captain Code |
| 2 | **Pentagon Model** — 5 atoms, 12-point quality gate | L2-L3 | Prof. Prometheus |
| 3 | **Context Engineering** — 6-layer model, CLAUDE.md, MCP | L4-L5 | Dr. Context |
| 4 | **Intent Engineering** — Goal hierarchies, trade-offs | L5-L6 | Commander Intent |
| 5 | **Specification Engineering** — Acceptance criteria | L6-L7 | Architect Spec |
| 6 | **Model Landscape** — Tiers, open/closed, token economics | L4 | Prof. Prometheus |
| 7 | **Claude Code Mastery** — 27 concepts, agents, screenshot loop | L5 | Captain Code |
| 8 | **RALF Loop & Scale** — Self-learning, rollout 10→900 | L7 | Coach Loop |

---

## 🔬 Hands-On Labs

| Lab | Title | Duration | Tools | Output |
|-----|-------|----------|-------|--------|
| 1 | Prompt to Pixel | 2h | Stitch + Claude Code | Complete landing page |
| 2 | Scroll-Driven 3D | 3h | Veo 3.1 + FFmpeg + Canvas | Apple-style scroll animation |
| 3 | Competition Interactions | 2h | Nano-Banana + Framer Motion | 7 reusable components |
| 4 | AI Design Review | 2h | Kimi + Screenshot Loop | Automated review workflow |
| 5 | Payment Dashboard | 3h | Stitch + Recharts | Full analytics dashboard |
| 6 | Ship It | 2h | GitHub + Vercel + CI/CD | Live deployed site |
| **Sprint** | **AI Innovation Showcase** | **1 week** | **Everything** | **Award-winning product page** |

---

## 🛠 Tech Stack

```
DESIGN     Stitch (Gemini 3 Pro/Flash) ─── Screen mockups + design tokens
VIDEO      Veo 3.1 / Kling 3.0 ────────── Product transition videos
REVIEW     Kimi + Screenshot Loop ──────── Automated design feedback
BUILD      Claude Code (Opus 4.6) ──────── Agentic coding environment
INTERACT   Nano-Banana Engine ──────────── Competition-grade interactions
ANIMATE    AetherDev 3D ────────────────── Scroll-driven frame flipbooks
STYLE      UI/UX Pro Max ──────────────── 50 styles, 97 palettes, 57 fonts
DEPLOY     GitHub → Vercel ─────────────── Auto-deploy + Lighthouse CI
```

---

## 📊 The RALF Loop

The continuous improvement engine that makes everything else compound:

```
    ┌──────────┐
    │  REVIEW  │ ← Score output (12-point gate)
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │ ANALYZE  │ ← Find patterns (worked/didn't)
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │  LEARN   │ ← Extract rules (update CLAUDE.md/skills)
    └────┬─────┘
         │
         ▼
    ┌──────────┐
    │   FIX    │ ← Apply improvements
    └────┬─────┘
         │
         └──────→ back to REVIEW
```

---

## 🧠 The Pentagon Model

Every effective prompt contains 5 atoms:

| Atom | Question | Example |
|------|----------|---------|
| **ROLE** | Who is the AI? | Senior payment systems architect |
| **CONTEXT** | What does it know? | Java 17, Spring Boot 3, 50K TPS |
| **GOAL** | What must it achieve? | Design /v3/payments API contract |
| **PROCESS** | How should it work? | Analyze WSDL → Map to REST → Define errors |
| **FORMAT** | What does output look like? | OpenAPI 3.1 YAML with examples |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/Maca2024/worldline-ai-first-academy.git
cd worldline-ai-first-academy

# Install
npm install

# Run
npm run dev

# Build
npm run build
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
worldline-ai-first-academy/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page (all sections)
│   │   ├── layout.tsx        # Root layout + metadata
│   │   └── globals.css       # Dark theme + glassmorphism
│   └── components/
│       ├── nav.tsx           # Glass navigation bar
│       ├── hero.tsx          # Particle canvas + hero text
│       ├── stats.tsx         # Animated counter cards
│       ├── instructors.tsx   # 6 instructor swarm cards
│       ├── curriculum.tsx    # 8-week timeline
│       ├── labs.tsx          # 6 labs + capstone sprint
│       ├── tool-stack.tsx    # AI tools overview + workflow
│       ├── models.tsx        # Tier 1/2/3 model comparison
│       ├── ralf-loop.tsx     # Interactive RALF visualization
│       ├── maturity.tsx      # AI maturity model + rollout
│       └── footer.tsx        # Contact + links
├── tailwind.config.ts        # Custom theme tokens
├── README.md                 # This file
└── package.json
```

---

## 🎯 Key Frameworks

| Framework | Purpose | Reference |
|-----------|---------|-----------|
| **Pentagon Model** | Structure every prompt with 5 atoms | Week 2 |
| **12-Point Quality Gate** | Score prompt quality before production | Week 2 |
| **6-Layer Context Model** | Audit information environment | Week 3 |
| **Goal Hierarchies** | Prevent AI optimizing wrong goals | Week 4 |
| **GIVEN/WHEN/THEN** | Testable acceptance criteria | Week 5 |
| **Model Tier System** | Right model for the job (T1/T2/T3) | Week 6 |
| **RALF Loop** | Continuous improvement cycle | Week 8 |
| **Self-Learning Loop** | Automated AI self-correction | Week 8 |

---

## 💰 ROI Projection

| Metric | Expected Impact |
|--------|----------------|
| Developer velocity | **+40%** (story points/sprint) |
| Code review time | **-60%** (AI pre-review) |
| Bug escape rate | **-30%** (AI-generated tests) |
| Onboarding time | **-50%** (AI-assisted ramp-up) |
| Dev satisfaction | **>4.0/5.0** (survey) |

---

## Contact

**AetherLink B.V.** — Europe's AI One-Stop-Shop

- Web: [aetherlink.ai](https://aetherlink.ai)
- Email: info@aetherlink.ai
- Consulting rate: EUR 225/hour

---

<div align="center">

Built with Claude Opus 4.6 · Deployed on Vercel · By AetherLink B.V.

*"We don't just teach AI. We transform how you build."*

</div>
