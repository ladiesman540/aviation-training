"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { PhaseBar } from "@/components/PhaseBar";
import { RiskMeter } from "@/components/RiskMeter";
import { BustScreen } from "@/components/BustScreen";
import { DebriefPanel } from "@/components/DebriefPanel";
import {
  type HopCard,
  type HopRadioExchange,
  type HopEmergency,
  type HopSequenceItem,
  type HopResponse,
  PHASES,
  MAX_RISK,
  processAnswer,
  HOP_TIMEOUT_SECONDS,
  SVFR_CARD_TIMER_SECONDS,
} from "@/lib/hop-engine";
import type { FlightPhase } from "@/types";
import type { FlightBrief } from "@/data/flight-briefs";
import { pickTransition, getPhaseBridge } from "@/data/flight-transitions";
import { RadioExchange as RadioExchangeComponent } from "@/components/RadioExchange";
import { recordAnswer } from "@/lib/mastery";

type GameState = "loading" | "brief" | "wx_decode" | "go_nogo" | "playing" | "transition" | "bust" | "debrief";

/** Phase panel labels using flight brief context */
const PHASE_PANEL: Record<FlightPhase, (b: FlightBrief) => { label: string; sub: string }> = {
  preflight: (b) => ({ label: `RAMP — ${b.airport.icao}`, sub: `${b.airport.name} Municipal` }),
  taxi_depart: (b) => ({ label: `TAXIWAY — ${b.airport.icao}`, sub: `Runway ${b.runway}` }),
  enroute: (b) => ({ label: `AIRBORNE — ${b.cruiseAltitude} ft`, sub: `${b.callsign}` }),
  arrival: (b) => ({ label: `CIRCUIT — RWY ${b.runway}`, sub: `${b.airport.name}` }),
};

