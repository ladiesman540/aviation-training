"use client";

import type { HopCard, HopResponse } from "@/lib/hop-engine";
import { PHASE_LABELS } from "@/lib/hop-engine";
import type { FlightPhase } from "@/types";
import { useState } from "react";

type Props = {
  aircraft: string;
  missionType: string;
  cards: HopCard[];
  responses: HopResponse[];
  busted: boolean;
  bustPhase?: FlightPhase;
  totalTime: number; // seconds
  onStartNext: () => void;
};

export function DebriefPanel({
  aircraft,
  missionType,
  cards,
  responses,
  busted,
  bustPhase,
  totalTime,
  onStartNext,
}: Props) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const correct = responses.filter((r) => r.isCorrect).length;
  const total = responses.length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const minutes = Math.floor(totalTime / 60);
  const seconds = totalTime % 60;

  // Group mistakes by section for "what stacked"
  const mistakes = responses.filter((r) => !r.isCorrect);
  const sectionMistakes = new Map<string, number>();
  for (const m of mistakes) {
    const card = cards.find((c) => c.questionId === m.questionId);
    const name = card?.sectionName ?? "Unknown";
    sectionMistakes.set(name, (sectionMistakes.get(name) ?? 0) + 1);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-panel border border-[#1e252d] rounded-full mb-4">
          <span className={`w-2 h-2 rounded-full ${busted ? "bg-red-500" : "bg-accent-green"}`} />
          <span className="font-display text-xs tracking-widest text-[#8b949e]">
            {busted ? "BUST" : "DEBRIEF"}
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">
          {busted
            ? `Flight terminated at ${bustPhase ? PHASE_LABELS[bustPhase] : "unknown"}`
            : "Flight complete"}
        </h1>
        <p className="text-[#8b949e]">
          {aircraft} · {missionType} · {minutes}m {seconds}s
        </p>
      </div>

      {/* Score summary */}
      <div className={`p-6 rounded-lg border mb-6 ${
        busted ? "border-red-500/30 bg-red-500/5" : pct >= 80 ? "border-accent-green/30 bg-accent-green/5" : "border-amber-500/30 bg-amber-500/5"
      }`}>
        <div className="flex items-baseline gap-3">
          <span className="font-display text-3xl font-bold">{pct}%</span>
          <span className="text-[#8b949e]">{correct}/{total} correct</span>
        </div>
        {busted && (
          <p className="text-sm text-red-400 mt-2">
            Critical error ended the flight early.
          </p>
        )}
      </div>

      {/* What stacked */}
      {sectionMistakes.size > 0 && (
        <div className="mb-6">
          <h2 className="font-display text-sm text-[#8b949e] tracking-wider mb-3">
            WHAT STACKED
          </h2>
          <div className="space-y-2">
            {[...sectionMistakes.entries()]
              .sort(([, a], [, b]) => b - a)
              .map(([section, count]) => (
                <div
                  key={section}
                  className="flex items-center justify-between p-3 bg-bg-panel border border-[#1e252d] rounded"
                >
                  <span className="text-sm">{section}</span>
                  <span className="font-display text-xs text-amber-400">
                    {count} mistake{count > 1 ? "s" : ""}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Risk timeline */}
      <div className="mb-6">
        <h2 className="font-display text-sm text-[#8b949e] tracking-wider mb-3">
          RISK TIMELINE
        </h2>
        <div className="flex items-end gap-1 h-16">
          {responses.map((r, i) => {
            const height = Math.max((r.riskAfter / 10) * 100, 5);
            const color = r.wasBust
              ? "bg-red-500"
              : !r.isCorrect
                ? "bg-amber-500"
                : "bg-accent-green/40";
            return (
              <div
                key={i}
                className={`flex-1 rounded-t transition-all ${color}`}
                style={{ height: `${height}%` }}
                title={`Q${r.questionId}: risk ${r.riskAfter}/10`}
              />
            );
          })}
        </div>
      </div>

      {/* Per-card review */}
      <div className="mb-8">
        <h2 className="font-display text-sm text-[#8b949e] tracking-wider mb-3">
          CARD REVIEW
        </h2>
        <div className="space-y-2">
          {responses.map((r) => {
            const card = cards.find((c) => c.questionId === r.questionId);
            if (!card) return null;
            const isExpanded = expandedCard === r.questionId;
            return (
              <div key={r.questionId} className="bg-bg-panel border border-[#1e252d] rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedCard(isExpanded ? null : r.questionId)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-bg-elevated/50 transition"
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    r.wasBust ? "bg-red-500" : r.isCorrect ? "bg-accent-green" : "bg-amber-500"
                  }`} />
                  <span className="font-display text-xs text-[#5c6570] w-10">{r.questionId}</span>
                  <span className="text-sm flex-1 truncate">{card.stem}</span>
                  <span className="text-xs text-[#5c6570]">
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-[#1e252d]">
                    <div className="pt-3 space-y-2">
                      {!r.isCorrect && (
                        <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                          <span className="font-display text-[10px] text-red-400 block mb-1">YOUR ANSWER</span>
                          <span className="text-xs text-red-300">{card.options[r.selectedOption - 1]}</span>
                        </div>
                      )}
                      <div className="p-2 rounded bg-accent-green/10 border border-accent-green/20">
                        <span className="font-display text-[10px] text-accent-green block mb-1">CORRECT</span>
                        <span className="text-xs text-accent-green/90">{card.options[card.correctOption - 1]}</span>
                      </div>
                      <div className="p-2 rounded bg-bg-elevated border border-[#1e252d]">
                        <span className="font-display text-[10px] text-accent-amber block mb-1">WHY</span>
                        <span className="text-xs text-[#e8ecf0] leading-relaxed">{card.explanation}</span>
                      </div>
                      <p className="text-[10px] text-[#5c6570]">
                        TP 11919 Q{r.questionId} · {card.sectionName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onStartNext}
          className="flex-1 px-6 py-3 font-display font-semibold text-bg-deep bg-accent-green rounded hover:bg-[#00e077] transition"
        >
          Start Next Hop
        </button>
      </div>
    </div>
  );
}
