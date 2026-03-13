export function Footer() {
  return (
    <footer id="contact" className="py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold">
                W
              </div>
              <div>
                <h3 className="font-bold text-white">AI-First Academy</h3>
                <p className="text-xs text-white/30">by AetherLink B.V.</p>
              </div>
            </div>
            <p className="text-sm text-white/40 max-w-md leading-relaxed">
              Transform your development team into AI-native engineers.
              Built by practitioners, not theorists. We don&apos;t just teach AI — we transform how you build.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Program</h4>
              <ul className="space-y-2">
                {["Curriculum", "Labs", "Tools", "Models", "RALF Loop"].map((item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(" ", "-")}`}
                      className="text-sm text-white/30 hover:text-white/60 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-white/30">
                <li>AetherLink B.V.</li>
                <li>The Netherlands</li>
                <li className="text-accent-blue">info@aetherlink.ai</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} AetherLink B.V. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-white/20">
            <span>Built with Claude Opus 4.6</span>
            <span className="w-1 h-1 rounded-full bg-white/10" />
            <span>Deployed on Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
