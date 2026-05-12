"use client";

import React, { useEffect, useRef, useState } from "react";

const bpms = {
  min: 30,
  max: 240,
};

const timeSignatures = [
  { label: "2/4", beats: 2, name: "March" },
  { label: "3/4", beats: 3, name: "Waltz" },
  { label: "4/4", beats: 4, name: "Standard" },
  { label: "6/8", beats: 6, name: "Flow" },
];

const tempoMarks = [
  { max: 40, label: "Grave" },
  { max: 60, label: "Largo" },
  { max: 76, label: "Adagio" },
  { max: 108, label: "Andante" },
  { max: 120, label: "Moderato" },
  { max: 168, label: "Allegro" },
  { max: 200, label: "Presto" },
  { max: 240, label: "Prestissimo" },
];

export default function OrchestraMetronomeWebApp() {
  const [bpm, setBpm] = useState(72);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatIndex, setBeatIndex] = useState(0);
  const [selectedSignature, setSelectedSignature] = useState(timeSignatures[2]);
  const [volume, setVolume] = useState(0.75);
  const [soundType, setSoundType] = useState<"wood" | "click" | "soft">("wood");

  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatRef = useRef(0);
  const isPlayingRef = useRef(false);

  const secondsPerBeat = 60 / bpm;
  const tempoName = tempoMarks.find((mark) => bpm <= mark.max)?.label ?? "Tempo";
  const pendulumAngle = isPlaying ? (beatIndex % 2 === 0 ? -18 : 18) : 0;

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }
    return audioContextRef.current;
  };

  const playTick = (time: number, isAccent: boolean) => {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    const frequency = isAccent
      ? soundType === "soft"
        ? 880
        : 1320
      : soundType === "click"
        ? 980
        : 660;

    const attackVolume = isAccent ? volume : volume * 0.62;
    const duration = soundType === "soft" ? 0.08 : 0.045;

    oscillator.type = soundType === "soft" ? "sine" : "square";
    oscillator.frequency.setValueAtTime(frequency, time);

    gainNode.gain.setValueAtTime(0.0001, time);
    gainNode.gain.exponentialRampToValueAtTime(Math.max(attackVolume, 0.0001), time + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
  };

  const scheduler = () => {
    const audioContext = getAudioContext();
    const scheduleAheadTime = 0.1;

    while (nextNoteTimeRef.current < audioContext.currentTime + scheduleAheadTime) {
      const isAccent = currentBeatRef.current === 0;
      playTick(nextNoteTimeRef.current, isAccent);

      const nextBeat = (currentBeatRef.current + 1) % selectedSignature.beats;
      currentBeatRef.current = nextBeat;
      setBeatIndex(nextBeat);
      nextNoteTimeRef.current += secondsPerBeat;
    }
  };

  const start = async () => {
    const audioContext = getAudioContext();
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    currentBeatRef.current = 0;
    setBeatIndex(0);
    nextNoteTimeRef.current = audioContext.currentTime + 0.05;
    isPlayingRef.current = true;
    setIsPlaying(true);

    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(scheduler, 25);
  };

  const stop = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setBeatIndex(0);
    currentBeatRef.current = 0;

    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlayingRef.current) {
      stop();
    } else {
      start();
    }
  };

  const updateBpm = (amount: number) => {
    setBpm((current) => Math.min(bpms.max, Math.max(bpms.min, current + amount)));
  };

  const setDirectBpm = (value: number) => {
    setBpm(Math.min(bpms.max, Math.max(bpms.min, value)));
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07040f] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.22),transparent_32%),radial-gradient(circle_at_10%_25%,rgba(168,85,247,0.16),transparent_32%),linear-gradient(180deg,#120817_0%,#05030a_62%,#000_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[48rem] w-[48rem] -translate-x-1/2 rounded-full border border-amber-300/10" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-44 bg-[linear-gradient(90deg,rgba(120,53,15,0.2)_1px,transparent_1px),linear-gradient(0deg,rgba(245,158,11,0.16)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-8">
        <header className="flex items-center justify-between gap-4 rounded-[1.6rem] border border-white/10 bg-white/[0.05] px-5 py-4 shadow-2xl backdrop-blur-xl">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.42em] text-amber-300/80">HitoriBIZ Web App</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-4xl">Orchestra Metronome</h1>
            <p className="mt-1 text-sm text-amber-50/70">A stage-ready tempo companion in your browser</p>
          </div>
          <a
            href="/metronome"
            className="hidden rounded-full border border-amber-300/30 bg-amber-300/10 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-300 hover:text-slate-950 sm:inline-flex"
          >
            テスター登録
          </a>
        </header>

        <section className="grid flex-1 grid-cols-1 items-center gap-6 py-6 lg:grid-cols-[1fr_0.9fr] lg:gap-8">
          <div className="relative overflow-hidden rounded-[2.3rem] border border-amber-200/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-amber-300/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-60 w-60 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div className="mx-auto flex h-72 w-44 flex-col items-center justify-end rounded-t-full border border-amber-200/20 bg-black/25 px-5 pb-6 shadow-inner sm:h-80 sm:w-52">
                <div className="mb-5 text-center">
                  <p className="text-xs uppercase tracking-[0.35em] text-amber-200/70">Conductor</p>
                  <p className="mt-2 text-sm text-slate-300">{selectedSignature.label} / {tempoName}</p>
                </div>
                <div className="relative h-44 w-24">
                  <div className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded-full bg-amber-200 shadow-[0_0_28px_rgba(252,211,77,0.65)]" />
                  <div
                    className="absolute left-1/2 top-3 h-36 w-1 origin-top rounded-full bg-gradient-to-b from-amber-100 to-amber-500 transition-transform duration-150 ease-in-out"
                    style={{ transform: `translateX(-50%) rotate(${pendulumAngle}deg)` }}
                  />
                  <div
                    className="absolute left-1/2 top-32 h-10 w-10 origin-top -translate-x-1/2 rounded-full border border-amber-100/60 bg-amber-300 shadow-xl transition-transform duration-150 ease-in-out"
                    style={{ transform: `translateX(-50%) rotate(${pendulumAngle}deg)` }}
                  />
                </div>
                <div className="mt-3 h-3 w-28 rounded-full bg-gradient-to-r from-transparent via-amber-200/50 to-transparent" />
              </div>

              <div className="text-center lg:text-left">
                <p className="text-xs uppercase tracking-[0.45em] text-slate-400">Tempo</p>
                <div className="mt-2 font-mono text-[7.5rem] font-black leading-none tracking-[-0.1em] text-white drop-shadow-[0_0_30px_rgba(245,158,11,0.24)] sm:text-[11rem]">
                  {bpm}
                </div>
                <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
                  <p className="text-3xl font-semibold text-amber-200">{tempoName}</p>
                  <p className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm text-slate-300">BPM {bpms.min} - {bpms.max}</p>
                </div>

                <div className="mt-7 grid grid-cols-4 gap-3">
                  <button onClick={() => updateBpm(-5)} className="rounded-2xl border border-white/10 bg-black/30 py-4 text-xl font-semibold hover:bg-white/10">-5</button>
                  <button onClick={() => updateBpm(-1)} className="rounded-2xl border border-white/10 bg-black/30 py-4 text-xl font-semibold hover:bg-white/10">-1</button>
                  <button onClick={() => updateBpm(1)} className="rounded-2xl border border-white/10 bg-black/30 py-4 text-xl font-semibold hover:bg-white/10">+1</button>
                  <button onClick={() => updateBpm(5)} className="rounded-2xl border border-white/10 bg-black/30 py-4 text-xl font-semibold hover:bg-white/10">+5</button>
                </div>

                <input
                  aria-label="BPM slider"
                  type="range"
                  min={bpms.min}
                  max={bpms.max}
                  value={bpm}
                  onChange={(event) => setDirectBpm(Number(event.target.value))}
                  className="mt-8 w-full accent-amber-300"
                />

                <button
                  onClick={togglePlay}
                  className={`mt-8 w-full rounded-[1.7rem] py-5 text-2xl font-black tracking-[0.18em] shadow-2xl transition active:scale-[0.98] ${
                    isPlaying
                      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-red-950/40 hover:brightness-110"
                      : "bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-400 text-slate-950 shadow-amber-950/30 hover:brightness-110"
                  }`}
                >
                  {isPlaying ? "STOP" : "START"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Beat Visualizer</h2>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">Accent on 1</span>
              </div>
              <div className="mt-5 flex justify-center gap-3">
                {Array.from({ length: selectedSignature.beats }).map((_, index) => {
                  const active = isPlaying && beatIndex === index;
                  const accent = index === 0;
                  return (
                    <div
                      key={index}
                      className={`flex h-14 w-14 items-center justify-center rounded-full border text-lg font-bold transition sm:h-16 sm:w-16 ${
                        active
                          ? accent
                            ? "scale-110 border-amber-100 bg-amber-300 text-slate-950 shadow-[0_0_30px_rgba(252,211,77,0.45)]"
                            : "scale-105 border-cyan-100 bg-cyan-200 text-slate-950 shadow-[0_0_24px_rgba(165,243,252,0.3)]"
                          : accent
                            ? "border-amber-300/50 bg-amber-300/10 text-amber-200"
                            : "border-white/20 bg-white/5 text-slate-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">
              <h2 className="text-lg font-semibold">Time Signature</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {timeSignatures.map((signature) => (
                  <button
                    key={signature.label}
                    onClick={() => {
                      setSelectedSignature(signature);
                      currentBeatRef.current = 0;
                      setBeatIndex(0);
                    }}
                    className={`rounded-2xl border px-3 py-4 text-left transition ${
                      selectedSignature.label === signature.label
                        ? "border-amber-200 bg-amber-300 text-slate-950"
                        : "border-white/10 bg-black/20 text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    <span className="block text-xl font-black">{signature.label}</span>
                    <span className="mt-1 block text-xs opacity-70">{signature.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl backdrop-blur-xl">
              <h2 className="text-lg font-semibold">Sound & Volume</h2>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { id: "wood", label: "Wood" },
                  { id: "click", label: "Click" },
                  { id: "soft", label: "Soft" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSoundType(item.id as "wood" | "click" | "soft")}
                    className={`rounded-2xl px-3 py-3 font-semibold transition ${
                      soundType === item.id
                        ? "bg-amber-300 text-slate-950"
                        : "bg-black/20 text-slate-200 hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="mt-5">
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  aria-label="Volume slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="mt-3 w-full accent-amber-300"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-5 text-sm leading-7 text-amber-50 shadow-2xl backdrop-blur-xl">
              <p className="font-semibold text-amber-200">URL版について</p>
              <p className="mt-2">
                このWeb版は、テスター・関係者がすぐに体験できるデモ版です。正式なApp Store版では、より安定した音声再生と本番利用向けの調整を行います。
              </p>
            </div>
          </div>
        </section>

        <footer className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] py-4 text-center text-xs text-slate-500 backdrop-blur">
          Orchestra Metronome Web App / HitoriBIZ by Olive Co., Ltd.
        </footer>
      </div>
    </main>
  );
}
