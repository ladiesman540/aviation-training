import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questions, sections } from "@/db/schema";
import { and, eq, like, or, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const sectionId = searchParams.get("section");

  try {
    const conditions: ReturnType<typeof eq>[] = [];

    if (q.trim()) {
      const term = q.trim();
      const exactId = /^\d+\.\d+$/.test(term) ? term : null;
      const sectionPrefix = /^\d+\.?$/.test(term) ? term.replace(/\.$/, "") : null;

      if (exactId) {
        conditions.push(eq(questions.id, exactId));
      } else if (sectionPrefix) {
        conditions.push(like(questions.id, `${sectionPrefix}.%`));
      } else {
        const textCond = or(
          like(questions.stem, `%${term}%`),
          like(questions.option1, `%${term}%`),
          like(questions.option2, `%${term}%`),
          like(questions.option3, `%${term}%`),
          like(questions.option4, `%${term}%`)
        );
        if (textCond) conditions.push(textCond);
      }
    }

    if (sectionId) {
      const parsedSectionId = Number.parseInt(sectionId, 10);
      if (Number.isNaN(parsedSectionId)) {
        return NextResponse.json(
          { error: "Invalid section parameter" },
          { status: 400 }
        );
      }
      conditions.push(eq(sections.id, parsedSectionId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const result = await db
      .select({
        id: questions.id,
        stem: questions.stem,
        option1: questions.option1,
        option2: questions.option2,
        option3: questions.option3,
        option4: questions.option4,
        correctOption: questions.correctOption,
        sectionName: sections.name,
        sectionNumber: sections.number,
        explanation: questions.explanation,
        phase: questions.phase,
        flightContext: questions.flightContext,
      })
      .from(questions)
      .innerJoin(sections, eq(questions.sectionId, sections.id))
      .where(whereClause ?? sql`1=1`)
      .orderBy(questions.id);

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: String(e) },
      { status: 500 }
    );
  }
}
