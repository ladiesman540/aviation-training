import type { AnswerKey } from "@/types";

/** Deterministic grading: answer from key only. No LLM, no fuzzy matching. */
export function gradeAnswer(
  questionId: string,
  selectedOption: number,
  answerKey: AnswerKey
): boolean {
  const correct = answerKey[questionId];
  if (correct === undefined) return false;
  return selectedOption === correct;
}
