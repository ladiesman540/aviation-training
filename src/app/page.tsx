import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8 md:max-w-6xl md:px-6 md:py-16">
      {/* Hero */}
      <section className="mb-10 md:mb-16 md:min-h-[40vh] md:flex md:flex-col md:justify-center">
        <p className="font-display text-[10px] tracking-[0.3em] text-accent-green/70 mb-3">
          PSTAR GROUND SCHOOL
        </p>
        <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4">
          <span className="block">Fly.</span>
          <span className="block">Learn.</span>
          <span className="block text-accent-green">Pass.</span>
        </h1>
        <p className="text-sm md:text-lg text-[#8b949e] max-w-md mb-6 leading-relaxed">
          5-minute micro-flights that drill PSTAR knowledge through consequences.
          Every answer traced to official Transport Canada sources.
        </p>
        <Link
          href="/hop"
          className="flex items-center justify-center gap-2 w-full md:w-auto md:inline-flex px-6 py-4 font-display font-semibold text-bg-deep bg-accent-green rounded-xl hover:bg-[#00e077] transition text-lg active:scale-[0.98]"
        >
          Start Flying
          <span>→</span>
        </Link>
      </section>

      {/* How it works */}
      <section className="bg-bg-panel border border-[#1e252d] rounded-xl p-5 md:p-8 mb-8">
        <h2 className="font-display text-sm font-bold mb-4 tracking-wider">HOW IT WORKS</h2>
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-6">
          <div className="flex gap-3 md:block">
            <span className="font-display text-xs text-accent-green mt-0.5 md:mt-0">01</span>
            <div>
              <h3 className="font-semibold text-sm mb-1">Fly micro-flights</h3>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Each hop is a 5-minute flight with METAR decode, radio calls, and in-flight decisions.
              </p>
            </div>
          </div>
          <div className="flex gap-3 md:block">
            <span className="font-display text-xs text-accent-green mt-0.5 md:mt-0">02</span>
            <div>
              <h3 className="font-semibold text-sm mb-1">Learn from consequences</h3>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Risk builds. Critical errors end the flight. Emergencies happen. Every mistake explains why.
              </p>
            </div>
          </div>
          <div className="flex gap-3 md:block">
            <span className="font-display text-xs text-accent-green mt-0.5 md:mt-0">03</span>
            <div>
              <h3 className="font-semibold text-sm mb-1">Track and verify</h3>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Every answer links to TP 11919, CARs, and AIM. Nothing is ambiguous.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Secondary actions */}
      <section className="grid grid-cols-2 gap-3 mb-8">
        <Link
          href="/progress"
          className="block p-4 bg-bg-panel border border-[#1e252d] rounded-xl hover:border-accent-green/30 transition active:scale-[0.98]"
        >
          <span className="font-display text-[10px] text-accent-amber tracking-widest">PROGRESS</span>
          <h2 className="font-semibold text-sm mt-1">Mastery</h2>
          <p className="text-[10px] text-[#5c6570] mt-1 leading-relaxed">
            Section accuracy and weak areas
          </p>
        </Link>
        <Link
          href="/hop"
          className="block p-4 bg-bg-panel border border-accent-green/20 rounded-xl hover:border-accent-green/30 transition active:scale-[0.98]"
        >
          <span className="font-display text-[10px] text-accent-green tracking-widest">QUICK HOP</span>
          <h2 className="font-semibold text-sm mt-1">Fly Again</h2>
          <p className="text-[10px] text-[#5c6570] mt-1 leading-relaxed">
            8-12 decisions, 5 minutes
          </p>
        </Link>
      </section>

      {/* Study tools — tucked away */}
      <section className="mb-8">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer px-4 py-3 bg-bg-panel border border-[#1e252d] rounded-xl hover:border-accent-green/20 transition list-none">
            <span className="font-display text-xs tracking-widest text-[#5c6570]">STUDY TOOLS</span>
            <span className="text-[#5c6570] text-xs group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-2 space-y-2">
            <Link
              href="/sim"
              className="block p-4 bg-bg-panel border border-[#1e252d] rounded-xl hover:border-accent-green/30 transition active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-display text-[10px] text-[#5c6570] tracking-widest">EXAM SIM</span>
                  <h3 className="font-semibold text-sm mt-1">PSTAR Mock Exam</h3>
                  <p className="text-[10px] text-[#5c6570] mt-1">50 questions, 90% to pass, full review</p>
                </div>
                <span className="text-[#5c6570]">→</span>
              </div>
            </Link>
            <Link
              href="/bank"
              className="block p-4 bg-bg-panel border border-[#1e252d] rounded-xl hover:border-accent-green/30 transition active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-display text-[10px] text-[#5c6570] tracking-widest">QUESTION BANK</span>
                  <h3 className="font-semibold text-sm mt-1">All 185 Questions</h3>
                  <p className="text-[10px] text-[#5c6570] mt-1">Search, browse, sources for everything</p>
                </div>
                <span className="text-[#5c6570]">→</span>
              </div>
            </Link>
          </div>
        </details>
      </section>

      <footer className="pt-6 border-t border-[#1e252d] text-center pb-4">
        <p className="text-xs text-[#5c6570]">SkyTrail &copy; 2025 &middot; For educational purposes only</p>
      </footer>
    </div>
  );
}
