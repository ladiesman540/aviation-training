/**
 * Client-side mastery tracking via localStorage.
 * Tracks per-question stats: times seen, times correct, last seen.
 * Will be migrated to server-side with auth in Phase 7.
 */

export type QuestionMastery = {
  timesSeen: number;
  timesCorrect: number;
  lastSeenAt: number; // timestamp
};

export type MasteryStore = Record<string, QuestionMastery>;

const STORAGE_KEY = "skytrail_mastery";

export function loadMastery(): MasteryStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveMastery(store: MasteryStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage full or unavailable
  }
}

export function recordAnswer(questionId: string, isCorrect: boolean): void {
  const store = loadMastery();
  const existing = store[questionId] ?? { timesSeen: 0, timesCorrect: 0, lastSeenAt: 0 };
  store[questionId] = {
    timesSeen: existing.timesSeen + 1,
    timesCorrect: existing.timesCorrect + (isCorrect ? 1 : 0),
    lastSeenAt: Date.now(),
  };
  saveMastery(store);
}

export function getAccuracy(questionId: string): number {
  const store = loadMastery();
  const m = store[questionId];
  if (!m || m.timesSeen === 0) return -1; // never seen
  return m.timesCorrect / m.timesSeen;
}

export type SectionMastery = {
  sectionName: string;
  sectionNumber: number;
  totalQuestions: number;
  questionsSeen: number;
  totalCorrect: number;
  totalSeen: number;
  accuracy: number;
};

/**
 * Get mastery summary grouped by section.
 * Takes a list of all question IDs with their section info.
 */
export function getSectionMastery(
  questions: { id: string; sectionNumber: number; sectionName: string }[]
): SectionMastery[] {
  const store = loadMastery();
  const sections = new Map<number, { name: string; ids: string[] }>();

  for (const q of questions) {
    const existing = sections.get(q.sectionNumber);
    if (existing) {
      existing.ids.push(q.id);
    } else {
      sections.set(q.sectionNumber, { name: q.sectionName, ids: [q.id] });
    }
  }

  const result: SectionMastery[] = [];
  for (const [num, { name, ids }] of sections) {
    let totalSeen = 0;
    let totalCorrect = 0;
    let questionsSeen = 0;
    for (const id of ids) {
      const m = store[id];
      if (m && m.timesSeen > 0) {
        questionsSeen++;
        totalSeen += m.timesSeen;
        totalCorrect += m.timesCorrect;
      }
    }
    result.push({
      sectionName: name,
      sectionNumber: num,
      totalQuestions: ids.length,
      questionsSeen,
      totalSeen,
      totalCorrect,
      accuracy: totalSeen > 0 ? totalCorrect / totalSeen : 0,
    });
  }

  return result.sort((a, b) => a.sectionNumber - b.sectionNumber);
}

/**
 * Get the weakest question IDs (lowest accuracy, minimum 1 seen).
 */
export function getWeakestQuestions(limit: number = 10): { id: string; accuracy: number; timesSeen: number }[] {
  const store = loadMastery();
  const entries = Object.entries(store)
    .filter(([, m]) => m.timesSeen > 0)
    .map(([id, m]) => ({
      id,
      accuracy: m.timesCorrect / m.timesSeen,
      timesSeen: m.timesSeen,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return entries.slice(0, limit);
}
