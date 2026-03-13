"use client";

import { useState, useEffect } from "react";

const links = [
  { href: "#instructors", label: "Instructors" },
  { href: "#curriculum", label: "Curriculum" },
  { href: "#labs", label: "Labs" },
  { href: "#tools", label: "Tools" },
  { href: "#models", label: "Models" },
  { href: "#ralf", label: "RALF Loop" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass py-3" : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
            W
          </div>
          <span className="font-semibold text-white/90 hidden sm:block">
            AI-First Academy
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-accent-blue to-accent-purple text-white hover:opacity-90 transition-opacity"
        >
          Start Training
        </a>
      </div>
    </nav>
  );
}
