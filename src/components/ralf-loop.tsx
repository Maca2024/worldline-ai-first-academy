"use client";

import { useState } from "react";

const steps = [
  {
    letter: "R",
    name: "Review",
    color: "from-blue-500 to-blue-600",
    desc: "Score the output against the 12-point Quality Gate. Does it match the specification?",
    detail: "Run automated checks, manual inspection, and compare against acceptance criteria.",
  },
  {
    letter: "A",
    name: "Analyze",
    color: "from-purple-500 to-purple-600",
    desc: "Identify patterns. What worked well? What went wrong? Was context sufficient?",
    detail: "Root cause analysis on failures. Pentagon check on prompts. 6-layer context audit.",
  },
  {
    letter: "L",
    name: "Learn",
    color: "from-cyan-500 to-cyan-600",
    desc: "Extract rules. Update CLAUDE.md, create skills, save to memory.",
    detail: "New rule for CLAUDE.md? New skill needed? Memory update? Prompt pattern to save?",
  },
  {
    letter: "F",
    name: "Fix",
    color: "from-green-500 to-green-600",
    desc: "Apply improvements to code, prompts, and context. Share learnings with team.",
    detail: "Update configuration, improve prompts, share findings in weekly RALF retrospective.",
  },
];

export function RalfLoop() {
  const [active, setActive] = useState(0);

  return (
    <section id="ralf" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-purple/[0.02] to-transparent" />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="text-accent-coral text-sm font-mono mb-3">CONTINUOUS IMPROVEMENT</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            The RALF Loop
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Run after every significant AI interaction. The system that makes everything else compound.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Loop visualization */}
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-64 h-64">
              {steps.map((step, i) => {
                const angle = (i * 90 - 90) * (Math.PI / 180);
                const x = 50 + 40 * Math.cos(angle);
                const y = 50 + 40 * Math.sin(angle);

                return (
                  <button
                    key={step.letter}
                    onClick={() => setActive(i)}
                    className={`absolute w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-2xl transition-all hover:scale-110 ${
                      active === i ? "scale-110 ring-2 ring-white/20" : "opacity-60"
                    }`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) ${active === i ? "scale(1.1)" : ""}`,
                    }}
                  >
                    {step.letter}
                  </button>
                );
              })}

              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full glass flex items-center justify-center">
                <span className="text-xs font-mono text-white/40">LOOP</span>
              </div>

              {/* Connecting arcs (simplified as lines) */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
          </div>

          {/* Detail panel */}
          <div className="flex-1">
            <div className="glass rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${steps[active].color} flex items-center justify-center text-white font-bold text-xl`}
                >
                  {steps[active].letter}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{steps[active].name}</h3>
                  <p className="text-xs font-mono text-white/30">Step {active + 1} of 4</p>
                </div>
              </div>

              <p className="text-white/60 mb-4 leading-relaxed">{steps[active].desc}</p>
              <p className="text-sm text-white/30 leading-relaxed">{steps[active].detail}</p>

              <div className="mt-6 flex gap-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-1 rounded-full transition-all ${
                      i === active ? "w-8 bg-white/40" : "w-4 bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Self-learning loop */}
            <div className="mt-4 glass rounded-2xl p-6">
              <p className="text-xs font-mono text-white/30 mb-3">SELF-LEARNING LOOP (HEADLESS)</p>
              <div className="flex items-center gap-2 text-sm text-white/40 flex-wrap">
                <span className="px-2 py-1 rounded bg-white/5">Execute</span>
                <span className="text-white/20">→</span>
                <span className="px-2 py-1 rounded bg-white/5">Evaluate</span>
                <span className="text-white/20">→</span>
                <span className="px-2 py-1 rounded bg-accent-green/10 text-accent-green">
                  ≥9/12? Ship ✅
                </span>
                <span className="text-white/20">|</span>
                <span className="px-2 py-1 rounded bg-accent-coral/10 text-orange-400">
                  &lt;9? Fix & retry
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
