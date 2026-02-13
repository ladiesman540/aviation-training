"use client";

import { useState } from "react";
import Link from "next/link";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-[#8b949e] hover:text-[#e8ecf0] transition"
        aria-label="Menu"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l12 12M16 4L4 16" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 5h14M3 10h14M3 15h14" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setOpen(false)} />
          <div className="fixed top-0 right-0 w-64 h-full bg-bg-panel border-l border-[#1e252d] z-50 p-6 safe-top">
            <div className="flex justify-between items-center mb-8">
              <span className="font-display text-xs tracking-widest text-[#5c6570]">MENU</span>
              <button onClick={() => setOpen(false)} className="p-1 text-[#8b949e]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4l12 12M16 4L4 16" />
                </svg>
              </button>
            </div>

            <nav className="space-y-1">
              <Link
                href="/hop"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#e8ecf0] hover:bg-accent-green/5 transition"
              >
                <span className="text-accent-green text-lg">▸</span>
                <div>
                  <span className="block font-semibold text-sm">Quick Hop</span>
                  <span className="block text-xs text-[#5c6570]">5-min micro-flight</span>
                </div>
              </Link>
              <Link
                href="/progress"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#e8ecf0] hover:bg-accent-green/5 transition"
              >
                <span className="text-accent-amber text-lg">◆</span>
                <div>
                  <span className="block font-semibold text-sm">Progress</span>
                  <span className="block text-xs text-[#5c6570]">Mastery tracker</span>
                </div>
              </Link>

              <div className="pt-4 mt-4 border-t border-[#1e252d]">
                <span className="font-display text-[10px] tracking-widest text-[#5c6570] px-4 block mb-2">STUDY TOOLS</span>
                <Link
                  href="/sim"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8b949e] hover:bg-accent-green/5 transition"
                >
                  <span className="text-[#5c6570] text-lg">◇</span>
                  <div>
                    <span className="block text-sm">Exam Sim</span>
                    <span className="block text-xs text-[#5c6570]">50-question mock</span>
                  </div>
                </Link>
                <Link
                  href="/bank"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#8b949e] hover:bg-accent-green/5 transition"
                >
                  <span className="text-[#5c6570] text-lg">◇</span>
                  <div>
                    <span className="block text-sm">Question Bank</span>
                    <span className="block text-xs text-[#5c6570]">Browse all 185 questions</span>
                  </div>
                </Link>
              </div>
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-[10px] text-[#5c6570]">TP 11919 — 7th Ed, Dec 2022</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
