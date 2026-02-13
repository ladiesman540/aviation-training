/**
 * Rule rationales — the "WHY does this rule exist?" layer.
 *
 * These are shared rationales mapped to groups of TP 11919 question IDs.
 * Many questions test the same underlying regulation, so one rationale
 * covers multiple questions.
 *
 * Every rationale is grounded in aviation safety history and TC AIM/CARs
 * reasoning — not speculative.
 */

export type RuleRationale = {
  id: string;
  title: string;
  rationale: string;
  questionIds: string[];
};

export const RULE_RATIONALES: RuleRationale[] = [
  // ─── RIGHT OF WAY (Section 1) ──────────────────────────────────────────
  {
    id: "right-of-way-hierarchy",
    title: "Right-of-Way Hierarchy",
    rationale: "The right-of-way rules exist because two aircraft heading for the same point in the sky need a universal system that works without any radio communication. The hierarchy is based on maneuverability: balloons can barely steer at all, so everything gives way to them. Gliders have no engine to go around, so powered aircraft yield to them. Aircraft towing things are less agile than free aircraft. This isn't arbitrary — it's built on the principle that the aircraft with the fewest options to avoid a collision gets priority. The system mirrors maritime law, which pilots borrowed because it was already proven over centuries of ships converging at sea.",
    questionIds: ["1.01", "1.03", "1.04", "1.05", "1.06"],
  },
  {
    id: "converging-right-has-right-of-way",
    title: "Right Has Right-of-Way",
    rationale: "When two aircraft converge, the one on the right has right-of-way. Why right? Because in most aircraft, the pilot sits on the left. That means traffic approaching from the right is partially blocked by the airframe and the right-seat passenger — it's your blind spot. The rule forces the pilot who can see better (the one with traffic on the left, in full view through the windscreen) to be the one who maneuvers. It also eliminates hesitation: both pilots instantly know who moves and who holds, with no radio call needed. Every mid-air collision investigation that involves converging traffic asks the same question: did both pilots know and follow this rule?",
    questionIds: ["1.02", "1.07"],
  },
  {
    id: "head-on-turn-right",
    title: "Head-On: Both Turn Right",
    rationale: "When two aircraft approach head-on, both alter heading to the right. Why not left? Because you need a rule that's deterministic — if one pilot picks left and the other picks right, you collide. 'Always right' means both aircraft move apart even if neither pilot can see which way the other is turning. This was adopted from maritime rules where ships pass port-to-port (left-to-left), which means each vessel turns starboard (right). The closure rate in a head-on is double your airspeed, so you have half the time to react compared to converging traffic. There's no time to negotiate.",
    questionIds: ["1.08"],
  },
  {
    id: "overtaking-and-approach-priority",
    title: "Overtaking and Approach Priority",
    rationale: "The overtaking rule (pass to the right) exists because the overtaken aircraft can't see you. You're in their blind spot behind them, so the burden is entirely on you to maintain clearance. The approach rule (lower aircraft has right-of-way) exists because the lower aircraft is closer to landing and has less energy to maneuver — they're configured, slowed down, and committed. Making the higher aircraft give way gives them the option to go around, extend, or orbit — options the lower aircraft doesn't have.",
    questionIds: ["1.09", "1.10"],
  },

  // ─── LIGHT GUN SIGNALS (Section 2) ─────────────────────────────────────
  {
    id: "light-gun-signals",
    title: "Light Gun Signals",
    rationale: "Light gun signals exist because radios fail. Your radio could die on short final, your electrical system could quit on the ground, or you might be flying a NORDO aircraft. ATC still needs a way to communicate clearances to you, and you still need to know what they mean. The color system is intuitive once you understand the logic: green means go (cleared), red means stop/danger, white means return. Steady light is a definitive instruction, flashing light is a preliminary or cautionary one. These signals date back to before radios existed in cockpits — they were the ONLY way towers communicated with aircraft. Memorize them. If your radio dies at a controlled field, this is all you've got.",
    questionIds: ["2.01", "2.02", "2.03", "2.04", "2.05", "2.06"],
  },

  // ─── RADIO PROCEDURES (Section 3) ──────────────────────────────────────
  {
    id: "callsign-procedures",
    title: "Callsign and Radio Procedures",
    rationale: "Radio procedures exist because the frequency is shared by everyone within range and nobody can see who's talking. Full callsign on initial contact (type + last 4 letters) prevents confusion between similar-sounding registrations. Phonetic alphabet (Alpha, Bravo, Charlie) exists because 'B', 'D', 'E', 'G', 'P', 'T' all sound the same over a noisy, compressed radio channel. The abbreviated callsign system (dropping the first 2 letters after initial contact) reduces congestion while maintaining enough uniqueness to avoid confusion. Every procedural word — 'Roger', 'Wilco', 'Affirm' — has a precise meaning because ambiguity on the radio kills people. When Tenerife happened in 1977 (583 dead), a contributing factor was the co-pilot saying 'we are at take-off' — ambiguous language on the radio.",
    questionIds: ["3.01", "3.02", "3.03", "3.04", "3.23", "3.24"],
  },
  {
    id: "atis-purpose",
    title: "ATIS Exists to Save Airtime",
    rationale: "ATIS (Automatic Terminal Information Service) exists because at busy airports, the controller would have to repeat the wind, runway, altimeter, and NOTAMs to every single aircraft that calls in. That eats up frequency time that should be used for clearances and traffic calls. ATIS broadcasts this information continuously on a separate frequency so you can listen before you call. The phonetic identifier (Alpha, Bravo, etc.) lets the controller know you have current information — if you say 'information Charlie' but the airport is now on 'Delta', the controller knows you're behind and will update you. It's an elegant system that trades a few seconds of your time for minutes of frequency congestion.",
    questionIds: ["3.05", "3.06"],
  },
  {
    id: "monitoring-frequencies",
    title: "Monitoring 126.7 and 121.5",
    rationale: "126.7 MHz is the enroute VFR advisory frequency in Canada — it's how uncontrolled traffic talks to each other in cruise. 121.5 MHz is the international emergency frequency. You monitor both because if someone is in distress or about to collide with you, these are the frequencies where you'll hear about it. 121.5 is also the frequency that ELTs transmit on, so if an aircraft crashes and the ELT activates, anyone monitoring 121.5 can pick it up and report it. Search and rescue response time improves dramatically when someone hears the signal early.",
    questionIds: ["3.07", "3.08", "5.07"],
  },
  {
    id: "mandatory-frequency",
    title: "Mandatory Frequency (MF) and ATF",
    rationale: "Mandatory Frequency exists at uncontrolled airports where there's no tower but enough traffic to need coordination. Without an MF, aircraft arrive and depart with no idea who else is there — the classic mid-air collision scenario. The MF requirement means you must broadcast your intentions (position, altitude, runway) so other pilots can build a mental picture of the traffic. At airports with no MF or UNICOM, the ATF (usually 123.2 MHz) serves the same purpose. The key principle: at uncontrolled airports, YOU are your own traffic controller, and the radio is how you do it.",
    questionIds: ["3.09", "3.10", "3.11", "3.12"],
  },
  {
    id: "taxi-clearance-runway-crossing",
    title: "Taxi Clearances Don't Include Runways",
    rationale: "A taxi clearance authorizes you to cross taxiways but NOT runways. This rule exists because of runway incursions — one of the most dangerous events in aviation. A runway is an active movement area where aircraft are taking off and landing at 60-130 knots. If a taxi clearance automatically included runway crossings, a misunderstanding could put you in the path of a departing jet. By requiring explicit clearance for each runway crossing, the system adds a confirmation step that forces both you and the controller to specifically acknowledge that you're about to enter an active runway. The Tenerife disaster, the deadliest accident in aviation history, began with a runway incursion.",
    questionIds: ["3.13", "3.14"],
  },
  {
    id: "immediate-takeoff",
    title: "Immediate Takeoff — No Stopping",
    rationale: "When you accept an 'immediate takeoff' clearance, you taxi onto the runway and go in one continuous motion — no stopping to do checks, no sitting on the runway. This exists because the controller issued 'immediate' for a reason: there's traffic on final, another aircraft waiting, or a gap in the sequence that's about to close. Every second you sit on the runway is a second that the landing aircraft gets closer. If you need time for checks, decline the clearance — that's explicitly allowed and is the safe choice.",
    questionIds: ["3.15"],
  },
  {
    id: "distress-urgency-signals",
    title: "MAYDAY vs PAN PAN",
    rationale: "MAYDAY (distress) and PAN PAN (urgency) are said three times each because radio channels are noisy and you might only catch part of a transmission. Saying it three times ensures at least one gets through clearly. MAYDAY comes from the French 'm'aidez' (help me) and means 'I am in immediate danger of crashing or dying — everyone shut up and help me.' PAN PAN is for situations that are serious but not immediately life-threatening — an ill passenger, a precautionary diversion, a partial system failure. The distinction matters because MAYDAY triggers full emergency response (fire trucks, ambulances, other traffic cleared), while PAN PAN gets you priority without the full emergency cascade.",
    questionIds: ["3.18", "3.19", "3.20"],
  },

  // ─── AERODROMES (Section 4) ────────────────────────────────────────────
  {
    id: "airport-vs-aerodrome",
    title: "Airport = Certified Aerodrome",
    rationale: "The distinction between 'airport' and 'aerodrome' matters because an airport (certified aerodrome) has met specific safety standards — obstacle clearances, runway markings, lighting, emergency services. An uncertified aerodrome (grass strip, farm field) hasn't. When a regulation says 'airport,' it means the certified kind, with all the infrastructure that implies. This affects your planning: you can't assume an aerodrome has the same services, markings, or safety margins as an airport.",
    questionIds: ["4.01", "4.03"],
  },
  {
    id: "aerodrome-operations",
    title: "Aerodrome Markings and Procedures",
    rationale: "Runway numbers, closed runway markings (white X on runways, yellow X on taxiways), wind indicators, and holding positions all exist to create an unambiguous visual language that works worldwide without radio or language skills. Runway 09 faces roughly east (090 degrees magnetic) — the number IS the heading divided by 10. The 200-foot hold distance exists because jet blast and prop wash at closer range can flip light aircraft. The manoeuvring area definition (taxiways + runways, not the apron) matters because different rules apply there — you're in the active movement area where aircraft are taking off and landing.",
    questionIds: ["4.02", "4.04", "4.05", "4.06", "4.07", "4.08"],
  },

  // ─── EQUIPMENT AND DOCUMENTS (Section 5) ───────────────────────────────
  {
    id: "required-documents",
    title: "Required Documents on Board",
    rationale: "The documents you must carry (C of A, Registration, Crew Licence, Flight Manual, Journey Log, Insurance) each serve a specific purpose. The Certificate of Airworthiness proves the aircraft is legally flyable. The Registration is like a car's license plate — it identifies ownership. The Flight Manual contains the performance data you need to fly safely (V-speeds, weight limits, emergency procedures). The Journey Log tracks maintenance state. Insurance is required because if you damage someone's property or injure someone, there must be a way to compensate them. A ramp check by Transport Canada can happen at any airport, and missing documents means your aircraft is grounded on the spot.",
    questionIds: ["5.01"],
  },
  {
    id: "survival-equipment",
    title: "Survival Equipment Requirements",
    rationale: "Canada has some of the most remote terrain on earth. If you go down 25 NM from an aerodrome, you could be in wilderness with no roads, no cell service, and no one looking for you for hours. The survival equipment requirements (seasonal supplies, life preservers on water) exist because search and rescue takes time, and the 'golden period' for survival in Canadian winters is measured in hours, not days. The 25 NM threshold is roughly the distance at which you're beyond easy walking range back to civilization.",
    questionIds: ["5.02", "5.06"],
  },
  {
    id: "oxygen-requirements",
    title: "Oxygen at Altitude",
    rationale: "Above 10,000 feet, the partial pressure of oxygen drops enough that your brain starts quietly malfunctioning — you feel fine but your judgment, reaction time, and vision degrade. The insidious part is that hypoxia makes you feel euphoric and confident, even as you make increasingly bad decisions. The rule allowing 30 minutes between 10,000 and 13,000 feet without oxygen is a compromise — brief exposure is tolerable, but extended flight requires supplemental oxygen. Above 13,000 feet, there's no grace period. These altitudes are lower than most people expect because the effects are subtle and cumulative.",
    questionIds: ["5.04", "5.05"],
  },
  {
    id: "night-flying-equipment",
    title: "Night Flying Requirements",
    rationale: "Night flying requirements (lighted aerodrome, landing lights for pax) exist because darkness eliminates your primary sense — vision. You lose the natural horizon, you can't see terrain, and unlighted obstacles become invisible. A lighted aerodrome gives you the visual references you need to judge your approach and landing. Landing lights on passenger-carrying aircraft aren't just for seeing the runway — they make you visible to other traffic and help you spot obstacles on short final. Night VFR accidents have a disproportionately high fatality rate because the first indication of a problem is often the ground.",
    questionIds: ["5.03", "5.08"],
  },
  {
    id: "instruments-for-day-vfr",
    title: "Required Instruments for Day VFR",
    rationale: "The minimum instruments for day VFR (airspeed indicator, altimeter, magnetic compass, timepiece) are the absolute basics for answering four questions: How fast am I going? How high am I? Which direction am I going? How long have I been flying? Without these, you can't maintain safe speeds (stall avoidance), legal altitudes (terrain clearance, cruising altitude rules), navigate to your destination, or manage your fuel. The attitude indicator and heading indicator aren't required for day VFR because in good visibility, the natural horizon and ground references replace them.",
    questionIds: ["5.11"],
  },

  // ─── PILOT RESPONSIBILITIES (Section 6) ────────────────────────────────
  {
    id: "pilot-is-final-authority",
    title: "The Pilot Is Always Responsible",
    rationale: "Multiple PSTAR questions hammer the same point: the pilot is the final authority for the safety of the flight. ATC can vector you, clear you, instruct you — but if following that instruction would put you into cloud, into another aircraft's path, or into terrain, YOU are responsible for saying no. This exists because ATC doesn't know everything: they can't see the cloud layer out your windscreen, they might have missed a target on radar, and their information is seconds old. The pilot in the aircraft has the most current information about the immediate situation. CARs 602.31 explicitly says you can deviate from a clearance when safety requires it — and you must advise ATC as soon as possible afterward.",
    questionIds: ["6.01", "6.11", "6.12", "6.13", "6.14", "6.15", "6.16", "6.17"],
  },
  {
    id: "intersection-takeoff-responsibility",
    title: "Intersection Takeoff — Your Call",
    rationale: "When a controller offers an intersection takeoff, the remaining runway length is YOUR responsibility to verify — the controller will not check it for you. This exists because the controller doesn't know your aircraft's performance requirements: your weight, your density altitude calculations, your obstacle clearance needs. Only you know whether 3,000 feet of remaining runway is enough for your loaded Cessna on a hot day. If you request the intersection takeoff yourself, the same applies — even more so, because you initiated it.",
    questionIds: ["6.02", "6.03"],
  },
  {
    id: "circuit-procedures",
    title: "Circuit Joining and Procedures",
    rationale: "Standard circuit procedures (join downwind at circuit height, left-hand circuits unless published otherwise) exist so that every pilot at an uncontrolled or controlled airport has the same mental picture of the traffic flow. If everyone joins at 1,000 feet AAE on the downwind, you know where to look for other traffic. The flexibility built in (NOTAMs can change circuit height, weather can force lower circuits, straight-in approaches exist) acknowledges that rigid rules can't cover every situation — but the default provides the predictability that prevents mid-airs in the pattern.",
    questionIds: ["6.04", "6.05", "6.06", "6.07", "6.08", "6.09", "6.10"],
  },
  {
    id: "transponder-usage",
    title: "Transponder Codes and Usage",
    rationale: "Transponder code 1200 is the universal VFR code — when ATC sees it on radar, they know you're VFR and not talking to anyone specific. The IDENT button creates a bright flash on the controller's screen so they can pick you out from dozens of targets — pressing it without being asked creates false identification and confusion. These procedures exist because radar shows dots, not aircraft types. The transponder is what makes your dot meaningful. Squawking the wrong code or hitting IDENT at the wrong time can send a controller chasing the wrong target while missing actual traffic conflicts.",
    questionIds: ["6.18", "6.19"],
  },
  {
    id: "student-pilot-restrictions",
    title: "Student Pilot Permit Restrictions",
    rationale: "Student pilots are restricted to day VFR only, solo only when authorized by their instructor, and no passengers. These restrictions exist because a student is still developing the judgment and skills needed for more complex situations. Night flying requires instrument skills a student hasn't developed. Passengers add distraction, pressure to continue in bad conditions ('get-there-itis'), and responsibility for lives beyond your own. The instructor authorization requirement creates a human checkpoint — someone who has flown with you and assessed whether you're ready to fly alone.",
    questionIds: ["6.20"],
  },
  {
    id: "preflight-requirements",
    title: "Preflight Information Requirements",
    rationale: "CARs 602.71 requires you to be 'familiar with all available information appropriate to the flight' — not just weather, not just NOTAMs, but everything relevant. This broad requirement exists because accidents rarely have a single cause. The pilot who skipped the NOTAMs didn't know the runway was shortened. The pilot who didn't check weather didn't know about the fog forecast. The pilot who didn't review the CFS didn't know the airport had a noise abatement procedure that changed the circuit. Preflight planning is where you catch the problems you can't catch in the air.",
    questionIds: ["6.22"],
  },

  // ─── WAKE TURBULENCE (Section 7) ───────────────────────────────────────
  {
    id: "wake-turbulence",
    title: "Wake Turbulence Is Invisible and Lethal",
    rationale: "Wake turbulence is generated by every aircraft in flight — it's the price of producing lift. Wingtip vortices spin like horizontal tornadoes, sink at 300-500 feet per minute, and can persist for over 5 minutes in calm air. A light aircraft hitting the vortex of a heavy jet can be flipped inverted at an altitude where recovery is impossible. The reason it's YOUR sole responsibility (not ATC's) is that ATC can provide warnings but cannot see vortices — they're invisible. Only you can apply the avoidance techniques: land beyond a heavy's touchdown point, take off before a heavy's rotation point, stay above their flight path, and give extra time in calm wind. The pilot is always the last line of defense against wake because it's an aerodynamic phenomenon, not a traffic management one.",
    questionIds: ["7.01", "7.02", "7.03", "7.04", "7.05", "7.06", "7.08", "7.09", "7.10", "7.11", "7.12", "7.13", "7.14", "7.15"],
  },

  // ─── AEROMEDICAL (Section 8) ───────────────────────────────────────────
  {
    id: "fitness-to-fly",
    title: "Fitness to Fly: You're the Weakest Link",
    rationale: "The aircraft doesn't care if you're hungover, fatigued, or congested — it'll fly fine. The problem is YOU. At altitude, every physiological impairment gets worse: alcohol hits harder because there's less oxygen, a blocked eustachian tube from a cold becomes agonizing ear pain during descent, fatigue-induced errors multiply because there's no one to catch them. The fitness-to-fly rules (no flying as crew when you know you're impaired, ground yourself before the Minister has to) exist because pilot incapacitation is a single point of failure in a small aircraft. There's no co-pilot to take over. If you're not right, the aircraft isn't right.",
    questionIds: ["8.01"],
  },
  {
    id: "aeromedical-physiology",
    title: "Your Body at Altitude",
    rationale: "Hyperventilation, ear problems during descent, decompression sickness from diving — these rules exist because the cockpit is a physiologically hostile environment. At altitude the air is thinner, pressure changes are constant, and your body reacts in ways that mimic emergencies (hyperventilation symptoms feel like hypoxia). The 24-hour rule after SCUBA diving with decompression stops exists because nitrogen bubbles in your blood will expand as cabin pressure decreases with altitude — the same mechanism that causes 'the bends' in divers. The ear-clearing techniques exist because a blocked eustachian tube during rapid descent can rupture your eardrum. Pilots need to understand their body as a system that has failure modes, just like the aircraft.",
    questionIds: ["8.02", "8.03", "8.04", "8.05", "8.06"],
  },
  {
    id: "alcohol-drugs-donation",
    title: "Alcohol, Drugs, and Impairment Timelines",
    rationale: "The 12-hour 'bottle to throttle' rule for alcohol (CARs 602.03), the 48-hour rule after blood donation, the 24-hour rule after local dental anesthesia — these aren't arbitrary waiting periods. They're based on how long these substances measurably affect performance in controlled studies. Alcohol is especially insidious because its effects are amplified at altitude: the equivalent of one drink at sea level hits like two or three drinks at 8,000 feet due to reduced oxygen. The blood donation rule exists because you've lost red blood cells — the oxygen carriers — and your blood's capacity to keep your brain functional at altitude is temporarily reduced. The medical certificate validity periods (24 months over 40, 60 months under 40) exist because age-related conditions (cardiovascular disease, vision degradation) develop faster after 40.",
    questionIds: ["8.07", "8.08", "8.09", "8.10", "8.11", "8.12", "8.13", "12.07"],
  },

  // ─── FLIGHT PLANS AND ITINERARIES (Section 9) ──────────────────────────
  {
    id: "flight-plans-sar",
    title: "Flight Plans Exist So Someone Comes Looking",
    rationale: "A flight plan is not paperwork — it's a search trigger. If you file a flight plan and don't close it within the required time, ATC initiates search and rescue. Without a flight plan or itinerary, nobody knows you're missing until someone on the ground notices you haven't come home. In remote Canadian terrain, the difference between being found in 2 hours (flight plan filed) and being found in 2 days (no plan filed) can be the difference between survival and death from exposure. The 'responsible person' concept in flight itineraries serves the same purpose: someone who knows your plan and will sound the alarm if you don't check in. The fuel requirements (30 minutes reserve for aeroplanes, 20 for helicopters) exist as a margin against headwinds, diversions, and holding — the things you can't perfectly predict but must survive.",
    questionIds: ["9.01", "9.02", "9.03", "9.04", "9.05", "9.06", "9.07", "9.08", "9.09", "9.10", "9.11"],
  },

  // ─── CLEARANCES AND INSTRUCTIONS (Section 10) ──────────────────────────
  {
    id: "clearance-vs-instruction",
    title: "Clearances vs Instructions",
    rationale: "The distinction between a clearance (requires acceptance) and an instruction (must be complied with, safety permitting) exists because of different levels of pilot authority. An instruction is a directive — comply unless it's unsafe. A clearance is more like an agreement: ATC proposes it, you accept it, and then you must follow it. But if conditions change and you can't comply, you take whatever immediate action safety requires and tell ATC as soon as you can. The key principle: ATC clearances are based on 'known traffic' — but there might be unknown traffic, weather ATC can't see, or mechanical issues they don't know about. The pilot's responsibility for traffic avoidance is NEVER transferred to ATC. You accepted a clearance, not a guarantee of safety.",
    questionIds: ["10.01", "10.02", "10.03", "10.04", "10.05", "10.06"],
  },

  // ─── AIRCRAFT OPERATIONS (Section 11) ──────────────────────────────────
  {
    id: "elt-operations",
    title: "ELT — Your Electronic Lifeline",
    rationale: "The Emergency Locator Transmitter broadcasts on 121.5 MHz when activated by a crash impact or manually. It's the difference between being found and being a statistic. Turning it on immediately in an emergency and leaving it on maximizes the time search aircraft have to home in on your signal. The 5-minutes-past-the-hour testing window exists so that genuine emergency signals aren't confused with tests — everyone (ATC, other pilots, SARSAT satellites) knows that a signal during that window is probably a test. Reporting accidental activations to ATS prevents expensive false-alarm search and rescue deployments.",
    questionIds: ["11.01", "11.02", "11.03", "11.04"],
  },
  {
    id: "thunderstorm-avoidance",
    title: "Thunderstorms Kill Light Aircraft",
    rationale: "Thunderstorms contain updrafts and downdrafts exceeding 6,000 feet per minute, hail that destroys windscreens, and microbursts that can push an aircraft into the ground on short final. A light aircraft cannot survive the interior of a mature thunderstorm — the structural loads exceed the airframe's design limits. The rules say avoid: don't take off into one, don't land with one near the field, and if one's near your destination, hold clear until it passes. 'Light' thunderstorms don't exist from a GA safety perspective — even a small CB cell can contain severe turbulence. Wind shear on final approach during a thunderstorm is the mechanism that has killed experienced airline crews; a student pilot has no chance.",
    questionIds: ["11.05", "11.06", "11.07"],
  },
  {
    id: "jet-blast-danger",
    title: "Jet and Propeller Blast",
    rationale: "A medium jet at takeoff thrust creates a blast zone extending 1,200 feet behind the tail — enough to flip a Cessna at several hundred feet. Even at idle, a jumbo jet's exhaust reaches 600 feet back. These distances exist in the regulations because they've been measured in real incidents. A Cherokee was flipped and destroyed by a 747's idle thrust at JFK. The turboprop taxi blast distances (60 feet for 45 knots of wind) are particularly relevant at Canadian airports where turboprops and light aircraft share taxiways. The rule is simple: know what's in front of you on the taxiway and give big aircraft more room than you think you need.",
    questionIds: ["11.08", "11.09", "11.10", "11.11", "11.12"],
  },
  {
    id: "simultaneous-operations",
    title: "Land and Hold Short (LAHSO)",
    rationale: "Simultaneous operations (land and hold short of an intersecting runway) exist to increase airport capacity — two aircraft can use intersecting runways at the same time if the landing aircraft stops before the intersection. The critical safety element: if you can't stop in the available distance (wet runway, gusty winds, fast approach), you MUST tell ATC immediately. Accepting a LAHSO clearance when you can't comply puts another aircraft's life at risk on the crossing runway. This is one of the rare cases where declining a clearance isn't just allowed — it's the only responsible choice.",
    questionIds: ["11.13", "11.14"],
  },

  // ─── AIRSPACE (Section 12) ─────────────────────────────────────────────
  {
    id: "vfr-weather-minimums",
    title: "VFR Weather Minimums Exist Because of Closing Speed",
    rationale: "The VFR weather minimums (visibility, cloud clearance) aren't about comfort — they're about collision avoidance math. At a combined closing speed of 250 knots (two aircraft head-on), 3 miles of visibility gives you roughly 43 seconds to see, identify, decide, and maneuver. That's barely enough. Below that visibility, the see-and-avoid system that VFR depends on breaks down. Cloud clearance distances (500 ft below, 1,000 ft above, 1 NM horizontal in controlled airspace) exist because IFR traffic is in the clouds and you need buffer space to not collide with an aircraft popping out of a cloud layer. Below 1,000 feet AGL in uncontrolled airspace, the rules relax to 'clear of cloud' because you're too low for most IFR traffic and terrain reference matters more.",
    questionIds: ["12.02", "12.03", "12.04", "13.02", "13.03", "13.04"],
  },
  {
    id: "adiz-rules",
    title: "ADIZ — National Defence",
    rationale: "Air Defence Identification Zones exist because Canada needs to identify every aircraft near its borders for national security. ADIZ rules apply to ALL aircraft — not just fast ones, not just IFR ones. The post-9/11 world means an unidentified aircraft heading toward a population center will get intercepted by CF-18s. Filing a DVFR flight plan when entering the ADIZ lets NORAD know you're a Cessna from Oshawa, not a threat. This is one rule where non-compliance has consequences beyond aviation: you may be met by fighter jets and forced to land.",
    questionIds: ["12.01"],
  },
  {
    id: "cruising-altitudes",
    title: "Cruising Altitudes Separate Traffic by Direction",
    rationale: "VFR cruising altitude rules (odd thousands + 500 for eastbound, even thousands + 500 for westbound, above 3,000 ft AGL) exist to create vertical separation between opposing traffic flows. If eastbound traffic is at 3,500 and westbound is at 4,500, there's always at least 1,000 feet between head-on traffic. The +500 offset separates VFR from IFR traffic (IFR uses round thousands). The magnetic track basis (not heading) is used because track is your actual path over the ground — if everyone uses the same reference, the system works regardless of individual wind correction angles. Below 3,000 ft AGL, terrain clearance matters more than traffic separation, so the rule doesn't apply.",
    questionIds: ["12.16", "12.17", "12.18"],
  },
  {
    id: "minimum-altitudes",
    title: "Minimum Altitudes Over People and Property",
    rationale: "The 1,000 ft minimum over built-up areas (within 500 ft horizontal of the highest obstacle) exists so that if your engine quits, you have enough altitude to glide to a forced landing area without hitting buildings or people below. The 500 ft minimum over non-built-up areas provides a smaller buffer because there are fewer people at risk and more forced-landing options. These rules are the reason light aircraft don't routinely fly at 200 feet over downtown Toronto — an engine failure at that altitude over a city is not survivable for people on the ground.",
    questionIds: ["12.13", "12.14", "12.15"],
  },
  {
    id: "class-f-airspace",
    title: "Class F Airspace — Restricted and Advisory",
    rationale: "CYR (restricted) airspace means something actively dangerous is happening there — military exercises, weapons testing, rocket launches. You cannot enter without permission from the using agency because you could be shot down, hit by ordnance, or fly through an artillery trajectory. CYA (advisory) airspace means activity is happening that you should know about — parachute jumping, aerobatics, model aircraft. You CAN enter but you're encouraged to avoid it during active times. The distinction matters: CYR is a hard boundary (enter and you may die), CYA is a heads-up (enter carefully and be aware).",
    questionIds: ["12.11", "12.12"],
  },
  {
    id: "day-night-definitions",
    title: "Day and Night Definitions",
    rationale: "In Canada, 'day' is from the beginning of morning civil twilight to the end of evening civil twilight — not sunrise to sunset. Civil twilight extends roughly 30 minutes before sunrise and after sunset, when there's still enough natural light to see the horizon and ground features. This matters because your pilot privileges (student pilot = day only) and equipment requirements (night requires specific instruments and lighting) depend on this definition. The practical effect: you have about 30 extra minutes of legal 'day' compared to sunrise/sunset.",
    questionIds: ["12.08", "12.09"],
  },

  // ─── CONTROLLED AIRSPACE (Section 13) ──────────────────────────────────
  {
    id: "controlled-airspace-clearance",
    title: "Controlled Airspace Requires Communication",
    rationale: "Class B and C airspace require ATC clearance before entry because these areas surround the busiest airports where jets are arriving and departing on instrument approaches. A VFR Cessna wandering into the approach path of a 737 on a 3-degree glideslope is a near-miss waiting to happen. The clearance requirement ensures ATC knows you're there and can sequence you safely with IFR traffic. Making initial contact BEFORE entering (not after) gives ATC time to say 'stay out' if traffic won't permit your transit. The Special VFR rules (1 mile vis, clear of cloud) exist as a reduced-minimums exception for aircraft that need to operate in a control zone when weather is below normal VFR — but only with ATC authorization, because ATC needs to separate you from IFR traffic when you can't see them.",
    questionIds: ["13.01", "13.05", "13.06", "13.07", "13.08", "13.09", "13.10", "13.11", "13.12"],
  },

  // ─── AVIATION OCCURRENCES (Section 14) ─────────────────────────────────
  {
    id: "occurrence-reporting",
    title: "Reporting Exists to Prevent the Next Accident",
    rationale: "The TSB (Transportation Safety Board) investigates accidents not to assign blame but to prevent recurrence. This distinction is critical — if pilots feared prosecution for reporting, they'd hide incidents and the safety system would collapse. Reporting 'as soon as possible by the quickest means available' exists because wreckage gets disturbed, memories fade, and evidence degrades. Missing aircraft are treated as accidents (not incidents) because until proven otherwise, someone may be alive in wreckage waiting for rescue. The 'do not disturb wreckage' rule preserves evidence that may reveal a mechanical failure, design flaw, or systemic issue that could affect every aircraft of that type. One investigation can save hundreds of future lives.",
    questionIds: ["14.01", "14.02", "14.03", "14.04", "14.05"],
  },
  // ─── ROC-A RADIO PROCEDURES ─────────────────────────────────────────────
  {
    id: "roc-a-radio-procedures",
    title: "Radio Procedure Discipline",
    rationale: "Aviation radio isn't casual conversation — it's a safety-critical communication protocol developed after decades of accidents caused by misunderstandings. Every procedural word (ROGER, WILCO, OVER, OUT, CORRECTION, SAY AGAIN) has one exact meaning because ambiguity kills. 'REPEAT' is banned because in military contexts it means 'fire again.' 'Over and out' contradicts itself. Frequencies are spoken digit-by-digit because '119.3' and '113.9' sound identical when slurred. The phonetic alphabet exists because 'B', 'D', 'E', 'G', 'P', 'T' are indistinguishable over a compressed, noisy VHF channel. The listen-before-transmit rule prevents you from stepping on a distress call. The MAYDAY format puts 'nature of distress' early because rescue services need to know what they're responding to before they know where. Every one of these procedures was written in the aftermath of someone dying because the radio was used carelessly.",
    questionIds: [
      "roc-freq-pronunciation", "roc-comm-priority", "roc-over-vs-out", "roc-correction-procedure",
      "roc-listen-before-transmit", "roc-mayday-message-order", "roc-affirm-negative", "roc-wilco-vs-roger",
      "roc-say-again-partial", "roc-read-back", "roc-altitude-pronunciation", "roc-heading-format",
      "roc-flight-level", "roc-zulu-time", "roc-privacy", "roc-comm-control", "roc-superfluous",
      "roc-false-distress", "roc-mayday-relay", "roc-mayday-ack", "roc-seelonce",
      "roc-phonetic-alphabet", "roc-number-nine",
    ],
  },
];

// Build lookup: questionId -> rationale
const _rationaleByQuestion = new Map<string, RuleRationale>();
for (const r of RULE_RATIONALES) {
  for (const qid of r.questionIds) {
    _rationaleByQuestion.set(qid, r);
  }
}

/** Get the rule rationale for a question ID. Returns undefined if no rationale exists. */
export function getRationale(questionId: string): RuleRationale | undefined {
  return _rationaleByQuestion.get(questionId);
}
