"use client";

import { useState } from "react";
import { getRationale } from "@/data/rule-rationales";

type Props = {
  id: string;
  stem: string;
  options: [string, string, string, string];
  correctOption?: number;
  showAnswer?: boolean;
  onSelect?: (option: number) => void;
  selectedOption?: number;
  // Game layer
  flightContext?: string;
  explanation?: string;
  isCritical?: boolean;
  riskPoints?: number;
  sectionName?: string;
  /** Whether to show inline feedback after answering */
  showFeedback?: boolean;
};

export function QuestionCard({
  id,
  stem,
  options,
  correctOption = 1,
  showAnswer = false,
  onSelect,
  selectedOption,
  flightContext,
  explanation,
  isCritical,
  riskPoints,
  sectionName,
  showFeedback = false,
}: Props) {
  const answered = selectedOption !== undefined;
  const isCorrect = answered && selectedOption === correctOption;
  const showingFeedback = showFeedback && answered;
  const [showRationale, setShowRationale] = useState(false);

  const rationale = getRationale(id);

  return (
    <article className="bg-bg-panel border border-[#1e252d] rounded-lg overflow-hidden">
      {/* Flight context banner */}
      {flightContext && (
        <div className="px-6 py-3 bg-bg-elevated border-b border-[#1e252d]">
          <p className="text-sm text-[#8b949e] leading-relaxed italic">
            {flightContext}
          </p>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <span className="font-display text-xs text-accent-amber">{id}</span>
          <div className="flex items-center gap-2">
            {isCritical && (
              <span className="font-display text-[10px] text-red-400 px-1.5 py-0.5 border border-red-500/30 rounded bg-red-500/10">
                CRITICAL
              </span>
            )}
            {showAnswer && (
              <span className="font-display text-xs text-accent-green">
                Correct: ({correctOption})
              </span>
            )}
          </div>
        </div>

        {/* Stem */}
        <p className="text-[#e8ecf0] mb-6 leading-relaxed">{stem}</p>

        {/* Options */}
        <div className="space-y-3">
          {options.map((opt, i) => {
            const optionNum = (i + 1) as 1 | 2 | 3 | 4;
            const isSelected = selectedOption === optionNum;
            const isCorrectOpt = showingFeedback && correctOption === optionNum;
            const isWrongSelected = showingFeedback && isSelected && !isCorrect;

            return (
              <button
                key={i}
                type="button"
                onClick={() => !answered && onSelect?.(optionNum)}
                disabled={!onSelect || answered}
                className={`w-full text-left p-3 rounded border transition ${
                  isCorrectOpt
                    ? "border-accent-green bg-accent-green/10"
                    : isWrongSelected
                      ? "border-red-500 bg-red-500/10"
                      : isSelected
                        ? "border-accent-green/50 bg-accent-green/5"
                        : "border-[#1e252d] hover:border-accent-green/30 hover:bg-accent-green/5 disabled:hover:border-[#1e252d] disabled:hover:bg-transparent"
                }`}
              >
                <span className="font-display text-xs text-[#5c6570] mr-2">
                  ({optionNum})
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Inline feedback */}
        {showingFeedback && (
          <div className={`mt-4 p-4 rounded border ${
            isCorrect
              ? "bg-accent-green/5 border-accent-green/20"
              : "bg-amber-500/5 border-amber-500/20"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-display text-xs tracking-wider ${
                isCorrect ? "text-accent-green" : "text-amber-400"
              }`}>
                {isCorrect ? "CORRECT" : `RISK +${riskPoints ?? 1}`}
              </span>
              {!isCorrect && sectionName && (
                <span className="text-[10px] text-[#5c6570]">· {sectionName}</span>
              )}
            </div>
            {explanation && (
              <p className="text-sm text-[#e8ecf0] leading-relaxed">{explanation}</p>
            )}
            <p className="text-[10px] text-[#5c6570] mt-2">
              TP 11919 Q{id}
            </p>

            {/* Expandable rule rationale */}
            {rationale && (
              <div className="mt-3 pt-3 border-t border-[#1e252d]/50">
                <button
                  onClick={() => setShowRationale(!showRationale)}
                  className="flex items-center gap-2 text-xs text-accent-blue hover:text-accent-blue/80 transition"
                >
                  <span className="font-display tracking-wider">
                    {showRationale ? "▾" : "▸"} WHY DOES THIS RULE EXIST?
                  </span>
                </button>
                {showRationale && (
                  <div className="mt-2 pl-3 border-l-2 border-accent-blue/20">
                    <p className="font-display text-[10px] text-accent-blue/70 tracking-wider mb-1.5">
                      {rationale.title}
                    </p>
                    <p className="text-sm text-[#8b949e] leading-relaxed">
                      {rationale.rationale}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Show rationale in Question Bank mode (showAnswer but not showFeedback) */}
        {showAnswer && !showFeedback && rationale && (
          <div className="mt-4">
            <button
              onClick={() => setShowRationale(!showRationale)}
              className="flex items-center gap-2 text-xs text-accent-blue hover:text-accent-blue/80 transition"
            >
              <span className="font-display tracking-wider">
                {showRationale ? "▾" : "▸"} WHY DOES THIS RULE EXIST?
              </span>
            </button>
            {showRationale && (
              <div className="mt-2 p-4 rounded bg-bg-elevated border border-[#1e252d]">
                <p className="font-display text-[10px] text-accent-blue/70 tracking-wider mb-1.5">
                  {rationale.title}
                </p>
                <p className="text-sm text-[#8b949e] leading-relaxed">
                  {rationale.rationale}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
