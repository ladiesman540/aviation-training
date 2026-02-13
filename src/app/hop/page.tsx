"use client";

import { useState } from "react";

export default function HopPage() {
  const [aircraft, setAircraft] = useState("C172");
  const [missionType, setMissionType] = useState("local");
  const [instructorMode, setInstructorMode] = useState(true);

  const handleStart = () => {
    const sessionId = crypto.randomUUID();
    window.location.href = `/hop/${sessionId}?aircraft=${aircraft}&mission=${missionType}&instructor=${instructorMode}`;
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="mb-8">
        <span className="font-display text-xs tracking-widest text-accent-green/70">QUICK HOP</span>
        <h1 className="font-display text-2xl font-bold mt-2 mb-2">Start a flight</h1>
        <p className="text-[#8b949e]">
          5-minute micro-flight with 8-12 decisions. Wrong answers add risk.
          Critical errors end the flight.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-[#8b949e] mb-2 font-display text-xs tracking-wider">
            AIRCRAFT
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "C150", label: "Cessna 150", desc: "Tighter margins" },
              { value: "C172", label: "Cessna 172", desc: "Standard trainer" },
            ].map((a) => (
              <button
                key={a.value}
                onClick={() => setAircraft(a.value)}
                className={`p-4 rounded-lg border text-left transition ${
                  aircraft === a.value
                    ? "border-accent-green/50 bg-accent-green/5"
                    : "border-[#1e252d] hover:border-accent-green/30"
                }`}
              >
                <span className="block font-display text-sm font-semibold">{a.label}</span>
                <span className="block text-xs text-[#5c6570] mt-1">{a.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#8b949e] mb-2 font-display text-xs tracking-wider">
            MISSION
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "local", label: "Local Circuits" },
              { value: "practice", label: "Practice Area" },
              { value: "short-hop", label: "Short Hop" },
            ].map((m) => (
              <button
                key={m.value}
                onClick={() => setMissionType(m.value)}
                className={`p-3 rounded-lg border text-center transition ${
                  missionType === m.value
                    ? "border-accent-green/50 bg-accent-green/5"
                    : "border-[#1e252d] hover:border-accent-green/30"
                }`}
              >
                <span className="block text-sm">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-bg-panel border border-[#1e252d] rounded-lg p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="block text-sm font-semibold">Instructor Mode</span>
              <span className="block text-xs text-[#5c6570] mt-0.5">
                {instructorMode
                  ? "Shows feedback after each card"
                  : "Results only at debrief"}
              </span>
            </div>
            <div
              className={`w-10 h-6 rounded-full transition-colors relative ${
                instructorMode ? "bg-accent-green" : "bg-[#1e252d]"
              }`}
              onClick={() => setInstructorMode(!instructorMode)}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  instructorMode ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </div>
          </label>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="mt-8 w-full px-6 py-4 font-display font-semibold text-bg-deep bg-accent-green rounded-lg hover:bg-[#00e077] transition text-lg"
      >
        Start Flight
      </button>
    </div>
  );
}
