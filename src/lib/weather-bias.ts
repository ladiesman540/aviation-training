import type { FlightPhase } from "@/types";

/**
 * Weather-biased card selection.
 *
 * Maps weather conditions to REAL TP 11919 question IDs that are contextually
 * relevant. These are not generated questions — they're curated selections
 * from the existing pool. Every ID here is a real question with a real answer key entry.
 *
 * The hop API uses these to bias (not replace) the random card selection:
 * when weather conditions match, these question IDs are preferred.
 */

type WeatherCondition = "low_ceiling" | "gusty" | "thunderstorm" | "low_vis" | "good_vfr";

/** Question IDs to prefer when conditions match, grouped by phase */
export const WEATHER_BIAS: Record<WeatherCondition, Partial<Record<FlightPhase, string[]>>> = {
  low_ceiling: {
    // MVFR/IFR ceiling — questions about weather minimums, circuit in low ceilings, Special VFR
    preflight: ["9.01", "9.02"], // fuel for potential diversions
    enroute: [
      "6.13", // VFR responsibility near cloud
      "6.14", // student pilot near cloud — alter heading
      "12.02", // VFR requires visual reference to surface
      "12.03", // helicopter VFR weather mins
      "12.04", // distance from cloud in uncontrolled airspace
    ],
    arrival: [
      "6.08", // circuit height with low ceiling
      "6.09", // joining circuit in low ceiling
      "6.10", // circuit height not always 1,000 ft
      "13.06", // Special VFR authorization
      "13.07", // helicopter Special VFR
      "13.08", // Special VFR is within a Control Zone
    ],
  },
  gusty: {
    // Gusty winds — crosswind, wake turbulence more relevant
    taxi_depart: ["7.09", "7.10", "7.15"], // wake turbulence on departure, crosswind effect on vortices
    arrival: [
      "6.12", // crosswind concern on landing
      "7.06", // landing behind heavy aircraft
      "7.12", // when wake turbulence is greatest
      "7.15", // light crosswind effect on vortices
    ],
  },
  thunderstorm: {
    // CB/TS in the area — thunderstorm avoidance, weather decisions
    enroute: [
      "6.13", // VFR responsibility
      "6.14", // alter heading to stay VFR
    ],
    arrival: [
      "11.06", // thunderstorm avoidance on takeoff/landing
      "11.07", // isolated thunderstorm near aerodrome
    ],
  },
  low_vis: {
    // Reduced visibility — weather minimums, Special VFR
    enroute: [
      "12.02", // VFR requires visual reference
      "12.03", // helicopter VFR vis minimums
      "12.04", // cloud distance in uncontrolled airspace
      "13.02", // VFR cloud clearance in controlled airspace
      "13.03", // VFR visibility in low-level airway
      "13.04", // VFR cloud clearance in control zone
    ],
    arrival: [
      "13.05", // Class C transit requires clearance
      "13.06", // Special VFR visibility
      "6.08",  // circuit height in low conditions
    ],
  },
  good_vfr: {
    // No special bias — use normal random selection
  },
};

/**
 * Determine which weather conditions apply based on METAR decoded data.
 * Returns conditions in priority order.
 */
export function detectWeatherConditions(decoded: {
  ceilingFt: number | null;
  gustSpeed: number | null;
  visSm: number;
  phenomena: string;
  flightCategory: string;
}): WeatherCondition[] {
  const conditions: WeatherCondition[] = [];

  // Thunderstorm check (highest priority)
  if (decoded.phenomena.toLowerCase().includes("thunderstorm") ||
      decoded.phenomena.toLowerCase().includes("ts")) {
    conditions.push("thunderstorm");
  }

  // Low ceiling
  if (decoded.ceilingFt !== null && decoded.ceilingFt <= 4000) {
    conditions.push("low_ceiling");
  }

  // Low visibility
  if (decoded.visSm <= 5) {
    conditions.push("low_vis");
  }

  // Gusty winds
  if (decoded.gustSpeed !== null && decoded.gustSpeed >= 15) {
    conditions.push("gusty");
  }

  if (conditions.length === 0) {
    conditions.push("good_vfr");
  }

  return conditions;
}

/**
 * Get preferred question IDs for a given phase based on weather conditions.
 * Returns a flat array of question IDs that should be preferred (not exclusive).
 */
export function getWeatherPreferredIds(
  phase: FlightPhase,
  conditions: WeatherCondition[]
): string[] {
  const ids = new Set<string>();
  for (const condition of conditions) {
    const phaseIds = WEATHER_BIAS[condition][phase];
    if (phaseIds) {
      for (const id of phaseIds) {
        ids.add(id);
      }
    }
  }
  return [...ids];
}
