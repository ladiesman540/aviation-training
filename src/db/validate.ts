import "dotenv/config";
import { db } from "./index";
import { questions, questionReferences, docMetadata } from "./schema";
import { PSTAR_QUESTIONS } from "@/data/pstar-questions";
import { PSTAR_ANSWER_KEY } from "@/data/pstar-answer-key";

async function validate() {
  let errors = 0;

  // 1. Every question has an answer key entry
  for (const q of PSTAR_QUESTIONS) {
    if (!PSTAR_ANSWER_KEY[q.id]) {
      console.error(`Missing answer key for ${q.id}`);
      errors++;
    }
  }
  if (errors === 0) {
    console.log(`Answer key: ${PSTAR_QUESTIONS.length}/${PSTAR_QUESTIONS.length} complete`);
  }

  // 2. No duplicate question IDs
  const ids = PSTAR_QUESTIONS.map((q) => q.id);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length > 0) {
    console.error("Duplicate question IDs:", [...new Set(dupes)]);
    errors += dupes.length;
  } else {
    console.log("No duplicate question IDs");
  }

  // 3. DB: all questions in DB have references
  const dbQuestions = await db.select({ id: questions.id }).from(questions);
  const refs = await db.select({ questionId: questionReferences.questionId }).from(questionReferences);
  const refIds = new Set(refs.map((r) => r.questionId));
  let missingRefs = 0;
  for (const q of dbQuestions) {
    if (!refIds.has(q.id)) {
      console.error(`Question ${q.id} has no references`);
      missingRefs++;
    }
  }
  if (missingRefs === 0) {
    console.log(`References: ${refIds.size} questions have references`);
  } else {
    errors += missingRefs;
  }

  // 4. Doc metadata present
  const meta = await db.select().from(docMetadata).limit(1);
  if (meta.length === 0) {
    console.error("No doc metadata");
    errors++;
  } else {
    console.log(`Doc: ${meta[0]!.name} ${meta[0]!.edition} Ed, ${meta[0]!.date}`);
  }

  if (errors > 0) {
    console.error(`${errors} validation error(s)`);
    process.exit(1);
  }
  console.log("Validation passed.");
}

validate().catch((e) => {
  console.error(e);
  process.exit(1);
});
