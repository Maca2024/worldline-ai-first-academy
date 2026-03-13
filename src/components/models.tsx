const tiers = [
  {
    tier: 1,
    label: "Frontier",
    desc: "Complex reasoning, architecture, security",
    color: "from-purple-500 to-violet-500",
    borderColor: "border-purple-500/20",
    models: [
      { name: "Claude Opus 4.6", provider: "Anthropic", context: "200K", strength: "Best reasoning" },
      { name: "GPT-4o", provider: "OpenAI", context: "128K", strength: "Multimodal" },
      { name: "Gemini Ultra", provider: "Google", context: "2M", strength: "Longest context" },
    ],
  },
  {
    tier: 2,
    label: "Balanced",
    desc: "Daily coding, reviews, testing",
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/20",
    models: [
      { name: "Claude Sonnet 4.6", provider: "Anthropic", context: "200K", strength: "Best value" },
      { name: "GPT-4o-mini", provider: "OpenAI", context: "128K", strength: "Fast & cheap" },
      { name: "Gemini Pro", provider: "Google", context: "2M", strength: "Search + code" },
    ],
  },
  {
    tier: 3,
    label: "Speed / Cost",
    desc: "Exploration, classification, linting",
    color: "from-green-500 to-emerald-500",
    borderColor: "border-green-500/20",
    models: [
      { name: "Claude Haiku 4.5", provider: "Anthropic", context: "200K", strength: "Fastest Claude" },
      { name: "Llama 3.1 70B", provider: "Meta (open)", context: "128K", strength: "Self-hosted" },
      { name: "Gemini Flash", provider: "Google", context: "1M", strength: "Cheapest" },
    ],
  },
];

export function Models() {
  return (
    <section id="models" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-accent-blue text-sm font-mono mb-3">MODEL LANDSCAPE</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Right Brain, Right Job
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Smart model routing saves 70% vs. using Tier 1 for everything.
            PCI-DSS scoped data stays on self-hosted models.
          </p>
        </div>

        <div className="space-y-6">
          {tiers.map((tier) => (
            <div
              key={tier.tier}
              className={`glass rounded-2xl p-6 border ${tier.borderColor}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center text-white font-bold text-lg`}
                >
                  T{tier.tier}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Tier {tier.tier}: {tier.label}</h3>
                  <p className="text-sm text-white/40">{tier.desc}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {tier.models.map((model) => (
                  <div
                    key={model.name}
                    className="rounded-xl bg-white/[0.02] border border-white/5 p-4 hover:border-white/10 transition-all"
                  >
                    <h4 className="font-semibold text-white text-sm mb-1">{model.name}</h4>
                    <p className="text-xs text-white/30 mb-2">{model.provider}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/20 font-mono">{model.context}</span>
                      <span className="text-accent-cyan">{model.strength}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cost comparison */}
        <div className="mt-8 glass rounded-2xl p-6">
          <p className="text-xs font-mono text-white/30 mb-4">COST PROJECTION — 900 DEVELOPERS</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { scenario: "All Opus API", cost: "~$121K/mo", rating: "❌", note: "Overkill" },
              { scenario: "Smart Routing", cost: "~$29K/mo", rating: "✅", note: "Recommended" },
              { scenario: "Claude Max (all)", cost: "~$90K/mo", rating: "⚠️", note: "Simpler" },
              { scenario: "Hybrid", cost: "~$35K/mo", rating: "✅", note: "Best balance" },
            ].map((s) => (
              <div key={s.scenario} className="text-center p-4 rounded-xl bg-white/[0.02]">
                <div className="text-lg mb-1">{s.rating}</div>
                <div className="text-sm font-semibold text-white">{s.cost}</div>
                <div className="text-xs text-white/30 mt-1">{s.scenario}</div>
                <div className="text-xs text-accent-blue mt-0.5">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
