import type { FlightPhase } from "@/types";

/**
 * Emergency events that can randomly trigger during a hop.
 * When an emergency fires:
 *  - A dramatic announcement card appears (type: "emergency")
 *  - The phase panel changes to show the emergency
 *  - Timer drops (adds urgency)
 *  - The next 2-3 cards are emergency-specific questions drawn from relevant PSTAR questions
 *  - Radio exchanges shift to emergency comms
 *
 * All emergency question cards map to real PSTAR question IDs or verified ROC-A cards.
 * Grading remains deterministic.
 */

export type EmergencyEvent = {
  id: string;
  name: string;
  /** When in the flight this can trigger */
  triggerPhases: FlightPhase[];
  /** Dramatic announcement text */
  announcement: string;
  /** What the phase panel shows during the emergency */
  panelLabel: string;
  panelSub: string;
  /** How many seconds to subtract from the timer (creates urgency) */
  timerPenalty: number;
  /** Risk points added immediately when the emergency triggers */
  immediateRisk: number;
  /** PSTAR question IDs to draw from during this emergency */
  questionPool: string[];
  /** ROC-A card IDs to draw from during this emergency */
  rocAPool: string[];
  /** Radio exchange to play as the emergency announcement */
  radioLines: { speaker: "atc" | "pilot"; text: string }[];
  /** Transition text while dealing with the emergency */
  transitionTexts: string[];
  /** How the emergency resolves (shown after emergency cards) */
  resolution: string;
};

