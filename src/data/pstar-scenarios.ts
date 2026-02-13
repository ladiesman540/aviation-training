/**
 * Scenario card rewrites for Quick Hop.
 * Each entry replaces the raw TP 11919 stem and options with decision-framed text.
 * The correctOption number stays the same — grading is unchanged.
 * Questions without a scenario entry fall back to flightContext + raw stem.
 */

export type ScenarioCard = {
  questionId: string;
  scenarioStem: string;
  scenarioOptions: [string, string, string, string];
};

/** Lookup map: questionId -> scenario rewrite */
export const SCENARIO_MAP: Record<string, ScenarioCard> = {};

/** Ordered array for reference */
export const PSTAR_SCENARIOS: ScenarioCard[] = [
  // === PREFLIGHT (8) ===
  {
    questionId: "5.01",
    scenarioStem: "You open the cockpit to start your document check. Which set is complete for this flight?",
    scenarioOptions: [
      "C of A, Registration, Technical Records, Crew Licences, Flight Manual, Journey Log",
      "C of A, Registration, Technical Records, Crew Licences, Type Certificate, Insurance",
      "C of A, Registration, Crew Licences, Flight Manual, Type Certificate, Journey Log",
      "C of A, Registration, Crew Licences, Flight Manual, Journey Log, Insurance",
    ],
  },
  {
    questionId: "5.11",
    scenarioStem: "You scan the instrument panel. For day VFR in this power-driven aircraft, which set of instruments is required alongside the magnetic compass?",
    scenarioOptions: [
      "Airspeed indicator, altimeter, and a timepiece.",
      "Airspeed indicator, attitude indicator, and heading indicator.",
      "Airspeed indicator, altimeter, vertical speed, turn and bank, and a timepiece.",
      "Attitude indicator, vertical speed, turn and bank, and heading indicator.",
    ],
  },
  {
    questionId: "8.01",
    scenarioStem: "Before heading to the airport, you realize you've had a bad head cold all week. As a flight crew member aware of a physical disability, what must you do?",
    scenarioOptions: [
      "Advise the Minister of Transport.",
      "Do not fly as a crew member.",
      "Forward your licence to the Regional Aviation Medical Officer.",
      "Fly only if a backup crew member is available.",
    ],
  },
  {
    questionId: "8.12",
    scenarioStem: "You're 42 years old. You pull out your medical certificate to check the expiry. How long is it valid?",
    scenarioOptions: [
      "12 months.",
      "24 months.",
      "36 months.",
      "48 months.",
    ],
  },
  {
    questionId: "8.13",
    scenarioStem: "Your friend, who is 28, asks how long their medical certificate lasts. What do you tell them?",
    scenarioOptions: [
      "72 months.",
      "60 months.",
      "48 months.",
      "24 months.",
    ],
  },
  {
    questionId: "9.01",
    scenarioStem: "You're planning a day VFR helicopter flight. How much fuel must you carry beyond what's needed to reach your destination?",
    scenarioOptions: [
      "45 minutes at normal cruise.",
      "Enough to fly to an alternate, then 45 minutes.",
      "20 minutes at normal cruise.",
      "Enough to fly to an alternate, then 20 minutes.",
    ],
  },
  {
    questionId: "9.02",
    scenarioStem: "Before your day VFR cross-country in the Cessna, you calculate fuel. Beyond reaching your destination, how much reserve is required?",
    scenarioOptions: [
      "45 minutes at normal cruising speed.",
      "30 minutes at normal cruising speed.",
      "Enough to reach an alternate plus 45 minutes.",
      "Enough to reach an alternate plus 30 minutes.",
    ],
  },
  {
    questionId: "9.03",
    scenarioStem: "You decide not to file a flight plan for today's trip. Under what circumstances must you file a flight itinerary instead?",
    scenarioOptions: [
      "When flying 25 NM or more from the departure point.",
      "Only for flights in sparsely settled areas.",
      "When landing at a place other than where you departed.",
      "For all flights regardless.",
    ],
  },

  // === TAXI / DEPARTURE (10) ===
  {
    questionId: "2.01",
    scenarioStem: "Your radio has failed on the ground. The tower flashes a series of green lights at you. What does that mean?",
    scenarioOptions: [
      "In flight: cleared to land. On ground: cleared to taxi.",
      "In flight: return for landing. On ground: cleared for take-off.",
      "In flight: return for landing. On ground: cleared to taxi.",
      "In flight: cleared to land. On ground: cleared for take-off.",
    ],
  },
  {
    questionId: "2.02",
    scenarioStem: "You're on the ramp with no radio. The tower points a steady red light at you. What does it mean?",
    scenarioOptions: [
      "In flight: give way and circle. On ground: stop.",
      "In flight: give way and circle. On ground: taxi clear of landing area.",
      "In flight: airport unsafe. On ground: taxi clear of landing area.",
      "In flight: airport unsafe. On ground: stop.",
    ],
  },
  {
    questionId: "2.04",
    scenarioStem: "On short final with a dead radio, you see a steady green light from the tower. What are you cleared for?",
    scenarioOptions: [
      "In flight: cleared to land. On ground: cleared to taxi.",
      "In flight: return for landing. On ground: cleared to taxi.",
      "In flight: return for landing. On ground: cleared for take-off.",
      "In flight: cleared to land. On ground: cleared for take-off.",
    ],
  },
  {
    questionId: "3.13",
    scenarioStem: "Ground clears you to taxi to the active runway. Your route crosses two taxiways and Runway 04. No hold-short instruction was given. What are you cleared to do?",
    scenarioOptions: [
      "Taxi to the active runway and hold short.",
      "Cross everything — taxiways and runway — no further clearance needed.",
      "Position on the active runway without further clearance.",
      "Taxi to the active runway, but request clearance to cross Runway 04.",
    ],
  },
  {
    questionId: "3.14",
    scenarioStem: "Ground says: \"Golf Alpha Bravo Charlie, taxi Runway 29, hold short of Runway 04.\" How do you read that back?",
    scenarioOptions: [
      "\"Golf Alpha Bravo Charlie to Runway 04.\"",
      "\"Golf Alpha Bravo Charlie to Runway 29.\"",
      "\"Golf Alpha Bravo Charlie hold short of 29.\"",
      "\"Golf Alpha Bravo Charlie hold short of 04.\"",
    ],
  },
  {
    questionId: "3.15",
    scenarioStem: "Tower clears you for immediate take-off. You accept. What do you do?",
    scenarioOptions: [
      "Back-track to use the full runway length.",
      "Taxi to position, stop, then take off without further clearance.",
      "Taxi onto the runway and take off in one continuous movement.",
      "Complete the pre-take-off check, then taxi on and take off.",
    ],
  },
  {
    questionId: "4.05",
    scenarioStem: "You're looking at the runway. It's oriented east-west. What number is painted on the west end?",
    scenarioOptions: [
      "09.",
      "90.",
      "27.",
      "270.",
    ],
  },
  {
    questionId: "4.06",
    scenarioStem: "There's no taxiway holding position marked here. How far from the runway edge should you hold?",
    scenarioOptions: [
      "Clear of the manoeuvring area entirely.",
      "50 feet from the edge.",
      "150 feet from the edge.",
      "200 feet from the edge.",
    ],
  },
  {
    questionId: "4.07",
    scenarioStem: "Your instructor asks: \"What's the manoeuvring area of an airport?\" What do you answer?",
    scenarioOptions: [
      "The ramp and apron.",
      "The apron, taxiways, and runways combined.",
      "The area used when taxiing to and from parking.",
      "The area used for taxiing, taking off, and landing.",
    ],
  },
  {
    questionId: "4.08",
    scenarioStem: "You want to overfly the airport to check the windsock before landing. What's the minimum height unless you're taking off or landing?",
    scenarioOptions: [
      "2,000 feet AGL.",
      "1,500 feet AGL.",
      "1,000 feet AGL.",
      "500 feet AGL.",
    ],
  },

  // === ENROUTE (18) ===
  {
    questionId: "1.02",
    scenarioStem: "A Cherokee appears converging from your right at the same altitude. Who gives way?",
    scenarioOptions: [
      "Both aircraft alter heading to the left.",
      "The aircraft on the right descends to avoid.",
      "You give way — the other aircraft is on your right.",
      "The other aircraft gives way — it has you on its left.",
    ],
  },
  {
    questionId: "1.07",
    scenarioStem: "Two Cessnas converge at 3,000 feet. You have the other one on your right. Who has the right of way?",
    scenarioOptions: [
      "You do — you're on the left.",
      "Neither — both alter heading left.",
      "The other aircraft — it's on your right.",
      "The other aircraft gives way by descending.",
    ],
  },
  {
    questionId: "1.08",
    scenarioStem: "Straight ahead — another aircraft, same altitude, coming right at you. What do you do?",
    scenarioOptions: [
      "Slow down.",
      "Speed up.",
      "Turn right.",
      "Turn left.",
    ],
  },
  {
    questionId: "1.09",
    scenarioStem: "You're overtaking a slower Piper Cub straight ahead at your altitude. How do you pass?",
    scenarioOptions: [
      "Climb over it.",
      "Descend under it.",
      "Alter heading to the right.",
      "Alter heading to the left.",
    ],
  },
  {
    questionId: "3.07",
    scenarioStem: "You're cruising VFR in uncontrolled airspace, not on a MF or ATF frequency. What should you be monitoring?",
    scenarioOptions: [
      "126.7 MHz and 121.5 MHz.",
      "123.2 MHz and 121.5 MHz.",
      "122.8 MHz and 121.5 MHz.",
      "122.2 MHz and 121.5 MHz.",
    ],
  },
  {
    questionId: "3.18",
    scenarioStem: "Your engine starts running rough and you smell smoke. You need help NOW. What do you transmit?",
    scenarioOptions: [
      "MAYDAY, MAYDAY, MAYDAY.",
      "PAN PAN, PAN PAN, PAN PAN.",
      "SECURITY, SECURITY, SECURITY.",
      "EMERGENCY, EMERGENCY, EMERGENCY.",
    ],
  },
  {
    questionId: "3.19",
    scenarioStem: "You have a passenger feeling very ill — not an emergency but you want priority handling. What do you transmit?",
    scenarioOptions: [
      "MAYDAY, MAYDAY, MAYDAY.",
      "PAN PAN, PAN PAN, PAN PAN.",
      "EMERGENCY, EMERGENCY, EMERGENCY.",
      "URGENCY, URGENCY, URGENCY.",
    ],
  },
  {
    questionId: "6.13",
    scenarioStem: "ATC is vectoring you on a VFR flight. Ahead, a solid wall of cloud. Whose responsibility is it to stay VFR?",
    scenarioOptions: [
      "The radar operator's.",
      "ATC's — your flight is designated VFR.",
      "ATC's — they can see the cloud on radar.",
      "Yours — the pilot is always responsible for VFR.",
    ],
  },
  {
    questionId: "6.14",
    scenarioStem: "You're a student on a radar vector from ATC. Ahead and below, solid overcast. What should you do?",
    scenarioOptions: [
      "Climb above the cloud and fly VFR over the top.",
      "Alter heading to stay VFR and tell ATC.",
      "Hold the heading — it's an ATC clearance.",
      "Hold the heading — ATC knows about the cloud.",
    ],
  },
  {
    questionId: "6.17",
    scenarioStem: "ATC tells you to maintain a heading in Class C, but you see traffic on that heading that could be a conflict. What do you do?",
    scenarioOptions: [
      "Change altitude to avoid.",
      "Hold the heading — CARs require compliance.",
      "Turn to avoid the traffic and advise ATC.",
      "Hold the heading — ATC will provide separation.",
    ],
  },
  {
    questionId: "6.18",
    scenarioStem: "You're VFR below 12,500 feet with no ATC instructions about your transponder. What code do you squawk?",
    scenarioOptions: [
      "1200 below 12,500; 1400 above.",
      "1200 below 12,500; 1300 above.",
      "1200 below 10,000; 1400 above.",
      "1200 below 10,000; 1300 above.",
    ],
  },
  {
    questionId: "6.19",
    scenarioStem: "ATC says \"squawk ident.\" When should you press the IDENT button?",
    scenarioOptions: [
      "Before entering any control zone.",
      "Only when ATC tells you to.",
      "Before every altitude change.",
      "After every code change.",
    ],
  },
  {
    questionId: "6.20",
    scenarioStem: "You hold a student pilot permit. When can you fly as PIC?",
    scenarioOptions: [
      "Only with a flight instructor on board.",
      "Day and night, with instructor authorization.",
      "Day only, with instructor authorization.",
      "Anytime, including with passengers.",
    ],
  },
  {
    questionId: "6.22",
    scenarioStem: "Before heading out on this VFR flight, what are you required to do?",
    scenarioOptions: [
      "Read all weather reports from stations within 100 miles.",
      "File a flight itinerary.",
      "Be familiar with all available information appropriate to the flight.",
      "Obtain an ATC clearance.",
    ],
  },
  {
    questionId: "10.01",
    scenarioStem: "ATC gives you an instruction. What's your obligation?",
    scenarioOptions: [
      "Comply, as long as it doesn't jeopardize safety.",
      "Read it back in full and wait for confirmation.",
      "It's just advice — no acknowledgement needed.",
      "It's the same as a clearance.",
    ],
  },
  {
    questionId: "10.02",
    scenarioStem: "ATC issues you a clearance. What does accepting it mean?",
    scenarioOptions: [
      "It's the same as an instruction.",
      "It's just advice — no compliance required.",
      "You must comply once you accept it.",
      "You must comply as soon as you hear it.",
    ],
  },
  {
    questionId: "12.02",
    scenarioStem: "You're flying VFR. What fundamental requirement must you always maintain?",
    scenarioOptions: [
      "Stay clear of aerodrome traffic zones.",
      "Stay clear of control zones.",
      "Maintain visual reference to the surface.",
      "All of the above.",
    ],
  },
  {
    questionId: "12.07",
    scenarioStem: "Last night you had a couple beers at dinner. How long must you wait before acting as crew?",
    scenarioOptions: [
      "12 hours.",
      "24 hours.",
      "36 hours.",
      "48 hours.",
    ],
  },

  // === ARRIVAL (12) ===
  {
    questionId: "1.10",
    scenarioStem: "You're higher than another aircraft also on approach. Who has the right of way?",
    scenarioOptions: [
      "You do — higher altitude has priority.",
      "You overtake them on the left.",
      "The lower aircraft — you must give way.",
      "You do a 360 to the right.",
    ],
  },
  {
    questionId: "6.04",
    scenarioStem: "Tower clears you \"to the circuit.\" How do you interpret that?",
    scenarioOptions: [
      "Join on the downwind leg at circuit height.",
      "Enter from the upwind side in all cases.",
      "Join on base leg if it's convenient.",
      "Fly a straight-in to final.",
    ],
  },
  {
    questionId: "6.07",
    scenarioStem: "You're told to continue your approach. The runway is clear, but you never received a landing clearance. What do you do?",
    scenarioOptions: [
      "Circle 360 to the left.",
      "Circle 360 in the circuit direction.",
      "Complete the landing anyway.",
      "Request landing clearance.",
    ],
  },
  {
    questionId: "6.08",
    scenarioStem: "The NOTAM says circuit height is 1,500 feet ASL (airport is 400 ASL). Ceiling is 1,000 overcast, vis 3 miles. In controlled airspace, what circuit height should you fly?",
    scenarioOptions: [
      "500 feet below the cloud base.",
      "1,500 feet ASL as published.",
      "1,100 feet above the airport.",
      "1,000 feet above the airport.",
    ],
  },
  {
    questionId: "6.09",
    scenarioStem: "Ceiling is 1,000 overcast, vis 3 miles. To stay VFR in the circuit, where must you join?",
    scenarioOptions: [
      "As high as possible without entering cloud.",
      "500 feet below cloud base.",
      "700 feet AGL.",
      "Under Special VFR rules.",
    ],
  },
  {
    questionId: "7.01",
    scenarioStem: "A 737 just departed ahead of you. Whose responsibility is it to avoid its wake turbulence?",
    scenarioOptions: [
      "ATC's alone.",
      "Yours, but only if ATC warned you.",
      "Shared between you and ATC.",
      "Yours alone — the pilot is always responsible.",
    ],
  },
  {
    questionId: "7.06",
    scenarioStem: "You're on short final, close behind a heavy that just landed. Where do you plan to touch down?",
    scenarioOptions: [
      "Beyond the heavy's touchdown point.",
      "Before the heavy's touchdown point.",
      "At the same point as the heavy.",
      "Left or right of the heavy's touchdown point.",
    ],
  },
  {
    questionId: "7.12",
    scenarioStem: "When is wake turbulence at its worst?",
    scenarioOptions: [
      "Heavy aircraft, landing config, slow speed.",
      "Heavy aircraft, clean config, slow speed.",
      "Light aircraft, clean config, high speed.",
      "Heavy aircraft, takeoff config, slow speed.",
    ],
  },
  {
    questionId: "11.06",
    scenarioStem: "A thunderstorm is approaching the field. Should you attempt to take off or land?",
    scenarioOptions: [
      "Avoid it — a sudden wind shift could cause loss of control.",
      "It's safe if you can see under the storm to the other side.",
      "Avoid it unless you can take off away from the storm.",
      "It's fine if the storm is rated as light.",
    ],
  },
  {
    questionId: "13.05",
    scenarioStem: "You're 12 NM from the Class C zone boundary. You need to transit through it. What must you do before entering?",
    scenarioOptions: [
      "Advise the associated FSS.",
      "Monitor the approach frequency.",
      "Advise ATC of your intentions and obtain a clearance.",
      "Just follow the circuit pattern at that airport.",
    ],
  },
  {
    questionId: "13.09",
    scenarioStem: "You're arriving VFR at a controlled airport. When must you make initial contact with the tower?",
    scenarioOptions: [
      "Upon entering the Aerodrome Traffic Zone.",
      "Prior to entering the Control Zone.",
      "Just before joining the circuit.",
      "Immediately after entering the Control Zone.",
    ],
  },
  {
    questionId: "13.11",
    scenarioStem: "You're arriving VFR at an airport in Class C airspace. When do you call the tower?",
    scenarioOptions: [
      "After entering the Control Zone.",
      "10 NM outside the Control Zone.",
      "Prior to entering the Control Zone.",
      "Just before joining the circuit.",
    ],
  },
  // === RADIO-FRAMED REWRITES (6) ===
  {
    questionId: "3.01",
    scenarioStem: "You're flying C-GFLU and about to make initial contact with Toronto Centre. How do you transmit your callsign?",
    scenarioOptions: [
      "\"Lima Uniform.\"",
      "\"Foxtrot Lima Uniform.\"",
      "\"Cessna Golf Foxtrot Lima Uniform.\"",
      "\"Charlie Golf Foxtrot Lima Uniform.\"",
    ],
  },
  {
    questionId: "3.02",
    scenarioStem: "You're flying C-FBSQ. Centre needs your initial callsign. How do you transmit the registration?",
    scenarioOptions: [
      "\"FBSQ.\"",
      "\"Fox Baker Sugar Queen.\"",
      "\"Foxtrot Bravo Sierra Québec.\"",
      "\"Bravo Sierra Québec.\"",
    ],
  },
  {
    questionId: "3.06",
    scenarioStem: "You've listened to the ATIS — it's information Charlie. You're about to call Tower for the first time. What do you include about the ATIS?",
    scenarioOptions: [
      "\"With the numbers.\"",
      "\"ATIS received.\"",
      "\"With the information.\"",
      "\"Information Charlie.\"",
    ],
  },
  {
    questionId: "3.21",
    scenarioStem: "You've just departed. When can you leave Tower frequency?",
    scenarioOptions: [
      "When you reach 2,000 feet AGL.",
      "25 NM from the airport.",
      "15 NM from the Control Zone.",
      "When you're clear of the Control Zone.",
    ],
  },
  {
    questionId: "3.29",
    scenarioStem: "ATC replies to your signal check: \"Readability three.\" What does that mean?",
    scenarioOptions: [
      "Readable now and then.",
      "Readable with difficulty.",
      "Readable.",
      "Perfectly readable.",
    ],
  },
  {
    questionId: "3.23",
    scenarioStem: "Tower says: \"{callsign}, Runway {runway}, cleared to land.\" How do you acknowledge?",
    scenarioOptions: [
      "\"Roger.\"",
      "\"Wilco.\"",
      "Click the microphone button.",
      "Transmit your aircraft callsign.",
    ],
  },

  // === SECTION 10 — ATC CLEARANCES ===
  {
    questionId: "10.03",
    scenarioStem: "You've accepted an ATC clearance, but partway through you realize you can't fully comply — terrain is higher than expected. What should you do?",
    scenarioOptions: [
      "Disregard the clearance entirely.",
      "Comply with whatever parts seem suitable.",
      "Comply as best you can and say nothing.",
      "Comply as best you can and advise ATC as soon as possible.",
    ],
  },
  {
    questionId: "10.04",
    scenarioStem: "ATC clears you to descend to 3,000 feet, but there's a ridge at 3,200 directly ahead. You can't comply. What do you do?",
    scenarioOptions: [
      "Take immediate action to ensure safety and advise ATC as soon as possible.",
      "Comply with the clearance and say nothing.",
      "Disregard the clearance entirely.",
      "Comply with whatever parts seem suitable.",
    ],
  },
  {
    questionId: "10.05",
    scenarioStem: "ATC gives you a clearance predicated on known traffic: \"Cleared visual approach, traffic is a Twin Otter on a two-mile final.\" You accept and proceed. What's your responsibility?",
    scenarioOptions: [
      "ATC is now relieved of all separation responsibility.",
      "Separation is now shared equally between you and ATC.",
      "You are NOT relieved of the responsibility to avoid that traffic.",
      "You are fully relieved of traffic avoidance — ATC has it.",
    ],
  },
  {
    questionId: "10.06",
    scenarioStem: "ATC clears you via a routing that takes you directly over a forest fire at low altitude. The clearance is unacceptable to you. What do you do?",
    scenarioOptions: [
      "Comply as best you can.",
      "Refuse the clearance without giving a reason.",
      "Read back only the acceptable parts.",
      "Refuse the clearance and inform ATC of your intentions.",
    ],
  },

  // === SECTION 11 — OPERATIONS ===
  {
    questionId: "11.01",
    scenarioStem: "You've declared an emergency — engine failure over remote terrain. When should you activate your ELT?",
    scenarioOptions: [
      "Turn it on immediately and leave it on.",
      "Wait until your ETA passes so searchers know you're overdue.",
      "Transmit only for the first five minutes of each hour.",
      "Transmit only during daylight hours.",
    ],
  },
  {
    questionId: "11.02",
    scenarioStem: "Your maintenance shop just reinstalled your ELT and you want to do a test transmission. When is this permitted?",
    scenarioOptions: [
      "Only after a hard landing.",
      "During the first five minutes of any UTC hour.",
      "Only after a component change, with no time restriction.",
      "Anytime on 121.5 before flight, for up to 30 seconds.",
    ],
  },
  {
    questionId: "11.03",
    scenarioStem: "You've just landed and are about to shut down. How should you verify that your ELT is not inadvertently transmitting?",
    scenarioOptions: [
      "Check that the ELT switch is in the OFF position.",
      "Monitor 121.5 MHz on your radio and listen for the signal.",
      "Turn off the master switch — that will silence it.",
      "Check the ELT visual warning light on the panel.",
    ],
  },
  {
    questionId: "11.04",
    scenarioStem: "After a hard landing, you realize your ELT was accidentally activated. Who should you report the false signal to?",
    scenarioOptions: [
      "The airport manager.",
      "The RCMP.",
      "The Minister of Transport.",
      "The nearest ATS unit.",
    ],
  },
  {
    questionId: "11.05",
    scenarioStem: "You need to leave the engine running while you step out to move a chock. Under what condition is this allowed?",
    scenarioOptions: [
      "As long as the aircraft remains in your sight.",
      "The aircraft must not be left unattended.",
      "Only if the aircraft weighs less than 2,000 kg.",
      "Only if the flight control locks are engaged.",
    ],
  },
  {
    questionId: "11.07",
    scenarioStem: "You're inbound for landing and spot an isolated thunderstorm sitting right over the field. What's the safest course of action?",
    scenarioOptions: [
      "Land immediately with wind-shear considerations.",
      "Hold clear of the area until the storm has passed.",
      "Land as quickly as possible before conditions worsen.",
      "Add a gust factor to your approach speed and land.",
    ],
  },
  {
    questionId: "11.08",
    scenarioStem: "A medium-size jet is about to depart from the runway ahead of you. How far behind must you stay to avoid dangerous jet blast during its takeoff roll?",
    scenarioOptions: [
      "1,200 feet.",
      "900 feet.",
      "500 feet.",
      "450 feet.",
    ],
  },
  {
    questionId: "11.09",
    scenarioStem: "A jumbo jet is holding on the taxiway beside you at ground idle power. What's the minimum safe distance to avoid its jet blast?",
    scenarioOptions: [
      "200 feet.",
      "450 feet.",
      "600 feet.",
      "750 feet.",
    ],
  },
  {
    questionId: "11.10",
    scenarioStem: "A medium jet is holding at ground idle ahead on the taxiway. What's the minimum distance you should maintain behind it?",
    scenarioOptions: [
      "200 feet.",
      "450 feet.",
      "600 feet.",
      "750 feet.",
    ],
  },
  {
    questionId: "11.11",
    scenarioStem: "An executive-size jet is idling at the hold-short line. You're taxiing behind it. What's the minimum safe distance at ground idle?",
    scenarioOptions: [
      "200 feet.",
      "450 feet.",
      "600 feet.",
      "750 feet.",
    ],
  },
  {
    questionId: "11.12",
    scenarioStem: "A turboprop is taxiing ahead of you. Its propwash can reach 45 knots. How far behind should you stay?",
    scenarioOptions: [
      "60 feet.",
      "80 feet.",
      "100 feet.",
      "120 feet.",
    ],
  },
  {
    questionId: "11.13",
    scenarioStem: "The ATIS mentions simultaneous operations are in effect. If you're arriving, what kind of clearance should you expect?",
    scenarioOptions: [
      "Cleared for takeoff over an intersecting active runway.",
      "Cleared for takeoff on a parallel runway.",
      "Cleared to land and hold short of an intersecting runway.",
      "Cleared to land on a parallel runway with no restrictions.",
    ],
  },
  {
    questionId: "11.14",
    scenarioStem: "Tower clears you to \"land and hold short of Runway 15.\" You're not confident you can stop in time. What do you do?",
    scenarioOptions: [
      "Comply regardless — it's a clearance.",
      "Land, then taxi across the intersecting runway once it's clear.",
      "Land, then do a 180 and backtrack.",
      "Immediately inform ATC that you are unable to comply.",
    ],
  },

  // === SECTION 12 — RULES OF THE AIR ===
  {
    questionId: "12.01",
    scenarioStem: "You're planning a VFR flight that will enter the ADIZ. Do the ADIZ rules apply to your aircraft?",
    scenarioOptions: [
      "Only if you're above 12,500 feet ASL.",
      "Only if you're flying faster than 180 knots.",
      "Only if you're flying southbound.",
      "Yes — ADIZ rules apply to all aircraft.",
    ],
  },
  {
    questionId: "12.03",
    scenarioStem: "You're flying a helicopter VFR in uncontrolled airspace below 1,000 feet AGL during the day. What's the minimum flight visibility you need?",
    scenarioOptions: [
      "1/2 statute mile.",
      "1 statute mile.",
      "2 statute miles.",
      "3 statute miles.",
    ],
  },
  {
    questionId: "12.04",
    scenarioStem: "You're VFR in uncontrolled airspace below 1,000 feet AGL. What cloud clearance must you maintain?",
    scenarioOptions: [
      "2,000 feet horizontal and 500 feet vertical.",
      "1 mile horizontal and 500 feet vertical.",
      "2 miles horizontal and 500 feet vertical.",
      "Clear of cloud.",
    ],
  },
  {
    questionId: "12.05",
    scenarioStem: "Your passenger asks if you're allowed to drop a banner over their friend's farm. What does the regulation say about dropping objects from aircraft?",
    scenarioOptions: [
      "Nothing may be dropped if it creates a hazard to persons or property.",
      "Nothing may be dropped unless authorized by the Minister.",
      "Objects may only be dropped over designated jettison areas.",
      "Objects may only be dropped with a parachute attached.",
    ],
  },
  {
    questionId: "12.06",
    scenarioStem: "You want to practise aerobatic manoeuvres. Where are you allowed to do so?",
    scenarioOptions: [
      "Over an airport while monitoring the appropriate frequency.",
      "Over suburban areas above 2,000 feet AGL.",
      "In Class F advisory airspace with visibility of 3 miles or more.",
      "In Class C airspace with visibility of 1 mile or more.",
    ],
  },
  {
    questionId: "12.08",
    scenarioStem: "You check the CFS for sunrise/sunset times. How is \"day\" officially defined in Canada?",
    scenarioOptions: [
      "From sunrise to sunset.",
      "From one hour before sunrise to one hour after sunset.",
      "From the beginning of morning civil twilight to the end of evening civil twilight.",
      "From the end of morning civil twilight to the beginning of evening civil twilight.",
    ],
  },
  {
    questionId: "12.09",
    scenarioStem: "You want to know whether your upcoming flight will be classified as a night flight. How is \"night\" defined in Canada?",
    scenarioOptions: [
      "From sunset to sunrise.",
      "From evening civil twilight to morning civil twilight.",
      "From one hour after sunset to one hour before sunrise.",
      "From the end of evening civil twilight to the beginning of morning civil twilight.",
    ],
  },
  {
    questionId: "12.10",
    scenarioStem: "A friend with a Citabria suggests you fly in formation together. Under what condition is formation flying permitted?",
    scenarioOptions: [
      "When pre-arranged between the pilots-in-command of each aircraft.",
      "Only above 3,000 feet AGL.",
      "Only by commercially licensed pilots.",
      "Only when specifically endorsed for formation flying.",
    ],
  },
  {
    questionId: "12.11",
    scenarioStem: "Your planned route passes through a CYR (Restricted) area that's currently active. What do you need to fly through it?",
    scenarioOptions: [
      "A functioning radio and transponder.",
      "Military pilot status.",
      "An IFR flight plan with positive radar identification.",
      "Permission from the user agency that controls the area.",
    ],
  },
  {
    questionId: "12.12",
    scenarioStem: "Your route clips a CYA (Advisory) area shown active on the NOTAM. Which statement about advisory airspace is correct?",
    scenarioOptions: [
      "A transponder is required to enter.",
      "VFR pilots are encouraged to avoid it while it is active.",
      "A radio is required to enter.",
      "Only military aircraft may enter.",
    ],
  },
  {
    questionId: "12.13",
    scenarioStem: "You're flying a helicopter over a built-up area. What's the minimum altitude you must maintain, and what radius does it reference?",
    scenarioOptions: [
      "3,000 feet above the highest obstacle within a 1-mile radius.",
      "2,000 feet above the highest obstacle within a 1,000-foot radius.",
      "1,000 feet above the highest obstacle within a 500-foot radius.",
      "500 feet above the highest obstacle within a 500-foot radius.",
    ],
  },
  {
    questionId: "12.14",
    scenarioStem: "You're flying over a lake in a non-populous area. A fishing boat is below you. What's the minimum distance you must maintain from that vessel?",
    scenarioOptions: [
      "200 feet.",
      "500 feet.",
      "1,000 feet.",
      "2,000 feet.",
    ],
  },
  {
    questionId: "12.15",
    scenarioStem: "You want to land at a grass strip inside a built-up area. Under what condition are you permitted to take off or land in a built-up area?",
    scenarioOptions: [
      "Only in a multi-engine aircraft.",
      "Only if you can clear all obstacles by 500 feet.",
      "Only at an airport or military aerodrome.",
      "Only if a noise-abatement procedure is in effect.",
    ],
  },
  {
    questionId: "12.16",
    scenarioStem: "You're planning your cruising altitude for a VFR cross-country. Above what height AGL do the VFR cruising altitude rules apply?",
    scenarioOptions: [
      "700 feet AGL.",
      "2,200 feet AGL.",
      "3,000 feet AGL.",
      "3,500 feet AGL.",
    ],
  },
  {
    questionId: "12.17",
    scenarioStem: "You're flying VFR above 3,000 feet AGL on a magnetic track of 290°. What altitude should you fly?",
    scenarioOptions: [
      "An even thousand feet ASL.",
      "An even thousand feet ASL plus 500.",
      "An odd thousand feet ASL.",
      "An odd thousand feet ASL plus 500.",
    ],
  },
  {
    questionId: "12.18",
    scenarioStem: "You're choosing your VFR cruising altitude in the southern domestic airspace. What is the altitude based on?",
    scenarioOptions: [
      "True track.",
      "Magnetic track.",
      "True heading.",
      "Magnetic heading.",
    ],
  },
  {
    questionId: "12.19",
    scenarioStem: "A peace officer asks to see your pilot licence at a fuel stop. You must produce it. Who else, besides the Minister and peace officers, can demand to see it?",
    scenarioOptions: [
      "FSS operators.",
      "Transport Canada airport managers.",
      "Immigration officers.",
      "All of the above.",
    ],
  },
  {
    questionId: "12.20",
    scenarioStem: "Your instructor mentions \"Low Level Airspace.\" How is it defined?",
    scenarioOptions: [
      "From 2,200 feet AGL upward within airways.",
      "From 1,000 feet AGL upward.",
      "From the surface upward within airways.",
      "All airspace below 18,000 feet ASL.",
    ],
  },
  {
    questionId: "12.21",
    scenarioStem: "You're approaching a controlled airport. The Control Zone extends upward from what altitude?",
    scenarioOptions: [
      "2,200 feet ASL.",
      "700 feet AGL.",
      "The surface, up to 3,000 feet AAE (or as specified).",
      "A specified height above the aerodrome.",
    ],
  },

  // === SECTION 13 — CONTROLLED / SPECIAL VFR ===
  {
    questionId: "13.01",
    scenarioStem: "A student asks you: \"What does Controlled Airspace actually mean?\" What's the best answer?",
    scenarioOptions: [
      "It means Control Zone regulations apply.",
      "It exists for security purposes.",
      "Only Special VFR flights are permitted.",
      "It means an ATC service is provided within that airspace.",
    ],
  },
  {
    questionId: "13.02",
    scenarioStem: "You're flying VFR inside controlled airspace. What minimum cloud clearance must you maintain?",
    scenarioOptions: [
      "500 feet vertically, 1 mile horizontally.",
      "500 feet vertically, 2,000 feet horizontally.",
      "1,000 feet vertically, 1 mile horizontally.",
      "1,000 feet vertically, 3 miles horizontally.",
    ],
  },
  {
    questionId: "13.03",
    scenarioStem: "You're flying VFR along a low-level airway. What's the minimum flight visibility required?",
    scenarioOptions: [
      "1 statute mile.",
      "1.5 statute miles.",
      "2 statute miles.",
      "3 statute miles.",
    ],
  },
  {
    questionId: "13.04",
    scenarioStem: "You're flying VFR inside a Control Zone. What cloud clearance must you maintain?",
    scenarioOptions: [
      "500 feet vertically, 2,000 feet horizontally.",
      "500 feet vertically, 1 mile horizontally.",
      "1,000 feet vertically, 1 mile horizontally.",
      "1,000 feet vertically, 3 miles horizontally.",
    ],
  },
  {
    questionId: "13.06",
    scenarioStem: "Visibility has dropped and you've requested a Special VFR clearance during the day. What's the minimum visibility you need to fly SVFR?",
    scenarioOptions: [
      "1/2 statute mile.",
      "1 statute mile.",
      "2 statute miles.",
      "3 statute miles.",
    ],
  },
  {
    questionId: "13.07",
    scenarioStem: "You're flying a helicopter under Special VFR during the day. What's the minimum visibility required?",
    scenarioOptions: [
      "1 statute mile plus 500 feet AGL.",
      "1/2 statute mile.",
      "1 statute mile.",
      "1/2 statute mile plus 500 feet AGL.",
    ],
  },
  {
    questionId: "13.08",
    scenarioStem: "ATC has just issued you a Special VFR clearance. What type of airspace would you be flying within?",
    scenarioOptions: [
      "A Control Zone.",
      "An Aerodrome Traffic Zone.",
      "A Terminal Control Area.",
      "A low-level airway.",
    ],
  },
  {
    questionId: "13.10",
    scenarioStem: "You want to fly VFR through Class B airspace. What do you need?",
    scenarioOptions: [
      "Flight visibility of 5 miles or more.",
      "All aircraft except gliders are prohibited.",
      "A Class B endorsement on your licence.",
      "An ATC clearance.",
    ],
  },
  {
    questionId: "13.12",
    scenarioStem: "You're planning a VFR transit through Class C airspace (a TCA). What's the requirement?",
    scenarioOptions: [
      "Exit the airspace immediately if conditions drop below VFR.",
      "A radio is only required inside the Control Zone itself.",
      "Establish and maintain two-way radio communication with ATC.",
      "Radar identification is required only when landing.",
    ],
  },

  // === SECTION 14 — ACCIDENT REPORTING ===
  {
    questionId: "14.01",
    scenarioStem: "After a runway excursion at your airport, investigators arrive. What is the primary objective of their safety investigation?",
    scenarioOptions: [
      "To assign blame to responsible parties.",
      "To resolve insurance liability.",
      "To enforce regulatory compliance.",
      "To prevent recurrences of similar occurrences.",
    ],
  },
  {
    questionId: "14.02",
    scenarioStem: "You need to review the procedures for reporting an aviation accident. Where would you find this information?",
    scenarioOptions: [
      "The Transport Canada Aeronautical Information Manual (TC AIM).",
      "The Canadian Aviation Regulations (CARs).",
      "The Canada Flight Supplement (CFS).",
      "The Aviation Safety Manual.",
    ],
  },
  {
    questionId: "14.03",
    scenarioStem: "You've been involved in an accident. How must the report be made to the TSB?",
    scenarioOptions: [
      "Within 7 days by registered mail.",
      "Within 24 hours by telephone.",
      "Within 48 hours by fax.",
      "As soon as possible by the quickest means available.",
    ],
  },
  {
    questionId: "14.04",
    scenarioStem: "Under what circumstances must the Transportation Safety Board be notified of an aviation occurrence?",
    scenarioOptions: [
      "Only when there is a serious or fatal injury.",
      "Only when there is damage affecting the aircraft's performance.",
      "Only when the aircraft is missing or inaccessible.",
      "Any of the above.",
    ],
  },
  {
    questionId: "14.05",
    scenarioStem: "An aircraft has gone missing and hasn't been found. How does the TSB classify a missing aircraft?",
    scenarioOptions: [
      "A reportable incident.",
      "No report is required until wreckage is found.",
      "An incident — no report required.",
      "A reportable accident.",
    ],
  },

  // === SECTION 1 – COLLISION AVOIDANCE (remaining) ===
  {
    questionId: "1.01",
    scenarioStem: "You're towing a banner behind your Cessna when a twin-engine aircraft converges from your right at the same altitude. Which right-of-way rule applies?",
    scenarioOptions: [
      "A jet aircraft has the right of way over all other aircraft.",
      "Your aircraft, towing an object, has the right of way over all power-driven heavier-than-air aircraft.",
      "An aeroplane approaching from the left has the right of way over all others.",
      "Aeroplanes towing gliders must give way to helicopters.",
    ],
  },
  {
    questionId: "1.03",
    scenarioStem: "You're flying a Cessna 172 and a glider converges from your left at the same altitude. Which right-of-way rule applies between aircraft types?",
    scenarioOptions: [
      "Gliders must give way to helicopters.",
      "Aeroplanes must give way to other power-driven aircraft.",
      "Gliders must give way to aeroplanes.",
      "Power-driven aircraft must give way to gliders.",
    ],
  },
  {
    questionId: "1.04",
    scenarioStem: "You're flying a helicopter and a glider appears converging from your right at the same altitude. Which rule governs this encounter?",
    scenarioOptions: [
      "Gliders give way to helicopters.",
      "Aeroplanes give way to helicopters.",
      "Helicopters give way to aeroplanes.",
      "Helicopters give way to gliders.",
    ],
  },
  {
    questionId: "1.05",
    scenarioStem: "During your ground school review, you discuss which aircraft types must yield to others when converging at the same altitude. Which statement is correct?",
    scenarioOptions: [
      "Gliders must give way to helicopters.",
      "Aeroplanes must give way to helicopters.",
      "Helicopters must give way to aeroplanes.",
      "Gliders must give way to balloons.",
    ],
  },
  {
    questionId: "1.06",
    scenarioStem: "You're towing a glider behind your aeroplane and a hot air balloon converges at your altitude. Who has the right of way?",
    scenarioOptions: [
      "You do — balloons give way to hang gliders.",
      "The balloon does — aeroplanes towing gliders give way to balloons.",
      "You do — balloons give way to gliders.",
      "You do — balloons give way to airships.",
    ],
  },

  // === SECTION 2 – SIGNALS & MARKINGS (remaining) ===
  {
    questionId: "2.03",
    scenarioStem: "Your radio has failed. The tower flashes a red light at you repeatedly. What does that signal mean?",
    scenarioOptions: [
      "In flight: airport unsafe, do not land. On ground: taxi clear of the landing area.",
      "In flight: give way and continue circling. On ground: stop.",
      "In flight: do not land, aerodrome not available. On ground: return to starting point.",
      "In flight: prohibited area. On ground: stop.",
    ],
  },
  {
    questionId: "2.05",
    scenarioStem: "You're taxiing on the manoeuvring area with a dead radio. The tower sends a flashing white light toward you. What does it mean?",
    scenarioOptions: [
      "Stop immediately.",
      "Return to your starting point on the airport.",
      "You are cleared to taxi.",
      "Taxi clear of the landing area in use.",
    ],
  },
  {
    questionId: "2.06",
    scenarioStem: "You notice the runway edge lights begin blinking rapidly. What does this emergency signal mean?",
    scenarioOptions: [
      "Return to the apron immediately.",
      "Vacate the runway and taxiway immediately — the surface is needed.",
      "An emergency is in progress — continue with caution.",
      "An emergency is in progress — hold your position.",
    ],
  },
  {
    questionId: "2.07",
    scenarioStem: "While flying low-level, you spot a marker on the ground — chrome yellow strips with black horizontal bands. What hazard does it indicate?",
    scenarioOptions: [
      "An explosives area.",
      "A fur farm — do not overfly at low altitude.",
      "An artillery range.",
      "An open pit mine.",
    ],
  },
  {
    questionId: "2.08",
    scenarioStem: "You're planning a northern flight over an area known for caribou herds. What minimum altitude should you maintain to avoid disturbing them?",
    scenarioOptions: [
      "2,500 feet AGL.",
      "2,000 feet AGL.",
      "1,500 feet AGL.",
      "1,000 feet AGL.",
    ],
  },

  // === SECTION 3 – RADIO & COMMUNICATIONS (remaining) ===
  {
    questionId: "3.03",
    scenarioStem: "You've already established contact with ATC on their frequency. On subsequent transmissions, which part of your callsign may be shortened?",
    scenarioOptions: [
      "Any letters that the ATS unit omits from your callsign.",
      "The first two letters of your registration, provided the ATS unit initiates the abbreviation.",
      "The first three letters of your registration at any time.",
      "You may drop the phonetic alphabet entirely and use letters only.",
    ],
  },
  {
    questionId: "3.04",
    scenarioStem: "You're about to make your initial radio call to a new ATC facility. How do you transmit your callsign?",
    scenarioOptions: [
      "Aircraft type and last four letters of the registration in phonetics.",
      "Last three letters of the registration in phonetics.",
      "The entire registration including the C- prefix.",
      "Aircraft type and last three letters of the registration.",
    ],
  },
  {
    questionId: "3.05",
    scenarioStem: "You tune to the ATIS frequency before calling Tower. Why is ATIS normally provided at busy airports?",
    scenarioOptions: [
      "To replace the need for a Flight Service Station.",
      "To relieve frequency congestion on ATC frequencies.",
      "To provide pilots with rapid weather updates only.",
      "To serve VFR traffic exclusively.",
    ],
  },
  {
    questionId: "3.08",
    scenarioStem: "You're cruising en route and your instructor reminds you to keep a listening watch for distress signals. How should you monitor for them?",
    scenarioOptions: [
      "Using your ELT receiver.",
      "By monitoring 121.5 MHz on your aircraft radio receiver.",
      "By switching to 121.5 MHz for the first five minutes of each hour.",
      "By listening on the nearest nav aid voice frequency.",
    ],
  },
  {
    questionId: "3.09",
    scenarioStem: "You're planning a flight into an aerodrome with a mandatory frequency. Where do you find the MF procedures for that aerodrome?",
    scenarioOptions: [
      "The Canada Flight Supplement (CFS) or Canada Water Aerodrome Supplement (CWAS).",
      "The Designated Airspace Handbook (DAH).",
      "The Transport Canada Aeronautical Information Manual (TC AIM).",
      "The Flight Training Manual (FTM).",
    ],
  },
  {
    questionId: "3.10",
    scenarioStem: "You're inbound to a mandatory frequency aerodrome that has no ground station. To whom do you direct your radio transmissions?",
    scenarioOptions: [
      "The UNICOM operator.",
      "The closest ATC unit.",
      "All aerodrome traffic on the mandatory frequency.",
      "The first aircraft you hear on frequency.",
    ],
  },
  {
    questionId: "3.11",
    scenarioStem: "You're landing VMC at an uncontrolled aerodrome that has no UNICOM station. What frequency do you broadcast your intentions on?",
    scenarioOptions: [
      "121.5 MHz.",
      "123.2 MHz.",
      "123.45 MHz.",
      "126.7 MHz.",
    ],
  },
  {
    questionId: "3.12",
    scenarioStem: "You've just departed VFR from a mandatory frequency aerodrome. How long must you continue to monitor the MF?",
    scenarioOptions: [
      "Until you are beyond the specified distance or altitude from the aerodrome.",
      "Until you are established on your en route heading.",
      "Until you reach your cruise altitude.",
      "Until you are clear of the circuit pattern.",
    ],
  },
  {
    questionId: "3.16",
    scenarioStem: "You're heading 270. ATC reports traffic at your 2 o'clock, 5 miles, eastbound. Where is that traffic relative to you?",
    scenarioOptions: [
      "60 degrees to your left, altitude unknown.",
      "60 degrees to your right, altitude unknown.",
      "90 degrees to your right, at the same altitude.",
      "90 degrees to your left, at the same altitude.",
    ],
  },
  {
    questionId: "3.17",
    scenarioStem: "Tower clears you to land with instructions to turn right at the first intersection. On rollout you realize you're too fast to make that turn safely. What should you do?",
    scenarioOptions: [
      "Attempt the turn — you accepted the clearance.",
      "Perform a touch-and-go and rejoin the circuit.",
      "Continue past and turn off at the nearest safe intersection, then advise Tower.",
      "Do a 180 on the runway and taxi back to the intersection.",
    ],
  },
  {
    questionId: "3.20",
    scenarioStem: "Your engine problem has been resolved and you no longer need emergency assistance. How do you cancel the distress condition?",
    scenarioOptions: [
      "Transmit MAYDAY three times, then ALL STATIONS, then state distress has ended.",
      "Transmit MAYDAY once, HELLO ALL STATIONS three times, your callsign, the time, and SEELONCE FEENEE.",
      "Transmit MAYDAY CANCELLED three times.",
      "Transmit ALL STATIONS three times, then state the emergency is over.",
    ],
  },
  {
    questionId: "3.22",
    scenarioStem: "You're on the downwind leg in a busy circuit and hear another aircraft also in the pattern. What will ATC tell you regarding the traffic?",
    scenarioOptions: [
      "Your sequence number in the landing order.",
      "The runway in use, wind, and altimeter setting.",
      "The positions of all aircraft in the circuit.",
      "An immediate clearance to land.",
    ],
  },
  {
    questionId: "3.24",
    scenarioStem: "You're about to make your first call to Timmins Flight Service Station. How do you begin the transmission?",
    scenarioOptions: [
      "\"Timmins Radio, this is...\"",
      "\"Timmins FSS, this is...\"",
      "\"Timmins UNICOM, this is...\"",
      "\"This is (your callsign), Timmins...\"",
    ],
  },
  {
    questionId: "3.25",
    scenarioStem: "You call a Flight Information Centre for help planning your trip. What service does the FIC specialist primarily provide?",
    scenarioOptions: [
      "Air traffic control services.",
      "Flight planning and information services.",
      "Air traffic services in uncontrolled airspace only.",
      "Terminal radar approach services.",
    ],
  },
  {
    questionId: "3.26",
    scenarioStem: "You need to check for NOTAMs before your flight. Where can you obtain them?",
    scenarioOptions: [
      "At any Flight Information Centre.",
      "They are emailed automatically to all licensed pilots.",
      "They cover facility closures only and are posted on-site.",
      "They are valid for only 24 hours and then expire.",
    ],
  },
  {
    questionId: "3.27",
    scenarioStem: "You read a NOTAM that does NOT contain the word EST. Until when is it valid?",
    scenarioOptions: [
      "48 hours from the time of issue.",
      "Only for the day it was issued.",
      "Until the end time stated in the NOTAM.",
      "Until a cancelling NOTAM is issued.",
    ],
  },
  {
    questionId: "3.28",
    scenarioStem: "A NOTAM you're reading includes the abbreviation EST. How long is it considered valid?",
    scenarioOptions: [
      "For an estimated 24 hours.",
      "For an estimated 48 hours.",
      "Until the exact time quoted and no longer.",
      "Until it is cancelled by a NOTAMC or replaced by a NOTAMR.",
    ],
  },

  // === SECTION 4 – AERODROMES (remaining) ===
  {
    questionId: "4.01",
    scenarioStem: "Your instructor asks you the difference between an airport and an aerodrome. What defines an airport?",
    scenarioOptions: [
      "Any aerodrome with paved runways.",
      "Any aerodrome with a control tower.",
      "An uncertified landing area.",
      "An aerodrome that has been certified by the Minister.",
    ],
  },
  {
    questionId: "4.02",
    scenarioStem: "You look at the windsock and it's stretched fully horizontal in dry conditions. What minimum wind speed does that indicate?",
    scenarioOptions: [
      "At least 25 knots.",
      "At least 15 knots.",
      "At least 10 knots.",
      "At least 6 knots.",
    ],
  },
  {
    questionId: "4.03",
    scenarioStem: "A friend wants to drive a vehicle onto the movement area at an uncontrolled airport. Whose permission is needed?",
    scenarioOptions: [
      "The airport operator's.",
      "Airport security.",
      "A peace officer.",
      "A certified flight instructor.",
    ],
  },
  {
    questionId: "4.04",
    scenarioStem: "As you taxi out, you notice markings indicating a closed runway and a closed taxiway. What do those markings look like?",
    scenarioOptions: [
      "Red flags on each side of the surface.",
      "Red squares with yellow diagonal stripes.",
      "A white X on the runway and a yellow X on the taxiway.",
      "Dumbbell shapes at each threshold.",
    ],
  },

  // === SECTION 5 – EQUIPMENT & DOCUMENTS (remaining) ===
  {
    questionId: "5.02",
    scenarioStem: "You're planning a VFR flight that will take you 25 nautical miles or more from the departure aerodrome. What additional equipment may be required on board?",
    scenarioOptions: [
      "Emergency survival supplies appropriate to the area overflown.",
      "A functioning two-way radio.",
      "A multi-engine aircraft.",
      "All of the above.",
    ],
  },
  {
    questionId: "5.03",
    scenarioStem: "You're preparing for a night flight with a passenger. Which lighting equipment is required on the aircraft?",
    scenarioOptions: [
      "A landing light, whenever passengers are carried at night.",
      "A landing light on all passenger aircraft except private operations under 5,700 kg.",
      "A landing light only when operating into an unlighted aerodrome.",
      "A landing light for all take-offs and landings at night.",
    ],
  },
  {
    questionId: "5.04",
    scenarioStem: "You're planning a cross-country at high altitude in an unpressurized aircraft. Above what altitude must you provide oxygen for passengers and crew?",
    scenarioOptions: [
      "9,500 feet ASL.",
      "10,000 feet ASL.",
      "12,500 feet ASL.",
      "13,000 feet ASL.",
    ],
  },
  {
    questionId: "5.05",
    scenarioStem: "You're flying between 10,000 and 13,000 feet ASL without supplemental oxygen for the flight crew. What is the maximum time you may spend at those altitudes?",
    scenarioOptions: [
      "15 minutes.",
      "30 minutes.",
      "1 hour.",
      "2 hours.",
    ],
  },
  {
    questionId: "5.06",
    scenarioStem: "You're flying a single-engine aircraft over open water beyond gliding distance from shore. What safety equipment must you carry for each person on board?",
    scenarioOptions: [
      "A life raft.",
      "A life preserver or personal flotation device.",
      "A pyrotechnic flare.",
      "A signal mirror.",
    ],
  },
  {
    questionId: "5.07",
    scenarioStem: "Your instructor quizzes you: what is the international VHF emergency frequency?",
    scenarioOptions: [
      "121.5 MHz.",
      "121.9 MHz.",
      "122.2 MHz.",
      "126.7 MHz.",
    ],
  },
  {
    questionId: "5.08",
    scenarioStem: "You want to take off or land at an aerodrome at night. What condition must be met?",
    scenarioOptions: [
      "The aircraft must have a functioning two-way radio.",
      "The aircraft must have a serviceable landing light.",
      "The aerodrome must be lighted as prescribed in the regulations.",
      "You must have completed three night landings within the previous 90 days.",
    ],
  },
  {
    questionId: "5.09",
    scenarioStem: "A couple boards with a baby on your flight. Under the regulations, how is an infant passenger defined?",
    scenarioOptions: [
      "A person weighing less than 30 pounds.",
      "A person less than 3 years of age.",
      "A person weighing less than 50 pounds and less than 5 years of age.",
      "A person less than 2 years of age.",
    ],
  },
  {
    questionId: "5.10",
    scenarioStem: "An infant passenger is on board without a child restraint system. As PIC, how do you direct the infant to be secured during taxi, take-off, and landing?",
    scenarioOptions: [
      "In a seatbelt in their own seat.",
      "Held by an adult whose own seatbelt is fastened.",
      "Held by an adult with a seatbelt around both of them.",
      "Any of the above is acceptable.",
    ],
  },

  // === SECTION 6 – ATC / AIRSPACE (remaining) ===
  {
    questionId: "6.01",
    scenarioStem: "A large aircraft just completed a low approach and is overshooting ahead of you. Tower clears you for take-off. The wake turbulence risk is significant. What should you do?",
    scenarioOptions: [
      "Take off immediately before the vortices reach the runway.",
      "Taxi into position and hold, waiting for a new clearance.",
      "Decline the clearance and inform ATC you'd prefer to wait.",
      "Wait exactly 2 minutes, then take off without further clearance.",
    ],
  },
  {
    questionId: "6.02",
    scenarioStem: "The controller offers you an intersection departure to expedite traffic. Regarding the remaining runway length, which statement is correct?",
    scenarioOptions: [
      "The controller is not required to state the remaining runway length.",
      "It is the pilot's responsibility to determine that the remaining length is adequate.",
      "The controller ensures the remaining length is sufficient for your aircraft type.",
      "Noise abatement procedures are automatically cancelled for intersection departures.",
    ],
  },
  {
    questionId: "6.03",
    scenarioStem: "You request an intersection take-off to save taxi time and ATC authorizes it. Whose responsibility is it to ensure there is enough runway remaining?",
    scenarioOptions: [
      "The controller will state the remaining runway distance.",
      "The controller is responsible for ensuring the length is adequate.",
      "It is your responsibility as pilot to ensure the remaining length is adequate.",
      "Noise abatement procedures are automatically cancelled.",
    ],
  },
  {
    questionId: "6.05",
    scenarioStem: "Your radio is inoperative and you need landing information. You decide to cross over the airport to observe the signals. What altitude should you maintain?",
    scenarioOptions: [
      "Circuit height.",
      "1,000 feet above circuit height.",
      "2,000 feet AGL.",
      "500 feet above circuit height.",
    ],
  },
  {
    questionId: "6.06",
    scenarioStem: "You're cleared to the circuit, which is left-hand. You'd like to make a right turn to expedite joining. When is a right turn permitted?",
    scenarioOptions: [
      "Only on final approach.",
      "Only on the base leg.",
      "On the crosswind leg, or a partial right turn to join the downwind.",
      "When descending on the downwind leg.",
    ],
  },
  {
    questionId: "6.10",
    scenarioStem: "Standard circuit altitude is 1,000 feet above aerodrome elevation, but it's not always possible to fly that altitude. Why not?",
    scenarioOptions: [
      "ATC may require a straight-in approach.",
      "A NOTAM may specify a different circuit altitude.",
      "Weather conditions may force a lower altitude.",
      "Any of the above reasons.",
    ],
  },
  {
    questionId: "6.11",
    scenarioStem: "On final approach, ATC asks you to reduce speed for spacing behind the aircraft ahead. How do you comply?",
    scenarioOptions: [
      "Reduce speed, giving proper consideration to your aircraft's safe minimum speed.",
      "Perform a 360-degree turn to create spacing.",
      "Overshoot and rejoin the circuit.",
      "Reduce speed well below your normal approach speed.",
    ],
  },
  {
    questionId: "6.12",
    scenarioStem: "You're cleared to land, but the crosswind on final is very strong and you're uncomfortable with the approach. What should you do?",
    scenarioOptions: [
      "Use full flaps and reduce speed to compensate.",
      "Land on a different runway without telling ATC.",
      "Overshoot and request the runway most aligned with the wind.",
      "Land as cleared — you must comply with the clearance.",
    ],
  },
  {
    questionId: "6.15",
    scenarioStem: "You've been cleared for a Special VFR straight-in approach. You notice a radio mast near the approach path. Whose responsibility is it to avoid obstacles under SVFR?",
    scenarioOptions: [
      "Yours — the pilot is responsible for obstacle avoidance.",
      "The tower controller's.",
      "ATC's, since they issued the SVFR clearance.",
      "It is a shared responsibility between pilot and ATC.",
    ],
  },
  {
    questionId: "6.16",
    scenarioStem: "You're cleared to the circuit under Special VFR. Ahead you see a layer of stratus cloud encroaching on the circuit. Whose responsibility is it to remain clear of cloud?",
    scenarioOptions: [
      "The tower controller's.",
      "ATC's, since they cleared you SVFR.",
      "Shared between you and ATC.",
      "Yours — the pilot is always responsible for remaining clear of cloud under SVFR.",
    ],
  },
  {
    questionId: "6.21",
    scenarioStem: "You see ATC light signals and ground markings giving you directions. As PIC, when must you comply with them?",
    scenarioOptions: [
      "Only inside Class C airspace.",
      "Only inside a control zone.",
      "At all times, without exception.",
      "At all times, provided safety is not jeopardized.",
    ],
  },
  {
    questionId: "6.23",
    scenarioStem: "You need to look up the dimensions of the terminal airspace and the VHF sector frequencies before entering a busy terminal area. Where do you find this information?",
    scenarioOptions: [
      "The Designated Airspace Handbook and the TC AIM.",
      "The VFR Terminal Area chart (VTA) and the Canada Flight Supplement (CFS).",
      "The VTA and the VFR Navigation Chart (VNC).",
      "The CFS and the VNC.",
    ],
  },

  // === SECTION 7 – WAKE TURBULENCE (remaining) ===
  {
    questionId: "7.02",
    scenarioStem: "A large aircraft just passed through your altitude in still air. How long might its wake vortices persist?",
    scenarioOptions: [
      "They dissipate almost immediately.",
      "They dissipate rapidly within about 30 seconds.",
      "They may persist for 5 minutes or more.",
      "They persist indefinitely until wind disperses them.",
    ],
  },
  {
    questionId: "7.03",
    scenarioStem: "Your instructor asks what you know about the behaviour of wake turbulence vortices. Which statement is most correct?",
    scenarioOptions: [
      "Vortices are carried downwind away from the generating aircraft.",
      "They create a circular downward flow behind the wings.",
      "They are generated behind all aircraft in flight.",
      "All of the above.",
    ],
  },
  {
    questionId: "7.04",
    scenarioStem: "You're a light aircraft following a heavy transport on approach. What hazard can its wake vortices pose to you?",
    scenarioOptions: [
      "Loss of control of your aircraft.",
      "An uncontrollable descent even at maximum power.",
      "Structural damage to your airframe.",
      "Any of the above.",
    ],
  },
  {
    questionId: "7.05",
    scenarioStem: "A heavy aircraft passed through your cruising altitude 2 minutes ago in calm air. What is the state of its vortices?",
    scenarioOptions: [
      "They have dissipated completely.",
      "They are dissipating rapidly.",
      "They are dissipating very slowly and may still be dangerous.",
      "They remain at the exact altitude indefinitely.",
    ],
  },
  {
    questionId: "7.08",
    scenarioStem: "You're discussing wake turbulence hazards during a briefing. Which types of aircraft produce wake vortices?",
    scenarioOptions: [
      "Only heavy transport-category aircraft.",
      "Only turbojet aircraft.",
      "Only fast-moving aircraft.",
      "All fixed-wing and rotary-wing aircraft in flight.",
    ],
  },
  {
    questionId: "7.09",
    scenarioStem: "You're holding short watching a large aircraft begin its departure roll. At what point do its wake vortices begin?",
    scenarioOptions: [
      "Before the aircraft starts to rotate.",
      "At the point of rotation.",
      "After the aircraft is fully airborne.",
      "When full power is applied.",
    ],
  },
  {
    questionId: "7.10",
    scenarioStem: "You're departing behind a large aircraft. When is its wake turbulence most severe near the surface?",
    scenarioOptions: [
      "Just before rotation.",
      "Immediately following take-off.",
      "Above and behind the flight path.",
      "Immediately following the application of full power.",
    ],
  },
  {
    questionId: "7.11",
    scenarioStem: "During a ground-school session on wake turbulence, which of the following statements is FALSE?",
    scenarioOptions: [
      "Vortices settle below and behind the generating aircraft.",
      "In a crosswind, one vortex may remain stationary over the runway.",
      "With no wind, vortices can drift laterally across a parallel runway.",
      "Wake turbulence is caused by jet engine wash.",
    ],
  },
  {
    questionId: "7.13",
    scenarioStem: "A helicopter in forward flight passes ahead of you. How do its vortices compare to those of a fixed-wing aircraft?",
    scenarioOptions: [
      "They rise above and behind the helicopter.",
      "They are similar to wingtip vortices from a fixed-wing aircraft.",
      "They remain at the same level as the helicopter.",
      "They travel ahead of the helicopter.",
    ],
  },
  {
    questionId: "7.14",
    scenarioStem: "You're discussing helicopter vortex hazards. Which statement about helicopter-generated vortices is correct?",
    scenarioOptions: [
      "They are weak and dissipate quickly.",
      "The size and weight of the helicopter influence vortex intensity.",
      "They are less intense than vortices from an aeroplane of the same weight.",
      "Wind has no influence on vortices from a hovering helicopter.",
    ],
  },
  {
    questionId: "7.15",
    scenarioStem: "A large aircraft has just departed and there is a light crosswind across the runway. What effect does the crosswind have on its vortices?",
    scenarioOptions: [
      "One vortex can remain stationary over the runway.",
      "Both vortices dissipate rapidly.",
      "Both vortices are rapidly cleared off the runway.",
      "The crosswind has no effect on lateral vortex movement.",
    ],
  },

  // === SECTION 8 – HUMAN FACTORS (remaining) ===
  {
    questionId: "8.02",
    scenarioStem: "You're flying below 8,000 feet and start feeling lightheaded and tingly — signs of hyperventilation. What should you do?",
    scenarioOptions: [
      "Increase the depth of your breathing.",
      "Hold your breath and perform the Valsalva manoeuvre.",
      "Slow your breathing rate to below 12 breaths per minute.",
      "Increase your supplemental oxygen flow.",
    ],
  },
  {
    questionId: "8.03",
    scenarioStem: "You notice ear pain during flight. During which phase of flight is ear drum damage most likely to occur?",
    scenarioOptions: [
      "During a climb.",
      "During a descent.",
      "When using supplementary oxygen.",
      "After SCUBA diving.",
    ],
  },
  {
    questionId: "8.04",
    scenarioStem: "You're on a rapid descent and feel painful pressure building in your ears. What techniques can you use to equalize the pressure?",
    scenarioOptions: [
      "Swallowing.",
      "Yawning.",
      "The Valsalva manoeuvre — pinch your nose and gently blow.",
      "All of the above.",
    ],
  },
  {
    questionId: "8.05",
    scenarioStem: "You completed a SCUBA dive yesterday that required decompression stops. How long must you wait before flying?",
    scenarioOptions: [
      "4 hours.",
      "8 hours.",
      "12 hours.",
      "24 hours.",
    ],
  },
  {
    questionId: "8.06",
    scenarioStem: "You've had a stressful week with very little sleep. Which statement about fatigue and flying is correct?",
    scenarioOptions: [
      "Personal or family problems don't influence flight performance.",
      "Fatigue slows reaction time and increases decision-making errors.",
      "You'll recuperate faster from fatigue at altitude than at sea level.",
      "As long as you eat before and during the flight, fatigue is not a concern.",
    ],
  },
  {
    questionId: "8.07",
    scenarioStem: "You donated blood earlier this week. How long must you wait before acting as flight crew?",
    scenarioOptions: [
      "12 hours.",
      "24 hours.",
      "36 hours.",
      "48 hours.",
    ],
  },
  {
    questionId: "8.08",
    scenarioStem: "You recently had a minor procedure under general anaesthetic. When can you fly again?",
    scenarioOptions: [
      "After 12 hours.",
      "After 36 hours.",
      "After 48 hours.",
      "Only when your doctor confirms you are fit to fly.",
    ],
  },
  {
    questionId: "8.09",
    scenarioStem: "You had a dental filling done today under local anaesthetic. How long must you wait before flying?",
    scenarioOptions: [
      "12 hours.",
      "24 hours.",
      "36 hours.",
      "48 hours.",
    ],
  },
  {
    questionId: "8.10",
    scenarioStem: "You had a drink last night and wonder how alcohol affects altitude tolerance. What happens to your susceptibility to hypoxia?",
    scenarioOptions: [
      "Tolerance deteriorates — the effects of hypoxia worsen with altitude.",
      "Tolerance improves with altitude.",
      "Alcohol does not affect hypoxia tolerance.",
      "Tolerance remains constant up to 6,000 feet.",
    ],
  },
  {
    questionId: "8.11",
    scenarioStem: "You have a headache and consider taking an over-the-counter medication before your flight. What is the safest rule regarding medications?",
    scenarioOptions: [
      "Read the warning label — if no drowsiness warning, it's fine to fly.",
      "Do not take any medication before flying unless a Civil Aviation Medical Examiner advises it is safe.",
      "Wait at least 12 hours between taking any drug and flying.",
      "Wait at least 8 hours between taking any drug and flying.",
    ],
  },

  // === SECTION 9 – FLIGHT PLANNING (remaining) ===
  {
    questionId: "9.04",
    scenarioStem: "You filed a VFR flight plan. After landing at your destination, within what time must you file an arrival report?",
    scenarioOptions: [
      "15 minutes.",
      "30 minutes.",
      "45 minutes.",
      "60 minutes.",
    ],
  },
  {
    questionId: "9.05",
    scenarioStem: "En route, you decide to change your destination from what you filed on your VFR flight plan. When must you notify ATC of the change?",
    scenarioOptions: [
      "As soon as possible.",
      "Within 10 minutes of the deviation.",
      "Within 30 minutes of the deviation.",
      "Within 60 minutes after landing.",
    ],
  },
  {
    questionId: "9.06",
    scenarioStem: "You filed a flight itinerary with a responsible person but did not specify a SAR time. When must you report to that person after arrival?",
    scenarioOptions: [
      "Within 1 hour after the estimated duration of flight.",
      "Within 1 hour after landing.",
      "Within 24 hours after the estimated duration of flight.",
      "As soon as practicable, but within 24 hours of your ETA.",
    ],
  },
  {
    questionId: "9.07",
    scenarioStem: "You named a friend as the 'responsible person' on your flight itinerary. What does that role mean?",
    scenarioOptions: [
      "That person has agreed to notify an ATS unit if you are overdue.",
      "That person must be at least 18 years old.",
      "That person holds a pilot licence.",
      "That person has agreed to report your arrival to ATS.",
    ],
  },
  {
    questionId: "9.08",
    scenarioStem: "You've landed after a VFR flight plan trip. How do you close your flight plan — that is, file the arrival report?",
    scenarioOptions: [
      "By advising any ATS unit (FSS, tower, or FIC).",
      "By reporting at each intermediate stop.",
      "Automatically, by parking within sight of the control tower.",
      "Flight plans are closed automatically at tower-controlled airports.",
    ],
  },
  {
    questionId: "9.09",
    scenarioStem: "You're filing a VFR flight plan: leg A–B takes 1:15, you stop at B for 30 minutes, then B–C takes 1:20. What total elapsed time do you enter?",
    scenarioOptions: [
      "3:50.",
      "3:20.",
      "3:05.",
      "2:35.",
    ],
  },
  {
    questionId: "9.10",
    scenarioStem: "You're filing a VFR flight plan with an intermediate stop. How do you calculate the total elapsed time?",
    scenarioOptions: [
      "Flight time for all legs plus the duration of any intermediate stops.",
      "Flight time for all legs plus the stops plus an additional 45 minutes.",
      "Flight time only — intermediate stops are excluded.",
      "Time to the first landing plus all stops.",
    ],
  },
  {
    questionId: "9.11",
    scenarioStem: "You need to indicate an intermediate stop on your VFR flight plan. How is it shown?",
    scenarioOptions: [
      "In the total elapsed time box only.",
      "Included in elapsed time only if the stop is less than 30 minutes.",
      "The stop location and duration are repeated in the Route section.",
      "In the Other Information section of the flight plan.",
    ],
  },
];

// Build the lookup map
for (const s of PSTAR_SCENARIOS) {
  SCENARIO_MAP[s.questionId] = s;
}
