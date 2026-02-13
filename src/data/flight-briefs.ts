/**
 * Canadian airport data and METAR generation for flight briefs.
 * Each hop picks one airport and generates a realistic METAR to decode.
 */

export type AirportInfo = {
  icao: string;
  name: string;
  runways: string[]; // e.g. ["12/30", "03/21"]
  elevation: number; // feet ASL
  hasAtc: boolean;
};

export const AIRPORTS: AirportInfo[] = [
  { icao: "CYOO", name: "Oshawa", runways: ["12/30"], elevation: 460, hasAtc: true },
  { icao: "CYKZ", name: "Buttonville", runways: ["15/33", "03/21"], elevation: 650, hasAtc: true },
  { icao: "CYRP", name: "Carp", runways: ["10/28"], elevation: 382, hasAtc: false },
  { icao: "CYTZ", name: "Toronto Island", runways: ["08/26", "06/24"], elevation: 252, hasAtc: true },
  { icao: "CYKF", name: "Waterloo", runways: ["08/26", "14/32"], elevation: 1055, hasAtc: true },
  { icao: "CYRO", name: "Rockcliffe", runways: ["09/27"], elevation: 188, hasAtc: false },
  { icao: "CYPQ", name: "Peterborough", runways: ["09/27", "17/35"], elevation: 628, hasAtc: false },
  { icao: "CNB7", name: "Kawartha Lakes", runways: ["13/31"], elevation: 882, hasAtc: false },
  { icao: "CYQA", name: "Muskoka", runways: ["18/36", "09/27"], elevation: 925, hasAtc: false },
  { icao: "CZBA", name: "Burlington", runways: ["14/32"], elevation: 602, hasAtc: false },
  { icao: "CYGK", name: "Kingston", runways: ["01/19", "07/25"], elevation: 305, hasAtc: true },
  { icao: "CYHU", name: "St-Hubert", runways: ["06L/24R", "06R/24L"], elevation: 90, hasAtc: true },
];

// ─── METAR Generation ──────────────────────────────────────────────────────

type MetarParts = {
  icao: string;
  dayTime: string;       // e.g. "121545Z"
  wind: string;          // e.g. "27015G22KT"
  vis: string;           // e.g. "6SM"
  wxPhenomena: string;   // e.g. "-RA" or ""
  clouds: string;        // e.g. "BKN035 OVC050"
  tempDew: string;       // e.g. "18/12"
  altimeter: string;     // e.g. "A2992"
  rmk: string;           // e.g. "RMK SC5SC3 SLP013"
};

type MetarTemplate = {
  parts: Omit<MetarParts, "icao" | "dayTime">;
  decoded: {
    windDir: number;
    windSpeed: number;
    gustSpeed: number | null;
    visSm: number;
    ceilingFt: number | null; // null = no ceiling (VFR)
    cloudLayers: string;     // human readable
    tempC: number;
    dewC: number;
    altimeterInHg: string;
    phenomena: string;       // human readable, e.g. "Light rain"
    flightCategory: "VFR" | "MVFR" | "IFR" | "LIFR" | "SVFR";
  };
  /** A quiz question about this METAR. Player must decode one element. */
  wxQuestion: {
    stem: string;
    options: [string, string, string, string];
    correctOption: 1 | 2 | 3 | 4;
    explanation: string;
  };
};

