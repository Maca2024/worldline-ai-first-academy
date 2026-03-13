const tools = [
  {
    name: "Stitch",
    provider: "Google",
    desc: "AI screen design from text prompts",
    use: "Design phase — mockups, variations, tokens",
    color: "from-blue-400 to-cyan-400",
  },
  {
    name: "Veo 3.1",
    provider: "Google",
    desc: "AI video generation from images",
    use: "Product animations, scroll-driven 3D",
    color: "from-red-400 to-orange-400",
  },
  {
    name: "Kimi",
    provider: "Moonshot AI",
    desc: "Long-context multimodal analysis",
    use: "UI review, accessibility, code generation",
    color: "from-green-400 to-emerald-400",
  },
  {
    name: "Claude Code",
    provider: "Anthropic",
    desc: "Agentic coding environment",
    use: "Everything — build, test, deploy",
    color: "from-orange-400 to-amber-400",
  },
  {
    name: "Nano-Banana",
    provider: "AetherLink Skill",
    desc: "Competition-grade interaction engine",
    use: "Micro-animations, generative art, physics UI",
    color: "from-yellow-400 to-lime-400",
  },
  {
    name: "Frontend-Design",
    provider: "AetherLink Skill",
    desc: "Orchestrates all sub-skills",
    use: "Production-grade, award-winning output",
    color: "from-purple-400 to-pink-400",
  },
];

export function ToolStack() {
  return (
    <section id="tools" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent-green text-sm font-mono mb-3">AI DESIGN TOOLS</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            The Stack That Makes It<br />
            <span className="text-gradient">Award-Winning</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="glass rounded-2xl p-6 hover:border-white/10 transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {tool.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{tool.name}</h3>
                  <p className="text-xs text-white/30">{tool.provider}</p>
                </div>
              </div>
              <p className="text-sm text-white/50 mb-2">{tool.desc}</p>
              <p className="text-xs text-white/30 font-mono">{tool.use}</p>
            </div>
          ))}
        </div>

        {/* Workflow diagram */}
        <div className="mt-12 glass rounded-2xl p-8">
          <p className="text-xs font-mono text-white/30 mb-4">WORKFLOW</p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            {[
              { step: "Design", tool: "Stitch", color: "bg-blue-500/20 text-blue-300" },
              { step: "Build", tool: "Claude Code", color: "bg-orange-500/20 text-orange-300" },
              { step: "Animate", tool: "Veo + FFmpeg", color: "bg-red-500/20 text-red-300" },
              { step: "Interact", tool: "Nano-Banana", color: "bg-yellow-500/20 text-yellow-300" },
              { step: "Review", tool: "Kimi", color: "bg-green-500/20 text-green-300" },
              { step: "Ship", tool: "Vercel", color: "bg-purple-500/20 text-purple-300" },
            ].map((item, i) => (
              <div key={item.step} className="flex items-center gap-2">
                <div className={`px-3 py-1.5 rounded-lg ${item.color} font-medium`}>
                  {item.step}
                  <span className="text-xs opacity-60 ml-1">({item.tool})</span>
                </div>
                {i < 5 && <span className="text-white/20">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
