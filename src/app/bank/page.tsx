"use client";

import { useEffect, useState } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { SourcesDrawer } from "@/components/SourcesDrawer";

type Question = {
  id: string;
  stem: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
  sectionName: string;
  sectionNumber: number;
  explanation: string;
  phase: string;
  flightContext: string;
};

type Section = { id: number; number: number; name: string };

export default function BankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sections] = useState<Section[]>([
    { id: 1, number: 1, name: "Collision Avoidance" },
    { id: 2, number: 2, name: "Visual Signals" },
    { id: 3, number: 3, name: "Communications" },
    { id: 4, number: 4, name: "Aerodromes" },
    { id: 5, number: 5, name: "Equipment" },
    { id: 6, number: 6, name: "Pilot Responsibilities" },
    { id: 7, number: 7, name: "Wake Turbulence" },
    { id: 8, number: 8, name: "Aeromedical" },
    { id: 9, number: 9, name: "Flight Plans and Flight Itineraries" },
    { id: 10, number: 10, name: "Clearances and Instructions" },
    { id: 11, number: 11, name: "Aircraft Operations" },
    { id: 12, number: 12, name: "Regulations – Canadian Airspace" },
    { id: 13, number: 13, name: "Controlled Airspace" },
    { id: 14, number: 14, name: "Aviation Occurrences" },
  ]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [drawerQuestion, setDrawerQuestion] = useState<Question | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (sectionFilter) params.set("section", sectionFilter);
    fetch(`/api/questions?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setQuestions(Array.isArray(data) ? data : []);
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [search, sectionFilter]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-4">
      <div className="mb-6">
        <span className="font-display text-xs tracking-widest text-accent-green/70">QUESTION BANK</span>
        <h1 className="font-display text-2xl font-bold mt-2">
          All {questions.length > 0 ? questions.length : 185} PSTAR Questions
        </h1>
        <p className="text-sm text-[#8b949e] mt-1">
          Search by ID, section, or keyword. Every question shows the official source chain.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder='Search by ID (e.g. "3.14") or section ("3.") or keyword'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2.5 bg-bg-panel border border-[#1e252d] rounded-lg text-[#e8ecf0] placeholder:text-[#5c6570] focus:outline-none focus:border-accent-green/30"
        />
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="px-4 py-2.5 bg-bg-panel border border-[#1e252d] rounded-lg text-[#e8ecf0]"
        >
          <option value="">All sections</option>
          {sections.map((s) => (
            <option key={s.id} value={String(s.id)}>
              {s.number}. {s.name}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-[#8b949e] cursor-pointer">
          <input
            type="checkbox"
            checked={showAnswer}
            onChange={(e) => setShowAnswer(e.target.checked)}
            className="accent-accent-green"
          />
          Show answers
        </label>
      </div>

      {loading ? (
        <p className="text-[#8b949e]">Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-[#8b949e]">No questions found.</p>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id}>
              <QuestionCard
                id={q.id}
                stem={q.stem}
                options={[q.option1, q.option2, q.option3, q.option4]}
                correctOption={q.correctOption}
                showAnswer={showAnswer}
                explanation={showAnswer ? q.explanation : undefined}
                showFeedback={false}
              />
              <button
                onClick={() => setDrawerQuestion(q)}
                className="mt-2 text-xs text-accent-blue hover:underline font-display tracking-wider"
              >
                VIEW SOURCES
              </button>
            </div>
          ))}
        </div>
      )}

      <SourcesDrawer
        questionId={drawerQuestion?.id ?? ""}
        correctOption={drawerQuestion?.correctOption ?? 1}
        isOpen={!!drawerQuestion}
        onClose={() => setDrawerQuestion(null)}
        explanation={drawerQuestion?.explanation}
        options={
          drawerQuestion
            ? [drawerQuestion.option1, drawerQuestion.option2, drawerQuestion.option3, drawerQuestion.option4]
            : undefined
        }
      />
    </div>
  );
}
