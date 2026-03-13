"use client";

import { useEffect, useRef } from "react";

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = window.innerWidth < 768 ? 40 : 80;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        hue: 220 + Math.random() * 60,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, 0.6)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${(p.hue + p2.hue) / 2}, 60%, 50%, ${
              0.15 * (1 - dist / 120)
            })`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.4 }}
      />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-[120px] animate-pulse [animation-delay:1.5s]" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light text-xs text-white/60 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          AetherLink B.V. &mdash; AI Consulting &amp; Training
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6">
          <span className="text-white">Worldline</span>
          <br />
          <span className="text-gradient">AI-First</span>
          <br />
          <span className="text-white/80">Academy</span>
        </h1>

        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Transform 900 engineers into AI-native developers.
          <br className="hidden sm:block" />
          8 weeks. 4 disciplines. 6 instructor swarm. Zero theory without practice.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#curriculum"
            className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white font-medium transition-all hover:scale-105"
          >
            <span className="relative z-10">Explore Curriculum</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
          </a>
          <a
            href="#labs"
            className="px-8 py-3.5 rounded-full border border-white/10 text-white/70 font-medium hover:border-white/20 hover:text-white transition-all hover:bg-white/5"
          >
            Hands-On Labs
          </a>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-white/30 text-xs font-mono">
          <span>Next.js</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Claude Code</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Stitch</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Veo 3.1</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Vercel</span>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-navy-900 to-transparent" />
    </section>
  );
}
