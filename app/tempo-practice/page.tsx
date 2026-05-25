"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type TempoPreset = {
  label: string;
  description: string;
  startBpm: number;
  targetBpm: number;
  stepBpm: number;
  barsPerStep: number;
  beatsPerBar: number;
};

const PRESETS: TempoPreset[] = [
  {
    label: "Careful Warm-up",
    description: "ゆっくり確認しながら、安定したテンポ感を作る練習",
    startBpm: 60,
    targetBpm: 84,
    stepBpm: 4,
    barsPerStep: 4,
    beatsPerBar: 4,
  },
  {
    label: "Orchestra Section Practice",
    description: "合奏前のパート練習に適した、無理のないテンポアップ",
    startBpm: 72,
    targetBpm: 108,
    stepBpm: 4,
    barsPerStep: 4,
    beatsPerBar: 4,
  },
  {
    label: "Difficult Passage Builder",
    description: "難所を少しずつ目標テンポへ近づける集中練習",
    startBpm: 50,
    targetBpm: 120,
    stepBpm: 5,
    barsPerStep: 2,
    beatsPerBar: 4,
  },
  {
    label: "Waltz / 3 Beats",
    description: "ワルツや3拍子の曲で、1拍目を意識する練習",
    startBpm: 60,
    targetBpm: 96,
    stepBpm: 3,
    barsPerStep: 4,
    beatsPerBar: 3,
  },
];

