"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 900, suffix: "+", label: "Engineers", color: "from-accent-blue to-accent-cyan" },
  { value: 8, suffix: " Weeks", label: "Program Duration", color: "from-accent-purple to-accent-blue" },
  { value: 6, suffix: "", label: "AI Instructors", color: "from-accent-cyan to-accent-green" },
  { value: 27, suffix: "", label: "Core Concepts", color: "from-accent-coral to-accent-purple" },
];

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1500;
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));

            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-6 text-center hover:border-white/10 transition-all group"
            >
              <div
                className={`text-4xl sm:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
              >
                <AnimatedNumber target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-white/40 group-hover:text-white/60 transition-colors">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
