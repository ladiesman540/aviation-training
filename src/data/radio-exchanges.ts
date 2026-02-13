import type { FlightPhase } from "@/types";

/**
 * Radio exchange templates — non-graded interstitial cards that show
 * realistic ATC/pilot radio exchanges during the hop.
 *
 * Teaches proper phraseology by exposure (RIC-21 / ROC-A procedures).
 * Tokens {callsign}, {runway}, {icao}, {freq} are replaced at render time
 * with the flight brief's actual values.
 *
 * Each exchange is 2-4 lines. Speaker is "atc" or "pilot".
 */

export type RadioLine = {
  speaker: "atc" | "pilot";
  text: string;
};

export type RadioExchangeTemplate = {
  id: string;
  phase: FlightPhase;
  /** Brief label shown above the exchange */
  context: string;
  lines: RadioLine[];
};

export const RADIO_EXCHANGES: RadioExchangeTemplate[] = [
  // ─── PREFLIGHT (4) ──────────────────────────────────────────────────────

  {
    id: "pre-atis",
    phase: "preflight",
    context: "You tune to the ATIS frequency before starting the engine.",
    lines: [
      { speaker: "atc", text: "{icao} information Bravo. One eight zero zero zulu. Wind two seven zero at eight. Visibility one five. Few five thousand five hundred. Temperature two two, dewpoint one four. Altimeter three zero zero five. IFR approaches in use. Landing and departing Runway {runway}. Advise on initial contact you have information Bravo." },
    ],
  },
  {
    id: "pre-radio-check",
    phase: "preflight",
    context: "Engine started. You do a preflight radio check.",
    lines: [
      { speaker: "pilot", text: "{icao} Ground, {callsign}, request preflight check on one two one decimal niner." },
      { speaker: "atc", text: "{callsign}, {icao} Ground, reading you five by five." },
      { speaker: "pilot", text: "Five by five, {callsign}, thank you." },
    ],
  },
  {
    id: "pre-overhear-ifr",
    phase: "preflight",
    context: "While warming up, you overhear IFR traffic on the frequency.",
    lines: [
      { speaker: "atc", text: "Navajo Foxtrot Papa Kilo Lima, {icao} Ground, cleared to destination via radar vectors, maintain three thousand, squawk four two one five." },
      { speaker: "atc", text: "Cleared destination, radar vectors, three thousand, squawk four two one five, Foxtrot Papa Kilo Lima." },
    ],
  },
  {
    id: "pre-request-taxi",
    phase: "preflight",
    context: "Run-up complete. You're ready to request taxi.",
    lines: [
      { speaker: "pilot", text: "{icao} Ground, {callsign}, Cessna one seven two, at the south apron with information Bravo, VFR, request taxi." },
      { speaker: "atc", text: "{callsign}, {icao} Ground, taxi Runway {runway} via Alpha." },
      { speaker: "pilot", text: "Taxi Runway {runway} via Alpha, {callsign}." },
    ],
  },

  // ─── TAXI / DEPARTURE (6) ──────────────────────────────────────────────

  {
    id: "taxi-hold-short",
    phase: "taxi_depart",
    context: "Taxiing to the runway, Ground issues a hold-short instruction.",
    lines: [
      { speaker: "atc", text: "{callsign}, hold short Runway {runway}, traffic on final." },
      { speaker: "pilot", text: "Hold short Runway {runway}, {callsign}." },
    ],
  },
  {
    id: "taxi-contact-tower",
    phase: "taxi_depart",
    context: "Ground hands you off to Tower.",
    lines: [
      { speaker: "atc", text: "{callsign}, contact Tower on one one eight decimal seven." },
      { speaker: "pilot", text: "Tower, one one eight decimal seven, {callsign}." },
    ],
  },
  {
    id: "taxi-ready-departure",
    phase: "taxi_depart",
    context: "You're holding short, ready for departure.",
    lines: [
      { speaker: "pilot", text: "{icao} Tower, {callsign}, holding short Runway {runway}, ready for departure." },
      { speaker: "atc", text: "{callsign}, {icao} Tower, wind two seven zero at eight, Runway {runway}, cleared for takeoff." },
      { speaker: "pilot", text: "Cleared for takeoff, Runway {runway}, {callsign}." },
    ],
  },
  {
    id: "taxi-freq-change-departure",
    phase: "taxi_depart",
    context: "Airborne. Tower hands you off.",
    lines: [
      { speaker: "atc", text: "{callsign}, contact Terminal on one one niner decimal three." },
      { speaker: "pilot", text: "Terminal, one one niner decimal three, {callsign}. Good day." },
    ],
  },
  {
    id: "taxi-traffic-on-ground",
    phase: "taxi_depart",
    context: "While taxiing, you hear another aircraft's exchange.",
    lines: [
      { speaker: "atc", text: "Cherokee Golf Lima November Delta, taxi Runway {runway} via Bravo, hold short of Alpha." },
      { speaker: "atc", text: "Runway {runway} via Bravo, hold short Alpha, Golf Lima November Delta." },
    ],
  },
  {
    id: "taxi-backtrack",
    phase: "taxi_depart",
    context: "No taxiway to the threshold — you need to backtrack.",
    lines: [
      { speaker: "atc", text: "{callsign}, backtrack Runway {runway}, report ready." },
      { speaker: "pilot", text: "Backtrack Runway {runway}, wilco, {callsign}." },
    ],
  },

  // ─── ENROUTE (6) ───────────────────────────────────────────────────────

  {
    id: "enr-checkin-terminal",
    phase: "enroute",
    context: "You check in with Terminal after the frequency change.",
    lines: [
      { speaker: "pilot", text: "Toronto Terminal, {callsign}, Cessna one seven two, three thousand five hundred, VFR to Muskoka." },
      { speaker: "atc", text: "{callsign}, Toronto Terminal, radar contact, squawk one two zero zero, report any altitude changes." },
      { speaker: "pilot", text: "One two zero zero, will report altitude changes, {callsign}." },
    ],
  },
  {
    id: "enr-traffic-advisory",
    phase: "enroute",
    context: "ATC calls out traffic.",
    lines: [
      { speaker: "atc", text: "{callsign}, traffic, two o'clock, five miles, eastbound, a Dash 8 at four thousand." },
      { speaker: "pilot", text: "Traffic in sight, {callsign}." },
    ],
  },
  {
    id: "enr-mf-position-report",
    phase: "enroute",
    context: "Approaching an uncontrolled airport's mandatory frequency zone.",
    lines: [
      { speaker: "pilot", text: "Muskoka traffic, {callsign}, Cessna one seven two, one five miles south at three thousand five hundred, inbound for landing Runway one eight, Muskoka." },
    ],
  },
  {
    id: "enr-freq-change-sector",
    phase: "enroute",
    context: "Centre hands you off to the next sector.",
    lines: [
      { speaker: "atc", text: "{callsign}, contact Toronto Centre on one three two decimal zero two." },
      { speaker: "pilot", text: "One three two decimal zero two, {callsign}." },
    ],
  },
  {
    id: "enr-altimeter-update",
    phase: "enroute",
    context: "ATC passes an updated altimeter setting.",
    lines: [
      { speaker: "atc", text: "{callsign}, altimeter two niner niner two." },
      { speaker: "pilot", text: "Two niner niner two, {callsign}." },
    ],
  },
  {
    id: "enr-pan-pan-overheard",
    phase: "enroute",
    context: "You overhear an urgency call on 121.5 MHz.",
    lines: [
      { speaker: "atc", text: "PAN PAN, PAN PAN, PAN PAN. All stations, this is Cherokee Foxtrot Bravo November Tango. Lost, request radar check. Position unknown. Altitude one thousand fifty feet. Cherokee Foxtrot Bravo November Tango. Over." },
    ],
  },

  // ─── ARRIVAL (4) ───────────────────────────────────────────────────────

  {
    id: "arr-initial-call",
    phase: "arrival",
    context: "You contact Tower inbound for landing.",
    lines: [
      { speaker: "pilot", text: "{icao} Tower, {callsign}, Cessna one seven two, one zero miles south at two thousand five hundred, inbound for landing with information Bravo." },
      { speaker: "atc", text: "{callsign}, {icao} Tower, expect Runway {runway}, join left downwind, report midfield downwind." },
      { speaker: "pilot", text: "Left downwind Runway {runway}, will report midfield, {callsign}." },
    ],
  },
  {
    id: "arr-downwind-sequence",
    phase: "arrival",
    context: "You report midfield downwind.",
    lines: [
      { speaker: "pilot", text: "{icao} Tower, {callsign}, midfield downwind Runway {runway}." },
      { speaker: "atc", text: "{callsign}, number two, follow the Cherokee on base. Caution wake turbulence, Boeing seven three seven departed two minutes ago." },
      { speaker: "pilot", text: "Number two, following the Cherokee, {callsign}." },
    ],
  },
  {
    id: "arr-cleared-land",
    phase: "arrival",
    context: "On final approach, you receive landing clearance.",
    lines: [
      { speaker: "atc", text: "{callsign}, wind two seven zero at one zero, Runway {runway}, cleared to land." },
      { speaker: "pilot", text: "Cleared to land, Runway {runway}, {callsign}." },
    ],
  },
  {
    id: "arr-exit-contact-ground",
    phase: "arrival",
    context: "After landing, Tower hands you back to Ground.",
    lines: [
      { speaker: "atc", text: "{callsign}, turn right next taxiway, contact Ground on one two one decimal niner." },
      { speaker: "pilot", text: "Right next taxiway, Ground on one two one decimal niner, {callsign}." },
    ],
  },
  // ─── ADDITIONAL EXCHANGES (filling RIC-21 gaps) ─────────────────────────

  // Preflight — demonstrating STANDBY and GO AHEAD
  {
    id: "pre-standby",
    phase: "preflight",
    context: "You call Ground but they're busy with another aircraft.",
    lines: [
      { speaker: "pilot", text: "{icao} Ground, {callsign}, request taxi." },
      { speaker: "atc", text: "{callsign}, {icao} Ground, stand by two minutes." },
    ],
  },

  // Taxi — SAY AGAIN partial repetition
  {
    id: "taxi-say-again",
    phase: "taxi_depart",
    context: "Ground gives you a complex taxi instruction but you missed the first part.",
    lines: [
      { speaker: "atc", text: "{callsign}, taxi Runway {runway} via Alpha, Bravo, hold short of Charlie." },
      { speaker: "pilot", text: "{callsign}, say again all before Bravo." },
      { speaker: "atc", text: "{callsign}, taxi Runway {runway} via Alpha, Bravo, hold short of Charlie." },
      { speaker: "pilot", text: "Runway {runway}, Alpha, Bravo, hold short Charlie, {callsign}." },
    ],
  },

  // Taxi — CORRECTION in real time
  {
    id: "taxi-correction",
    phase: "taxi_depart",
    context: "ATC corrects themselves mid-clearance.",
    lines: [
      { speaker: "atc", text: "{callsign}, taxi Runway three zero, correction, Runway {runway} via Alpha." },
      { speaker: "pilot", text: "Runway {runway} via Alpha, {callsign}." },
    ],
  },

  // Enroute — MAYDAY RELAY (you relay another aircraft's distress)
  {
    id: "enr-mayday-relay",
    phase: "enroute",
    context: "You hear an unanswered MAYDAY from another aircraft. No one responds. You relay it.",
    lines: [
      { speaker: "atc", text: "MAYDAY, MAYDAY, MAYDAY. This is Piper Foxtrot X-ray Quebec Quebec. Engine failure. Ditching. Position twenty miles east of Winnipeg. Altitude one thousand five hundred. One person on board. Piper Foxtrot X-ray Quebec Quebec." },
      { speaker: "pilot", text: "MAYDAY RELAY, MAYDAY RELAY, MAYDAY RELAY. This is {callsign}, {callsign}, {callsign}. MAYDAY. Piper Foxtrot X-ray Quebec Quebec. Engine failure. Ditching. Twenty miles east of Winnipeg. One thousand five hundred feet. One POB." },
    ],
  },

  // Enroute — MAYDAY acknowledgement format
  {
    id: "enr-mayday-ack",
    phase: "enroute",
    context: "A nearby aircraft declares MAYDAY and you're in position to help.",
    lines: [
      { speaker: "atc", text: "MAYDAY, MAYDAY, MAYDAY. This is Cherokee Golf Bravo November Tango, Golf Bravo November Tango, Golf Bravo November Tango. Rough running engine. Diverting to nearest field." },
      { speaker: "pilot", text: "MAYDAY. Cherokee Golf Bravo November Tango, Golf Bravo November Tango, Golf Bravo November Tango. This is {callsign}, {callsign}, {callsign}. Received MAYDAY." },
    ],
  },

  // Enroute — SEELONCE imposed during emergency
  {
    id: "enr-seelonce",
    phase: "enroute",
    context: "ATC imposes radio silence during a distress situation.",
    lines: [
      { speaker: "atc", text: "All stations, all stations, all stations. This is Toronto Centre. SEELONCE MAYDAY. Out." },
    ],
  },

  // Enroute — SEELONCE FEENEE — silence lifted
  {
    id: "enr-seelonce-feenee",
    phase: "enroute",
    context: "The distress situation is resolved. ATC lifts radio silence.",
    lines: [
      { speaker: "atc", text: "MAYDAY. Hello all stations, hello all stations, hello all stations. This is Toronto Centre. Time one six three zero zulu. Cherokee Golf Bravo November Tango. SEELONCE FEENEE. Out." },
    ],
  },

  // Enroute — signal/radio check with readability scale
  {
    id: "enr-signal-check",
    phase: "enroute",
    context: "Your transmissions feel weak. You request a signal check.",
    lines: [
      { speaker: "pilot", text: "Toronto Centre, {callsign}, request signal check on one three two decimal zero two." },
      { speaker: "atc", text: "{callsign}, Toronto Centre, reading you strength four." },
      { speaker: "pilot", text: "Strength four, thank you, {callsign}." },
    ],
  },

  // Arrival — WORDS TWICE due to poor reception
  {
    id: "arr-words-twice",
    phase: "arrival",
    context: "Poor reception on approach. Tower transmits each word twice.",
    lines: [
      { speaker: "atc", text: "{callsign}, {callsign}, words twice. Wind, wind, two seven zero, two seven zero, at one five, at one five. Runway, Runway, {runway}, {runway}, cleared to land, cleared to land." },
      { speaker: "pilot", text: "Cleared to land, Runway {runway}, {callsign}." },
    ],
  },

  // Arrival — DISREGARD after ATC error
  {
    id: "arr-disregard",
    phase: "arrival",
    context: "Tower starts to give you an instruction, then cancels it.",
    lines: [
      { speaker: "atc", text: "{callsign}, turn left heading — disregard. Continue present heading, expect Runway {runway}." },
      { speaker: "pilot", text: "Continue present heading, expect Runway {runway}, {callsign}." },
    ],
  },

  // Enroute — air-to-air communication (called station controls)
  {
    id: "enr-air-to-air",
    phase: "enroute",
    context: "You overhear two aircraft coordinating on an air-to-air frequency.",
    lines: [
      { speaker: "atc", text: "Cessna Foxtrot X-ray Quebec Tango, this is Piper Foxtrot X-ray Quebec Quebec, on frequency one one niner decimal seven. Over." },
      { speaker: "atc", text: "Piper Foxtrot X-ray Quebec Quebec, this is Cessna Foxtrot X-ray Quebec Tango. Change to search and rescue frequency one two three decimal six. Out." },
    ],
  },

  // Preflight — urgency cancellation format
  {
    id: "pre-urgency-cancel",
    phase: "preflight",
    context: "While monitoring the frequency, you hear an urgency cancellation.",
    lines: [
      { speaker: "atc", text: "PAN PAN. All stations, all stations, all stations. This is Cessna Foxtrot November Juliett India. Cessna Foxtrot November Juliett India has been positioned at twenty miles south of Winnipeg Airport, proceeding normally. Cessna Foxtrot November Juliett India. Out." },
    ],
  },
];

/**
 * Pick random radio exchanges for a given phase.
 * Returns the requested count, or fewer if not enough exist.
 */
export function pickRadioExchanges(phase: FlightPhase, count: number): RadioExchangeTemplate[] {
  const pool = RADIO_EXCHANGES.filter((r) => r.phase === phase);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
