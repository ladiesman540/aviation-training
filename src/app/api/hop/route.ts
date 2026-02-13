import { unstable_noStore as noStore } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { questions, sections } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { distributeCards, PHASES, PHASE_CARD_COUNTS } from "@/lib/hop-engine";
import type { FlightPhase } from "@/types";
import { generateFlightBrief } from "@/data/flight-briefs";
import { SCENARIO_MAP } from "@/data/pstar-scenarios";
import { detectWeatherConditions, getWeatherPreferredIds } from "@/lib/weather-bias";
import { pickRadioExchanges } from "@/data/radio-exchanges";
import { ROC_A_CARDS, type RocACard } from "@/data/roc-a-cards";
import { maybePickEmergency, type EmergencyEvent } from "@/data/emergency-events";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type QuestionRow = {
  id: string;
  stem: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
  phase: string;
  flightContext: string;
  explanation: string;
  isCritical: boolean | null;
  riskPoints: number;
  sectionName: string;
};

type EmergencyQuestionCandidate =
  | { kind: "db"; card: QuestionRow }
  | { kind: "roc"; card: RocACard };

type TokenValues = {
  callsign: string;
  runway: string;
  icao: string;
};

type EmergencyPlan = {
  phase: FlightPhase;
  event: EmergencyEvent;
  cards: EmergencyQuestionCandidate[];
};

type MissionType = "local" | "practice" | "short-hop" | "cross-country";
type AircraftType = "C150" | "C172";
type PhaseBounds = Record<FlightPhase, [number, number]>;

const MAX_EMERGENCY_QUESTIONS = 2;
const MAX_RISK_POINTS = 3;
const MISSION_TARGETS: Record<MissionType, [number, number]> = {
  local: [8, 10],
  practice: [10, 12],
  "short-hop": [8, 9],
  "cross-country": [20, 20],
};

const MISSION_PHASE_BOUNDS: Record<MissionType, PhaseBounds> = {
  local: PHASE_CARD_COUNTS,
  practice: PHASE_CARD_COUNTS,
  "short-hop": PHASE_CARD_COUNTS,
  "cross-country": {
    preflight: [2, 5],
    taxi_depart: [3, 6],
    enroute: [5, 10],
    arrival: [3, 5],
  },
};

const MISSION_PHASE_PROFILE: Record<
  MissionType,
  { boost: FlightPhase[]; reduce: FlightPhase[] }
> = {
  local: {
    boost: ["taxi_depart", "arrival"],
    reduce: ["enroute", "preflight"],
  },
  practice: {
    boost: ["enroute", "preflight"],
    reduce: ["arrival", "taxi_depart"],
  },
  "short-hop": {
    boost: ["enroute", "arrival"],
    reduce: ["taxi_depart", "preflight"],
  },
  "cross-country": {
    boost: ["enroute", "arrival"],
    reduce: ["preflight", "taxi_depart"],
  },
};

const AIRCRAFT_RISK_BONUS: Record<AircraftType, number> = {
  C150: 1,
  C172: 0,
};

const MISSION_EMERGENCY_ATTEMPTS: Record<MissionType, number> = {
  local: 1,
  practice: 1,
  "short-hop": 1,
  "cross-country": 3,
};

const QUESTION_SELECT = {
  id: questions.id,
  stem: questions.stem,
  option1: questions.option1,
  option2: questions.option2,
  option3: questions.option3,
  option4: questions.option4,
  correctOption: questions.correctOption,
  phase: questions.phase,
  flightContext: questions.flightContext,
  explanation: questions.explanation,
  isCritical: questions.isCritical,
  riskPoints: questions.riskPoints,
  sectionName: sections.name,
};

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function injectBriefTokens(text: string, tokens: TokenValues): string {
  return text
    .replace(/\{callsign\}/g, tokens.callsign)
    .replace(/\{runway\}/g, tokens.runway)
    .replace(/\{icao\}/g, tokens.icao);
}

function injectRadioLines(
  lines: { speaker: "atc" | "pilot"; text: string }[],
  tokens: TokenValues
): { speaker: "atc" | "pilot"; text: string }[] {
  return lines.map((line) => ({
    ...line,
    text: injectBriefTokens(line.text, tokens),
  }));
}

function toRiskPoints(value: number | null | undefined, emergencyBoost = false): number {
  const base = Math.max(1, Math.trunc(value ?? 1));
  const boosted = emergencyBoost ? base + 1 : base;
  return Math.min(boosted, MAX_RISK_POINTS);
}

