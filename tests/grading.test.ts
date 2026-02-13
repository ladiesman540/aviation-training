import { describe, it, expect } from "vitest";
import { gradeAnswer } from "../src/lib/grading";
import { PSTAR_ANSWER_KEY } from "../src/data/pstar-answer-key";

describe("grading", () => {
  it("grades 1.01 correctly", () => {
    const correct = PSTAR_ANSWER_KEY["1.01"];
    expect(gradeAnswer("1.01", correct!, PSTAR_ANSWER_KEY)).toBe(true);
    if (correct !== 1) expect(gradeAnswer("1.01", 1, PSTAR_ANSWER_KEY)).toBe(false);
  });

  it("grades 3.18 (mayday) correctly", () => {
    expect(gradeAnswer("3.18", 1, PSTAR_ANSWER_KEY)).toBe(true);
  });

  it("returns false for unknown question", () => {
    expect(gradeAnswer("99.99", 1, PSTAR_ANSWER_KEY)).toBe(false);
  });
});
