"use client";

import { MAX_RISK } from "@/lib/hop-engine";

type Props = {
  risk: number;
  animate?: boolean;
  isSvfr?: boolean;
};

export function RiskMeter({ risk, animate = false, isSvfr = false }: Props) {
  // With max 3: 0=green, 1=amber, 2=red, 3=bust
  const color =
    risk >= MAX_RISK
      ? "bg-red-500"
      : risk >= 2
        ? "bg-red-500"
        : risk >= 1
          ? "bg-amber-500"
          : "bg-accent-green";

  const textColor =
    risk >= 2 ? "text-red-400" : risk >= 1 ? "text-amber-400" : "text-[#8b949e]";

  return (
    <div className="flex items-center gap-3">
      <span className={`font-display text-xs tracking-wider ${textColor}`}>
        {isSvfr ? "SVFR RISK" : "RISK"}
      </span>
      {/* Show as dots instead of a bar for max 3 — more readable */}
      <div className="flex gap-1.5 flex-1">
        {Array.from({ length: MAX_RISK }).map((_, i) => (
          <div
            key={i}
            className={`h-3 flex-1 rounded-full transition-all duration-500 ${
              i < risk
                ? `${color} ${animate && i === risk - 1 ? "animate-pulse" : ""}`
                : "bg-[#1e252d]"
            }`}
          />
        ))}
      </div>
      <span className={`font-display text-xs tabular-nums ${textColor}`}>
        {risk}/{MAX_RISK}
      </span>
    </div>
  );
}