function getCandidateId(candidate: EmergencyQuestionCandidate): string {
  return candidate.kind === "db" ? candidate.card.id : candidate.card.id;
}

function toDbQuestionPayload(
  card: QuestionRow,
  phase: FlightPhase,
  tokens: TokenValues,
  options?: { emergencyName?: string; emergencyBoost?: boolean }
) {
  const scenario = SCENARIO_MAP[card.id];
  const emergencyName = options?.emergencyName;

  let stem = card.stem;
  let option1 = card.option1;
  let option2 = card.option2;
  let option3 = card.option3;
  let option4 = card.option4;

  if (scenario) {
    stem = injectBriefTokens(scenario.scenarioStem, tokens);
    option1 = injectBriefTokens(scenario.scenarioOptions[0]!, tokens);
    option2 = injectBriefTokens(scenario.scenarioOptions[1]!, tokens);
    option3 = injectBriefTokens(scenario.scenarioOptions[2]!, tokens);
    option4 = injectBriefTokens(scenario.scenarioOptions[3]!, tokens);
  }

  const baseContext = injectBriefTokens(card.flightContext ?? "", tokens);
  const flightContext = emergencyName
    ? `[${emergencyName.toUpperCase()}] ${baseContext}`
    : baseContext;

  return {
    type: "question",
    id: card.id,
    stem,
    option1,
    option2,
    option3,
    option4,
    correctOption: card.correctOption,
    phase,
    flightContext,
    explanation: card.explanation,
    isCritical: !!card.isCritical,
    riskPoints: toRiskPoints(card.riskPoints, options?.emergencyBoost),
    sectionName: card.sectionName,
    hasScenario: !!scenario,
    ...(emergencyName ? { isEmergency: true } : {}),
  };
}

function toRocQuestionPayload(
  card: RocACard,
  phase: FlightPhase,
  tokens: TokenValues,
  options?: { emergencyName?: string; emergencyBoost?: boolean }
) {
  const emergencyName = options?.emergencyName;
  const baseContext = injectBriefTokens(card.flightContext, tokens);
  const flightContext = emergencyName
    ? `[${emergencyName.toUpperCase()}] ${baseContext}`
    : baseContext;

  return {
    type: "question",
    id: card.id,
    stem: injectBriefTokens(card.stem, tokens),
    option1: injectBriefTokens(card.options[0], tokens),
    option2: injectBriefTokens(card.options[1], tokens),
    option3: injectBriefTokens(card.options[2], tokens),
    option4: injectBriefTokens(card.options[3], tokens),
    correctOption: card.correctOption,
    phase,
    flightContext,
    explanation: card.explanation,
    isCritical: card.isCritical,
    riskPoints: toRiskPoints(card.riskPoints, options?.emergencyBoost),
    sectionName: card.sectionName,
    hasScenario: true,
    isRocA: true,
    ...(emergencyName ? { isEmergency: true } : {}),
  };
}

async function loadEmergencyCandidates(event: EmergencyEvent): Promise<EmergencyQuestionCandidate[]> {
  const dbCards = event.questionPool.length > 0
    ? await db
        .select(QUESTION_SELECT)
        .from(questions)
        .innerJoin(sections, eq(questions.sectionId, sections.id))
        .where(inArray(questions.id, event.questionPool))
        .orderBy(sql`random()`)
    : [];

  const rocCards = ROC_A_CARDS.filter((card) => event.rocAPool.includes(card.id));

  return shuffle([
    ...dbCards.map((card) => ({ kind: "db" as const, card })),
    ...rocCards.map((card) => ({ kind: "roc" as const, card })),
  ]);
}

function normalizeMission(raw: string | null): MissionType {
  if (
    raw === "practice" ||
    raw === "short-hop" ||
    raw === "local" ||
    raw === "cross-country" ||
    raw === "cross-counter"
  ) {
    if (raw === "cross-counter") return "cross-country";
    return raw;
  }
  return "local";
}

function normalizeAircraft(raw: string | null): AircraftType {
  if (raw === "C150" || raw === "C172") {
    return raw;
  }
  return "C172";
}

function rebalanceByMission(
  counts: Record<FlightPhase, number>,
  mission: MissionType,
  bounds: PhaseBounds
): Record<FlightPhase, number> {
  const next = { ...counts };
  const profile = MISSION_PHASE_PROFILE[mission];

  for (const target of profile.boost) {
    const [, targetMax] = bounds[target];
    if (next[target] >= targetMax) continue;

    const donor = profile.reduce.find((phase) => {
      const [min] = bounds[phase];
      return next[phase] > min;
    });
    if (!donor) continue;

    next[donor]--;
    next[target]++;
  }

  return next;
}

