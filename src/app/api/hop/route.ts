import { NextResponse } from "next/server";
import { db } from "@/db";
import { questions, sections } from "@/db/schema";
import { eq, sql, inArray } from "drizzle-orm";
import { distributeCards, PHASES } from "@/lib/hop-engine";
import type { FlightPhase } from "@/types";
import { generateFlightBrief } from "@/data/flight-briefs";
import { SCENARIO_MAP } from "@/data/pstar-scenarios";
import { detectWeatherConditions, getWeatherPreferredIds } from "@/lib/weather-bias";
import { pickRadioExchanges } from "@/data/radio-exchanges";
import { ROC_A_CARDS } from "@/data/roc-a-cards";
import { maybePickEmergency } from "@/data/emergency-events";

/** GET: Fetch hop sequence — question cards interleaved with radio exchanges */
export async function GET() {
  try {
    const targetTotal = 8 + Math.floor(Math.random() * 5); // 8-12
    const phaseCounts = distributeCards(targetTotal);
    const brief = generateFlightBrief();
    const wxConditions = detectWeatherConditions(brief.metar.template.decoded);

    // Decide if this hop includes a ROC-A card (50% chance, max 1 per hop)
    const includeRocA = Math.random() < 0.5;
    let rocACard = null;
    if (includeRocA) {
      const randomIdx = Math.floor(Math.random() * ROC_A_CARDS.length);
      rocACard = ROC_A_CARDS[randomIdx]!;
    }

    const sequence: unknown[] = [];

    for (const phase of PHASES) {
      const count = phaseCounts[phase];
      const preferredIds = getWeatherPreferredIds(phase as FlightPhase, wxConditions);

      // Pick 1 radio exchange for this phase (placed before the first question card)
      const radioExchanges = pickRadioExchanges(phase as FlightPhase, 1);
      for (const rx of radioExchanges) {
        sequence.push({
          type: "radio",
          id: rx.id,
          phase: rx.phase,
          context: rx.context,
          lines: rx.lines,
        });
      }

      // Fetch question cards with weather bias
      let phaseCards;
      if (preferredIds.length > 0) {
        const preferred = await db
          .select({
            id: questions.id, stem: questions.stem,
            option1: questions.option1, option2: questions.option2,
            option3: questions.option3, option4: questions.option4,
            correctOption: questions.correctOption, phase: questions.phase,
            flightContext: questions.flightContext, explanation: questions.explanation,
            isCritical: questions.isCritical, riskPoints: questions.riskPoints,
            sectionName: sections.name,
          })
          .from(questions)
          .innerJoin(sections, eq(questions.sectionId, sections.id))
          .where(inArray(questions.id, preferredIds))
          .orderBy(sql`random()`)
          .limit(count);

        if (preferred.length >= count) {
          phaseCards = preferred;
        } else {
          const usedIds = preferred.map((c) => c.id);
          const remaining = count - preferred.length;
          const filler = await db
            .select({
              id: questions.id, stem: questions.stem,
              option1: questions.option1, option2: questions.option2,
              option3: questions.option3, option4: questions.option4,
              correctOption: questions.correctOption, phase: questions.phase,
              flightContext: questions.flightContext, explanation: questions.explanation,
              isCritical: questions.isCritical, riskPoints: questions.riskPoints,
              sectionName: sections.name,
            })
            .from(questions)
            .innerJoin(sections, eq(questions.sectionId, sections.id))
            .where(eq(questions.phase, phase as string))
            .orderBy(sql`random()`)
            .limit(remaining + usedIds.length);

          const filtered = filler.filter((c) => !usedIds.includes(c.id)).slice(0, remaining);
          phaseCards = [...preferred, ...filtered];
        }
      } else {
        phaseCards = await db
          .select({
            id: questions.id, stem: questions.stem,
            option1: questions.option1, option2: questions.option2,
            option3: questions.option3, option4: questions.option4,
            correctOption: questions.correctOption, phase: questions.phase,
            flightContext: questions.flightContext, explanation: questions.explanation,
            isCritical: questions.isCritical, riskPoints: questions.riskPoints,
            sectionName: sections.name,
          })
          .from(questions)
          .innerJoin(sections, eq(questions.sectionId, sections.id))
          .where(eq(questions.phase, phase as string))
          .orderBy(sql`random()`)
          .limit(count);
      }

      // Map question cards with scenario overlay and brief token injection
      for (let i = 0; i < phaseCards.length; i++) {
        const card = phaseCards[i]!;

        let ctx = card.flightContext ?? "";
        ctx = ctx
          .replace(/\{callsign\}/g, brief.callsign)
          .replace(/\{runway\}/g, brief.runway)
          .replace(/\{icao\}/g, brief.airport.icao);

        const scenario = SCENARIO_MAP[card.id];
        let stem = card.stem;
        let o1 = card.option1, o2 = card.option2, o3 = card.option3, o4 = card.option4;

        if (scenario) {
          stem = scenario.scenarioStem
            .replace(/\{callsign\}/g, brief.callsign)
            .replace(/\{runway\}/g, brief.runway)
            .replace(/\{icao\}/g, brief.airport.icao);
          o1 = scenario.scenarioOptions[0]
            .replace(/\{callsign\}/g, brief.callsign)
            .replace(/\{runway\}/g, brief.runway);
          o2 = scenario.scenarioOptions[1]
            .replace(/\{callsign\}/g, brief.callsign)
            .replace(/\{runway\}/g, brief.runway);
          o3 = scenario.scenarioOptions[2]
            .replace(/\{callsign\}/g, brief.callsign)
            .replace(/\{runway\}/g, brief.runway);
          o4 = scenario.scenarioOptions[3]
            .replace(/\{callsign\}/g, brief.callsign)
            .replace(/\{runway\}/g, brief.runway);
        }

        sequence.push({
          type: "question",
          id: card.id,
          stem, option1: o1, option2: o2, option3: o3, option4: o4,
          correctOption: card.correctOption,
          phase: card.phase,
          flightContext: ctx,
          explanation: card.explanation,
          isCritical: card.isCritical,
          riskPoints: card.riskPoints,
          sectionName: card.sectionName,
          hasScenario: !!scenario,
        });

        // Add a radio exchange between question cards (not after the last one in a phase)
        if (i < phaseCards.length - 1 && Math.random() < 0.4) {
          const midExchanges = pickRadioExchanges(phase as FlightPhase, 1);
          for (const rx of midExchanges) {
            sequence.push({
              type: "radio",
              id: rx.id + "-mid",
              phase: rx.phase,
              context: rx.context,
              lines: rx.lines,
            });
          }
        }
      }

      // Maybe inject an emergency event in this phase
      const emergency = maybePickEmergency(phase as FlightPhase, 0);
      if (emergency) {
        // Emergency announcement card
        sequence.push({
          type: "emergency",
          id: emergency.id,
          name: emergency.name,
          phase: phase,
          announcement: emergency.announcement,
          panelLabel: emergency.panelLabel,
          panelSub: emergency.panelSub,
          timerPenalty: emergency.timerPenalty,
          immediateRisk: emergency.immediateRisk,
          resolution: emergency.resolution,
          radioLines: emergency.radioLines.map((l) => ({
            ...l,
            text: l.text
              .replace(/\{callsign\}/g, brief.callsign)
              .replace(/\{runway\}/g, brief.runway)
              .replace(/\{icao\}/g, brief.airport.icao),
          })),
        });

        // Emergency-specific radio exchange (the emergency comms)
        if (emergency.radioLines.length > 0) {
          sequence.push({
            type: "radio",
            id: `emergency-radio-${emergency.id}`,
            phase: phase,
            context: `Emergency communications — ${emergency.name}`,
            lines: emergency.radioLines.map((l) => ({
              ...l,
              text: l.text
                .replace(/\{callsign\}/g, brief.callsign)
                .replace(/\{runway\}/g, brief.runway)
                .replace(/\{icao\}/g, brief.airport.icao),
            })),
          });
        }

        // Pull 2 emergency-specific question cards from the PSTAR pool
        if (emergency.questionPool.length > 0) {
          const emergencyQuestions = await db
            .select({
              id: questions.id, stem: questions.stem,
              option1: questions.option1, option2: questions.option2,
              option3: questions.option3, option4: questions.option4,
              correctOption: questions.correctOption, phase: questions.phase,
              flightContext: questions.flightContext, explanation: questions.explanation,
              isCritical: questions.isCritical, riskPoints: questions.riskPoints,
              sectionName: sections.name,
            })
            .from(questions)
            .innerJoin(sections, eq(questions.sectionId, sections.id))
            .where(inArray(questions.id, emergency.questionPool))
            .orderBy(sql`random()`)
            .limit(2);

          for (const eq2 of emergencyQuestions) {
            const scenario = SCENARIO_MAP[eq2.id];
            let stem2 = eq2.stem;
            let eo1 = eq2.option1, eo2 = eq2.option2, eo3 = eq2.option3, eo4 = eq2.option4;
            let ctx2 = eq2.flightContext ?? "";

            ctx2 = `[${emergency.name.toUpperCase()}] ${ctx2}`
              .replace(/\{callsign\}/g, brief.callsign)
              .replace(/\{runway\}/g, brief.runway)
              .replace(/\{icao\}/g, brief.airport.icao);

            if (scenario) {
              stem2 = scenario.scenarioStem
                .replace(/\{callsign\}/g, brief.callsign)
                .replace(/\{runway\}/g, brief.runway)
                .replace(/\{icao\}/g, brief.airport.icao);
              eo1 = scenario.scenarioOptions[0].replace(/\{callsign\}/g, brief.callsign).replace(/\{runway\}/g, brief.runway);
              eo2 = scenario.scenarioOptions[1].replace(/\{callsign\}/g, brief.callsign).replace(/\{runway\}/g, brief.runway);
              eo3 = scenario.scenarioOptions[2].replace(/\{callsign\}/g, brief.callsign).replace(/\{runway\}/g, brief.runway);
              eo4 = scenario.scenarioOptions[3].replace(/\{callsign\}/g, brief.callsign).replace(/\{runway\}/g, brief.runway);
            }

            sequence.push({
              type: "question",
              id: eq2.id,
              stem: stem2, option1: eo1, option2: eo2, option3: eo3, option4: eo4,
              correctOption: eq2.correctOption,
              phase: phase,
              flightContext: ctx2,
              explanation: eq2.explanation,
              isCritical: eq2.isCritical,
              riskPoints: Math.min((eq2.riskPoints ?? 1) + 1, 3), // emergency cards are riskier
              sectionName: eq2.sectionName,
              hasScenario: !!scenario,
              isEmergency: true,
            });
          }

          // Emergency resolution transition
          sequence.push({
            type: "radio",
            id: `emergency-resolve-${emergency.id}`,
            phase: phase,
            context: emergency.resolution,
            lines: [],
          });
        }
      }

      // Insert ROC-A card in the enroute phase if selected
      if (rocACard && phase === rocACard.phase) {
        sequence.push({
          type: "question",
          id: rocACard.id,
          stem: rocACard.stem
            .replace(/\{callsign\}/g, brief.callsign)
            .replace(/\{runway\}/g, brief.runway)
            .replace(/\{icao\}/g, brief.airport.icao),
          option1: rocACard.options[0],
          option2: rocACard.options[1],
          option3: rocACard.options[2],
          option4: rocACard.options[3],
          correctOption: rocACard.correctOption,
          phase: rocACard.phase,
          flightContext: rocACard.flightContext,
          explanation: rocACard.explanation,
          isCritical: rocACard.isCritical,
          riskPoints: rocACard.riskPoints,
          sectionName: rocACard.sectionName,
          hasScenario: true,
          isRocA: true,
        });
        rocACard = null; // only insert once
      }
    }

    // Inject brief tokens into all radio exchange lines
    const finalSequence = sequence.map((item: any) => {
      if (item.type === "radio" && item.lines) {
        return {
          ...item,
          lines: item.lines.map((line: any) => ({
            ...line,
            text: line.text
              .replace(/\{callsign\}/g, brief.callsign)
              .replace(/\{runway\}/g, brief.runway)
              .replace(/\{icao\}/g, brief.airport.icao),
          })),
        };
      }
      return item;
    });

    return NextResponse.json({ sequence: finalSequence, brief, wxConditions });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
