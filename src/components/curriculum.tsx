const weeks = [
  {
    week: 1,
    title: "Foundations",
    subtitle: "Why AI-First Changes Everything",
    level: "L1-L2",
    topics: ["AI-First mindset shift", "Prompts as programs", "Token economics", "The Prompt Stack (L1-L7)"],
    instructor: "Prof. Prometheus + Captain Code",
    color: "border-blue-500/30",
    accent: "text-blue-400",
  },
  {
    week: 2,
    title: "The Pentagon Model",
    subtitle: "5 Atoms of Every Great Prompt",
    level: "L2-L3",
    topics: ["ROLE / CONTEXT / GOAL / PROCESS / FORMAT", "12-Point Quality Gate", "Anti-pattern detection", "Instant fix toolkit"],
    instructor: "Prof. Prometheus",
    color: "border-orange-500/30",
    accent: "text-orange-400",
  },
  {
    week: 3,
    title: "Context Engineering",
    subtitle: "The 6 Layers That Feed Your AI",
    level: "L4-L5",
    topics: ["CLAUDE.md architecture", "MCP servers & tools", "Skills & RAG", "Memory & live context"],
    instructor: "Dr. Context",
    color: "border-cyan-500/30",
    accent: "text-cyan-400",
  },
  {
    week: 4,
    title: "Intent Engineering",
    subtitle: "Teaching AI What You Actually Want",
    level: "L5-L6",
    topics: ["Goal hierarchies", "Value encoding", "Trade-off frameworks", "Escalation triggers"],
    instructor: "Commander Intent",
    color: "border-green-500/30",
    accent: "text-green-400",
  },
  {
    week: 5,
    title: "Specification Engineering",
    subtitle: "AI Systems That Don't Break",
    level: "L6-L7",
    topics: ["Self-contained problems", "Acceptance criteria (GIVEN/WHEN/THEN)", "Decomposition strategy", "Evaluation design"],
    instructor: "Architect Spec",
    color: "border-purple-500/30",
    accent: "text-purple-400",
  },
  {
    week: 6,
    title: "Model Landscape",
    subtitle: "Choosing the Right Brain for the Job",
    level: "L4",
    topics: ["Tier 1/2/3 models", "Open vs closed source", "Token pricing & ROI", "Smart routing strategies"],
    instructor: "Prof. Prometheus + Captain Code",
    color: "border-indigo-500/30",
    accent: "text-indigo-400",
  },
  {
    week: 7,
    title: "Claude Code Mastery",
    subtitle: "Your AI Development Environment",
    level: "L5",
    topics: ["27 core concepts speed run", "Sub-agents & agent teams", "Screenshot loop workflow", "AI-first feature development"],
    instructor: "Captain Code",
    color: "border-blue-500/30",
    accent: "text-blue-400",
  },
  {
    week: 8,
    title: "RALF Loop & Scale",
    subtitle: "Building Systems That Get Better",
    level: "L7",
    topics: ["Review → Analyze → Learn → Fix", "Self-learning loops", "Team retrospectives", "Rollout strategy: 10 → 900"],
    instructor: "Coach Loop + ALL",
    color: "border-pink-500/30",
    accent: "text-pink-400",
  },
];

export function Curriculum() {
  return (
    <section id="curriculum" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent-purple text-sm font-mono mb-3">8-WEEK CURRICULUM</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            From First Prompt to<br />
            <span className="text-gradient">Production Systems</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Each week builds on the previous. Start simple (L1), end autonomous (L7).
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-blue via-accent-purple to-accent-coral opacity-20 hidden sm:block" />

          <div className="space-y-4">
            {weeks.map((week, i) => (
              <div
                key={week.week}
                className={`relative flex flex-col lg:flex-row gap-4 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Week number badge */}
                <div className="hidden sm:flex absolute left-4 lg:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-navy-800 border border-white/10 items-center justify-center text-xs font-mono text-white/50 z-10">
                  {week.week}
                </div>

                {/* Spacer for timeline */}
                <div className="hidden lg:block lg:w-1/2" />

                {/* Card */}
                <div className={`lg:w-1/2 glass rounded-2xl p-6 border-l-2 ${week.color} hover:border-l-4 transition-all sm:ml-12 lg:ml-0`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-mono text-white/30">WEEK {week.week}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 ${week.accent}`}>
                      {week.level}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{week.title}</h3>
                  <p className="text-sm text-white/40 mb-4">{week.subtitle}</p>
                  <ul className="space-y-1.5 mb-4">
                    {week.topics.map((topic) => (
                      <li key={topic} className="text-sm text-white/50 flex items-start gap-2">
                        <span className={`mt-1.5 w-1 h-1 rounded-full ${week.accent} bg-current flex-shrink-0`} />
                        {topic}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-white/25 font-mono">{week.instructor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