function sumPhaseMins(bounds: PhaseBounds): number {
  return PHASES.reduce((sum, phase) => sum + bounds[phase][0], 0);
}

function sumPhaseMax(bounds: PhaseBounds): number {
  return PHASES.reduce((sum, phase) => sum + bounds[phase][1], 0);
}

function distributeByBounds(
  targetTotal: number,
  bounds: PhaseBounds
): Record<FlightPhase, number> {
  const counts: Record<FlightPhase, number> = {
    preflight: bounds.preflight[0],
    taxi_depart: bounds.taxi_depart[0],
    enroute: bounds.enroute[0],
    arrival: bounds.arrival[0],
  };

  let total = sumPhaseMins(bounds);
  const cappedTarget = Math.min(targetTotal, sumPhaseMax(bounds));
  const order: FlightPhase[] = ["enroute", "taxi_depart", "arrival", "preflight"];
  let idx = 0;

  while (total < cappedTarget) {
    const phase = order[idx % order.length]!;
    const [, max] = bounds[phase];
    if (counts[phase] < max) {
      counts[phase]++;
      total++;
    }
    idx++;
    if (idx > 400) break;
  }

  return counts;
}

function maybePickEmergencyForMission(
  phase: FlightPhase,
  riskSeed: number,
  mission: MissionType
): EmergencyEvent | null {
  const attempts = MISSION_EMERGENCY_ATTEMPTS[mission];
  for (let i = 0; i < attempts; i++) {
    const event = maybePickEmergency(phase, riskSeed);
    if (event) return event;
  }
  return null;
}

