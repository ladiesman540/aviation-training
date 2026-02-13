"use client";

import type { FlightPhase } from "@/types";
import { PHASES, PHASE_LABELS } from "@/lib/hop-engine";

type Props = {
  currentPhase: FlightPhase;
  completedPhases: FlightPhase[];
};

export function PhaseBar({ currentPhase, completedPhases }: Props) {
  return (
    <div className="flex items-center gap-1 w-full">
      {PHASES.map((phase, i) => {
        const isActive = phase === currentPhase;
        const isComplete = completedPhases.includes(phase);
        return (
          <div key={phase} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`h-1.5 w-full rounded-full transition-all duration-500 ${
                  isComplete
                    ? "bg-accent-green"
                    : isActive
                      ? "bg-accent-green/50 animate-pulse"
                      : "bg-[#1e252d]"
                }`}
              />
              <span
                className={`text-[10px] mt-1 font-display tracking-wider ${
                  isActive
                    ? "text-accent-green"
                    : isComplete
                      ? "text-accent-green/60"
                      : "text-[#5c6570]"
                }`}
              >
                {PHASE_LABELS[phase]}
              </span>
            </div>
            {i < PHASES.length - 1 && (
              <div className="w-2 h-px bg-[#1e252d] mx-0.5 mt-[-10px]" />
            )}
          </div>
        );
      })}
    </div>
  );
}