export const METAR_TEMPLATES: MetarTemplate[] = [
  {
    parts: {
      wind: "27008KT",
      vis: "15SM",
      wxPhenomena: "",
      clouds: "FEW055 SCT080",
      tempDew: "22/14",
      altimeter: "A3005",
      rmk: "RMK CI1SC2 SLP176",
    },
    decoded: {
      windDir: 270, windSpeed: 8, gustSpeed: null, visSm: 15,
      ceilingFt: null, cloudLayers: "Few at 5,500, scattered at 8,000",
      tempC: 22, dewC: 14, altimeterInHg: "30.05",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "What does \"FEW055 SCT080\" mean?",
      options: [
        "Few clouds at 550 feet, scattered at 800 feet.",
        "Few clouds at 5,500 feet, scattered at 8,000 feet.",
        "Fog at 5,500 feet, overcast at 8,000 feet.",
        "Few clouds at 55,000 feet, scattered at 80,000 feet.",
      ],
      correctOption: 2,
      explanation: "Cloud heights in METARs are in hundreds of feet AGL. FEW055 = few at 5,500 ft, SCT080 = scattered at 8,000 ft. Neither is a ceiling since FEW and SCT don't constitute ceilings.",
    },
  },
  {
    parts: {
      wind: "15012KT",
      vis: "6SM",
      wxPhenomena: "-RA",
      clouds: "BKN035 OVC050",
      tempDew: "14/11",
      altimeter: "A2978",
      rmk: "RMK SC5SC3 SLP085",
    },
    decoded: {
      windDir: 150, windSpeed: 12, gustSpeed: null, visSm: 6,
      ceilingFt: 3500, cloudLayers: "Broken at 3,500, overcast at 5,000",
      tempC: 14, dewC: 11, altimeterInHg: "29.78",
      phenomena: "Light rain", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "What is the ceiling in this METAR?",
      options: [
        "5,000 feet AGL.",
        "3,500 feet AGL.",
        "No ceiling — conditions are VFR.",
        "6 statute miles.",
      ],
      correctOption: 2,
      explanation: "A ceiling is the lowest broken (BKN) or overcast (OVC) layer. BKN035 = broken at 3,500 ft AGL. That's the ceiling. OVC050 is above it but BKN035 is what matters for flight planning.",
    },
  },
  {
    parts: {
      wind: "32015G22KT",
      vis: "8SM",
      wxPhenomena: "",
      clouds: "SCT045 BKN070",
      tempDew: "18/08",
      altimeter: "A2992",
      rmk: "RMK SC4AC2 SLP132",
    },
    decoded: {
      windDir: 320, windSpeed: 15, gustSpeed: 22, visSm: 8,
      ceilingFt: 7000, cloudLayers: "Scattered at 4,500, broken at 7,000",
      tempC: 18, dewC: 8, altimeterInHg: "29.92",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "What does \"32015G22KT\" tell you?",
      options: [
        "Wind from 320 degrees at 15 knots, gusting to 22.",
        "Wind from 032 degrees at 15 knots, gusting to 22.",
        "Wind from 320 degrees at 22 knots, steady.",
        "Variable wind between 150 and 220 degrees at 32 knots.",
      ],
      correctOption: 1,
      explanation: "Wind is always reported as direction (true)/speed/gusts in knots. 320 = direction from (northwest), 15 = speed, G22 = gusts to 22 knots. The G means gusts — the wind is varying between 15 and 22 kt.",
    },
  },
  {
    parts: {
      wind: "00000KT",
      vis: "20SM",
      wxPhenomena: "",
      clouds: "FEW100 SKC",
      tempDew: "26/10",
      altimeter: "A3018",
      rmk: "RMK CI1 SLP223",
    },
    decoded: {
      windDir: 0, windSpeed: 0, gustSpeed: null, visSm: 20,
      ceilingFt: null, cloudLayers: "Few at 10,000, sky clear",
      tempC: 26, dewC: 10, altimeterInHg: "30.18",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "The wind is reported as \"00000KT\". What does this mean?",
      options: [
        "Wind data is missing.",
        "Wind is calm.",
        "Wind is variable at less than 3 knots.",
        "Wind is from the north at 0 knots.",
      ],
      correctOption: 2,
      explanation: "00000KT means calm winds — no measurable wind speed or direction. If winds were variable and light, the report would say VRB at some speed. 00000 specifically means calm.",
    },
  },
  {
    parts: {
      wind: "09010KT",
      vis: "3SM",
      wxPhenomena: "BR",
      clouds: "OVC012",
      tempDew: "08/07",
      altimeter: "A2968",
      rmk: "RMK ST8 SLP054",
    },
    decoded: {
      windDir: 90, windSpeed: 10, gustSpeed: null, visSm: 3,
      ceilingFt: 1200, cloudLayers: "Overcast at 1,200",
      tempC: 8, dewC: 7, altimeterInHg: "29.68",
      phenomena: "Mist", flightCategory: "IFR",
    },
    wxQuestion: {
      stem: "\"BR\" in the METAR means what?",
      options: [
        "Heavy rain.",
        "Blowing snow.",
        "Mist (visibility 5/8 SM to 6 SM).",
        "Drizzle.",
      ],
      correctOption: 3,
      explanation: "BR stands for 'brume' (French for mist). It's reported when visibility is between 5/8 SM and 6 SM due to water droplets. Below 5/8 SM it becomes FG (fog). This METAR has 3SM vis with mist — marginal conditions.",
    },
  },
  {
    parts: {
      wind: "21014G20KT",
      vis: "10SM",
      wxPhenomena: "",
      clouds: "BKN040 BKN120",
      tempDew: "20/12",
      altimeter: "A2985",
      rmk: "RMK SC5AC2 SLP110",
    },
    decoded: {
      windDir: 210, windSpeed: 14, gustSpeed: 20, visSm: 10,
      ceilingFt: 4000, cloudLayers: "Broken at 4,000, broken at 12,000",
      tempC: 20, dewC: 12, altimeterInHg: "29.85",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "With a ceiling of BKN040, are you legal to fly VFR in controlled airspace?",
      options: [
        "No — VFR requires at least 5,000 foot ceiling in controlled airspace.",
        "Yes — VFR in controlled airspace requires 1,000 ft above cloud, and you can fly below 3,000 ft AGL.",
        "No — you need Special VFR.",
        "Yes — there's no minimum ceiling for VFR.",
      ],
      correctOption: 2,
      explanation: "In controlled airspace, VFR requires 500 ft below / 1,000 ft above / 1 NM horizontal from cloud, with 3 SM vis. With a ceiling of 4,000 ft, you can fly VFR below 3,000 ft while maintaining 1,000 ft clearance above you. No issue.",
    },
  },
  {
    parts: {
      wind: "18008KT",
      vis: "15SM",
      wxPhenomena: "",
      clouds: "SCT060",
      tempDew: "24/16",
      altimeter: "A3002",
      rmk: "RMK CU3 SLP168",
    },
    decoded: {
      windDir: 180, windSpeed: 8, gustSpeed: null, visSm: 15,
      ceilingFt: null, cloudLayers: "Scattered at 6,000",
      tempC: 24, dewC: 16, altimeterInHg: "30.02",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "The altimeter setting is A3002. What does this mean?",
      options: [
        "Set your altimeter to 30.02 inches of mercury.",
        "The field elevation is 3,002 feet.",
        "The pressure altitude is 3,002 feet.",
        "QNH is 3002 hectopascals.",
      ],
      correctOption: 1,
      explanation: "A3002 means the altimeter setting is 30.02 inches of mercury (inHg). The 'A' prefix indicates an altimeter setting in inches. Canadian METARs use this format. You set this in your altimeter's Kollsman window so your altimeter reads correct altitude.",
    },
  },
  {
    parts: {
      wind: "30018G28KT",
      vis: "5SM",
      wxPhenomena: "-TSRA",
      clouds: "SCT025CB BKN045 OVC080",
      tempDew: "19/17",
      altimeter: "A2962",
      rmk: "RMK CB5SC2AC1 PRESRR SLP036",
    },
    decoded: {
      windDir: 300, windSpeed: 18, gustSpeed: 28, visSm: 5,
      ceilingFt: 4500, cloudLayers: "Scattered CB at 2,500, broken at 4,500, overcast at 8,000",
      tempC: 19, dewC: 17, altimeterInHg: "29.62",
      phenomena: "Light thunderstorm with rain", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "You see \"-TSRA\" and \"SCT025CB\" in the METAR. What should concern you most?",
      options: [
        "Nothing — the rain is light so it's fine to fly.",
        "The CB indicates cumulonimbus (thunderstorm) clouds, and -TSRA means thunderstorms with rain are occurring. Avoid this area.",
        "TS means turbulence is smooth. CB means clear below.",
        "The minus sign means the thunderstorm is departing the area.",
      ],
      correctOption: 2,
      explanation: "CB = cumulonimbus (thunderstorm clouds). -TSRA = light thunderstorm with rain. Even 'light' thunderstorms are dangerous for VFR — severe turbulence, wind shear, and microbursts. The temp/dew spread of only 2 degrees also means more moisture and instability.",
    },
  },
  // ── 9: Variable wind direction (VRB) ──────────────────────────────────────
  {
    parts: {
      wind: "VRB05KT",
      vis: "10SM",
      wxPhenomena: "",
      clouds: "SCT040 BKN080",
      tempDew: "16/10",
      altimeter: "A2998",
      rmk: "RMK SC3AC2 SLP152",
    },
    decoded: {
      windDir: 0, windSpeed: 5, gustSpeed: null, visSm: 10,
      ceilingFt: 8000, cloudLayers: "Scattered at 4,000, broken at 8,000",
      tempC: 16, dewC: 10, altimeterInHg: "29.98",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "The wind is reported as \"VRB05KT\". What does VRB mean?",
      options: [
        "Wind is from the north (variable north).",
        "Wind direction is variable — shifting and not from one consistent direction.",
        "Wind is calm but gusting variably.",
        "The wind sensor is malfunctioning.",
      ],
      correctOption: 2,
      explanation: "VRB means the wind direction is variable, shifting around and not assignable to a single direction. This is commonly reported when wind speeds are 6 knots or less. The speed here is 5 knots.",
    },
  },
  // ── 10: Wind direction meaning (from vs to) ──────────────────────────────
  {
    parts: {
      wind: "18012KT",
      vis: "8SM",
      wxPhenomena: "",
      clouds: "FEW045 BKN070",
      tempDew: "21/13",
      altimeter: "A2990",
      rmk: "RMK CU2SC4 SLP126",
    },
    decoded: {
      windDir: 180, windSpeed: 12, gustSpeed: null, visSm: 8,
      ceilingFt: 7000, cloudLayers: "Few at 4,500, broken at 7,000",
      tempC: 21, dewC: 13, altimeterInHg: "29.90",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "Wind reported as \"18012KT\". Which direction is the wind coming FROM?",
      options: [
        "From the north (360°).",
        "From the south (180°).",
        "Toward the south (blowing northward).",
        "From the east (180° is easterly).",
      ],
      correctOption: 2,
      explanation: "METAR wind direction always indicates where the wind is blowing FROM, in degrees true. 180° = south. So this is a southerly wind at 12 knots blowing from south toward north.",
    },
  },
  // ── 11: Crosswind component estimation ────────────────────────────────────
  {
    parts: {
      wind: "27015KT",
      vis: "12SM",
      wxPhenomena: "",
      clouds: "FEW060 SCT100",
      tempDew: "19/09",
      altimeter: "A3010",
      rmk: "RMK CU2CI1 SLP195",
    },
    decoded: {
      windDir: 270, windSpeed: 15, gustSpeed: null, visSm: 12,
      ceilingFt: null, cloudLayers: "Few at 6,000, scattered at 10,000",
      tempC: 19, dewC: 9, altimeterInHg: "30.10",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "Wind is 27015KT and you plan to land runway 30. What is the approximate crosswind component?",
      options: [
        "15 knots — full crosswind.",
        "About 8 knots (30° off runway heading, roughly half the wind speed).",
        "0 knots — the wind is aligned with the runway.",
        "About 13 knots (nearly all crosswind).",
      ],
      correctOption: 2,
      explanation: "Runway 30 heading is 300°. Wind from 270°. Angle difference is 30°. Crosswind = wind speed × sin(30°) = 15 × 0.5 = 7.5 knots, approximately 8 knots. The rest is headwind component.",
    },
  },
  // ── 12: Strong/sustained winds vs gusts ───────────────────────────────────
  {
    parts: {
      wind: "25020G35KT",
      vis: "9SM",
      wxPhenomena: "",
      clouds: "SCT030 BKN055",
      tempDew: "15/06",
      altimeter: "A2970",
      rmk: "RMK SC3AC3 SLP060",
    },
    decoded: {
      windDir: 250, windSpeed: 20, gustSpeed: 35, visSm: 9,
      ceilingFt: 5500, cloudLayers: "Scattered at 3,000, broken at 5,500",
      tempC: 15, dewC: 6, altimeterInHg: "29.70",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "Wind is \"25020G35KT\". What is the gust spread and why does it matter?",
      options: [
        "Gust spread is 35 knots — it represents the maximum wind.",
        "Gust spread is 15 knots (35 minus 20) — it indicates the range of speed variation you may encounter.",
        "Gust spread is 55 knots (35 plus 20) — add them together for planning.",
        "Gust spread is 20 knots — the sustained speed IS the gust spread.",
      ],
      correctOption: 2,
      explanation: "Gust spread is the difference between gust speed and sustained speed: 35 - 20 = 15 knots. A large gust spread means significant speed variation, increasing turbulence risk and making approach speed management difficult. Many schools limit students to 15 kt gust spreads.",
    },
  },
  // ── 13: Wind direction in degrees vs compass ──────────────────────────────
  {
    parts: {
      wind: "04510KT",
      vis: "15SM",
      wxPhenomena: "",
      clouds: "FEW080",
      tempDew: "20/08",
      altimeter: "A3015",
      rmk: "RMK CI2 SLP210",
    },
    decoded: {
      windDir: 45, windSpeed: 10, gustSpeed: null, visSm: 15,
      ceilingFt: null, cloudLayers: "Few at 8,000",
      tempC: 20, dewC: 8, altimeterInHg: "30.15",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "Wind is reported as \"04510KT\". What compass direction does 045° correspond to?",
      options: [
        "East.",
        "North.",
        "Northeast.",
        "Southeast.",
      ],
      correctOption: 3,
      explanation: "045° is northeast. Compass directions: 360/000=North, 090=East, 180=South, 270=West. 045 is halfway between north (360) and east (090), which is northeast. The wind blows FROM the northeast at 10 knots.",
    },
  },
  // ── 14: Light and variable winds ──────────────────────────────────────────
  {
    parts: {
      wind: "VRB03KT",
      vis: "20SM",
      wxPhenomena: "",
      clouds: "SKC",
      tempDew: "28/12",
      altimeter: "A3022",
      rmk: "RMK SLP236",
    },
    decoded: {
      windDir: 0, windSpeed: 3, gustSpeed: null, visSm: 20,
      ceilingFt: null, cloudLayers: "Sky clear",
      tempC: 28, dewC: 12, altimeterInHg: "30.22",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "When are winds reported as VRB (variable) in a METAR?",
      options: [
        "Only when wind speed exceeds 20 knots and direction shifts rapidly.",
        "When wind speed is 6 knots or less and direction is variable.",
        "Whenever the wind direction changes more than 10° in an hour.",
        "Only during thunderstorm activity.",
      ],
      correctOption: 2,
      explanation: "VRB is used when wind speed is 6 knots or less and the direction is variable. At these low speeds, a specific direction can't be determined. Above 6 knots, variable winds are shown with a specific mean direction plus a VRBdddVddd remark.",
    },
  },
  // ── 15: Fractional visibility (1/2SM) ─────────────────────────────────────
  {
    parts: {
      wind: "12005KT",
      vis: "1/2SM",
      wxPhenomena: "FG",
      clouds: "VV002",
      tempDew: "06/06",
      altimeter: "A2985",
      rmk: "RMK FG8 SLP112",
    },
    decoded: {
      windDir: 120, windSpeed: 5, gustSpeed: null, visSm: 0.5,
      ceilingFt: 200, cloudLayers: "Vertical visibility 200 feet",
      tempC: 6, dewC: 6, altimeterInHg: "29.85",
      phenomena: "Fog", flightCategory: "LIFR",
    },
    wxQuestion: {
      stem: "Visibility is reported as \"1/2SM\". What does this mean?",
      options: [
        "Visibility is 12 statute miles.",
        "Visibility is one-half statute mile (0.5 SM).",
        "Visibility varies between 1 and 2 statute miles.",
        "Visibility is 2 statute miles in one direction.",
      ],
      correctOption: 2,
      explanation: "1/2SM means visibility is one-half statute mile. Fractional visibilities in METARs use standard fractions: 1/4, 1/2, 3/4 SM. This is well below VFR minimums (3 SM) — these are LIFR conditions with fog.",
    },
  },
  // ── 16: Prevailing vs directional visibility ──────────────────────────────
  {
    parts: {
      wind: "33008KT",
      vis: "6SM",
      wxPhenomena: "-RA",
      clouds: "BKN020 OVC040",
      tempDew: "10/08",
      altimeter: "A2975",
      rmk: "RMK SC6SC2 VIS S2 SLP072",
    },
    decoded: {
      windDir: 330, windSpeed: 8, gustSpeed: null, visSm: 6,
      ceilingFt: 2000, cloudLayers: "Broken at 2,000, overcast at 4,000",
      tempC: 10, dewC: 8, altimeterInHg: "29.75",
      phenomena: "Light rain", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "The METAR shows \"6SM\" visibility with remarks \"VIS S2\". What does this mean?",
      options: [
        "Visibility is 62 statute miles to the south.",
        "Prevailing visibility is 6 SM, but visibility to the south is only 2 SM.",
        "Visibility is 6 SM but the sensor is 2 miles south of the station.",
        "Visibility is 6.2 statute miles in all directions.",
      ],
      correctOption: 2,
      explanation: "The main visibility in a METAR is the prevailing (most common) visibility. Directional visibility in remarks (VIS S2) means visibility to the south is only 2 SM. You could depart in 6 SM but fly into 2 SM conditions southbound.",
    },
  },
  // ── 17: Visibility at VFR minimums (3SM) ──────────────────────────────────
  {
    parts: {
      wind: "20010KT",
      vis: "3SM",
      wxPhenomena: "BR",
      clouds: "BKN045",
      tempDew: "14/12",
      altimeter: "A2995",
      rmk: "RMK SC5 SLP142",
    },
    decoded: {
      windDir: 200, windSpeed: 10, gustSpeed: null, visSm: 3,
      ceilingFt: 4500, cloudLayers: "Broken at 4,500",
      tempC: 14, dewC: 12, altimeterInHg: "29.95",
      phenomena: "Mist", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "Visibility is exactly 3 SM. What flight category does this fall into?",
      options: [
        "VFR — 3 SM meets the VFR minimum.",
        "IFR — anything below 5 SM is IFR.",
        "MVFR — 3 SM visibility falls in the marginal VFR range (3–5 SM).",
        "SVFR — you need special VFR clearance at 3 SM.",
      ],
      correctOption: 3,
      explanation: "A visibility of 3 SM falls in the MVFR (Marginal VFR) range. MVFR is defined as visibility 3 to 5 SM and/or ceiling 1,000 to 3,000 feet. While you may legally fly VFR in some cases, conditions warrant extra caution.",
    },
  },
  // ── 18: Unlimited visibility (P6SM) ───────────────────────────────────────
  {
    parts: {
      wind: "34006KT",
      vis: "P6SM",
      wxPhenomena: "",
      clouds: "FEW120",
      tempDew: "24/06",
      altimeter: "A3020",
      rmk: "RMK CI1 SLP230",
    },
    decoded: {
      windDir: 340, windSpeed: 6, gustSpeed: null, visSm: 7,
      ceilingFt: null, cloudLayers: "Few at 12,000",
      tempC: 24, dewC: 6, altimeterInHg: "30.20",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "Visibility is reported as \"P6SM\". What does the P prefix mean?",
      options: [
        "Visibility is precisely 6 statute miles.",
        "Visibility is greater than 6 statute miles (P = plus/more than).",
        "Visibility is poor at 6 statute miles.",
        "Visibility is projected to be 6 statute miles.",
      ],
      correctOption: 2,
      explanation: "P6SM means visibility is greater than 6 statute miles. The 'P' prefix stands for 'plus' (more than). Some automated stations report P6SM instead of specific values like 10SM or 15SM. It indicates excellent visibility.",
    },
  },
  // ── 19: Visibility with precipitation reducing it ─────────────────────────
  {
    parts: {
      wind: "16015KT",
      vis: "2SM",
      wxPhenomena: "RA",
      clouds: "OVC015",
      tempDew: "12/10",
      altimeter: "A2962",
      rmk: "RMK ST8 SLP040",
    },
    decoded: {
      windDir: 160, windSpeed: 15, gustSpeed: null, visSm: 2,
      ceilingFt: 1500, cloudLayers: "Overcast at 1,500",
      tempC: 12, dewC: 10, altimeterInHg: "29.62",
      phenomena: "Rain", flightCategory: "IFR",
    },
    wxQuestion: {
      stem: "With 2SM visibility in rain and an overcast ceiling at 1,500 feet, what is the primary visibility concern?",
      options: [
        "Visibility is above VFR minimums so there is no concern.",
        "Rain can further reduce visibility suddenly, and with IFR ceilings, conditions may deteriorate to LIFR.",
        "2SM is only a concern at night.",
        "Visibility in rain always improves as the front passes.",
      ],
      correctOption: 2,
      explanation: "2 SM visibility in rain is IFR. Rain can intensify and drop visibility further. Combined with a 1,500 ft ceiling, conditions are already IFR and could quickly become LIFR. VFR flight is not legal, and conditions may worsen.",
    },
  },
  // ── 20: Light snow (-SN) ──────────────────────────────────────────────────
  {
    parts: {
      wind: "02012KT",
      vis: "3SM",
      wxPhenomena: "-SN",
      clouds: "OVC018",
      tempDew: "M03/M05",
      altimeter: "A2948",
      rmk: "RMK SC8 SLP998",
    },
    decoded: {
      windDir: 20, windSpeed: 12, gustSpeed: null, visSm: 3,
      ceilingFt: 1800, cloudLayers: "Overcast at 1,800",
      tempC: -3, dewC: -5, altimeterInHg: "29.48",
      phenomena: "Light snow", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "The weather phenomena \"-SN\" means what?",
      options: [
        "Heavy snow.",
        "Snow showers ending.",
        "Light snow (the minus prefix indicates light intensity).",
        "Snow mixed with freezing rain.",
      ],
      correctOption: 3,
      explanation: "In METAR notation, the minus sign (-) indicates light intensity, no prefix means moderate, and plus (+) means heavy. -SN = light snow. Light snow can still reduce visibility and accumulate on surfaces — check icing and runway conditions.",
    },
  },
  // ── 21: Heavy rain (+RA) ──────────────────────────────────────────────────
  {
    parts: {
      wind: "22018G26KT",
      vis: "1SM",
      wxPhenomena: "+RA",
      clouds: "BKN008 OVC020",
      tempDew: "16/15",
      altimeter: "A2952",
      rmk: "RMK SC5SC3 SLP020",
    },
    decoded: {
      windDir: 220, windSpeed: 18, gustSpeed: 26, visSm: 1,
      ceilingFt: 800, cloudLayers: "Broken at 800, overcast at 2,000",
      tempC: 16, dewC: 15, altimeterInHg: "29.52",
      phenomena: "Heavy rain", flightCategory: "IFR",
    },
    wxQuestion: {
      stem: "What does the \"+\" in \"+RA\" signify?",
      options: [
        "Rain is increasing in coverage.",
        "Rain is heavy intensity.",
        "Rain is of positive temperature (above freezing).",
        "Rain is intermittent.",
      ],
      correctOption: 2,
      explanation: "The + prefix means heavy intensity. +RA = heavy rain. METAR uses three intensity levels: - (light), no prefix (moderate), + (heavy). Heavy rain severely reduces visibility — here to just 1 SM — and creates hydroplaning risk on runways.",
    },
  },
  // ── 22: FG (fog) vs BR (mist) difference ─────────────────────────────────
  {
    parts: {
      wind: "00000KT",
      vis: "1/4SM",
      wxPhenomena: "FG",
      clouds: "VV001",
      tempDew: "02/02",
      altimeter: "A2995",
      rmk: "RMK FG8 SLP148",
    },
    decoded: {
      windDir: 0, windSpeed: 0, gustSpeed: null, visSm: 0.25,
      ceilingFt: 100, cloudLayers: "Vertical visibility 100 feet",
      tempC: 2, dewC: 2, altimeterInHg: "29.95",
      phenomena: "Fog", flightCategory: "LIFR",
    },
    wxQuestion: {
      stem: "What is the key difference between FG (fog) and BR (mist) in a METAR?",
      options: [
        "FG is reported when visibility is below 5/8 SM; BR when it is 5/8 SM to 6 SM.",
        "FG is frozen moisture; BR is liquid moisture.",
        "FG is natural; BR is man-made.",
        "FG occurs at night only; BR occurs during the day.",
      ],
      correctOption: 1,
      explanation: "The distinction is purely visibility-based. FG (fog) is reported when visibility drops below 5/8 statute mile. BR (mist/brume) is used when visibility is between 5/8 SM and 6 SM. Both involve small water droplets, but fog is denser.",
    },
  },
  // ── 23: Freezing rain (FZRA) ──────────────────────────────────────────────
  {
    parts: {
      wind: "07012KT",
      vis: "2SM",
      wxPhenomena: "FZRA",
      clouds: "OVC010",
      tempDew: "M01/M02",
      altimeter: "A2955",
      rmk: "RMK ST8 SLP015",
    },
    decoded: {
      windDir: 70, windSpeed: 12, gustSpeed: null, visSm: 2,
      ceilingFt: 1000, cloudLayers: "Overcast at 1,000",
      tempC: -1, dewC: -2, altimeterInHg: "29.55",
      phenomena: "Freezing rain", flightCategory: "IFR",
    },
    wxQuestion: {
      stem: "\"FZRA\" is reported in the METAR. What does this mean for aircraft?",
      options: [
        "Rain that is very cold but will not freeze on contact.",
        "Freezing rain — supercooled water drops that freeze on contact with surfaces, causing rapid ice accumulation.",
        "Rain mixed with dry snow that causes no icing.",
        "Frozen rain pellets (ice pellets/sleet) bouncing off surfaces.",
      ],
      correctOption: 2,
      explanation: "FZRA = freezing rain. The raindrops are supercooled and freeze on contact with aircraft surfaces, creating dangerous clear ice rapidly. This is one of the most hazardous icing conditions. VFR flight should not be attempted.",
    },
  },
  // ── 24: Blowing snow (BLSN) ───────────────────────────────────────────────
  {
    parts: {
      wind: "31025G38KT",
      vis: "1SM",
      wxPhenomena: "BLSN",
      clouds: "OVC025",
      tempDew: "M12/M15",
      altimeter: "A2938",
      rmk: "RMK SC8 SLP950",
    },
    decoded: {
      windDir: 310, windSpeed: 25, gustSpeed: 38, visSm: 1,
      ceilingFt: 2500, cloudLayers: "Overcast at 2,500",
      tempC: -12, dewC: -15, altimeterInHg: "29.38",
      phenomena: "Blowing snow", flightCategory: "IFR",
    },
    wxQuestion: {
      stem: "\"BLSN\" is reported. What is blowing snow and why is it hazardous?",
      options: [
        "Snow falling from clouds — same as SN but heavier.",
        "Snow being lifted from the surface by strong winds, reducing visibility. It can occur even without snowfall.",
        "A type of snow that only occurs during blizzards above 10,000 feet.",
        "Light, fluffy snow that poses no hazard to aviation.",
      ],
      correctOption: 2,
      explanation: "BLSN = blowing snow. Wind lifts existing snow from the ground, reducing surface visibility even when it's not actively snowing. With 31025G38KT winds, visibility is cut to 1 SM. Blowing snow can also cause whiteout conditions and obscure runway markings.",
    },
  },
  // ── 25: Showers (SH) vs continuous precipitation ──────────────────────────
  {
    parts: {
      wind: "24012KT",
      vis: "5SM",
      wxPhenomena: "-SHRA",
      clouds: "SCT020 BKN045",
      tempDew: "17/13",
      altimeter: "A2982",
      rmk: "RMK CU4SC2 SLP102",
    },
    decoded: {
      windDir: 240, windSpeed: 12, gustSpeed: null, visSm: 5,
      ceilingFt: 4500, cloudLayers: "Scattered at 2,000, broken at 4,500",
      tempC: 17, dewC: 13, altimeterInHg: "29.82",
      phenomena: "Light rain showers", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "What is the difference between \"-SHRA\" (rain showers) and \"-RA\" (rain)?",
      options: [
        "There is no difference — both mean light rain.",
        "SHRA is rain from convective clouds (cumulus), starting and stopping abruptly. RA is steady rain from stratiform clouds.",
        "SHRA is sleet and hail mixed with rain. RA is pure rain.",
        "SHRA only occurs at high altitudes, RA at the surface.",
      ],
      correctOption: 2,
      explanation: "SH (showers) indicates precipitation from convective (cumulus) clouds — it starts and stops suddenly and varies in intensity. RA without SH indicates steady, continuous rain from stratiform (layered) clouds. Showers mean more variability in conditions.",
    },
  },
  // ── 26: Drizzle (DZ) ─────────────────────────────────────────────────────
  {
    parts: {
      wind: "14008KT",
      vis: "4SM",
      wxPhenomena: "DZ",
      clouds: "OVC008",
      tempDew: "09/08",
      altimeter: "A2972",
      rmk: "RMK ST8 SLP065",
    },
    decoded: {
      windDir: 140, windSpeed: 8, gustSpeed: null, visSm: 4,
      ceilingFt: 800, cloudLayers: "Overcast at 800",
      tempC: 9, dewC: 8, altimeterInHg: "29.72",
      phenomena: "Drizzle", flightCategory: "IFR",
    },
    wxQuestion: {
      stem: "\"DZ\" is reported in the METAR. What is drizzle?",
      options: [
        "Very light snow.",
        "Very small water droplets that fall slowly, typically from stratus clouds.",
        "A dust storm with zero visibility.",
        "Dense fog with freezing precipitation.",
      ],
      correctOption: 2,
      explanation: "DZ = drizzle. Drizzle consists of very small, closely spaced water droplets (< 0.5 mm diameter) falling from low stratus clouds. It's associated with low ceilings and poor visibility. Here, OVC008 (800 ft ceiling) with drizzle creates IFR conditions.",
    },
  },
  // ── 27: Haze (HZ) ────────────────────────────────────────────────────────
  {
    parts: {
      wind: "19006KT",
      vis: "5SM",
      wxPhenomena: "HZ",
      clouds: "SCT070",
      tempDew: "18/10",
      altimeter: "A3008",
      rmk: "RMK AC3 SLP186",
    },
    decoded: {
      windDir: 190, windSpeed: 6, gustSpeed: null, visSm: 5,
      ceilingFt: null, cloudLayers: "Scattered at 7,000",
      tempC: 18, dewC: 10, altimeterInHg: "30.08",
      phenomena: "Haze", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "\"HZ\" appears in the METAR. What is haze and when is it reported?",
      options: [
        "Haze is a type of freezing precipitation.",
        "Haze is fine dry particles (dust, pollution) suspended in air, reported when visibility is reduced to 6 SM or less.",
        "Haze is heavy fog in mountainous areas.",
        "Haze is steam rising from warm water surfaces.",
      ],
      correctOption: 2,
      explanation: "HZ = haze. It's caused by fine dry particles (dust, smoke, pollution) reducing visibility. It's distinguished from mist (BR) — haze is dry particles, mist is water droplets. Haze is common in calm, stable conditions and reduces visibility gradually.",
    },
  },
  // ── 28: SKC vs CLR difference ─────────────────────────────────────────────
  {
    parts: {
      wind: "36008KT",
      vis: "15SM",
      wxPhenomena: "",
      clouds: "CLR",
      tempDew: "22/08",
      altimeter: "A3012",
      rmk: "RMK SLP202",
    },
    decoded: {
      windDir: 360, windSpeed: 8, gustSpeed: null, visSm: 15,
      ceilingFt: null, cloudLayers: "Clear below 12,000",
      tempC: 22, dewC: 8, altimeterInHg: "30.12",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "What is the difference between \"CLR\" and \"SKC\" in a METAR?",
      options: [
        "CLR means clear below 12,000 ft (automated station); SKC means sky clear at all levels (human observer).",
        "SKC means partly cloudy; CLR means completely clear.",
        "There is no difference — both mean clear skies.",
        "CLR means clear of ice; SKC means sky condition unknown.",
      ],
      correctOption: 1,
      explanation: "CLR is used by automated stations (AWOS/ASOS) and means no clouds detected below 12,000 feet. SKC is used by human observers and means the sky is completely clear at all levels. CLR does NOT guarantee clear skies above 12,000 ft.",
    },
  },
  // ── 29: Multiple cloud layers reading ─────────────────────────────────────
  {
    parts: {
      wind: "28010KT",
      vis: "8SM",
      wxPhenomena: "",
      clouds: "FEW012 SCT025 BKN050 OVC090",
      tempDew: "15/11",
      altimeter: "A2980",
      rmk: "RMK CU2SC3AC2AS1 SLP098",
    },
    decoded: {
      windDir: 280, windSpeed: 10, gustSpeed: null, visSm: 8,
      ceilingFt: 5000, cloudLayers: "Few at 1,200, scattered at 2,500, broken at 5,000, overcast at 9,000",
      tempC: 15, dewC: 11, altimeterInHg: "29.80",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "This METAR reports four cloud layers: FEW012 SCT025 BKN050 OVC090. Which layer is the ceiling?",
      options: [
        "FEW012 — it's the lowest layer.",
        "SCT025 — scattered counts as a ceiling.",
        "BKN050 — the lowest broken or overcast layer.",
        "OVC090 — overcast is always the ceiling.",
      ],
      correctOption: 3,
      explanation: "A ceiling is defined as the lowest layer reported as broken (BKN) or overcast (OVC). FEW and SCT layers don't count as ceilings. BKN050 (broken at 5,000 ft) is the ceiling here, even though there are lower cloud layers.",
    },
  },
  // ── 30: TCU (towering cumulus) significance ───────────────────────────────
  {
    parts: {
      wind: "23015G22KT",
      vis: "6SM",
      wxPhenomena: "",
      clouds: "SCT035TCU BKN070",
      tempDew: "23/18",
      altimeter: "A2976",
      rmk: "RMK TCU4AC2 SLP074",
    },
    decoded: {
      windDir: 230, windSpeed: 15, gustSpeed: 22, visSm: 6,
      ceilingFt: 7000, cloudLayers: "Scattered towering cumulus at 3,500, broken at 7,000",
      tempC: 23, dewC: 18, altimeterInHg: "29.76",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "\"SCT035TCU\" is reported. What does TCU indicate?",
      options: [
        "Thin cumulus clouds — no significance.",
        "Towering cumulus — indicating strong updrafts and potential thunderstorm development.",
        "Tropical cumulus — only found near the equator.",
        "Temporary cumulus — clouds that are dissipating.",
      ],
      correctOption: 2,
      explanation: "TCU = towering cumulus. These are large cumulus clouds with significant vertical development, indicating strong convective updrafts. TCU often develops into cumulonimbus (CB) and thunderstorms. Their presence warns of potential turbulence, wind shear, and worsening weather.",
    },
  },
  // ── 31: Vertical visibility (VV) in obscured sky ──────────────────────────
  {
    parts: {
      wind: "08006KT",
      vis: "1/4SM",
      wxPhenomena: "FG",
      clouds: "VV003",
      tempDew: "01/01",
      altimeter: "A2990",
      rmk: "RMK FG8 SLP130",
    },
    decoded: {
      windDir: 80, windSpeed: 6, gustSpeed: null, visSm: 0.25,
      ceilingFt: 300, cloudLayers: "Vertical visibility 300 feet (sky obscured)",
      tempC: 1, dewC: 1, altimeterInHg: "29.90",
      phenomena: "Fog", flightCategory: "LIFR",
    },
    wxQuestion: {
      stem: "Instead of cloud layers, this METAR shows \"VV003\". What does this mean?",
      options: [
        "Variable visibility at 300 feet.",
        "The sky is obscured and vertical visibility is 300 feet — you cannot see the sky or any cloud layers.",
        "Very light clouds at 3,000 feet.",
        "Visibility is variable between 0 and 3 SM.",
      ],
      correctOption: 2,
      explanation: "VV (vertical visibility) is reported when the sky is completely obscured (usually by fog, heavy snow, etc.). VV003 means you can see upward only 300 feet. There is no definable cloud base — just an obscured sky. This constitutes an indefinite ceiling of 300 ft.",
    },
  },
  // ── 32: Scattered does NOT constitute a ceiling ───────────────────────────
  {
    parts: {
      wind: "17010KT",
      vis: "10SM",
      wxPhenomena: "",
      clouds: "SCT025 SCT050",
      tempDew: "20/12",
      altimeter: "A3000",
      rmk: "RMK CU3AC2 SLP158",
    },
    decoded: {
      windDir: 170, windSpeed: 10, gustSpeed: null, visSm: 10,
      ceilingFt: null, cloudLayers: "Scattered at 2,500, scattered at 5,000",
      tempC: 20, dewC: 12, altimeterInHg: "30.00",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "The METAR shows \"SCT025 SCT050\" with no BKN or OVC layers. Is there a ceiling?",
      options: [
        "Yes — SCT025 is the ceiling at 2,500 feet.",
        "Yes — the combined coverage of both layers creates a ceiling.",
        "No — scattered layers do not constitute a ceiling. Only BKN or OVC layers define a ceiling.",
        "No — ceilings only apply to IFR conditions.",
      ],
      correctOption: 3,
      explanation: "A ceiling requires at least a broken (BKN, 5/8 to 7/8 coverage) or overcast (OVC, 8/8 coverage) layer. Scattered (SCT, 3/8 to 4/8) does not qualify. With only SCT layers, there is no ceiling, and this reports as VFR conditions.",
    },
  },
  // ── 33: Cloud coverage oktas (FEW/SCT/BKN/OVC) ───────────────────────────
  {
    parts: {
      wind: "21008KT",
      vis: "12SM",
      wxPhenomena: "",
      clouds: "FEW008 SCT020 BKN060",
      tempDew: "13/09",
      altimeter: "A2988",
      rmk: "RMK CU1CU3SC4 SLP118",
    },
    decoded: {
      windDir: 210, windSpeed: 8, gustSpeed: null, visSm: 12,
      ceilingFt: 6000, cloudLayers: "Few at 800, scattered at 2,000, broken at 6,000",
      tempC: 13, dewC: 9, altimeterInHg: "29.88",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "In cloud coverage, what do FEW, SCT, BKN, and OVC represent in eighths of sky coverage?",
      options: [
        "FEW = 1-2/8, SCT = 3-4/8, BKN = 5-7/8, OVC = 8/8.",
        "FEW = 0/8, SCT = 1/8, BKN = 2/8, OVC = 3/8.",
        "FEW = light clouds, SCT = medium, BKN = heavy, OVC = total (no numerical definition).",
        "FEW = 1/8, SCT = 2/8, BKN = 4/8, OVC = 6/8.",
      ],
      correctOption: 1,
      explanation: "Cloud coverage uses oktas (eighths): FEW = 1–2/8, SCT (scattered) = 3–4/8, BKN (broken) = 5–7/8, OVC (overcast) = 8/8. Only BKN and OVC are considered ceilings because they cover more than half the sky.",
    },
  },
  // ── 34: Negative temps with M prefix ──────────────────────────────────────
  {
    parts: {
      wind: "35015KT",
      vis: "8SM",
      wxPhenomena: "-SN",
      clouds: "BKN020 OVC035",
      tempDew: "M05/M08",
      altimeter: "A2942",
      rmk: "RMK SC5SC3 SLP960",
    },
    decoded: {
      windDir: 350, windSpeed: 15, gustSpeed: null, visSm: 8,
      ceilingFt: 2000, cloudLayers: "Broken at 2,000, overcast at 3,500",
      tempC: -5, dewC: -8, altimeterInHg: "29.42",
      phenomena: "Light snow", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "Temperature/dewpoint is \"M05/M08\". What does the M prefix mean?",
      options: [
        "M stands for 'missing' — temperature data is unavailable.",
        "M stands for 'minus' — the temperature is -5°C and dewpoint is -8°C.",
        "M stands for 'moderate' — temperatures are moderate.",
        "M means the values are measured in Fahrenheit, not Celsius.",
      ],
      correctOption: 2,
      explanation: "In METARs, the M prefix indicates a negative (below zero) temperature in Celsius. M05 = -5°C, M08 = -8°C. Temperatures are always in Celsius. The M comes from 'minus'. This is a common Canadian winter scenario — watch for icing conditions.",
    },
  },
  // ── 35: Temp/dew spread and fog risk ──────────────────────────────────────
  {
    parts: {
      wind: "10005KT",
      vis: "6SM",
      wxPhenomena: "BR",
      clouds: "SCT008 OVC020",
      tempDew: "11/10",
      altimeter: "A2982",
      rmk: "RMK CU3ST5 SLP104",
    },
    decoded: {
      windDir: 100, windSpeed: 5, gustSpeed: null, visSm: 6,
      ceilingFt: 2000, cloudLayers: "Scattered at 800, overcast at 2,000",
      tempC: 11, dewC: 10, altimeterInHg: "29.82",
      phenomena: "Mist", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "Temperature is 11°C and dewpoint is 10°C (1° spread). What does this small spread indicate?",
      options: [
        "The air is very dry and evaporation is occurring rapidly.",
        "Conditions are ideal for soaring and thermal activity.",
        "The air is nearly saturated — fog or low clouds are likely to form, especially with cooling.",
        "The temperature sensors are malfunctioning.",
      ],
      correctOption: 3,
      explanation: "A small temperature-dewpoint spread (1-3°C) means the air is close to saturation. As temperature drops (especially near evening), fog or low stratus will likely form. Here, BR (mist) is already present. Expect visibility to worsen — plan accordingly.",
    },
  },
  // ── 36: Temp/dew same = fog likely ────────────────────────────────────────
  {
    parts: {
      wind: "00000KT",
      vis: "1SM",
      wxPhenomena: "BR",
      clouds: "OVC004",
      tempDew: "05/05",
      altimeter: "A2998",
      rmk: "RMK ST8 SLP156",
    },
    decoded: {
      windDir: 0, windSpeed: 0, gustSpeed: null, visSm: 1,
      ceilingFt: 400, cloudLayers: "Overcast at 400",
      tempC: 5, dewC: 5, altimeterInHg: "29.98",
      phenomena: "Mist", flightCategory: "IFR",
    },
    wxQuestion: {
      stem: "Temperature and dewpoint are both 5°C (spread = 0). What does this tell you?",
      options: [
        "The air is extremely dry.",
        "The air is fully saturated — fog, mist, or low clouds are occurring or imminent.",
        "Temperature measurement is unreliable.",
        "Strong convective activity is expected.",
      ],
      correctOption: 2,
      explanation: "When temperature equals dewpoint (spread = 0), the air is fully saturated at 100% relative humidity. Moisture must condense — expect fog, mist, or cloud formation at the surface. Combined with calm winds and OVC004, this is a classic radiation fog scenario.",
    },
  },
  // ── 37: High temp/dew spread = dry conditions ─────────────────────────────
  {
    parts: {
      wind: "24012KT",
      vis: "15SM",
      wxPhenomena: "",
      clouds: "FEW080",
      tempDew: "30/08",
      altimeter: "A2995",
      rmk: "RMK CI1 SLP142",
    },
    decoded: {
      windDir: 240, windSpeed: 12, gustSpeed: null, visSm: 15,
      ceilingFt: null, cloudLayers: "Few at 8,000",
      tempC: 30, dewC: 8, altimeterInHg: "29.95",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "Temperature is 30°C and dewpoint is 8°C (22° spread). What does this large spread indicate?",
      options: [
        "Thunderstorms are imminent.",
        "Very dry air — low humidity and virtually no fog risk, but strong turbulence from thermal activity is possible.",
        "Freezing conditions aloft.",
        "The station is located at a very high elevation.",
      ],
      correctOption: 2,
      explanation: "A large temperature-dewpoint spread (>15°C) indicates very dry air with low relative humidity. Fog risk is near zero, but hot, dry conditions create strong thermal convection — expect bumpy flying from turbulence, especially in the afternoon.",
    },
  },
  // ── 38: Low altimeter = lower than indicated altitude ─────────────────────
  {
    parts: {
      wind: "15012KT",
      vis: "6SM",
      wxPhenomena: "-RA",
      clouds: "BKN030 OVC060",
      tempDew: "08/06",
      altimeter: "A2912",
      rmk: "RMK SC5AC3 SLP892",
    },
    decoded: {
      windDir: 150, windSpeed: 12, gustSpeed: null, visSm: 6,
      ceilingFt: 3000, cloudLayers: "Broken at 3,000, overcast at 6,000",
      tempC: 8, dewC: 6, altimeterInHg: "29.12",
      phenomena: "Light rain", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "The altimeter is A2912, well below standard (29.92). If you fly from high to low pressure without correcting your altimeter, what happens?",
      options: [
        "Your altimeter will read higher than your actual altitude — you are lower than you think.",
        "Your altimeter will read lower than your actual altitude — you are higher than you think.",
        "Nothing — the altimeter adjusts automatically.",
        "Your airspeed indicator will be affected, not the altimeter.",
      ],
      correctOption: 1,
      explanation: "\"High to low, look out below.\" Flying from high to low pressure without updating the altimeter makes it over-read. You're actually lower than indicated. With A2912 (0.80 inHg below standard), the error is about 800 feet — significant for terrain clearance.",
    },
  },
  // ── 39: Standard altimeter 29.92 ──────────────────────────────────────────
  {
    parts: {
      wind: "27010KT",
      vis: "10SM",
      wxPhenomena: "",
      clouds: "FEW045 SCT090",
      tempDew: "18/10",
      altimeter: "A2992",
      rmk: "RMK CU2CI1 SLP132",
    },
    decoded: {
      windDir: 270, windSpeed: 10, gustSpeed: null, visSm: 10,
      ceilingFt: null, cloudLayers: "Few at 4,500, scattered at 9,000",
      tempC: 18, dewC: 10, altimeterInHg: "29.92",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "The altimeter reads A2992 (29.92 inHg). When would a pilot deliberately set 29.92 on their altimeter?",
      options: [
        "When landing at any airport.",
        "When flying at or above 18,000 feet ASL (flight levels) to use pressure altitude as the standard.",
        "Only when flying in uncontrolled airspace.",
        "Whenever the METAR altimeter happens to read 29.92.",
      ],
      correctOption: 2,
      explanation: "29.92 inHg is the standard pressure setting. Pilots set this when flying at or above 18,000 ft (FL180). All aircraft at these altitudes use the same reference, ensuring safe vertical separation regardless of local pressure variations.",
    },
  },
  // ── 40: High vs low pressure trends ───────────────────────────────────────
  {
    parts: {
      wind: "06005KT",
      vis: "20SM",
      wxPhenomena: "",
      clouds: "FEW100",
      tempDew: "16/04",
      altimeter: "A3042",
      rmk: "RMK CI1 SLP308",
    },
    decoded: {
      windDir: 60, windSpeed: 5, gustSpeed: null, visSm: 20,
      ceilingFt: null, cloudLayers: "Few at 10,000",
      tempC: 16, dewC: 4, altimeterInHg: "30.42",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "The altimeter setting is A3042. What does a high altimeter setting generally indicate about the weather?",
      options: [
        "A low-pressure system with deteriorating weather.",
        "A high-pressure system typically associated with fair weather and stable conditions.",
        "The altimeter is broken — 30.42 is not a realistic value.",
        "Strong upper-level winds and turbulence.",
      ],
      correctOption: 2,
      explanation: "An altimeter setting of 30.42 inHg is well above standard (29.92). High pressure typically brings fair weather, clear skies, and stable conditions. This METAR confirms it: 20 SM visibility, few high clouds, and a large temp-dew spread.",
    },
  },
  // ── 41: Altimeter correction in cold weather ──────────────────────────────
  {
    parts: {
      wind: "33012KT",
      vis: "10SM",
      wxPhenomena: "",
      clouds: "SCT035 BKN080",
      tempDew: "M18/M22",
      altimeter: "A2982",
      rmk: "RMK SC3AC4 SLP105",
    },
    decoded: {
      windDir: 330, windSpeed: 12, gustSpeed: null, visSm: 10,
      ceilingFt: 8000, cloudLayers: "Scattered at 3,500, broken at 8,000",
      tempC: -18, dewC: -22, altimeterInHg: "29.82",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "Temperature is M18 (-18°C) and altimeter is A2982. Why should you be concerned about your altitude readings in extreme cold?",
      options: [
        "Cold air has no effect on altimeter readings.",
        "Cold air is denser — your true altitude is HIGHER than indicated. No safety concern.",
        "Cold air is denser — your true altitude is LOWER than indicated, requiring altitude corrections near terrain.",
        "Cold weather only affects GPS altitude, not barometric.",
      ],
      correctOption: 3,
      explanation: "Cold air is denser, making pressure levels sag lower. Your altimeter over-reads — you are lower than indicated. At -18°C, the error can be several hundred feet. Near terrain or on approach, apply cold weather altitude corrections from the CFS/AIM to maintain safe clearance.",
    },
  },
  // ── 42: IFR conditions definition ─────────────────────────────────────────
  {
    parts: {
      wind: "17015KT",
      vis: "2SM",
      wxPhenomena: "RA",
      clouds: "OVC008",
      tempDew: "10/09",
      altimeter: "A2958",
      rmk: "RMK ST8 SLP028",
    },
    decoded: {
      windDir: 170, windSpeed: 15, gustSpeed: null, visSm: 2,
      ceilingFt: 800, cloudLayers: "Overcast at 800",
      tempC: 10, dewC: 9, altimeterInHg: "29.58",
      phenomena: "Rain", flightCategory: "IFR",
    },
    wxQuestion: {
      stem: "This METAR shows OVC008 and 2SM. What makes these conditions IFR?",
      options: [
        "IFR requires both ceiling below 1,000 AND visibility below 3 SM simultaneously.",
        "IFR exists when ceiling is below 1,000 feet OR visibility is below 3 statute miles (either condition qualifies).",
        "IFR is determined solely by the presence of precipitation.",
        "IFR only applies when winds exceed 25 knots.",
      ],
      correctOption: 2,
      explanation: "IFR conditions exist when the ceiling is below 1,000 ft OR visibility is below 3 SM — either one alone qualifies. Here, BOTH are IFR: ceiling 800 ft (< 1,000) and visibility 2 SM (< 3). VFR flight is not permitted in these conditions.",
    },
  },
  // ── 43: MVFR definition ───────────────────────────────────────────────────
  {
    parts: {
      wind: "26010KT",
      vis: "4SM",
      wxPhenomena: "BR",
      clouds: "BKN025 OVC045",
      tempDew: "12/10",
      altimeter: "A2985",
      rmk: "RMK SC5SC3 SLP115",
    },
    decoded: {
      windDir: 260, windSpeed: 10, gustSpeed: null, visSm: 4,
      ceilingFt: 2500, cloudLayers: "Broken at 2,500, overcast at 4,500",
      tempC: 12, dewC: 10, altimeterInHg: "29.85",
      phenomena: "Mist", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "With a ceiling of 2,500 ft and visibility 4 SM, this METAR is MVFR. What defines Marginal VFR?",
      options: [
        "Ceiling between 500 and 999 feet or visibility 1 to less than 3 SM.",
        "Ceiling between 1,000 and 3,000 feet and/or visibility 3 to 5 statute miles.",
        "Any condition with precipitation present.",
        "Ceiling above 3,000 feet but with reported weather phenomena.",
      ],
      correctOption: 2,
      explanation: "MVFR = ceiling 1,000–3,000 ft and/or visibility 3–5 SM. Both values here fall in the MVFR range: 2,500 ft ceiling and 4 SM visibility. VFR flight is legal but challenging — reduced cloud clearance and visibility require extra vigilance.",
    },
  },
  // ── 44: LIFR (low IFR) conditions ─────────────────────────────────────────
  {
    parts: {
      wind: "05008KT",
      vis: "1/4SM",
      wxPhenomena: "FZFG",
      clouds: "VV001",
      tempDew: "M02/M02",
      altimeter: "A2978",
      rmk: "RMK FG8 SLP088",
    },
    decoded: {
      windDir: 50, windSpeed: 8, gustSpeed: null, visSm: 0.25,
      ceilingFt: 100, cloudLayers: "Vertical visibility 100 feet (sky obscured)",
      tempC: -2, dewC: -2, altimeterInHg: "29.78",
      phenomena: "Freezing fog", flightCategory: "LIFR",
    },
    wxQuestion: {
      stem: "Ceiling is 100 feet (VV001) and visibility is 1/4 SM. What flight category is this?",
      options: [
        "IFR — ceiling below 1,000 and visibility below 3 SM.",
        "MVFR — conditions are marginal but flyable.",
        "LIFR (Low IFR) — ceiling below 500 feet or visibility below 1 SM.",
        "SVFR — Special VFR conditions.",
      ],
      correctOption: 3,
      explanation: "LIFR (Low IFR) is the most restrictive category: ceiling below 500 ft OR visibility below 1 SM. Here, both qualify — 100 ft ceiling and 1/4 SM visibility. Even IFR-equipped aircraft would find these conditions extremely challenging. Freezing fog adds icing danger.",
    },
  },
  // ── 45: Determining go/no-go from METAR ───────────────────────────────────
  {
    parts: {
      wind: "29018G30KT",
      vis: "3SM",
      wxPhenomena: "-SHRA",
      clouds: "BKN015 OVC030",
      tempDew: "11/09",
      altimeter: "A2958",
      rmk: "RMK CU6SC2 SLP025",
    },
    decoded: {
      windDir: 290, windSpeed: 18, gustSpeed: 30, visSm: 3,
      ceilingFt: 1500, cloudLayers: "Broken at 1,500, overcast at 3,000",
      tempC: 11, dewC: 9, altimeterInHg: "29.58",
      phenomena: "Light rain showers", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "As a VFR student pilot, you see: wind 29018G30KT, vis 3SM, ceiling 1,500 ft, rain showers. Should you go?",
      options: [
        "Yes — the ceiling is above 1,000 ft so it's fine for VFR.",
        "Yes — light showers are not a concern.",
        "No — while technically MVFR, the gusty winds (12 kt gust spread), low ceiling, marginal visibility, and active precipitation create high risk for a student.",
        "No — all flights are cancelled whenever rain is reported.",
      ],
      correctOption: 3,
      explanation: "Each factor alone might be manageable, but combined they're high risk: 18G30 winds (12 kt gust spread), 3 SM vis, 1,500 ft ceiling, rain showers, and low pressure. Good aeronautical decision-making means recognizing cumulative risk — this is a no-go for a student pilot.",
    },
  },
  // ── 46: SLP (sea level pressure) ──────────────────────────────────────────
  {
    parts: {
      wind: "22010KT",
      vis: "10SM",
      wxPhenomena: "",
      clouds: "SCT040 BKN080",
      tempDew: "17/10",
      altimeter: "A2992",
      rmk: "RMK SC3AC3 SLP132",
    },
    decoded: {
      windDir: 220, windSpeed: 10, gustSpeed: null, visSm: 10,
      ceilingFt: 8000, cloudLayers: "Scattered at 4,000, broken at 8,000",
      tempC: 17, dewC: 10, altimeterInHg: "29.92",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "The remarks include \"SLP132\". What does this mean?",
      options: [
        "Sea level pressure is 132 millibars.",
        "Sea level pressure is 1013.2 hectopascals (millibars).",
        "The slope of the pressure trend is 1.32 mb per hour.",
        "The station's elevation is 132 feet.",
      ],
      correctOption: 2,
      explanation: "SLP gives sea level pressure in hectopascals (millibars) with the leading 9 or 10 omitted and the last digit as tenths. SLP132 = 1013.2 hPa. If the value is over 500, prepend 9 (e.g., SLP982 = 998.2 hPa). If under 500, prepend 10 (SLP132 = 1013.2 hPa).",
    },
  },
  // ── 47: PRESRR/PRESFR (pressure rising/falling rapidly) ───────────────────
  {
    parts: {
      wind: "19020G32KT",
      vis: "4SM",
      wxPhenomena: "-RA",
      clouds: "BKN012 OVC025",
      tempDew: "13/11",
      altimeter: "A2945",
      rmk: "RMK SC6SC2 PRESFR SLP998",
    },
    decoded: {
      windDir: 190, windSpeed: 20, gustSpeed: 32, visSm: 4,
      ceilingFt: 1200, cloudLayers: "Broken at 1,200, overcast at 2,500",
      tempC: 13, dewC: 11, altimeterInHg: "29.45",
      phenomena: "Light rain", flightCategory: "MVFR",
    },
    wxQuestion: {
      stem: "The remarks include \"PRESFR\". What does this indicate?",
      options: [
        "Pressure is freezing — icing conditions expected.",
        "Pressure is falling rapidly — weather is likely deteriorating and a front or storm system is approaching.",
        "Pressure is falling and rising alternately.",
        "The pressure sensor has been recently repaired.",
      ],
      correctOption: 2,
      explanation: "PRESFR = pressure falling rapidly. This indicates a fast-moving low-pressure system or front approaching. Expect worsening weather: lower ceilings, reduced visibility, stronger winds. PRESRR is the opposite — pressure rising rapidly, usually behind a cold front.",
    },
  },
  // ── 48: AO2 (automated station with precip sensor) ────────────────────────
  {
    parts: {
      wind: "31010KT",
      vis: "9SM",
      wxPhenomena: "",
      clouds: "FEW035 BKN060",
      tempDew: "14/06",
      altimeter: "A3005",
      rmk: "RMK AO2 CU2AC3 SLP178",
    },
    decoded: {
      windDir: 310, windSpeed: 10, gustSpeed: null, visSm: 9,
      ceilingFt: 6000, cloudLayers: "Few at 3,500, broken at 6,000",
      tempC: 14, dewC: 6, altimeterInHg: "30.05",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "The remarks include \"AO2\". What does this tell you about the observation?",
      options: [
        "The observation was made by two independent observers.",
        "This is an automated station WITH a precipitation discriminator (can identify rain vs snow).",
        "This station observes weather at 2-hour intervals.",
        "The altimeter has been calibrated within the last 2 hours.",
      ],
      correctOption: 2,
      explanation: "AO2 = automated observation station type 2, equipped with a precipitation discriminator that can distinguish between liquid and frozen precipitation. AO1 lacks this sensor. Knowing the station type helps you judge the reliability of reported weather phenomena.",
    },
  },
  // ── 49: Zulu time in the METAR ────────────────────────────────────────────
  {
    parts: {
      wind: "23008KT",
      vis: "12SM",
      wxPhenomena: "",
      clouds: "FEW050 SCT100",
      tempDew: "20/10",
      altimeter: "A3002",
      rmk: "RMK CU2CI2 SLP168",
    },
    decoded: {
      windDir: 230, windSpeed: 8, gustSpeed: null, visSm: 12,
      ceilingFt: null, cloudLayers: "Few at 5,000, scattered at 10,000",
      tempC: 20, dewC: 10, altimeterInHg: "30.02",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "A METAR timestamp reads \"121845Z\". What does this mean?",
      options: [
        "December 18th at 4:50 local time.",
        "The 12th day of the month at 1845 UTC (Zulu time).",
        "12 hours and 18 minutes since the last observation, at station 45.",
        "Runway 12, at 1845 local time.",
      ],
      correctOption: 2,
      explanation: "METAR timestamps are DDHHMMz: DD = day of month, HHMM = hours and minutes in UTC (Zulu). 121845Z = 12th day at 18:45 UTC. All aviation weather uses UTC/Zulu, not local time. In Eastern Canada, Zulu is 4 or 5 hours ahead of local time.",
    },
  },
  // ── 50: AUTO vs manual observation ────────────────────────────────────────
  {
    parts: {
      wind: "16010KT",
      vis: "9SM",
      wxPhenomena: "",
      clouds: "SCT030 BKN055",
      tempDew: "16/09",
      altimeter: "A2998",
      rmk: "RMK AO2 SC3AC4 SLP152",
    },
    decoded: {
      windDir: 160, windSpeed: 10, gustSpeed: null, visSm: 9,
      ceilingFt: 5500, cloudLayers: "Scattered at 3,000, broken at 5,500",
      tempC: 16, dewC: 9, altimeterInHg: "29.98",
      phenomena: "None", flightCategory: "VFR",
    },
    wxQuestion: {
      stem: "Some METARs include the word \"AUTO\" after the timestamp. What does this indicate?",
      options: [
        "The METAR was automatically sent to all pilots in the area.",
        "The observation is fully automated with no human augmentation — certain phenomena (like thunderstorms or volcanic ash) may not be detected.",
        "The METAR updates automatically every minute.",
        "The aircraft autopilot should be used in these conditions.",
      ],
      correctOption: 2,
      explanation: "AUTO means the observation was generated entirely by automated sensors with no human observer augmenting the data. Automated stations may miss phenomena like thunderstorms, tornadoes, or ice pellets. When AUTO is absent, a human observer has reviewed or supplemented the report.",
    },
  },
];

