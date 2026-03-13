const levels = [
  {
    level: 1,
    name: "AI-Curious",
    desc: "Some developers use ChatGPT occasionally. No standardization.",
    progress: 10,
  },
  {
    level: 2,
    name: "AI-Assisted",
    desc: "Claude Code installed, CLAUDE.md exists. Basic prompting (L1-L2).",
    progress: 30,
  },
  {
    level: 3,
    name: "AI-Integrated",
    desc: "Full prompt stack (L1-L5). Skills library, MCP configured. RALF Loop weekly.",
    progress: 55,
  },
  {
    level: 4,
    name: "AI-Native",
    desc: "Spec Engineering (L6-L7). Agent teams. Headless overnight processing. AI-first is default.",
    progress: 80,
    target: true,
  },
  {
    level: 5,
    name: "AI-Autonomous",
    desc: "Multi-agent production systems. Continuous self-improvement. Humans specify, AI executes.",
    progress: 100,
  },
];

export function Maturity() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent-purple text-sm font-mono mb-3">TRANSFORMATION JOURNEY</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            AI-First Maturity Model
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Target: Level 1 → Level 4 in 8 weeks.
          </p>
        </div>

        <div className="space-y-3">
          {levels.map((lvl) => (
            <div
              key={lvl.level}
              className={`glass rounded-xl p-5 transition-all ${
                lvl.target ? "border-accent-blue/30 border" : ""
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                    lvl.target
                      ? "bg-gradient-to-br from-accent-blue to-accent-purple text-white"
                      : "bg-white/5 text-white/40"
                  }`}
                >
                  L{lvl.level}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{lvl.name}</h3>
                    {lvl.target && (
                      <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue">
                        TARGET
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/40">{lvl.desc}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    lvl.target
                      ? "bg-gradient-to-r from-accent-blue to-accent-purple"
                      : "bg-white/10"
                  }`}
                  style={{ width: `${lvl.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Rollout strategy */}
        <div className="mt-12 glass rounded-2xl p-8">
          <p className="text-xs font-mono text-white/30 mb-6">ROLLOUT STRATEGY</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { phase: "Week 1-2", team: "10", label: "Seed Team", icon: "🌱" },
              { phase: "Week 3-4", team: "50", label: "Early Adopters", icon: "🌿" },
              { phase: "Week 5-6", team: "200", label: "Department", icon: "🌳" },
              { phase: "Week 7-8", team: "900", label: "Full Org", icon: "🌲" },
            ].map((p) => (
              <div key={p.phase} className="text-center p-4 rounded-xl bg-white/[0.02]">
                <div className="text-2xl mb-2">{p.icon}</div>
                <div className="text-2xl font-bold text-white">{p.team}</div>
                <div className="text-sm text-white/50">{p.label}</div>
                <div className="text-xs text-white/25 font-mono mt-1">{p.phase}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
