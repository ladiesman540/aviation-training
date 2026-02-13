import "dotenv/config";
import { db } from "./index";
import {
  sections,
  questions,
  questionReferences,
  docMetadata,
} from "./schema";
import { SECTIONS } from "@/data/sections";
import { PSTAR_QUESTIONS } from "@/data/pstar-questions";
import { PSTAR_ANSWER_KEY } from "@/data/pstar-answer-key";
import { PSTAR_REFERENCES } from "@/data/pstar-references";
import { PSTAR_ENRICHMENT } from "@/data/pstar-enrichment";
import { docMetadata as meta } from "@/data/doc-metadata";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data (determinism: running seed twice yields identical data)
  await db.delete(questionReferences);
  await db.delete(questions);
  await db.delete(docMetadata);
  await db.delete(sections);

  // Sections
  const sectionRows = await db
    .insert(sections)
    .values(
      SECTIONS.map((s) => ({ number: s.number, name: s.name }))
    )
    .returning({ id: sections.id });

  const sectionIdByNumber = new Map<number, number>();
  SECTIONS.forEach((s, i) => {
    sectionIdByNumber.set(s.number, sectionRows[i]!.id);
  });

  // Questions (with enrichment data)
  for (const q of PSTAR_QUESTIONS) {
    const sectionId = sectionIdByNumber.get(q.sectionNumber);
    if (!sectionId) throw new Error(`Unknown section ${q.sectionNumber}`);
    const correct = PSTAR_ANSWER_KEY[q.id];
    if (!correct) throw new Error(`Missing answer key for ${q.id}`);
    const enrichment = PSTAR_ENRICHMENT[q.id];
    if (!enrichment) throw new Error(`Missing enrichment for ${q.id}`);

    await db.insert(questions).values({
      id: q.id,
      sectionId,
      stem: q.stem,
      option1: q.option1,
      option2: q.option2,
      option3: q.option3,
      option4: q.option4,
      correctOption: correct,
      phase: enrichment.phase,
      flightContext: enrichment.flightContext,
      explanation: enrichment.explanation,
      isCritical: enrichment.criticality === "critical",
      riskPoints: enrichment.riskPoints,
    });
  }

  // References
  for (const ref of PSTAR_REFERENCES) {
    await db.insert(questionReferences).values({
      questionId: ref.questionId,
      referenceText: ref.referenceText,
      canonicalUrl: ref.canonicalUrl ?? null,
    });
  }

  // Doc metadata
  await db.insert(docMetadata).values({
    name: meta.name,
    edition: meta.edition,
    date: meta.date,
    sha256Hash: meta.sha256Hash,
  });

  console.log("Seed complete.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
