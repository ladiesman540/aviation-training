"use client";

import { useEffect, useState } from "react";
import { getRationale } from "@/data/rule-rationales";

type Ref = {
  id: number;
  questionId: string;
  referenceText: string;
  canonicalUrl: string | null;
};

type Props = {
  questionId: string;
  correctOption?: number;
  isOpen: boolean;
  onClose: () => void;
  hideCorrectAnswer?: boolean;
  explanation?: string;
  options?: string[];
};

export function SourcesDrawer({
  questionId,
  correctOption = 0,
  isOpen,
  onClose,
  hideCorrectAnswer,
  explanation,
  options,
}: Props) {
  const [refs, setRefs] = useState<Ref[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !questionId) return;
    setLoading(true);
    fetch(`/api/refs?questionId=${encodeURIComponent(questionId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRefs(data);
        else setRefs([]);
      })
      .catch(() => setRefs([]))
      .finally(() => setLoading(false));
  }, [questionId, isOpen]);

  if (!isOpen) return null;

  const correctLabel = options && correctOption > 0
    ? options[correctOption - 1]
    : `Option ${correctOption}`;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-bg-panel border-l border-[#1e252d] shadow-xl z-50 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-[#1e252d]">
          <h2 className="font-display font-semibold text-sm tracking-wider">SOURCES</h2>
          <button
            onClick={onClose}
            className="text-[#8b949e] hover:text-[#e8ecf0] rounded p-1 text-lg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 space-y-5">
          {/* Question ID */}
          <div>
            <span className="font-display text-[10px] text-[#5c6570] tracking-wider">QUESTION ID</span>
            <p className="font-display text-accent-green mt-1">TP 11919 Q{questionId}</p>
          </div>

          {/* Correct answer */}
          {!hideCorrectAnswer && correctOption > 0 && (
            <div>
              <span className="font-display text-[10px] text-[#5c6570] tracking-wider">CORRECT ANSWER</span>
              <p className="text-sm mt-1">
                <span className="font-display text-accent-green">({correctOption})</span>{" "}
                {correctLabel}
              </p>
            </div>
          )}

          {/* Explanation */}
          {explanation && (
            <div className="bg-bg-elevated rounded-lg p-4 border border-[#1e252d]">
              <span className="font-display text-[10px] text-accent-amber tracking-wider block mb-2">
                WHY THIS IS CORRECT
              </span>
              <p className="text-sm text-[#e8ecf0] leading-relaxed">{explanation}</p>
            </div>
          )}

          {/* Rule Rationale */}
          {questionId && (() => {
            const rationale = getRationale(questionId);
            if (!rationale) return null;
            return (
              <div className="bg-accent-blue/5 rounded-lg p-4 border border-accent-blue/20">
                <span className="font-display text-[10px] text-accent-blue tracking-wider block mb-1">
                  WHY THIS RULE EXISTS
                </span>
                <p className="font-display text-xs text-accent-blue/80 mb-2">{rationale.title}</p>
                <p className="text-sm text-[#8b949e] leading-relaxed">{rationale.rationale}</p>
              </div>
            );
          })()}

          {/* References */}
          <div>
            <span className="font-display text-[10px] text-[#5c6570] tracking-wider">REFERENCES</span>
            {loading ? (
              <p className="text-sm text-[#8b949e] mt-2">Loading...</p>
            ) : refs.length === 0 ? (
              <p className="text-sm text-amber-500 mt-2">No references found (invariant violated)</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {refs.map((ref) => (
                  <li key={ref.id} className="p-3 bg-bg-elevated rounded border border-[#1e252d]">
                    <p className="text-sm text-[#e8ecf0]">{ref.referenceText}</p>
                    {ref.canonicalUrl && (
                      <a
                        href={ref.canonicalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-1 text-xs text-accent-blue hover:underline truncate"
                      >
                        {ref.canonicalUrl}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Doc version */}
          <div className="pt-4 border-t border-[#1e252d]">
            <p className="text-[10px] text-[#5c6570]">
              Source: TP 11919E — 7th Edition, December 2022
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