const TEMPO_MARKS = [
  { name: "Largo", range: "40–60" },
  { name: "Adagio", range: "66–76" },
  { name: "Andante", range: "76–108" },
  { name: "Moderato", range: "108–120" },
  { name: "Allegro", range: "120–156" },
  { name: "Vivace", range: "156–176" },
  { name: "Presto", range: "168–200" },
];

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function TempoPracticePage() {
  const [startBpm, setStartBpm] = useState(60);
  const [targetBpm, setTargetBpm] = useState(120);
  const [currentBpm, setCurrentBpm] = useState(60);
  const [stepBpm, setStepBpm] = useState(4);
  const [barsPerStep, setBarsPerStep] = useState(4);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [accentFirstBeat, setAccentFirstBeat] = useState(true);
  const [subdivision, setSubdivision] = useState<1 | 2 | 3 | 4>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const [barCount, setBarCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const [statusMessage, setStatusMessage] = useState("Ready");

  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const elapsedTimerRef = useRef<number | null>(null);

  const beatCountRef = useRef(0);
  const barCountRef = useRef(0);
  const currentBpmRef = useRef(currentBpm);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    currentBpmRef.current = currentBpm;
  }, [currentBpm]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      stopPractice();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const estimatedMinutes = useMemo(() => {
    if (targetBpm <= startBpm || stepBpm <= 0 || barsPerStep <= 0) {
      return 0;
    }

    let bpm = startBpm;
    let totalSeconds = 0;

    while (bpm < targetBpm) {
      const secondsPerBeat = 60 / bpm;
      totalSeconds += secondsPerBeat * beatsPerBar * barsPerStep;
      bpm += stepBpm;
    }

    return Math.max(1, Math.round(totalSeconds / 60));
  }, [startBpm, targetBpm, stepBpm, barsPerStep, beatsPerBar]);

  const progressPercent = useMemo(() => {
    if (targetBpm <= startBpm) return 100;
    return clampNumber(
      ((currentBpm - startBpm) / (targetBpm - startBpm)) * 100,
      0,
      100
    );
  }, [currentBpm, startBpm, targetBpm]);

  function getAudioContext() {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }
    return audioContextRef.current;
  }

  function playClick(isAccent: boolean, isSubdivision = false) {
    const audioContext = getAudioContext();
    const now = audioContext.currentTime;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";

    if (isSubdivision) {
      oscillator.frequency.setValueAtTime(760, now);
      gain.gain.setValueAtTime(0.08, now);
    } else if (isAccent) {
      oscillator.frequency.setValueAtTime(1320, now);
      gain.gain.setValueAtTime(0.22, now);
    } else {
      oscillator.frequency.setValueAtTime(980, now);
      gain.gain.setValueAtTime(0.14, now);
    }

    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.06);
  }

  function scheduleNextBeat() {
    const bpm = currentBpmRef.current;
    const beatIntervalMs = (60 / bpm) * 1000;
    const subdivisionIntervalMs = beatIntervalMs / subdivision;

    for (let i = 1; i < subdivision; i++) {
      window.setTimeout(() => {
        if (isPlayingRef.current) {
          playClick(false, true);
        }
      }, subdivisionIntervalMs * i);
    }

    timerRef.current = window.setTimeout(() => {
      if (!isPlayingRef.current) return;

      const nextBeat = beatCountRef.current + 1;
      const beatInBar = ((nextBeat - 1) % beatsPerBar) + 1;
      const isFirstBeat = beatInBar === 1;

      playClick(accentFirstBeat && isFirstBeat);

      beatCountRef.current = nextBeat;
      setBeatCount(nextBeat);

      if (isFirstBeat && nextBeat > 1) {
        const nextBar = barCountRef.current + 1;
        barCountRef.current = nextBar;
        setBarCount(nextBar);

        if (nextBar > 0 && nextBar % barsPerStep === 0) {
          const nextBpm = Math.min(currentBpmRef.current + stepBpm, targetBpm);

          if (nextBpm > currentBpmRef.current) {
            currentBpmRef.current = nextBpm;
            setCurrentBpm(nextBpm);
            setStatusMessage(`Tempo Up: ${nextBpm} BPM`);
          }

          if (nextBpm >= targetBpm) {
            setStatusMessage("Target tempo reached");
          }
        }
      }

      scheduleNextBeat();
    }, beatIntervalMs);
  }

  async function startPractice() {
    if (isPlaying) return;

    const normalizedStart = clampNumber(startBpm, 30, 240);
    const normalizedTarget = clampNumber(targetBpm, normalizedStart, 260);

    setStartBpm(normalizedStart);
    setTargetBpm(normalizedTarget);
    setCurrentBpm(normalizedStart);
    currentBpmRef.current = normalizedStart;

    setBeatCount(0);
    setBarCount(0);
    setElapsedSeconds(0);
    beatCountRef.current = 0;
    barCountRef.current = 0;

    const audioContext = getAudioContext();
    if (audioContext.state === "suspended") {
      await audioContext.resume();
    }

    setIsPlaying(true);
    isPlayingRef.current = true;
    setStatusMessage("Practice started");

    playClick(true);

    elapsedTimerRef.current = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1);
    }, 1000);

    scheduleNextBeat();
  }

  function stopPractice() {
    setIsPlaying(false);
    isPlayingRef.current = false;
    setStatusMessage("Stopped");

    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (elapsedTimerRef.current) {
      window.clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }
  }

  function resetPractice() {
    stopPractice();
    setCurrentBpm(startBpm);
    currentBpmRef.current = startBpm;
    setBeatCount(0);
    setBarCount(0);
    setElapsedSeconds(0);
    beatCountRef.current = 0;
    barCountRef.current = 0;
    setStatusMessage("Ready");
  }

  function applyPreset(preset: TempoPreset) {
    stopPractice();
    setStartBpm(preset.startBpm);
    setTargetBpm(preset.targetBpm);
    setCurrentBpm(preset.startBpm);
    setStepBpm(preset.stepBpm);
    setBarsPerStep(preset.barsPerStep);
    setBeatsPerBar(preset.beatsPerBar);
    setBeatCount(0);
    setBarCount(0);
    setElapsedSeconds(0);
    beatCountRef.current = 0;
    barCountRef.current = 0;
    currentBpmRef.current = preset.startBpm;
    setStatusMessage(`Preset: ${preset.label}`);
  }

  function handleTapTempo() {
    const now = Date.now();
    const recentTaps = [...tapTimes.filter((time) => now - time < 3000), now];
    setTapTimes(recentTaps);

    if (recentTaps.length >= 2) {
      const intervals = recentTaps
        .slice(1)
        .map((time, index) => time - recentTaps[index]);

      const averageInterval =
        intervals.reduce((sum, interval) => sum + interval, 0) /
        intervals.length;

      const calculatedBpm = Math.round(60000 / averageInterval);
      const safeBpm = clampNumber(calculatedBpm, 30, 260);

      setStartBpm(safeBpm);
      setCurrentBpm(safeBpm);
      currentBpmRef.current = safeBpm;

      if (targetBpm < safeBpm) {
        setTargetBpm(safeBpm);
      }

      setStatusMessage(`Tap Tempo: ${safeBpm} BPM`);
    }
  }

  const currentBeatInBar = beatCount === 0 ? 1 : ((beatCount - 1) % beatsPerBar) + 1;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8">
        <header className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-6 shadow-2xl shadow-cyan-950/40">
          <p className="mb-2 text-sm font-semibold tracking-[0.3em] text-cyan-300">
            ORCHESTRA TOOLS
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Tempo Practice
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                難しいパッセージを、ゆっくりから始めて少しずつテンポアップ。
                オーケストラ練習・パート練習・個人練習に使えるテンポ育成ツールです。
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right">
              <p className="text-sm text-slate-400">Current Tempo</p>
              <p className="text-5xl font-bold text-cyan-300">{currentBpm}</p>
              <p className="text-sm text-slate-400">BPM</p>
            </div>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Practice Control</h2>
                <p className="text-sm text-slate-400">
                  Start BPM から Target BPM まで自動でテンポアップします。
                </p>
              </div>

              <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200">
                {statusMessage}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">
                  Start BPM
                </span>
                <input
                  type="number"
                  min={30}
                  max={240}
                  value={startBpm}
                  disabled={isPlaying}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setStartBpm(value);
                    setCurrentBpm(value);
                    currentBpmRef.current = value;
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-lg outline-none ring-cyan-400/30 focus:ring-4 disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">
                  Target BPM
                </span>
                <input
                  type="number"
                  min={30}
                  max={260}
                  value={targetBpm}
                  disabled={isPlaying}
                  onChange={(e) => setTargetBpm(Number(e.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-lg outline-none ring-cyan-400/30 focus:ring-4 disabled:opacity-60"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">
                  Tempo Up Step
                </span>
                <select
                  value={stepBpm}
                  disabled={isPlaying}
                  onChange={(e) => setStepBpm(Number(e.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-lg outline-none ring-cyan-400/30 focus:ring-4 disabled:opacity-60"
                >
                  <option value={1}>+1 BPM</option>
                  <option value={2}>+2 BPM</option>
                  <option value={3}>+3 BPM</option>
                  <option value={4}>+4 BPM</option>
                  <option value={5}>+5 BPM</option>
                  <option value={8}>+8 BPM</option>
                  <option value={10}>+10 BPM</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">
                  Bars Before Tempo Up
                </span>
                <select
                  value={barsPerStep}
                  disabled={isPlaying}
                  onChange={(e) => setBarsPerStep(Number(e.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-lg outline-none ring-cyan-400/30 focus:ring-4 disabled:opacity-60"
                >
                  <option value={1}>1 bar</option>
                  <option value={2}>2 bars</option>
                  <option value={4}>4 bars</option>
                  <option value={8}>8 bars</option>
                  <option value={16}>16 bars</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">
                  Beats Per Bar
                </span>
                <select
                  value={beatsPerBar}
                  disabled={isPlaying}
                  onChange={(e) => setBeatsPerBar(Number(e.target.value))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-lg outline-none ring-cyan-400/30 focus:ring-4 disabled:opacity-60"
                >
                  <option value={2}>2 / 4</option>
                  <option value={3}>3 / 4</option>
                  <option value={4}>4 / 4</option>
                  <option value={5}>5 beats</option>
                  <option value={6}>6 / 8 feel</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-300">
                  Subdivision
                </span>
                <select
                  value={subdivision}
                  disabled={isPlaying}
                  onChange={(e) =>
                    setSubdivision(Number(e.target.value) as 1 | 2 | 3 | 4)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-lg outline-none ring-cyan-400/30 focus:ring-4 disabled:opacity-60"
                >
                  <option value={1}>Quarter note only</option>
                  <option value={2}>8th notes</option>
                  <option value={3}>Triplets</option>
                  <option value={4}>16th notes</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <input
                id="accent"
                type="checkbox"
                checked={accentFirstBeat}
                disabled={isPlaying}
                onChange={(e) => setAccentFirstBeat(e.target.checked)}
                className="h-5 w-5"
              />
              <label htmlFor="accent" className="text-sm text-slate-300">
                Accent first beat of each bar
              </label>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <button
                onClick={startPractice}
                disabled={isPlaying}
                className="rounded-2xl bg-cyan-400 px-5 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-cyan-950/40 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Start Practice
              </button>

              <button
                onClick={stopPractice}
                disabled={!isPlaying}
                className="rounded-2xl bg-rose-500 px-5 py-4 text-lg font-bold text-white shadow-lg shadow-rose-950/40 transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Stop
              </button>

              <button
                onClick={resetPractice}
                className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-lg font-bold text-white transition hover:bg-white/15"
              >
                Reset
              </button>
            </div>

            <button
              onClick={handleTapTempo}
              disabled={isPlaying}
              className="mt-4 w-full rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-4 text-lg font-bold text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Tap Tempo
            </button>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
            <h2 className="text-2xl font-bold">Live Practice View</h2>
            <p className="mt-1 text-sm text-slate-400">
              現在の拍・小節・進行状況を確認できます。
            </p>

            <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">
                Beat
              </p>
              <p className="mt-2 text-7xl font-black text-cyan-300">
                {currentBeatInBar}
              </p>
              <p className="mt-2 text-slate-400">/ {beatsPerBar}</p>

              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: beatsPerBar }).map((_, index) => {
                  const active = index + 1 === currentBeatInBar;
                  return (
                    <div
                      key={index}
                      className={`h-4 w-4 rounded-full ${
                        active ? "bg-cyan-300" : "bg-slate-700"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Bars</p>
                <p className="text-3xl font-bold">{barCount}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Elapsed</p>
                <p className="text-3xl font-bold">
                  {formatTime(elapsedSeconds)}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex justify-between text-sm text-slate-400">
                <span>Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-300 transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Estimated practice time: about {estimatedMinutes} min
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
            <h2 className="text-2xl font-bold">Practice Presets</h2>
            <p className="mt-1 text-sm text-slate-400">
              練習内容に合わせて、すぐに設定を切り替えられます。
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  disabled={isPlaying}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-400/40 hover:bg-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <p className="text-lg font-bold text-cyan-200">
                    {preset.label}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {preset.description}
                  </p>
                  <p className="mt-3 text-sm text-slate-300">
                    {preset.startBpm} → {preset.targetBpm} BPM / +
                    {preset.stepBpm} BPM
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
            <h2 className="text-2xl font-bold">Tempo Marks</h2>
            <p className="mt-1 text-sm text-slate-400">
              クラシック曲でよく使われる速度記号の目安です。
            </p>

            <div className="mt-5 space-y-2">
              {TEMPO_MARKS.map((mark) => (
                <div
                  key={mark.name}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="font-semibold text-slate-100">
                    {mark.name}
                  </span>
                  <span className="text-sm text-cyan-200">
                    {mark.range} BPM
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-xl">
          <h2 className="text-2xl font-bold">How to Use</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-lg font-bold text-cyan-200">1. Start slow</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                まずは弾けるテンポから開始します。音程・弓・指の動きを確認します。
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-lg font-bold text-cyan-200">
                2. Build gradually
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                指定小節ごとに自動でテンポアップします。無理なく目標に近づけます。
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-lg font-bold text-cyan-200">
                3. Reach target
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                目標テンポに到達したら、同じテンポで安定して弾けるか確認します。
              </p>
            </div>
          </div>
        </section>

        <footer className="pb-8 text-center text-sm text-slate-500">
          Tempo Practice | Orchestra Tools | HitoriBIZ by Olive Co., Ltd.
        </footer>
      </section>
    </main>
  );
}