const labs = [
  {
    num: 1,
    title: "Prompt to Pixel",
    duration: "2h",
    tools: ["Stitch", "Claude Code", "Nano-Banana"],
    output: "Complete landing page from a single prompt",
    icon: "🎨",
  },
  {
    num: 2,
    title: "Scroll-Driven 3D",
    duration: "3h",
    tools: ["Veo 3.1", "FFmpeg", "React Canvas"],
    output: "Apple-style scroll animation of a payment terminal",
    icon: "🎬",
  },
  {
    num: 3,
    title: "Competition-Grade Interactions",
    duration: "2h",
    tools: ["Nano-Banana", "Framer Motion", "Canvas API"],
    output: "7 reusable interaction components",
    icon: "✨",
  },
  {
    num: 4,
    title: "AI Design Review",
    duration: "2h",
    tools: ["Kimi", "Puppeteer", "Screenshot Loop"],
    output: "Automated design feedback workflow",
    icon: "🔍",
  },
  {
    num: 5,
    title: "Payment Dashboard",
    duration: "3h",
    tools: ["Stitch", "Recharts", "Claude Code"],
    output: "Full analytics dashboard with live data",
    icon: "📊",
  },
  {
    num: 6,
    title: "Ship It",
    duration: "2h",
    tools: ["GitHub", "Vercel", "Lighthouse CI"],
    output: "Live deployed site with CI/CD pipeline",
    icon: "🚀",
  },
];

export function Labs() {
  return (
    <section id="labs" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-blue/[0.02] to-transparent" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="text-accent-cyan text-sm font-mono mb-3">HANDS-ON MASTERCLASS</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            6 Labs + Capstone Sprint
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Every lab produces something real. No theory without practice.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {labs.map((lab) => (
            <div
              key={lab.num}
              className="glass rounded-2xl p-6 hover:border-white/10 transition-all group relative overflow-hidden"
            >
              {/* Subtle gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{lab.icon}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white/30">LAB {lab.num}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-accent-cyan/10 text-accent-cyan">
                      {lab.duration}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-3">{lab.title}</h3>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {lab.tools.map((tool) => (
                    <span
                      key={tool}
                      className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/5"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
                  {lab.output}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Capstone card */}
        <div className="mt-6 glass rounded-2xl p-8 border border-accent-purple/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 via-accent-purple/5 to-accent-coral/5" />
          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <span className="text-xs font-mono text-accent-purple mb-2 block">CAPSTONE SPRINT &mdash; 1 WEEK</span>
              <h3 className="text-2xl font-bold text-white mb-3">AI Innovation Showcase</h3>
              <p className="text-white/40 mb-4">
                Teams of 4-5 build a complete AI-driven product page for Worldline.
                Judged on 4 axes: Functionality, Originality, Coolness, and Magic.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="text-blue-400">25% Functionality</span>
                <span className="text-purple-400">25% Originality</span>
                <span className="text-cyan-400">25% Coolness</span>
                <span className="text-coral text-orange-400">25% Magic</span>
              </div>
            </div>
            <div className="text-8xl opacity-20">🏆</div>
          </div>
        </div>
      </div>
    </section>
  );
}