export const EMERGENCY_EVENTS: EmergencyEvent[] = [
  {
    id: "engine-rough",
    name: "Rough Running Engine",
    triggerPhases: ["enroute"],
    announcement: "The engine starts running rough. RPM fluctuates. You feel vibration through the airframe. Time to act.",
    panelLabel: "EMERGENCY — ENGINE ROUGH",
    panelSub: "Troubleshoot and decide",
    timerPenalty: 120, // lose 2 minutes
    immediateRisk: 1,
    questionPool: [
      "11.01", // ELT in emergency — turn on immediately
      "3.18",  // MAYDAY call
      "3.19",  // PAN PAN call
      "6.13",  // pilot responsibility for VFR
      "9.05",  // deviation from flight plan — notify ASAP
    ],
    rocAPool: [
      "roc-mayday-message-order", // MAYDAY message element order
      "roc-comm-priority",         // distress has priority
    ],
    radioLines: [
      { speaker: "pilot", text: "{icao} Centre, {callsign}, we have rough running engine, request vectors to nearest aerodrome." },
      { speaker: "atc", text: "{callsign}, roger, nearest aerodrome is {icao}, one five miles, heading two seven zero. Say intentions." },
      { speaker: "pilot", text: "{callsign}, proceeding direct {icao}, may need to declare PAN PAN." },
    ],
    transitionTexts: [
      "The engine coughs again. Carb heat — ON. Mixture — full rich. You scan for a field below.",
      "RPM is still unstable. You run through the emergency checklist. Stay calm.",
      "You're losing altitude slowly. Eyes scanning for the nearest runway.",
    ],
    resolution: "The engine smooths out after applying carb heat. Probable carb icing. You continue to the nearest aerodrome as a precaution.",
  },

  {
    id: "comm-failure",
    name: "Radio Failure",
    triggerPhases: ["enroute", "arrival"],
    announcement: "Static fills your headset. You try transmitting — nothing. You've lost your radio. You're NORDO.",
    panelLabel: "EMERGENCY — NORDO",
    panelSub: "No radio, light gun signals",
    timerPenalty: 90,
    immediateRisk: 1,
    questionPool: [
      "2.01", // green flashes — cleared to taxi
      "2.02", // steady red — stop / give way
      "2.03", // red flashes — airport unsafe / taxi clear
      "2.04", // steady green — cleared to land / takeoff
      "2.05", // flashing white — return to starting point
      "6.05", // NORDO crosses airport at 500 above circuit height
      "6.18", // transponder code 1200 / 7600 for comm failure
    ],
    rocAPool: [],
    radioLines: [
      { speaker: "atc", text: "..." },
      { speaker: "pilot", text: "(You transmit but hear only static. The radio is dead. Squawk 7600.)" },
    ],
    transitionTexts: [
      "Silence in the headset. You're on your own now. Squawk 7600 and head for the field.",
      "No radio means light gun signals. Remember your colours.",
      "You overfly the field at 500 feet above circuit height to check the signals.",
    ],
    resolution: "You enter the circuit, watch for light gun signals, and land safely. The tower gives you a steady green — cleared to land. A technician finds a loose headset connector.",
  },

  {
    id: "alternator-failure",
    name: "Alternator Failure",
    triggerPhases: ["enroute"],
    announcement: "The low-voltage light illuminates. Your alternator has failed. You're running on battery only — limited time before you lose avionics.",
    panelLabel: "EMERGENCY — ALT FAIL",
    panelSub: "Battery power only",
    timerPenalty: 150, // lose 2.5 minutes — battery is draining
    immediateRisk: 1,
    questionPool: [
      "5.07", // emergency frequency 121.5
      "5.11", // required instruments (what do you lose?)
      "11.01", // ELT activation
      "3.08", // distress listening watch on 121.5
      "6.22", // familiar with all available information
    ],
    rocAPool: [
      "roc-listen-before-transmit",
      "roc-freq-pronunciation",
    ],
    radioLines: [
      { speaker: "pilot", text: "{icao} Centre, {callsign}, we've lost our alternator. Running on battery. Reducing electrical load. Request direct {icao}." },
      { speaker: "atc", text: "{callsign}, roger. Direct {icao} approved. Advise if you lose comms." },
    ],
    transitionTexts: [
      "You shed electrical load — off with the second radio, the GPS, the transponder if needed. Essentials only.",
      "The battery has maybe 20-30 minutes. Every minute counts now.",
      "You keep one comm radio alive and navigate by pilotage. The battery voltage gauge creeps lower.",
    ],
    resolution: "You land with battery to spare. The alternator belt snapped — a common failure. Good load management kept you talking until touchdown.",
  },

  {
    id: "passenger-ill",
    name: "Passenger Medical Emergency",
    triggerPhases: ["enroute"],
    announcement: "Your passenger suddenly looks pale and starts sweating. They say they feel faint and their chest is tight. You need to get on the ground.",
    panelLabel: "EMERGENCY — MEDICAL",
    panelSub: "Passenger incapacitated",
    timerPenalty: 120,
    immediateRisk: 1,
    questionPool: [
      "3.19", // PAN PAN
      "8.02", // hyperventilation treatment
      "8.06", // fatigue and impairment
      "9.05", // deviation from flight plan
      "5.04", // oxygen requirements
    ],
    rocAPool: [
      "roc-comm-priority", // urgency priority
      "roc-mayday-message-order",
    ],
    radioLines: [
      { speaker: "pilot", text: "PAN PAN, PAN PAN, PAN PAN. {icao} Centre, {callsign}. Passenger medical emergency. Request priority handling and vectors to nearest aerodrome with medical facilities." },
      { speaker: "atc", text: "{callsign}, {icao} Centre, PAN PAN acknowledged. Vectors to {icao}, one two miles. Emergency services will be standing by." },
      { speaker: "pilot", text: "Direct {icao}, {callsign}." },
    ],
    transitionTexts: [
      "You descend to lower altitude. Your passenger needs air. Loosen their collar and open the air vent.",
      "Talk to them. Keep them conscious and calm. You're almost there.",
      "You can see the field ahead. Ambulance lights on the ramp.",
    ],
    resolution: "You land and the paramedics take over. Your passenger is conscious and stable. The PAN PAN got emergency services there before you touched down.",
  },

  {
    id: "unexpected-weather",
    name: "Weather Deterioration",
    triggerPhases: ["enroute"],
    announcement: "The horizon disappears. Visibility is dropping fast — fog is rolling in below you and cloud is lowering above. The ceiling you briefed is gone.",
    panelLabel: "EMERGENCY — WX DETERIORATING",
    panelSub: "Visibility dropping",
    timerPenalty: 90,
    immediateRisk: 1,
    questionPool: [
      "12.02", // VFR requires visual reference
      "12.03", // helicopter VFR vis minimums
      "12.04", // cloud distance uncontrolled
      "13.02", // VFR cloud clearance controlled
      "13.06", // Special VFR
      "6.13",  // pilot responsible for VFR
      "6.14",  // student pilot near cloud — alter heading
    ],
    rocAPool: [],
    radioLines: [
      { speaker: "pilot", text: "{icao} Centre, {callsign}, VFR flight, weather deteriorating rapidly ahead. Request diversion to alternate." },
      { speaker: "atc", text: "{callsign}, roger. {icao} is reporting three miles in mist. Suggest divert to Bravo Foxtrot field, two zero miles southeast, ceiling three thousand broken, vis one zero miles." },
      { speaker: "pilot", text: "Diverting to Bravo Foxtrot, {callsign}." },
    ],
    transitionTexts: [
      "The ground is getting harder to see. 180-degree turn NOW or press on? This is how VFR-into-IMC accidents start.",
      "You turn toward better weather. Don't try to be a hero. Get on the ground.",
      "Visibility improves as you head southeast. The alternate field is in sight.",
    ],
    resolution: "You divert successfully to an alternate with better weather. The original destination went IFR 10 minutes after you turned around. Good call.",
  },

  {
    id: "door-open",
    name: "Door Pops Open",
    triggerPhases: ["taxi_depart"],
    announcement: "BANG. The cabin door flies open just after rotation. Wind noise fills the cockpit. The aircraft is still flying — but you need to deal with this.",
    panelLabel: "EMERGENCY — DOOR OPEN",
    panelSub: "Fly the aircraft first",
    timerPenalty: 60,
    immediateRisk: 1,
    questionPool: [
      "6.01", // cleared for takeoff after large aircraft — decline if unsafe
      "6.11", // ATC requests speed reduction — comply but safely
      "6.12", // crosswind concern — overshoot and request
      "10.04", // clearance can't be complied with — take action advise ATC
      "10.05", // pilot not relieved of traffic avoidance
    ],
    rocAPool: [],
    radioLines: [
      { speaker: "pilot", text: "{icao} Tower, {callsign}, door open after departure. Returning for landing." },
      { speaker: "atc", text: "{callsign}, roger. Circuit is clear. Runway {runway}, cleared to land." },
      { speaker: "pilot", text: "Cleared to land, Runway {runway}, {callsign}." },
    ],
    transitionTexts: [
      "FLY THE AIRCRAFT. A Cessna door open in flight is scary but not dangerous. The aircraft flies fine.",
      "Don't try to close the door in flight. Fly the circuit, land, then deal with it on the ground.",
      "Your instructor's voice in your head: 'Aviate, navigate, communicate.' In that order.",
    ],
    resolution: "You fly a normal circuit and land. The door latch wasn't fully secured during preflight. Lesson learned — always double-check the door before takeoff.",
  },

  {
    id: "bird-strike",
    name: "Bird Strike",
    triggerPhases: ["taxi_depart", "arrival"],
    announcement: "THWACK. A bird hits the windscreen. A web of cracks appears but the windscreen holds. Your visibility through the front is reduced.",
    panelLabel: "CAUTION — BIRD STRIKE",
    panelSub: "Reduced forward visibility",
    timerPenalty: 60,
    immediateRisk: 1,
    questionPool: [
      "14.03", // report accident to TSB ASAP
      "14.04", // TSB notified for damage/injury
      "11.05", // aircraft operations — engine running procedures
      "4.08",  // overfly aerodrome at 1000+ AGL
      "6.07",  // no landing clearance — request it
    ],
    rocAPool: [],
    radioLines: [
      { speaker: "pilot", text: "{icao} Tower, {callsign}, bird strike, windscreen cracked. Aircraft controllable. Request priority landing." },
      { speaker: "atc", text: "{callsign}, roger. You are number one. Runway {runway}, cleared to land. Emergency equipment standing by." },
    ],
    transitionTexts: [
      "Windscreen is cracked but holding. Scan through the side windows for runway reference.",
      "The aircraft is still flyable. Fly a normal approach — just use the side window for final reference.",
      "Emergency trucks are rolling. You'll need to file a report with the TSB after landing.",
    ],
    resolution: "You land safely using the side window for visual reference on final. The bird strike cracked the windscreen but didn't penetrate. You file a TSB occurrence report as required.",
  },

  {
    id: "electrical-smell",
    name: "Electrical Burning Smell",
    triggerPhases: ["enroute"],
    announcement: "A sharp burning smell fills the cockpit. Something electrical is overheating. Smoke wisps from behind the panel.",
    panelLabel: "EMERGENCY — ELEC FIRE",
    panelSub: "Smoke in cockpit",
    timerPenalty: 150,
    immediateRisk: 1,
    questionPool: [
      "5.07",  // emergency frequency 121.5
      "11.01", // ELT in emergency
      "3.18",  // MAYDAY
      "5.11",  // required instruments (what's left without electrics?)
      "12.05", // drop objects from aircraft — no jettison
    ],
    rocAPool: [
      "roc-mayday-message-order",
      "roc-comm-priority",
    ],
    radioLines: [
      { speaker: "pilot", text: "MAYDAY, MAYDAY, MAYDAY. {icao} Centre, {callsign}, {callsign}, {callsign}. Electrical fire. Smoke in cockpit. Shutting down all electrics. Descending to land at nearest field." },
      { speaker: "atc", text: "MAYDAY, {callsign}, {callsign}, {callsign}. This is {icao} Centre, {icao} Centre, {icao} Centre. Received MAYDAY. Nearest field {icao}, heading one eight zero, one zero miles. Emergency services alerted." },
    ],
    transitionTexts: [
      "MASTER SWITCH — OFF. Everything goes dark and quiet. Smoke starts to clear with the vents open.",
      "No electrics means no radio, no transponder, no GPS. Navigate by looking outside. Aviate, navigate, communicate.",
      "You can see the field ahead. No radio for landing clearance — watch for light gun signals.",
    ],
    resolution: "You land without electrical power, guided by light gun signals. The fire service meets you on the runway. A chafed wire behind the panel caused the short. This is why you practice no-electrical emergencies.",
  },
];

/**
 * Pick a random emergency event that can trigger in the given phase.
 * Returns null if no emergency should occur (probability-based).
 */
export function maybePickEmergency(
  phase: FlightPhase,
  currentRisk: number
): EmergencyEvent | null {
  // ~30% chance of an emergency per hop, biased by risk (higher risk = more likely)
  const baseProbability = 0.08; // per phase
  const riskBonus = currentRisk * 0.02;
  const probability = baseProbability + riskBonus;

  if (Math.random() > probability) return null;

  const eligible = EMERGENCY_EVENTS.filter((e) => e.triggerPhases.includes(phase));
  if (eligible.length === 0) return null;

  return eligible[Math.floor(Math.random() * eligible.length)]!;
}