/** GET: Fetch hop sequence — question cards interleaved with radio exchanges */
export async function GET(request: NextRequest) {
  try {
    noStore();
    const mission = normalizeMission(request.nextUrl.searchParams.get("mission"));
    const aircraft = normalizeAircraft(request.nextUrl.searchParams.get("aircraft"));
    const missionBounds = MISSION_PHASE_BOUNDS[mission];
    const minBaseQuestions = sumPhaseMins(missionBounds);
    const [minQuestions, maxQuestions] = MISSION_TARGETS[mission];
    const targetQuestionCount = minQuestions + Math.floor(Math.random() * (maxQuestions - minQuestions + 1));
    const brief = generateFlightBrief();
    const wxConditions = detectWeatherConditions(brief.metar.template.decoded);
    const tokens: TokenValues = {
      callsign: brief.callsign,
      runway: brief.runway,
      icao: brief.airport.icao,
    };

    let plannedRocA = Math.random() < 0.5
      ? shuffle(ROC_A_CARDS)[0] ?? null
      : null;

    const weatherRiskSeed = Math.min(
      wxConditions.filter((condition) => condition !== "good_vfr").length,
      MAX_RISK_POINTS
    );
    const riskSeed = Math.min(
      weatherRiskSeed + AIRCRAFT_RISK_BONUS[aircraft],
      MAX_RISK_POINTS
    );

    const emergencyTriggers = PHASES
      .map((phase) => {
        const event = maybePickEmergencyForMission(phase, riskSeed, mission);
        return event ? { phase, event } : null;
      })
      .filter((entry): entry is { phase: FlightPhase; event: EmergencyEvent } => entry !== null);

    const candidateEmergency = emergencyTriggers.length > 0
      ? shuffle(emergencyTriggers)[0] ?? null
      : null;

    const emergencyCandidates = candidateEmergency
      ? await loadEmergencyCandidates(candidateEmergency.event)
      : [];

    let emergencyBudget = Math.min(MAX_EMERGENCY_QUESTIONS, emergencyCandidates.length);
    while (
      targetQuestionCount - ((plannedRocA ? 1 : 0) + emergencyBudget) < minBaseQuestions
    ) {
      if (emergencyBudget > 0) {
        emergencyBudget--;
      } else if (plannedRocA) {
        plannedRocA = null;
      } else {
        break;
      }
    }

    const optionalIds = new Set<string>();
    if (plannedRocA) optionalIds.add(plannedRocA.id);

    const emergencyCards: EmergencyQuestionCandidate[] = [];
    for (const candidate of emergencyCandidates) {
      if (emergencyCards.length >= emergencyBudget) break;
      const id = getCandidateId(candidate);
      if (optionalIds.has(id)) continue;
      emergencyCards.push(candidate);
      optionalIds.add(id);
    }

    const emergencyPlan: EmergencyPlan | null =
      candidateEmergency && emergencyCards.length > 0
        ? {
            phase: candidateEmergency.phase,
            event: candidateEmergency.event,
            cards: emergencyCards,
          }
        : null;

    const reservedQuestions = (plannedRocA ? 1 : 0) + (emergencyPlan ? emergencyPlan.cards.length : 0);
    const baseQuestionTarget = targetQuestionCount - reservedQuestions;
    const phaseCounts = rebalanceByMission(
      mission === "cross-country"
        ? distributeByBounds(baseQuestionTarget, missionBounds)
        : distributeCards(baseQuestionTarget),
      mission,
      missionBounds
    );

    const sequence: Record<string, unknown>[] = [];
    const usedQuestionIds = new Set<string>();

    for (const phase of PHASES) {
      const count = phaseCounts[phase];
      const preferredIds = new Set(getWeatherPreferredIds(phase, wxConditions));

      // Pick 1 radio exchange for this phase (placed before first question card)
      for (const rx of pickRadioExchanges(phase, 1)) {
        sequence.push({
          type: "radio",
          id: rx.id,
          phase: rx.phase,
          context: rx.context,
          lines: injectRadioLines(rx.lines, tokens),
        });
      }

      // Pull phase-matching cards, then prioritize weather-biased IDs.
      const phasePool: QuestionRow[] = await db
        .select(QUESTION_SELECT)
        .from(questions)
        .innerJoin(sections, eq(questions.sectionId, sections.id))
        .where(eq(questions.phase, phase))
        .orderBy(sql`random()`);

      const prioritizedPool = [
        ...phasePool.filter((card) => preferredIds.has(card.id)),
        ...phasePool.filter((card) => !preferredIds.has(card.id)),
      ];

      const selectedCards: QuestionRow[] = [];
      for (const card of prioritizedPool) {
        if (selectedCards.length >= count) break;
        if (optionalIds.has(card.id) || usedQuestionIds.has(card.id)) continue;
        selectedCards.push(card);
        usedQuestionIds.add(card.id);
      }

      for (let i = 0; i < selectedCards.length; i++) {
        sequence.push(toDbQuestionPayload(selectedCards[i]!, phase, tokens));

        // Add a radio exchange between question cards (not after the last one in a phase)
        if (i < selectedCards.length - 1 && Math.random() < 0.4) {
          for (const rx of pickRadioExchanges(phase, 1)) {
            sequence.push({
              type: "radio",
              id: `${rx.id}-mid-${sequence.length}`,
              phase: rx.phase,
              context: rx.context,
              lines: injectRadioLines(rx.lines, tokens),
            });
          }
        }
      }

      if (emergencyPlan && phase === emergencyPlan.phase) {
        const event = emergencyPlan.event;

        sequence.push({
          type: "emergency",
          id: event.id,
          name: event.name,
          phase,
          announcement: event.announcement,
          panelLabel: event.panelLabel,
          panelSub: event.panelSub,
          timerPenalty: event.timerPenalty,
          immediateRisk: event.immediateRisk,
          resolution: event.resolution,
          radioLines: injectRadioLines(event.radioLines, tokens),
        });

        if (event.radioLines.length > 0) {
          sequence.push({
            type: "radio",
            id: `emergency-radio-${event.id}`,
            phase,
            context: `Emergency communications - ${event.name}`,
            lines: injectRadioLines(event.radioLines, tokens),
          });
        }

        for (const candidate of emergencyPlan.cards) {
          const id = getCandidateId(candidate);
          if (usedQuestionIds.has(id)) continue;

          if (candidate.kind === "db") {
            sequence.push(
              toDbQuestionPayload(candidate.card, phase, tokens, {
                emergencyName: event.name,
                emergencyBoost: true,
              })
            );
          } else {
            sequence.push(
              toRocQuestionPayload(candidate.card, phase, tokens, {
                emergencyName: event.name,
                emergencyBoost: true,
              })
            );
          }

          usedQuestionIds.add(id);
        }

        sequence.push({
          type: "radio",
          id: `emergency-resolve-${event.id}`,
          phase,
          context: event.resolution,
          lines: [],
        });
      }

      if (plannedRocA && phase === plannedRocA.phase) {
        if (!usedQuestionIds.has(plannedRocA.id)) {
          sequence.push(toRocQuestionPayload(plannedRocA, phase, tokens));
          usedQuestionIds.add(plannedRocA.id);
        }
        plannedRocA = null;
      }
    }

    return NextResponse.json(
      {
        sequence,
        brief,
        wxConditions,
        mode: { mission, aircraft },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        },
      }
    );
  } catch (e) {
    return NextResponse.json(
      { error: String(e) },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        },
      }
    );
  }
}