/**
 * Build a raw METAR string from a template and airport.
 */
export function buildMetarString(icao: string, template: MetarTemplate): string {
  const p = template.parts;
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  const hour = String(Math.floor(Math.random() * 18) + 6).padStart(2, "0"); // 06-23Z
  const minute = ["00", "30"][Math.floor(Math.random() * 2)]!;
  const time = `${day}${hour}${minute}Z`;

  const parts = [
    `METAR ${icao}`,
    time,
    p.wind,
    p.vis,
    p.wxPhenomena,
    p.clouds,
    p.tempDew,
    p.altimeter,
    p.rmk,
  ].filter(Boolean);

  return parts.join(" ");
}

// ─── Flight Brief ──────────────────────────────────────────────────────────

export type FlightBrief = {
  airport: AirportInfo;
  runway: string;
  callsign: string;
  metar: {
    raw: string;
    template: MetarTemplate;
  };
  cruiseAltitude: string;
};

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomCallsign(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const a = randomPick(letters.split(""));
  const b = randomPick(letters.split(""));
  const c = randomPick(letters.split(""));
  return `C-G${a}${b}${c}`;
}

function pickRunwayNumber(runwayPair: string): string {
  const parts = runwayPair.split("/");
  return randomPick(parts);
}

export function generateFlightBrief(): FlightBrief {
  const airport = randomPick(AIRPORTS);
  const runwayPair = randomPick(airport.runways);
  const runway = pickRunwayNumber(runwayPair);
  const callsign = randomCallsign();
  const template = randomPick(METAR_TEMPLATES);
  const raw = buildMetarString(airport.icao, template);
  const altitudes = ["2,500", "3,500", "4,500", "5,500"];
  const cruiseAltitude = randomPick(altitudes);

  return {
    airport,
    runway,
    callsign,
    metar: { raw, template },
    cruiseAltitude,
  };
}
