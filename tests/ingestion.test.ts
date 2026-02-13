import { describe, it, expect } from "vitest";
import { PSTAR_QUESTIONS } from "../src/data/pstar-questions";
import { PSTAR_ANSWER_KEY } from "../src/data/pstar-answer-key";
import { PSTAR_REFERENCES } from "../src/data/pstar-references";

describe("ingestion", () => {
  it("answer key has entry for every question", () => {
    for (const q of PSTAR_QUESTIONS) {
      expect(PSTAR_ANSWER_KEY[q.id]).toBeDefined();
      expect([1, 2, 3, 4]).toContain(PSTAR_ANSWER_KEY[q.id]);
    }
  });

  it("no duplicate question IDs", () => {
    const ids = PSTAR_QUESTIONS.map((q) => q.id);
    const set = new Set(ids);
    expect(set.size).toBe(ids.length);
  });

  it("no orphan references", () => {
    const questionIds = new Set(PSTAR_QUESTIONS.map((q) => q.id));
    for (const ref of PSTAR_REFERENCES) {
      expect(questionIds.has(ref.questionId)).toBe(true);
    }
  });

  it("references cover all questions", () => {
    const refIds = new Set(PSTAR_REFERENCES.map((r) => r.questionId));
    for (const q of PSTAR_QUESTIONS) {
      expect(refIds.has(q.id)).toBe(true);
    }
  });
});
