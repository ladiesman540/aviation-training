"use client";

import { useEffect, useState } from "react";
import {
  loadMastery,
  getSectionMastery,
  getWeakestQuestions,
  type SectionMastery,
} from "@/lib/mastery";

type QuestionSummary = {
  id: string;
  sectionName: string;
  sectionNumber: number;
};

export default function ProgressPage() {
  const [sectionData, setSectionData] = useState<SectionMastery[]>([]);
  const [weakQuestions, setWeakQuestions] = useState<{ id: string; accuracy: number; timesSeen: number }[]>([]);
  const [totalSeen, setTotalSeen] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all questions to build section mapping
    fetch("/api/questions")
      .then((r) => r.json())
      .then((data: QuestionSummary[]) => {
        if (!Array.isArray(data)) return;

        const sections = getSectionMastery(
          data.map((q) => ({
            id: q.id,
            sectionNumber: q.sectionNumber,
            sectionName: q.sectionName,
          }))
        );
        setSectionData(sections);

        const store = loadMastery();
        let seen = 0;
        let correct = 0;
        for (const m of Object.values(store)) {
          seen += m.timesSeen;
          correct += m.timesCorrect;
        }
        setTotalSeen(seen);
        setTotalCorrect(correct);

        setWeakQuestions(getWeakestQuestions(10));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const overallAccuracy = totalSeen > 0 ? Math.round((totalCorrect / totalSeen) * 100) : 0;
  const uniqueQuestionsSeen = Object.keys(loadMastery()).filter(
    (k) => (loadMastery()[k]?.timesSeen ?? 0) > 0
  ).length;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-[#8b949e] font-display">Loading progress...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <span className="font-display text-xs tracking-widest text-accent-green/70">PROGRESS</span>
        <h1 className="font-display text-2xl font-bold mt-2">Your Mastery</h1>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-bg-panel border border-[#1e252d] rounded-lg p-4 text-center">
          <p className="font-display text-2xl font-bold text-accent-green">{overallAccuracy}%</p>
          <p className="text-xs text-[#5c6570] mt-1">Accuracy</p>
        </div>
        <div className="bg-bg-panel border border-[#1e252d] rounded-lg p-4 text-center">
          <p className="font-display text-2xl font-bold">{uniqueQuestionsSeen}</p>
          <p className="text-xs text-[#5c6570] mt-1">Questions seen</p>
        </div>
        <div className="bg-bg-panel border border-[#1e252d] rounded-lg p-4 text-center">
          <p className="font-display text-2xl font-bold">{totalSeen}</p>
          <p className="text-xs text-[#5c6570] mt-1">Total responses</p>
        </div>
      </div>

      {/* Section mastery */}
      <div className="mb-8">
        <h2 className="font-display text-sm text-[#8b949e] tracking-wider mb-3">
          SECTION MASTERY
        </h2>
        <div className="space-y-2">
          {sectionData.map((s) => {
            const pct = Math.round(s.accuracy * 100);
            const barColor =
              s.questionsSeen === 0
                ? "bg-[#1e252d]"
                : pct >= 80
                  ? "bg-accent-green"
                  : pct >= 60
                    ? "bg-amber-400"
                    : "bg-red-500";

            return (
              <div
                key={s.sectionNumber}
                className="bg-bg-panel border border-[#1e252d] rounded-lg p-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">
                    <span className="font-display text-xs text-[#5c6570] mr-2">
                      {s.sectionNumber}.
                    </span>
                    {s.sectionName}
                  </span>
                  <span className="font-display text-xs tabular-nums text-[#8b949e]">
                    {s.questionsSeen === 0 ? "—" : `${pct}%`}
                    <span className="text-[#5c6570] ml-1">
                      ({s.questionsSeen}/{s.totalQuestions})
                    </span>
                  </span>
                </div>
                <div className="h-1.5 bg-[#1e252d] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{
                      width: s.questionsSeen === 0 ? "0%" : `${Math.max(pct, 3)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weakest questions */}
      {weakQuestions.length > 0 && (
        <div className="mb-8">
          <h2 className="font-display text-sm text-[#8b949e] tracking-wider mb-3">
            WEAKEST QUESTIONS
          </h2>
          <div className="space-y-1">
            {weakQuestions.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between p-2 bg-bg-panel border border-[#1e252d] rounded"
              >
                <span className="font-display text-sm text-accent-amber">{q.id}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#5c6570]">{q.timesSeen} seen</span>
                  <span className={`font-display text-xs ${
                    q.accuracy < 0.5 ? "text-red-400" : "text-amber-400"
                  }`}>
                    {Math.round(q.accuracy * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalSeen === 0 && (
        <div className="text-center py-12">
          <p className="text-[#8b949e] mb-4">
            No data yet. Complete a Quick Hop or Exam Sim to start tracking.
          </p>
          <a
            href="/hop"
            className="inline-block px-6 py-3 font-display font-semibold text-bg-deep bg-accent-green rounded hover:bg-[#00e077] transition"
          >
            Start Your First Hop
          </a>
        </div>
      )}
    </div>
  );
}
