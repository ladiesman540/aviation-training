import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questions, sections } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { PSTAR_ANSWER_KEY } from "@/data/pstar-answer-key";
import { gradeAnswer } from "@/lib/grading";

/** GET: Fetch 50 random questions for exam sim (with explanations) */
export async function GET() {
  try {
    const all = await db
      .select({
        id: questions.id,
        stem: questions.stem,
        option1: questions.option1,
        option2: questions.option2,
        option3: questions.option3,
        option4: questions.option4,
        correctOption: questions.correctOption,
        sectionName: sections.name,
        explanation: questions.explanation,
      })
      .from(questions)
      .innerJoin(sections, eq(questions.sectionId, sections.id))
      .orderBy(sql`random()`)
      .limit(50);

    return NextResponse.json(all);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

/** POST: Grade responses and return score with per-question details */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const responses: { questionId: string; selectedOption: number }[] = body.responses ?? [];

    let correct = 0;
    const results: {
      questionId: string;
      selectedOption: number;
      isCorrect: boolean;
      correctOption: number;
    }[] = [];

    for (const r of responses) {
      const isCorrect = gradeAnswer(r.questionId, r.selectedOption, PSTAR_ANSWER_KEY);
      if (isCorrect) correct++;
      const correctOpt = PSTAR_ANSWER_KEY[r.questionId] ?? 0;
      results.push({ ...r, isCorrect, correctOption: correctOpt });
    }

    const total = responses.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = score >= 90;

    return NextResponse.json({
      score,
      correct,
      total,
      passed,
      results,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
