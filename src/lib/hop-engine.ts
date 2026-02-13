import type { FlightPhase } from "@/types";

/**
 * Hop engine: phase-based card selection, risk management, bust logic.
 * All logic is deterministic — no LLM, no randomness in grading.
 */

export const PHASES: FlightPhase[] = ["preflight", "taxi_depart", "enroute", "arrival"];

export const PHASE_LABELS: Record<FlightPhase, string> = {
  preflight: "Preflight",
  taxi_depart: "Taxi / Departure",
  enroute: "Enroute",
  arrival: "Arrival",
};

/** How many cards per phase (min, max). Total hop = 8-12 cards. */
export const PHASE_CARD_COUNTS: Record<FlightPhase, [number, number]> = {
  preflight: [1, 2],
  taxi_depart: [2, 4],
  enroute: [2, 4],
  arrival: [1, 2],
};

export const MAX_RISK = 3;
export const ESCALATION_THRESHOLD = 2; // Risk >= 2 triggers harder questions
export const HOP_TIMEOUT_SECONDS = 10 * 60; // 10 minute hard cap
export const SVFR_CARD_TIMER_SECONDS = 10; // per-card timer for SVFR flights

export type HopCard = {
  type: "question";
  questionId: string;
  stem: string;
  options: [string, string, string, string];
  correctOption: 1 | 2 | 3 | 4;
  phase: FlightPhase;
  flightContext: string;
  explanation: string;
  isCritical: boolean;
  riskPoints: number;
  sectionName: string;
};

export type HopRadioExchange = {
  type: "radio";
  id: string;
  phase: FlightPhase;
  context: string;
  lines: { speaker: "atc" | "pilot"; text: string }[];
};

export type HopEmergency = {
  type: "emergency";
  id: string;
  name: string;
  phase: FlightPhase;
  announcement: string;
  panelLabel: string;
  panelSub: string;
  timerPenalty: number;
  immediateRisk: number;
  resolution: string;
  radioLines: { speaker: "atc" | "pilot"; text: string }[];
};

/** A hop sequence item is a question card, radio exchange, or emergency event */
export type HopSequenceItem = HopCard | HopRadioExchange | HopEmergency;

export type HopResponse = {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  phase: FlightPhase;
  riskBefore: number;
  riskAfter: number;
  wasBust: boolean;
};

/**
 * Distribute card counts across phases, totaling 8-12.
 */
export function distributeCards(targetTotal: number): Record<FlightPhase, number> {
  const counts: Record<FlightPhase, number> = {
    preflight: 1,
    taxi_depart: 2,
    enroute: 2,
    arrival: 1,
  };
  let total = 6;

  const order: FlightPhase[] = ["enroute", "taxi_depart", "preflight", "arrival"];
  let idx = 0;
  while (total < targetTotal) {
    const phase = order[idx % order.length]!;
    const [, max] = PHASE_CARD_COUNTS[phase];
    if (counts[phase] < max) {
      counts[phase]++;
      total++;
    }
    idx++;
    if (idx > 20) break;
  }

  return counts;
}

/**
 * Check if a response causes a bust or adds risk.
 * With MAX_RISK=3, one wrong answer on a minor = risk+1 (2 mistakes = bust territory).
 * Critical wrong = immediate bust.
 */
export function processAnswer(
  isCorrect: boolean,
  isCritical: boolean,
  _riskPoints: number,
  currentRisk: number
): { newRisk: number; busted: boolean } {
  if (isCorrect) {
    return { newRisk: currentRisk, busted: false };
  }
  if (isCritical) {
    return { newRisk: MAX_RISK, busted: true };
  }
  // Every wrong answer adds exactly 1 risk. At risk 3 = bust on next wrong.
  const newRisk = Math.min(currentRisk + 1, MAX_RISK);
  const busted = newRisk >= MAX_RISK;
  return { newRisk, busted };
}
