export type FlightPhase = "preflight" | "taxi_depart" | "enroute" | "arrival";

export type Criticality = "minor" | "critical";

/** Raw question record from TP 11919 — just the official content, no game layer */
export type QuestionRecord = {
  id: string;
  sectionNumber: number;
  stem: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
};

/** Question enriched with game layer data */
export type EnrichedQuestion = QuestionRecord & {
  phase: FlightPhase;
  flightContext: string;
  explanation: string;
  criticality: Criticality;
  riskPoints: number;
  correctOption: 1 | 2 | 3 | 4;
  sectionName: string;
};

export type AnswerKey = Record<string, 1 | 2 | 3 | 4>;

export type QuestionReference = {
  questionId: string;
  referenceText: string;
  canonicalUrl?: string;
};