export default function HopSessionPage() {
  const searchParams = useSearchParams();
  const aircraft = searchParams.get("aircraft") ?? "C172";
  const missionType = searchParams.get("mission") ?? "local";
  const instructorMode = searchParams.get("instructor") === "true";

  const [gameState, setGameState] = useState<GameState>("loading");
  const [sequence, setSequence] = useState<HopSequenceItem[]>([]);
  const [cards, setCards] = useState<HopCard[]>([]); // question cards only, for debrief
  const [brief, setBrief] = useState<FlightBrief | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<HopResponse[]>([]);
  const [risk, setRisk] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | undefined>();
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(HOP_TIMEOUT_SECONDS);
  const [riskAnimating, setRiskAnimating] = useState(false);
  const [transitionText, setTransitionText] = useState("");
  const [wxAnswer, setWxAnswer] = useState<number | undefined>();
  const [wxShowResult, setWxShowResult] = useState(false);
  const [activeEmergency, setActiveEmergency] = useState<HopEmergency | null>(null);
  const [isSvfr, setIsSvfr] = useState(false);
  const [cardTimer, setCardTimer] = useState<number | null>(null);
  const [showMetarRef, setShowMetarRef] = useState(false);
  const startTime = useRef(Date.now());
  const hasStartedFlight = useRef(false);

  // Fetch sequence (mixed question cards + radio exchanges) and flight brief
  useEffect(() => {
    fetch(
      `/api/hop?aircraft=${encodeURIComponent(aircraft)}&mission=${encodeURIComponent(missionType)}`,
      { cache: "no-store" }
    )
      .then((r) => {
        if (!r.ok) throw new Error(`API error: ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const seqData = data.sequence ?? data.cards ?? data;
        const briefData = data.brief ?? null;

        if (!Array.isArray(seqData) || seqData.length === 0) {
          throw new Error("No questions returned from API");
        }

        const mapped: HopSequenceItem[] = seqData.map((d: Record<string, unknown>) => {
          if (d.type === "emergency") {
            return {
              type: "emergency" as const,
              id: d.id as string,
              name: (d.name as string) ?? "",
              phase: d.phase as FlightPhase,
              announcement: (d.announcement as string) ?? "",
              panelLabel: (d.panelLabel as string) ?? "",
              panelSub: (d.panelSub as string) ?? "",
              timerPenalty: (d.timerPenalty as number) ?? 0,
              immediateRisk: (d.immediateRisk as number) ?? 0,
              resolution: (d.resolution as string) ?? "",
              radioLines: (d.radioLines as { speaker: "atc" | "pilot"; text: string }[]) ?? [],
            } satisfies HopEmergency;
          }
          if (d.type === "radio") {
            return {
              type: "radio" as const,
              id: d.id as string,
              phase: d.phase as FlightPhase,
              context: (d.context as string) ?? "",
              lines: (d.lines as { speaker: "atc" | "pilot"; text: string }[]) ?? [],
            } satisfies HopRadioExchange;
          }
          return {
            type: "question" as const,
            questionId: d.id as string,
            stem: d.stem as string,
            options: [d.option1, d.option2, d.option3, d.option4] as [string, string, string, string],
            correctOption: d.correctOption as 1 | 2 | 3 | 4,
            phase: d.phase as FlightPhase,
            flightContext: (d.flightContext as string) ?? "",
            explanation: (d.explanation as string) ?? "",
            isCritical: (d.isCritical as boolean) ?? false,
            riskPoints: (d.riskPoints as number) ?? 1,
            sectionName: (d.sectionName as string) ?? "",
          } satisfies HopCard;
        });

        setSequence(mapped);
        // Extract question cards only for debrief
        setCards(mapped.filter((s): s is HopCard => s.type === "question"));
        if (briefData) setBrief(briefData as FlightBrief);
        setGameState("brief");
      })
      .catch(() => setSequence([]));
  }, [aircraft, missionType]);

  // Timer (only ticks during playing and transition states)
  useEffect(() => {
    if (gameState !== "playing" && gameState !== "transition") return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("debrief");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [gameState]);

  const currentItem = sequence[currentIndex];

  // Reset viewport to top when advancing to a new in-flight item.
  useEffect(() => {
    if (gameState !== "playing") return;
    if (sequence.length === 0) return;

    if (!hasStartedFlight.current) {
      hasStartedFlight.current = true;
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [currentIndex, gameState, sequence.length]);

  // SVFR per-card timer — auto-bust if you take too long on a card
  useEffect(() => {
    if (!isSvfr || gameState !== "playing" || !currentItem || currentItem.type !== "question") {
      setCardTimer(null);
      return;
    }
    setCardTimer(SVFR_CARD_TIMER_SECONDS);
    const t = setInterval(() => {
      setCardTimer((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isSvfr, gameState, currentIndex, currentItem]);
  const currentCard = currentItem?.type === "question" ? currentItem : null;
  const currentRadio = currentItem?.type === "radio" ? currentItem : null;
  const currentEmergency = currentItem?.type === "emergency" ? (currentItem as HopEmergency) : null;
  const currentPhase = currentItem?.phase as FlightPhase | undefined;
  const completedPhases = PHASES.filter((p) => {
    const firstOfPhase = sequence.findIndex((c) => c.phase === p);
    return firstOfPhase !== -1 && firstOfPhase < currentIndex;
  });
  const questionCount = sequence.filter((s) => s.type === "question").length;
  const questionIndex = sequence.slice(0, currentIndex + 1).filter((s) => s.type === "question").length;

  const showTransition = useCallback(
    (text: string, then: () => void) => {
      setTransitionText(text);
      setGameState("transition");
      setTimeout(() => {
        then();
      }, 1800);
    },
    []
  );

  const handleSelect = useCallback(
    (option: number) => {
      if (!currentCard || selectedOption !== undefined) return;

      setSelectedOption(option);
      const isCorrect = option === currentCard.correctOption;
      const { newRisk, busted } = processAnswer(
        isCorrect,
        currentCard.isCritical ?? false,
        currentCard.riskPoints ?? 1,
        risk
      );

      const response: HopResponse = {
        questionId: currentCard.questionId,
        selectedOption: option,
        isCorrect,
        phase: currentCard.phase as FlightPhase,
        riskBefore: risk,
        riskAfter: newRisk,
        wasBust: busted,
      };

      setResponses((prev) => [...prev, response]);
      setRisk(newRisk);
      recordAnswer(currentCard.questionId, isCorrect);

      if (!isCorrect) {
        setRiskAnimating(true);
        setTimeout(() => setRiskAnimating(false), 1000);
      }

      if (busted) {
        setTimeout(() => setGameState("bust"), 600);
        return;
      }

      if (instructorMode) {
        setShowFeedback(true);
      } else {
        // In non-instructor mode, show a brief transition
        const tText = pickTransition(
          currentCard.phase as FlightPhase,
          isCorrect,
          newRisk
        );
        setTimeout(() => {
          showTransition(tText, () => {
            // After transition, advance (which may also show a phase bridge)
            if (currentIndex >= sequence.length - 1) {
              setGameState("debrief");
            } else {
              const next = sequence[currentIndex + 1];
              if (next && next.phase !== currentItem?.phase && currentPhase) {
                setTransitionText(getPhaseBridge(currentPhase));
                setTimeout(() => {
                  setCurrentIndex((i) => i + 1);
                  setSelectedOption(undefined);
                  setShowFeedback(false);
                  setGameState("playing");
                }, 1500);
              } else {
                setCurrentIndex((i) => i + 1);
                setSelectedOption(undefined);
                setShowFeedback(false);
                setGameState("playing");
              }
            }
          });
        }, 300);
      }
    },
    [currentCard, selectedOption, risk, instructorMode, currentIndex, cards, currentPhase, showTransition]
  );

  // When SVFR card timer hits 0 and no answer selected, auto-fail the card
  useEffect(() => {
    if (cardTimer === 0 && selectedOption === undefined && currentItem?.type === "question") {
      const card = currentItem as HopCard;
      const wrongOpt = card.correctOption === 1 ? 2 : 1;
      handleSelect(wrongOpt);
    }
  }, [cardTimer, selectedOption, currentItem, handleSelect]);

  const handleNextAfterFeedback = useCallback(() => {
    if (!currentCard) return;
    const lastResponse = responses[responses.length - 1];
    const tText = pickTransition(
      currentCard.phase as FlightPhase,
      lastResponse?.isCorrect ?? true,
      risk
    );
    showTransition(tText, () => {
      if (currentIndex >= sequence.length - 1) {
        if (currentPhase) {
          setTransitionText(getPhaseBridge(currentPhase));
          setTimeout(() => setGameState("debrief"), 1500);
        } else {
          setGameState("debrief");
        }
      } else {
        const next = sequence[currentIndex + 1];
        if (next && next.phase !== currentItem?.phase && currentPhase) {
          setTransitionText(getPhaseBridge(currentPhase));
          setTimeout(() => {
            setCurrentIndex((i) => i + 1);
            setSelectedOption(undefined);
            setShowFeedback(false);
            setGameState("playing");
          }, 1500);
        } else {
          setCurrentIndex((i) => i + 1);
          setSelectedOption(undefined);
          setShowFeedback(false);
          setGameState("playing");
        }
      }
    });
  }, [currentCard, responses, risk, currentIndex, cards, currentPhase, showTransition]);

  const handleBustContinue = useCallback(() => {
    setGameState("debrief");
  }, []);

  const handleStartNext = useCallback(() => {
    const sessionId = crypto.randomUUID();
    window.location.href = `/hop/${sessionId}?aircraft=${aircraft}&mission=${missionType}&instructor=${instructorMode}`;
  }, [aircraft, missionType, instructorMode]);

  const elapsedSeconds = Math.floor((Date.now() - startTime.current) / 1000);

  // === LOADING ===
  if (gameState === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="inline-block w-6 h-6 border-2 border-accent-green/30 border-t-accent-green rounded-full animate-spin" />
        <p className="text-[#5c6570] font-display text-sm mt-4">Preparing your flight...</p>
      </div>
    );
  }

  // === FLIGHT BRIEF ===
  if (gameState === "brief" && brief) {
    const d = brief.metar.template.decoded;
    return (
      <div className="max-w-md mx-auto px-6 py-8">
        <div className="bg-bg-panel border border-[#1e252d] rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-bg-elevated border-b border-[#1e252d]">
            <span className="font-display text-[10px] tracking-widest text-accent-green/70">FLIGHT BRIEF</span>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex justify-between items-baseline">
              <div>
                <p className="font-display text-lg font-bold">{brief.airport.icao}</p>
                <p className="text-sm text-[#8b949e]">{brief.airport.name}</p>
              </div>
              <span className="font-display text-sm text-accent-amber">{brief.callsign}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-display text-[10px] text-[#5c6570] tracking-wider block">RUNWAY</span>
                <span className="font-display">{brief.runway}</span>
              </div>
              <div>
                <span className="font-display text-[10px] text-[#5c6570] tracking-wider block">AIRCRAFT</span>
                <span className="font-display">{aircraft === "C150" ? "Cessna 150" : "Cessna 172"}</span>
              </div>
              <div>
                <span className="font-display text-[10px] text-[#5c6570] tracking-wider block">CRUISE ALT</span>
                <span>{brief.cruiseAltitude} ft</span>
              </div>
              <div>
                <span className="font-display text-[10px] text-[#5c6570] tracking-wider block">CATEGORY</span>
                <span className={`font-display ${
                  d.flightCategory === "VFR" ? "text-accent-green" :
                  d.flightCategory === "MVFR" ? "text-accent-blue" :
                  "text-red-400"
                }`}>{d.flightCategory}</span>
              </div>
            </div>

            {/* Raw METAR */}
            <div className="bg-bg-deep rounded-lg p-4 border border-[#1e252d]">
              <span className="font-display text-[10px] text-[#5c6570] tracking-wider block mb-2">METAR</span>
              <p className="font-display text-sm text-accent-green leading-relaxed break-all">
                {brief.metar.raw}
              </p>
            </div>

            <div className="text-xs text-[#5c6570] pt-2 border-t border-[#1e252d]">
              {cards.length} decisions · {missionType.replace("-", " ")} · {instructorMode ? "instructor mode" : "solo"}
            </div>
          </div>
        </div>

        {/* METAR Reference Toggle */}
        <button
          onClick={() => setShowMetarRef(!showMetarRef)}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-[#8b949e] hover:text-accent-green transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="font-display text-xs tracking-wider">
            {showMetarRef ? "HIDE METAR REFERENCE" : "METAR REFERENCE"}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${showMetarRef ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* METAR Reference Panel */}
        {showMetarRef && (
          <div className="mt-2 bg-bg-panel border border-[#1e252d] rounded-lg overflow-hidden text-xs">
            <div className="px-4 py-3 bg-bg-elevated border-b border-[#1e252d]">
              <span className="font-display text-[10px] tracking-widest text-accent-amber/70">METAR DECODING REFERENCE</span>
            </div>
            <div className="px-4 py-3 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Time */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">TIME</p>
                <p className="text-[#8b949e]"><span className="text-accent-green font-mono">DDHHMMZ</span> — Day / Hour / Minute in UTC</p>
              </div>

              {/* Wind */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">WIND</p>
                <div className="space-y-1 text-[#8b949e]">
                  <p><span className="text-accent-green font-mono">DDDSSKT</span> — Direction° / Speed in knots</p>
                  <p><span className="text-accent-green font-mono">DDDSSGSKT</span> — With gusts (G = gust)</p>
                  <p><span className="text-accent-green font-mono">VRB##KT</span> — Variable direction</p>
                  <p><span className="text-accent-green font-mono">00000KT</span> — Calm</p>
                </div>
              </div>

              {/* Visibility */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">VISIBILITY</p>
                <div className="space-y-1 text-[#8b949e]">
                  <p><span className="text-accent-green font-mono">#SM</span> — Statute miles</p>
                  <p><span className="text-accent-green font-mono">1/2SM, 1/4SM</span> — Fractional</p>
                  <p><span className="text-accent-green font-mono">P6SM</span> — Plus (greater than) 6 SM</p>
                </div>
              </div>

              {/* Clouds */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">CLOUD COVERAGE</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[#8b949e]">
                  <p><span className="text-accent-green font-mono">SKC</span> — Sky clear</p>
                  <p><span className="text-accent-green font-mono">CLR</span> — Clear below 12,000</p>
                  <p><span className="text-accent-green font-mono">FEW</span> — Few (1-2/8)</p>
                  <p><span className="text-accent-green font-mono">SCT</span> — Scattered (3-4/8)</p>
                  <p><span className="text-accent-green font-mono">BKN</span> — Broken (5-7/8) ✓</p>
                  <p><span className="text-accent-green font-mono">OVC</span> — Overcast (8/8) ✓</p>
                  <p><span className="text-accent-green font-mono">VV###</span> — Vert. visibility ✓</p>
                  <p className="text-[#5c6570]">✓ = ceiling</p>
                </div>
                <p className="mt-1 text-[#5c6570]">Height in 100s of feet AGL (e.g., 035 = 3,500 ft)</p>
              </div>

              {/* Cloud Types */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">CLOUD TYPES</p>
                <div className="space-y-1 text-[#8b949e]">
                  <p><span className="text-accent-green font-mono">CB</span> — Cumulonimbus (thunderstorm)</p>
                  <p><span className="text-accent-green font-mono">TCU</span> — Towering cumulus</p>
                </div>
              </div>

              {/* Weather */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">WEATHER PHENOMENA</p>
                <p className="text-[#5c6570] mb-2">Intensity: <span className="text-accent-green font-mono">-</span> light, (none) moderate, <span className="text-accent-green font-mono">+</span> heavy</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[#8b949e]">
                  <p><span className="text-accent-green font-mono">RA</span> — Rain</p>
                  <p><span className="text-accent-green font-mono">SN</span> — Snow</p>
                  <p><span className="text-accent-green font-mono">DZ</span> — Drizzle</p>
                  <p><span className="text-accent-green font-mono">SH</span> — Showers</p>
                  <p><span className="text-accent-green font-mono">TS</span> — Thunderstorm</p>
                  <p><span className="text-accent-green font-mono">FG</span> — Fog (&lt;5/8 SM)</p>
                  <p><span className="text-accent-green font-mono">BR</span> — Mist (5/8-6 SM)</p>
                  <p><span className="text-accent-green font-mono">HZ</span> — Haze</p>
                  <p><span className="text-accent-green font-mono">FZ</span> — Freezing (prefix)</p>
                  <p><span className="text-accent-green font-mono">BL</span> — Blowing (prefix)</p>
                </div>
                <p className="mt-1 text-[#5c6570]">e.g., -SHRA = light rain showers, FZRA = freezing rain</p>
              </div>

              {/* Temp/Dew */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">TEMP / DEWPOINT</p>
                <p className="text-[#8b949e]"><span className="text-accent-green font-mono">TT/DD</span> — °Celsius (<span className="text-accent-green font-mono">M</span> = minus, e.g., M05 = -5°C)</p>
              </div>

              {/* Altimeter */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">ALTIMETER</p>
                <p className="text-[#8b949e]"><span className="text-accent-green font-mono">ANNNN</span> — Inches Hg (e.g., A2992 = 29.92&quot;)</p>
              </div>

              {/* Flight Categories */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">FLIGHT CATEGORIES</p>
                <div className="space-y-1">
                  <p><span className="text-accent-green font-mono">VFR</span> — Ceiling &gt;3,000 ft AND vis &gt;5 SM</p>
                  <p><span className="text-accent-blue font-mono">MVFR</span> — Ceiling 1,000-3,000 ft OR vis 3-5 SM</p>
                  <p><span className="text-red-400 font-mono">IFR</span> — Ceiling 500-999 ft OR vis 1-3 SM</p>
                  <p><span className="text-red-500 font-mono">LIFR</span> — Ceiling &lt;500 ft OR vis &lt;1 SM</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setGameState("wx_decode")}
          className="mt-4 w-full px-6 py-4 font-display font-semibold text-bg-deep bg-accent-green rounded-lg hover:bg-[#00e077] transition text-lg"
        >
          Decode Weather
        </button>
      </div>
    );
  }

  // === WEATHER DECODE ===
  if (gameState === "wx_decode" && brief) {
    const wxQ = brief.metar.template.wxQuestion;
    const answered = wxAnswer !== undefined;
    const isCorrect = answered && wxAnswer === wxQ.correctOption;

    return (
      <div className="max-w-lg mx-auto px-6 py-8">
        {/* Raw METAR reminder */}
        <div className="bg-bg-deep rounded-lg p-3 border border-[#1e252d] mb-4">
          <p className="font-display text-xs text-accent-green leading-relaxed break-all">
            {brief.metar.raw}
          </p>
        </div>

        {/* METAR Reference Toggle */}
        <button
          onClick={() => setShowMetarRef(!showMetarRef)}
          className="mb-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-[#8b949e] hover:text-accent-green transition border border-[#1e252d] rounded-lg hover:border-accent-green/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="font-display text-xs tracking-wider">
            {showMetarRef ? "HIDE REFERENCE" : "METAR REFERENCE"}
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${showMetarRef ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* METAR Reference Panel */}
        {showMetarRef && (
          <div className="mb-6 bg-bg-panel border border-[#1e252d] rounded-lg overflow-hidden text-xs">
            <div className="px-4 py-3 bg-bg-elevated border-b border-[#1e252d]">
              <span className="font-display text-[10px] tracking-widest text-accent-amber/70">METAR DECODING REFERENCE</span>
            </div>
            <div className="px-4 py-3 space-y-4 max-h-[40vh] overflow-y-auto">
              {/* Time */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">TIME</p>
                <p className="text-[#8b949e]"><span className="text-accent-green font-mono">DDHHMMZ</span> — Day / Hour / Minute in UTC</p>
              </div>

              {/* Wind */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">WIND</p>
                <div className="space-y-1 text-[#8b949e]">
                  <p><span className="text-accent-green font-mono">DDDSSKT</span> — Direction° / Speed in knots</p>
                  <p><span className="text-accent-green font-mono">DDDSSGSKT</span> — With gusts (G = gust)</p>
                  <p><span className="text-accent-green font-mono">VRB##KT</span> — Variable direction</p>
                  <p><span className="text-accent-green font-mono">00000KT</span> — Calm</p>
                </div>
              </div>

              {/* Visibility */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">VISIBILITY</p>
                <div className="space-y-1 text-[#8b949e]">
                  <p><span className="text-accent-green font-mono">#SM</span> — Statute miles</p>
                  <p><span className="text-accent-green font-mono">1/2SM, 1/4SM</span> — Fractional</p>
                  <p><span className="text-accent-green font-mono">P6SM</span> — Plus (greater than) 6 SM</p>
                </div>
              </div>

              {/* Clouds */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">CLOUD COVERAGE</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[#8b949e]">
                  <p><span className="text-accent-green font-mono">SKC</span> — Sky clear</p>
                  <p><span className="text-accent-green font-mono">CLR</span> — Clear below 12,000</p>
                  <p><span className="text-accent-green font-mono">FEW</span> — Few (1-2/8)</p>
                  <p><span className="text-accent-green font-mono">SCT</span> — Scattered (3-4/8)</p>
                  <p><span className="text-accent-green font-mono">BKN</span> — Broken (5-7/8) ✓</p>
                  <p><span className="text-accent-green font-mono">OVC</span> — Overcast (8/8) ✓</p>
                  <p><span className="text-accent-green font-mono">VV###</span> — Vert. visibility ✓</p>
                  <p className="text-[#5c6570]">✓ = ceiling</p>
                </div>
                <p className="mt-1 text-[#5c6570]">Height in 100s of feet AGL (e.g., 035 = 3,500 ft)</p>
              </div>

              {/* Cloud Types */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">CLOUD TYPES</p>
                <div className="space-y-1 text-[#8b949e]">
                  <p><span className="text-accent-green font-mono">CB</span> — Cumulonimbus (thunderstorm)</p>
                  <p><span className="text-accent-green font-mono">TCU</span> — Towering cumulus</p>
                </div>
              </div>

              {/* Weather */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">WEATHER PHENOMENA</p>
                <p className="text-[#5c6570] mb-2">Intensity: <span className="text-accent-green font-mono">-</span> light, (none) moderate, <span className="text-accent-green font-mono">+</span> heavy</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[#8b949e]">
                  <p><span className="text-accent-green font-mono">RA</span> — Rain</p>
                  <p><span className="text-accent-green font-mono">SN</span> — Snow</p>
                  <p><span className="text-accent-green font-mono">DZ</span> — Drizzle</p>
                  <p><span className="text-accent-green font-mono">SH</span> — Showers</p>
                  <p><span className="text-accent-green font-mono">TS</span> — Thunderstorm</p>
                  <p><span className="text-accent-green font-mono">FG</span> — Fog (&lt;5/8 SM)</p>
                  <p><span className="text-accent-green font-mono">BR</span> — Mist (5/8-6 SM)</p>
                  <p><span className="text-accent-green font-mono">HZ</span> — Haze</p>
                  <p><span className="text-accent-green font-mono">FZ</span> — Freezing (prefix)</p>
                  <p><span className="text-accent-green font-mono">BL</span> — Blowing (prefix)</p>
                </div>
                <p className="mt-1 text-[#5c6570]">e.g., -SHRA = light rain showers, FZRA = freezing rain</p>
              </div>

              {/* Temp/Dew */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">TEMP / DEWPOINT</p>
                <p className="text-[#8b949e]"><span className="text-accent-green font-mono">TT/DD</span> — °Celsius (<span className="text-accent-green font-mono">M</span> = minus, e.g., M05 = -5°C)</p>
              </div>

              {/* Altimeter */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">ALTIMETER</p>
                <p className="text-[#8b949e]"><span className="text-accent-green font-mono">ANNNN</span> — Inches Hg (e.g., A2992 = 29.92&quot;)</p>
              </div>

              {/* Flight Categories */}
              <div>
                <p className="font-display text-[10px] text-[#5c6570] tracking-wider mb-1">FLIGHT CATEGORIES</p>
                <div className="space-y-1">
                  <p><span className="text-accent-green font-mono">VFR</span> — Ceiling &gt;3,000 ft AND vis &gt;5 SM</p>
                  <p><span className="text-accent-blue font-mono">MVFR</span> — Ceiling 1,000-3,000 ft OR vis 3-5 SM</p>
                  <p><span className="text-red-400 font-mono">IFR</span> — Ceiling 500-999 ft OR vis 1-3 SM</p>
                  <p><span className="text-red-500 font-mono">LIFR</span> — Ceiling &lt;500 ft OR vis &lt;1 SM</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-bg-panel border border-[#1e252d] rounded-lg p-6">
          <span className="font-display text-[10px] tracking-widest text-accent-amber block mb-3">
            DECODE THE METAR
          </span>
          <p className="text-[#e8ecf0] mb-6 leading-relaxed">{wxQ.stem}</p>

          <div className="space-y-3">
            {wxQ.options.map((opt, i) => {
              const optNum = (i + 1) as 1 | 2 | 3 | 4;
              const isSelected = wxAnswer === optNum;
              const isCorrectOpt = wxShowResult && wxQ.correctOption === optNum;
              const isWrongSelected = wxShowResult && isSelected && !isCorrect;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (answered) return;
                    setWxAnswer(optNum);
                    setWxShowResult(true);
                  }}
                  disabled={answered}
                  className={`w-full text-left p-3 rounded border transition text-sm ${
                    isCorrectOpt
                      ? "border-accent-green bg-accent-green/10"
                      : isWrongSelected
                        ? "border-red-500 bg-red-500/10"
                        : isSelected
                          ? "border-accent-green/50 bg-accent-green/5"
                          : "border-[#1e252d] hover:border-accent-green/30 hover:bg-accent-green/5 disabled:hover:border-[#1e252d] disabled:hover:bg-transparent"
                  }`}
                >
                  <span className="font-display text-xs text-[#5c6570] mr-2">({optNum})</span>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {wxShowResult && (
            <div className={`mt-4 p-4 rounded border ${
              isCorrect
                ? "bg-accent-green/5 border-accent-green/20"
                : "bg-amber-500/5 border-amber-500/20"
            }`}>
              <span className={`font-display text-xs tracking-wider block mb-2 ${
                isCorrect ? "text-accent-green" : "text-amber-400"
              }`}>
                {isCorrect ? "CORRECT" : "NOT QUITE"}
              </span>
              <p className="text-sm text-[#e8ecf0] leading-relaxed">{wxQ.explanation}</p>
            </div>
          )}
        </div>

        {wxShowResult && (() => {
          const cat = brief.metar.template.decoded.flightCategory;
          const isIfrConditions = cat === "IFR" || cat === "LIFR";
          const hasAtc = brief.airport.hasAtc;

          return (
            <div className="mt-6 space-y-3">
              {!isCorrect && (
                <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
                  <span className="font-display text-xs text-amber-400 tracking-wider">RISK +1</span>
                  <p className="text-sm text-[#8b949e] mt-1">You misread the weather. Starting with elevated risk.</p>
                </div>
              )}

              {isIfrConditions ? (
                <>
                  <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <span className="font-display text-xs text-red-400 tracking-wider block mb-1">GO / NO-GO DECISION</span>
                    <p className="text-sm text-[#e8ecf0]">
                      Conditions are {cat}. You are a VFR-only student pilot. What do you do?
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      // Correct decision — cancel the flight. This is good ADM.
                      setResponses([{
                        questionId: "go-nogo",
                        selectedOption: 1,
                        isCorrect: true,
                        phase: "preflight",
                        riskBefore: 0,
                        riskAfter: 0,
                        wasBust: false,
                      }]);
                      setGameState("debrief");
                    }}
                    className="w-full px-6 py-4 font-display font-semibold text-[#e8ecf0] bg-bg-panel border border-accent-green/30 rounded-lg hover:bg-accent-green/10 transition text-base"
                  >
                    Cancel the flight — below VFR minimums
                  </button>
                  {hasAtc && (
                    <button
                      onClick={() => {
                        // SVFR — legal but risky. Start at risk 2/3.
                        const startRisk = isCorrect ? 2 : 3; // wrong WX decode = even worse
                        setRisk(startRisk);
                        setIsSvfr(true);
                        setRiskAnimating(true);
                        setTimeout(() => setRiskAnimating(false), 1000);
                        setGameState("playing");
                        startTime.current = Date.now();
                      }}
                      className="w-full px-6 py-4 font-display font-semibold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition text-base"
                    >
                      Request Special VFR — {hasAtc ? "controlled field" : "not available"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      // Wrong decision — flying VFR in IFR conditions
                      setRisk(3);
                      setResponses([{
                        questionId: "go-nogo",
                        selectedOption: 3,
                        isCorrect: false,
                        phase: "preflight",
                        riskBefore: 0,
                        riskAfter: 3,
                        wasBust: true,
                      }]);
                      setGameState("debrief");
                    }}
                    className="w-full px-4 py-3 font-display text-sm text-[#5c6570] border border-[#1e252d] rounded-lg hover:border-red-500/30 transition"
                  >
                    Fly anyway — it'll be fine
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    if (!isCorrect) {
                      setRisk(1);
                      setRiskAnimating(true);
                      setTimeout(() => setRiskAnimating(false), 1000);
                    }
                    setGameState("playing");
                    startTime.current = Date.now();
                  }}
                  className="w-full px-6 py-4 font-display font-semibold text-bg-deep bg-accent-green rounded-lg hover:bg-[#00e077] transition text-lg"
                >
                  Begin Flight
                </button>
              )}
            </div>
          );
        })()}
      </div>
    );
  }

  // === TRANSITION ===
  if (gameState === "transition") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-4">
        {/* Keep the HUD visible */}
        <div className="flex justify-between items-center mb-3">
          <span className={`font-display text-sm tabular-nums ${
            timeLeft < 60 ? "text-red-400 animate-pulse" : "text-accent-amber"
          }`}>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
          </span>
          <span className="text-sm text-[#8b949e]">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="mb-4">
          <RiskMeter risk={risk} />
        </div>

        {/* Transition text */}
        <div className="flex items-center justify-center min-h-[300px]">
          <p className="text-center text-[#8b949e] italic text-lg leading-relaxed max-w-sm animate-[fadeIn_0.5s_ease-in]">
            {transitionText}
          </p>
        </div>
      </div>
    );
  }

  // === BUST ===
  if (gameState === "bust" && currentCard) {
    return (
      <BustScreen
        card={currentCard}
        selectedOption={selectedOption ?? 0}
        onContinue={handleBustContinue}
      />
    );
  }

  // === DEBRIEF ===
  if (gameState === "debrief") {
    return (
      <DebriefPanel
        aircraft={aircraft}
        missionType={missionType}
        cards={cards}
        responses={responses}
        busted={responses.some((r) => r.wasBust)}
        bustPhase={responses.find((r) => r.wasBust)?.phase}
        totalTime={elapsedSeconds}
        onStartNext={handleStartNext}
      />
    );
  }

  // === PLAYING ===
  if (!currentItem) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-[#8b949e]">No cards available. Run seed first.</p>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const emergencyPanel = activeEmergency ? { label: activeEmergency.panelLabel, sub: activeEmergency.panelSub } : null;
  const phasePanel = brief && currentPhase ? PHASE_PANEL[currentPhase](brief) : null;
  const displayPanel = emergencyPanel ?? phasePanel;

  // === EMERGENCY EVENT ===
  if (currentEmergency) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-4">
        {/* HUD */}
        <div className="flex justify-between items-center mb-3">
          <span className="font-display text-sm tabular-nums text-red-400 animate-pulse">
            {minutes}:{String(secs).padStart(2, "0")}
          </span>
          <span className="text-sm text-[#8b949e]">{questionIndex} / {questionCount}</span>
        </div>
        <div className="mb-4"><RiskMeter risk={risk} animate /></div>

        {/* Emergency announcement */}
        <div className="bg-red-500/5 border-2 border-red-500/30 rounded-lg overflow-hidden animate-[fadeIn_0.5s_ease-in]">
          <div className="px-5 py-3 bg-red-500/10 border-b border-red-500/20 flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="font-display text-xs tracking-widest text-red-400">{currentEmergency.panelLabel}</span>
          </div>
          <div className="p-5">
            <p className="text-[#e8ecf0] leading-relaxed mb-4">{currentEmergency.announcement}</p>
            {currentEmergency.timerPenalty > 0 && (
              <div className="flex items-center gap-2 text-xs text-red-400 mb-2">
                <span className="font-display tracking-wider">TIME PRESSURE</span>
                <span>−{Math.floor(currentEmergency.timerPenalty / 60)}:{String(currentEmergency.timerPenalty % 60).padStart(2, "0")}</span>
              </div>
            )}
            {currentEmergency.immediateRisk > 0 && (
              <div className="flex items-center gap-2 text-xs text-amber-400">
                <span className="font-display tracking-wider">RISK +{currentEmergency.immediateRisk}</span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            // Apply emergency effects
            setTimeLeft((t) => Math.max(t - currentEmergency.timerPenalty, 60));
            setRisk((r) => Math.min(r + currentEmergency.immediateRisk, MAX_RISK));
            setActiveEmergency(currentEmergency);
            setRiskAnimating(true);
            setTimeout(() => setRiskAnimating(false), 1000);
            // Advance to the next item (emergency radio / question cards)
            setCurrentIndex((i) => i + 1);
          }}
          className="mt-6 w-full px-6 py-4 font-display font-semibold text-bg-deep bg-red-500 rounded-lg hover:bg-red-600 transition text-lg"
        >
          Deal With It
        </button>
      </div>
    );
  }

  // === RADIO EXCHANGE ===
  if (currentRadio) {
    const advanceFromRadio = () => {
      // If this radio exchange has no lines, it's an emergency resolution — clear emergency state
      if (currentRadio.lines.length === 0 && activeEmergency) {
        setActiveEmergency(null);
      }
      if (currentIndex >= sequence.length - 1) {
        setGameState("debrief");
      } else {
        setCurrentIndex((i) => i + 1);
      }
    };

    // Emergency resolution — show as narrative, not radio transcript
    if (currentRadio.lines.length === 0) {
      return (
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-3">
            <span className={`font-display text-sm tabular-nums ${timeLeft < 60 ? "text-red-400 animate-pulse" : "text-accent-amber"}`}>
              {minutes}:{String(secs).padStart(2, "0")}
            </span>
            <span className="text-sm text-[#8b949e]">{questionIndex} / {questionCount}</span>
          </div>
          <div className="mb-4"><RiskMeter risk={risk} /></div>
          <div
            className="flex items-center justify-center min-h-[300px] cursor-pointer"
            onClick={advanceFromRadio}
          >
            <div className="text-center max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-green/10 border border-accent-green/20 rounded-full mb-4">
                <span className="w-2 h-2 bg-accent-green rounded-full" />
                <span className="font-display text-[10px] tracking-widest text-accent-green">RESOLVED</span>
              </div>
              <p className="text-[#8b949e] italic text-lg leading-relaxed animate-[fadeIn_0.5s_ease-in]">
                {currentRadio.context}
              </p>
              <p className="text-center text-[10px] text-[#5c6570] mt-4 font-display tracking-wider">TAP TO CONTINUE</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto px-6 py-4">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-3">
          <span className={`font-display text-sm tabular-nums ${
            timeLeft < 60 ? "text-red-400 animate-pulse" : "text-accent-amber"
          }`}>
            {minutes}:{String(secs).padStart(2, "0")}
          </span>
          <span className="text-sm text-[#8b949e]">
            {questionIndex} / {questionCount}
          </span>
        </div>
        {currentPhase && (
          <div className="mb-3">
            <PhaseBar currentPhase={currentPhase} completedPhases={completedPhases} />
          </div>
        )}
        <div className="mb-4">
          <RiskMeter risk={risk} />
        </div>
        {phasePanel && (
          <div className={`mb-3 px-4 py-2.5 rounded-lg border ${
            currentPhase === "preflight" ? "bg-bg-elevated border-[#1e252d]"
              : currentPhase === "taxi_depart" ? "bg-bg-elevated border-accent-amber/20"
              : currentPhase === "enroute" ? "bg-bg-panel border-accent-blue/20"
              : "bg-bg-elevated border-accent-green/20"
          }`}>
            <span className="font-display text-xs tracking-widest text-accent-green">
              {phasePanel.label}
            </span>
            <span className="text-[10px] text-[#5c6570] ml-3">{phasePanel.sub}</span>
          </div>
        )}
        <RadioExchangeComponent
          context={currentRadio.context}
          lines={currentRadio.lines}
          onContinue={advanceFromRadio}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-4">
      {/* Top bar: timer + card count + SVFR card timer */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <span className={`font-display text-sm tabular-nums ${
            timeLeft < 60 ? "text-red-400 animate-pulse" : "text-accent-amber"
          }`}>
            {minutes}:{String(secs).padStart(2, "0")}
          </span>
          {isSvfr && cardTimer !== null && currentItem?.type === "question" && selectedOption === undefined && (
            <span className={`font-display text-sm tabular-nums px-2 py-0.5 rounded ${
              cardTimer <= 3 ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-amber-500/10 text-amber-400"
            }`}>
              {cardTimer}s
            </span>
          )}
        </div>
        <span className="text-sm text-[#8b949e]">
          {questionIndex} / {questionCount}
        </span>
      </div>

      {/* SVFR warning banner */}
      {isSvfr && (
        <div className="mb-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
          <span className="font-display text-[10px] tracking-widest text-red-400">SPECIAL VFR — 10 SECONDS PER DECISION</span>
        </div>
      )}

      {/* Phase bar */}
      {currentPhase && (
        <div className="mb-3">
          <PhaseBar currentPhase={currentPhase} completedPhases={completedPhases} />
        </div>
      )}

      {/* Risk meter */}
      <div className="mb-4">
        <RiskMeter risk={risk} animate={riskAnimating} isSvfr={isSvfr} />
      </div>

      {/* Phase panel (Layer 4) — shows emergency panel when active */}
      {displayPanel && (
        <div className={`mb-3 px-4 py-2.5 rounded-lg border ${
          activeEmergency
            ? "bg-red-500/5 border-red-500/30"
            : currentPhase === "preflight"
              ? "bg-bg-elevated border-[#1e252d]"
              : currentPhase === "taxi_depart"
                ? "bg-bg-elevated border-accent-amber/20"
                : currentPhase === "enroute"
                  ? "bg-bg-panel border-accent-blue/20"
                  : "bg-bg-elevated border-accent-green/20"
        }`}>
          <span className={`font-display text-xs tracking-widest ${activeEmergency ? "text-red-400" : "text-accent-green"}`}>
            {displayPanel.label}
          </span>
          <span className="text-[10px] text-[#5c6570] ml-3">
            {displayPanel.sub}
          </span>
        </div>
      )}

      {/* Question card */}
      {currentCard && <QuestionCard
        id={currentCard.questionId}
        stem={currentCard.stem}
        options={currentCard.options}
        correctOption={currentCard.correctOption}
        onSelect={selectedOption === undefined ? handleSelect : undefined}
        selectedOption={selectedOption}
        flightContext={currentCard.flightContext}
        explanation={currentCard.explanation}
        isCritical={currentCard.isCritical}
        riskPoints={currentCard.riskPoints}
        sectionName={currentCard.sectionName}
        showFeedback={showFeedback}
      />}

      {/* Next button (instructor mode) */}
      {showFeedback && (
        <div className="flex justify-end mt-4">
          <button
            onClick={handleNextAfterFeedback}
            className="px-6 py-2.5 font-display font-semibold text-bg-deep bg-accent-green rounded hover:bg-[#00e077] transition"
          >
            {currentIndex >= sequence.length - 1 ? "Finish Flight" : "Next"}
          </button>
        </div>
      )}
    </div>
  );
}
