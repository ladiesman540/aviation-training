import type { FlightPhase } from "@/types";

/**
 * Narrative transition text shown between cards.
 * Creates the sense of moving through a real flight instead of jumping between disconnected questions.
 */

export type TransitionSet = {
  correct: string[];
  wrong: string[];
  highRisk: string[];
  phaseBridge: string;
};

export const TRANSITIONS: Record<FlightPhase, TransitionSet> = {
  preflight: {
    correct: [
      "Good. You check the next item on your list.",
      "That's right. You move on with the walk-around.",
      "Correct. One less thing to worry about before engine start.",
    ],
    wrong: [
      "Your instructor pauses. \"Let's think about that one again after the flight.\"",
      "That's not quite right. You make a mental note and continue the preflight.",
      "Missed that one. Your instructor marks it in the training record.",
    ],
    highRisk: [
      "You're making mistakes before you even start the engine. Focus.",
      "Your instructor is watching closely. The preflight isn't going smoothly.",
    ],
    phaseBridge: "Preflight complete. You climb in, buckle up, and start the engine.",
  },
  taxi_depart: {
    correct: [
      "Good call. You release the brakes and continue.",
      "Correct. The taxi continues smoothly.",
      "Right answer. You scan left and right and keep rolling.",
    ],
    wrong: [
      "Your instructor reaches for the brakes. \"Let's talk about that.\"",
      "Not quite. You stop and think before continuing.",
      "That would have been a problem. Your instructor corrects you.",
    ],
    highRisk: [
      "You're already behind and you haven't left the ground yet.",
      "Workload is building on the taxiway. Not a great start.",
      "Your instructor is considering whether to continue the lesson.",
    ],
    phaseBridge: "You line up on the runway, apply full power, and begin the takeoff roll.",
  },
  enroute: {
    correct: [
      "Good. You scan the instruments and continue on course.",
      "Correct. The flight continues smoothly.",
      "Right call. You keep your eyes outside and cross-check.",
      "That's the right answer. You stay ahead of the aircraft.",
    ],
    wrong: [
      "That's not right. Your instructor makes a note.",
      "Wrong answer. In the real world, that could get expensive — or worse.",
      "Missed that one. You adjust and press on.",
      "Your instructor shakes their head. \"Review that tonight.\"",
    ],
    highRisk: [
      "Workload is building. You're falling behind the aircraft.",
      "Mistakes are stacking. Your instructor is getting tense.",
      "You're task-saturated. Take a breath and focus.",
    ],
    phaseBridge: "The airport comes into view ahead. Time to set up for arrival.",
  },
  arrival: {
    correct: [
      "Good call. You continue the approach.",
      "Correct. You're stable and on profile.",
      "That's right. Runway in sight, cleared to land.",
    ],
    wrong: [
      "Not right. Your instructor takes note for the debrief.",
      "That could have been a problem on a real approach.",
      "Missed it. You correct and continue toward the field.",
    ],
    highRisk: [
      "The approach is getting messy. Stay focused.",
      "Too many errors on the way in. Keep it together for the landing.",
    ],
    phaseBridge: "Wheels down, flare, and... touchdown. You taxi clear of the runway.",
  },
};

/** Pick a random transition string based on phase, correctness, and risk level. */
export function pickTransition(
  phase: FlightPhase,
  wasCorrect: boolean,
  risk: number
): string {
  const set = TRANSITIONS[phase];
  if (risk >= 2 && !wasCorrect) {
    return set.highRisk[Math.floor(Math.random() * set.highRisk.length)]!;
  }
  const pool = wasCorrect ? set.correct : set.wrong;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

/** Get the bridge text for transitioning between phases. */
export function getPhaseBridge(fromPhase: FlightPhase): string {
  return TRANSITIONS[fromPhase].phaseBridge;
}
