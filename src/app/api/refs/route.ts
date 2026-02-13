import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questionReferences } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get("questionId");

  if (!questionId) {
    return NextResponse.json(
      { error: "questionId required" },
      { status: 400 }
    );
  }

  try {
    const refs = await db
      .select()
      .from(questionReferences)
      .where(eq(questionReferences.questionId, questionId));

    if (refs.length === 0) {
      return NextResponse.json(
        { error: "No references found for this question. Invariant violated." },
        { status: 404 }
      );
    }

    return NextResponse.json(refs);
  } catch (e) {
    return NextResponse.json(
      { error: String(e) },
      { status: 500 }
    );
  }
}
