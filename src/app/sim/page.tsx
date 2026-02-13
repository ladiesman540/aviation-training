"use client";

import { useEffect, useState } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { SourcesDrawer } from "@/components/SourcesDrawer";
import Link from "next/link";

type Question = {
  id: string;
  stem: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
  sectionName: string;
  explanation: string;
};

type GradedResult = {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  correctOption: number;
};

export default function SimPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    correct: number;
    total: number;
    passed: boolean;
    results: GradedResult[];
  } | null>(null);
  const [drawerQ, setDrawerQ] = useState<Question | null>(null);
  const [reviewExpanded, setReviewExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/sim")
      .then((r) => r.json())
      .then((data) => {
        setQuestions(Array.isArray(data) ? data : []);
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (questionId: string, option: number) => {
    setResponses((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    const res = Object.entries(responses).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));
    fetch("/api/sim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ responses: res }),
    })
      .then((r) => r.json())
      .then((data) => {
        setResult(data);
        setSubmitted(true);
      });
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-[#8b949e] font-display">Loading exam...</p>
      </div>
    );
  }

  // Results view with explanations
  if (submitted && result) {
    // Group incorrect by section
    const sectionMistakes = new Map<string, number>();
    for (const r of result.results) {
      if (!r.isCorrect) {
        const q = questions.find((q) => q.id === r.questionId);
        const name = q?.sectionName ?? "Unknown";
        sectionMistakes.set(name, (sectionMistakes.get(name) ?? 0) + 1);
      }
    }

    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Score header */}
        <div className="mb-8">
          <span className="font-display text-xs tracking-widest text-accent-green/70">EXAM RESULTS</span>
          <div
            className={`mt-4 p-6 rounded-lg border-2 ${
              result.passed ? "border-accent-green bg-accent-green/10" : "border-red-500 bg-red-500/10"
            }`}
          >
            <p className="text-3xl font-display font-bold">
              {result.score}% — {result.passed ? "PASS" : "FAIL"}
            </p>
            <p className="text-[#8b949e] mt-1">
              {result.correct} / {result.total} correct (90% required)
            </p>
          </div>
        </div>

        {/* Weak areas */}
        {sectionMistakes.size > 0 && (
          <div className="mb-8">
            <h2 className="font-display text-sm text-[#8b949e] tracking-wider mb-3">WEAK AREAS</h2>
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
                      {count} wrong
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Per-question review */}
        <div className="mb-8">
          <h2 className="font-display text-sm text-[#8b949e] tracking-wider mb-3">QUESTION REVIEW</h2>
          <div className="space-y-2">
            {result.results.map((r) => {
              const q = questions.find((q) => q.id === r.questionId);
              if (!q) return null;
              const isExpanded = reviewExpanded === r.questionId;

              return (
                <div key={r.questionId} className="bg-bg-panel border border-[#1e252d] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setReviewExpanded(isExpanded ? null : r.questionId)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-bg-elevated/50 transition"
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      r.isCorrect ? "bg-accent-green" : "bg-red-500"
                    }`} />
                    <span className="font-display text-xs text-[#5c6570] w-10">{r.questionId}</span>
                    <span className="text-sm flex-1 truncate">{q.stem}</span>
                    <span className="text-xs text-[#5c6570]">{isExpanded ? "▲" : "▼"}</span>
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-[#1e252d] pt-3 space-y-2">
                      {!r.isCorrect && (
                        <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                          <span className="font-display text-[10px] text-red-400 block mb-1">YOUR ANSWER</span>
                          <span className="text-xs text-red-300">
                            ({r.selectedOption}) {[q.option1, q.option2, q.option3, q.option4][r.selectedOption - 1]}
                          </span>
                        </div>
                      )}
                      <div className="p-2 rounded bg-accent-green/10 border border-accent-green/20">
                        <span className="font-display text-[10px] text-accent-green block mb-1">CORRECT</span>
                        <span className="text-xs text-accent-green/90">
                          ({r.correctOption}) {[q.option1, q.option2, q.option3, q.option4][r.correctOption - 1]}
                        </span>
                      </div>
                      <div className="p-2 rounded bg-bg-elevated border border-[#1e252d]">
                        <span className="font-display text-[10px] text-accent-amber block mb-1">WHY</span>
                        <span className="text-xs text-[#e8ecf0] leading-relaxed">{q.explanation}</span>
                      </div>
                      <button
                        onClick={() => setDrawerQ(q)}
                        className="text-[10px] text-accent-blue hover:underline font-display"
                      >
                        VIEW FULL SOURCES
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/sim"
            className="flex-1 px-6 py-3 font-display font-semibold text-bg-deep bg-accent-green rounded text-center hover:bg-[#00e077] transition"
          >
            Retake Exam
          </Link>
          <Link
            href="/hop"
            className="flex-1 px-6 py-3 font-display font-semibold text-accent-green border border-accent-green/30 rounded text-center hover:bg-accent-green/10 transition"
          >
            Train Weak Areas
          </Link>
        </div>

        <SourcesDrawer
          questionId={drawerQ?.id ?? ""}
          correctOption={drawerQ?.correctOption ?? 0}
          isOpen={!!drawerQ}
          onClose={() => setDrawerQ(null)}
          explanation={drawerQ?.explanation}
          options={
            drawerQ
              ? [drawerQ.option1, drawerQ.option2, drawerQ.option3, drawerQ.option4]
              : undefined
          }
        />
      </div>
    );
  }

  // Question view
  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-[#8b949e]">No questions available. Run seed first.</p>
      </div>
    );
  }

  const q = questions[currentIndex]!;
  const selected = responses[q.id];
  const answeredCount = Object.keys(responses).length;

  return (
    <div className="max-w-2xl mx-auto px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="font-display text-xs tracking-widest text-accent-green/70">PSTAR EXAM SIM</span>
          <p className="text-sm text-[#8b949e] mt-1">
            {answeredCount}/{questions.length} answered
          </p>
        </div>
        <span className="font-display text-sm text-[#8b949e]">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[#1e252d] rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-accent-green/50 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <QuestionCard
        id={q.id}
        stem={q.stem}
        options={[q.option1, q.option2, q.option3, q.option4]}
        onSelect={(opt) => handleSelect(q.id, opt)}
        selectedOption={selected}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-sm border border-[#1e252d] rounded disabled:opacity-30 hover:border-accent-green/30 transition"
        >
          Back
        </button>
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="px-6 py-2 text-sm bg-accent-green/20 text-accent-green border border-accent-green/30 rounded hover:bg-accent-green/30 transition"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={answeredCount < questions.length}
            className="px-6 py-2 text-sm font-semibold bg-accent-green text-bg-deep rounded hover:bg-[#00e077] disabled:opacity-50 transition"
          >
            Submit ({answeredCount}/{questions.length})
          </button>
        )}
      </div>
    </div>
  );
}
