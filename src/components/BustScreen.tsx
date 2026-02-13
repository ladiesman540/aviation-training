"use client";

import type { HopCard } from "@/lib/hop-engine";

type Props = {
  card: HopCard;
  selectedOption: number;
  onContinue: () => void;
};

export function BustScreen({ card, selectedOption, onContinue }: Props) {
  const optionLabels = [card.options[0], card.options[1], card.options[2], card.options[3]];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-deep/95 backdrop-blur-sm">
      <div className="max-w-lg mx-auto px-6 text-center">
        {/* Bust header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-full mb-4">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="font-display text-xs text-red-400 tracking-widest">
              FLIGHT TERMINATED
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-red-400">
            Critical Bust
          </h1>
        </div>

        {/* What happened */}
        <div className="bg-bg-panel border border-red-500/20 rounded-lg p-6 text-left mb-6">
          <p className="text-sm text-[#8b949e] mb-3">{card.flightContext}</p>
          <p className="text-[#e8ecf0] mb-4">{card.stem}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 p-2 rounded bg-red-500/10 border border-red-500/20">
              <span className="font-display text-xs text-red-400 mt-0.5">YOUR ANSWER</span>
              <span className="text-sm text-red-300">{optionLabels[selectedOption - 1]}</span>
            </div>
            <div className="flex items-start gap-2 p-2 rounded bg-accent-green/10 border border-accent-green/20">
              <span className="font-display text-xs text-accent-green mt-0.5">CORRECT</span>
              <span className="text-sm text-accent-green/90">{optionLabels[card.correctOption - 1]}</span>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-bg-elevated rounded p-4 border border-[#1e252d]">
            <p className="font-display text-xs text-accent-amber mb-2">WHY THIS MATTERS</p>
            <p className="text-sm text-[#e8ecf0] leading-relaxed">{card.explanation}</p>
          </div>

          {/* Source reference */}
          <p className="text-xs text-[#5c6570] mt-3">
            TP 11919 Q{card.questionId} · {card.sectionName}
          </p>
        </div>

        <button
          onClick={onContinue}
          className="px-8 py-3 font-display font-semibold text-bg-deep bg-accent-green rounded hover:bg-[#00e077] transition"
        >
          Back to Debrief
        </button>
      </div>
    </div>
  );
}
