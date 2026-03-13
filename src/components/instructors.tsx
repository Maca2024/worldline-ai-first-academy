const instructors = [
  {
    codename: "PROMETHEUS",
    name: "Prof. Prometheus",
    domain: "Prompt Engineering",
    emoji: "🔥",
    description: "Socratic teacher. Never gives fish, teaches fishing. Obsessed with the 12-point Quality Gate.",
    color: "from-orange-500 to-red-500",
  },
  {
    codename: "CONTEXT",
    name: "Dr. Context",
    domain: "Context Engineering",
    emoji: "🧠",
    description: "Systems thinker. Sees everything as layers. Draws diagrams in ASCII. Loves the 6-layer context audit.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    codename: "INTENT",
    name: "Commander Intent",
    domain: "Intent Engineering",
    emoji: "🎯",
    description: "Military precision meets empathy. Every goal gets a number. Conflicts get resolved, not ignored.",
    color: "from-green-500 to-emerald-500",
  },
  {
    codename: "SPEC",
    name: "Architect Spec",
    domain: "Specification Engineering",
    emoji: "📐",
    description: 'The perfectionist. Nothing ships without acceptance criteria. "If you can\'t test it, you can\'t trust it."',
    color: "from-purple-500 to-violet-500",
  },
  {
    codename: "CODE",
    name: "Captain Code",
    domain: "Claude Code Mastery",
    emoji: "⚡",
    description: "Hands-on hacker. Lives in the terminal. Shows, doesn't tell. Every concept gets a live demo.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    codename: "LOOP",
    name: "Coach Loop",
    domain: "RALF & Self-Learning",
    emoji: "🔄",
    description: "The meta-thinker. Makes the team reflect. Builds feedback systems that compound.",
    color: "from-pink-500 to-rose-500",
  },
];

export function Instructors() {
  return (
    <section id="instructors" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent-blue text-sm font-mono mb-3">THE INSTRUCTOR SWARM</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            6 World-Class AI Experts
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Each instructor is a specialized Claude agent — together they form the
            AI-First Transformation Swarm.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {instructors.map((inst, i) => (
            <div
              key={inst.codename}
              className="glass rounded-2xl p-6 hover:border-white/10 transition-all group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-3xl">{inst.emoji}</div>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded-full bg-gradient-to-r ${inst.color} text-white/90`}
                >
                  {inst.codename}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{inst.name}</h3>
              <p className="text-sm text-accent-blue mb-3">{inst.domain}</p>
              <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                {inst.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
