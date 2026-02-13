"use client";

import type { RadioLine } from "@/data/radio-exchanges";

type Props = {
  context: string;
  lines: RadioLine[];
  onContinue: () => void;
};

/**
 * Displays a radio exchange transcript between ATC and the pilot.
 * Green monospace text on a dark background, like listening to the radio.
 */
export function RadioExchange({ context, lines, onContinue }: Props) {
  return (
    <div
      className="cursor-pointer select-none"
      onClick={onContinue}
    >
      {/* Context line */}
      <p className="text-xs text-[#5c6570] italic mb-4">{context}</p>

      {/* Radio transcript */}
      <div className="bg-[#050607] rounded-lg border border-[#1a1f25] p-5 space-y-3">
        {/* Static indicator */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#1a1f25]">
          <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
          <span className="font-display text-[10px] tracking-widest text-[#5c6570]">RADIO</span>
        </div>

        {lines.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span
              className={`font-display text-[10px] tracking-wider mt-0.5 w-8 flex-shrink-0 ${
                line.speaker === "atc"
                  ? "text-accent-amber/70"
                  : "text-accent-green"
              }`}
            >
              {line.speaker === "atc" ? "ATC" : "YOU"}
            </span>
            <p
              className={`font-display text-sm leading-relaxed ${
                line.speaker === "atc"
                  ? "text-accent-green/60"
                  : "text-accent-green"
              }`}
            >
              {line.text}
            </p>
          </div>
        ))}
      </div>

      {/* Tap hint */}
      <p className="text-center text-[10px] text-[#5c6570] mt-3 font-display tracking-wider">
        TAP TO CONTINUE
      </p>
    </div>
  );
}
