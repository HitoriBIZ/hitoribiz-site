"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// ============================================================
// Orchestra Drone Tone / ドローン・トーン
// Next.js App Router: app/drone-tone/page.tsx
// ============================================================
// このページは、Orchestra Tuner とは独立した Drone Tone 専用UIです。
// スマホのホーム画面に別アイコンで追加する想定です。
//
// 推奨配置:
//   app/drone-tone/page.tsx
//
// PWA化する場合は、別途 public/drone-tone.webmanifest と
// app/drone-tone/head.tsx または metadata 設定で manifest を読み込ませます。
// ============================================================

type InstrumentKey = "violin" | "viola" | "cello" | "bass";

type DroneNote = {
  stringName: string;
  label: string;
  frequency: number;
  description?: string;
  lowBoost?: boolean;
};

type InstrumentConfig = {
  key: InstrumentKey;
  name: string;
  shortName: string;
  subtitle: string;
  notes: DroneNote[];
};

const INSTRUMENTS: InstrumentConfig[] = [
  {
    key: "violin",
    name: "Violin",
    shortName: "Vn",
    subtitle: "G / D / A / E",
    notes: [
      { stringName: "G", label: "G3", frequency: 196.0 },
      { stringName: "D", label: "D4", frequency: 293.66 },
      { stringName: "A", label: "A4", frequency: 440.0 },
      { stringName: "E", label: "E5", frequency: 659.25 },
    ],
  },
  {
    key: "viola",
    name: "Viola",
    shortName: "Va",
    subtitle: "C / G / D / A",
    notes: [
      { stringName: "C", label: "C3", frequency: 130.81 },
      { stringName: "G", label: "G3", frequency: 196.0 },
      { stringName: "D", label: "D4", frequency: 293.66 },
      { stringName: "A", label: "A4", frequency: 440.0 },
    ],
  },
  {
    key: "cello",
    name: "Cello",
    shortName: "Vc",
    subtitle: "C / G / D / A",
    notes: [
      {
        stringName: "C",
        label: "C2",
        frequency: 65.41,
        description: "Low boost",
        lowBoost: true,
      },
      {
        stringName: "G",
        label: "G2",
        frequency: 98.0,
        description: "Low boost",
        lowBoost: true,
      },
      { stringName: "D", label: "D3", frequency: 146.83, lowBoost: true },
      { stringName: "A", label: "A3", frequency: 220.0 },
    ],
  },
  {
    key: "bass",
    name: "Double Bass",
    shortName: "Cb",
    subtitle: "E / A / D / G",
    notes: [
      {
        stringName: "E",
        label: "E1",
        frequency: 41.2,
        description: "Low boost",
        lowBoost: true,
      },
      {
        stringName: "A",
        label: "A1",
        frequency: 55.0,
        description: "Low boost",
        lowBoost: true,
      },
      {
        stringName: "D",
        label: "D2",
        frequency: 73.42,
        description: "Low boost",
        lowBoost: true,
      },
      {
        stringName: "G",
        label: "G2",
        frequency: 98.0,
        description: "Low boost",
        lowBoost: true,
      },
    ],
  },
];

const A_REFERENCE_OPTIONS = [
  { label: "A = 440Hz", value: 440 },
  { label: "A = 441Hz", value: 441 },
  { label: "A = 442Hz", value: 442 },
  { label: "A = 443Hz", value: 443 },
];

function frequencyFromA4(baseFrequency: number, a4: number) {
  return baseFrequency * (a4 / 440);
}

function formatFrequency(frequency: number) {
  if (frequency >= 100) return frequency.toFixed(2);
  return frequency.toFixed(2);
}

export default function DroneTonePage() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const oscillatorRefs = useRef<OscillatorNode[]>([]);
  const oscillatorGainRefs = useRef<GainNode[]>([]);
  const stopTimerRef = useRef<number | null>(null);

  const [selectedInstrument, setSelectedInstrument] =
    useState<InstrumentKey>("violin");
  const [selectedA4, setSelectedA4] = useState(440);
  const [volume, setVolume] = useState(0.22);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNote, setActiveNote] = useState<DroneNote | null>(null);
  const [audioReadyMessage, setAudioReadyMessage] = useState(
    "音を選ぶとDrone Toneが始まります。"
  );

  const currentInstrument = useMemo(() => {
    return (
      INSTRUMENTS.find((instrument) => instrument.key === selectedInstrument) ??
      INSTRUMENTS[0]
    );
  }, [selectedInstrument]);

  const adjustedActiveFrequency = useMemo(() => {
    if (!activeNote) return null;
    return frequencyFromA4(activeNote.frequency, selectedA4);
  }, [activeNote, selectedA4]);

  const stopDroneTone = () => {
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }

    const audioCtx = audioCtxRef.current;
    const masterGain = masterGainRef.current;

    if (audioCtx && masterGain) {
      const now = audioCtx.currentTime;

      try {
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setValueAtTime(
          Math.max(masterGain.gain.value, 0.0001),
          now
        );
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      } catch {
        // do nothing
      }

      stopTimerRef.current = window.setTimeout(() => {
        try {
          oscillatorRefs.current.forEach((oscillator) => oscillator.stop());
        } catch {
          // do nothing
        }

        try {
          oscillatorRefs.current.forEach((oscillator) => oscillator.disconnect());
          oscillatorGainRefs.current.forEach((gain) => gain.disconnect());
          masterGain.disconnect();
        } catch {
          // do nothing
        }

        try {
          audioCtx.close();
        } catch {
          // do nothing
        }

        oscillatorRefs.current = [];
        oscillatorGainRefs.current = [];
        masterGainRef.current = null;
        audioCtxRef.current = null;
        stopTimerRef.current = null;
      }, 260);
    }

    setIsPlaying(false);
    setActiveNote(null);
    setAudioReadyMessage("Drone Toneを停止しました。");
  };

  const startDroneTone = async (note: DroneNote) => {
    stopDroneTone();

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextClass) {
        setAudioReadyMessage(
          "このブラウザではWeb Audio APIを利用できません。"
        );
        return;
      }

      const audioCtx = new AudioContextClass();
      await audioCtx.resume();

      const adjustedFrequency = frequencyFromA4(note.frequency, selectedA4);
      const masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(
        Math.max(volume, 0.01),
        audioCtx.currentTime + 0.28
      );

      const oscillators: OscillatorNode[] = [];
      const oscillatorGains: GainNode[] = [];

      // Core sine wave: 純音に近い中心音
      const sineOsc = audioCtx.createOscillator();
      const sineGain = audioCtx.createGain();
      sineOsc.type = "sine";
      sineOsc.frequency.setValueAtTime(adjustedFrequency, audioCtx.currentTime);
      sineGain.gain.setValueAtTime(0.78, audioCtx.currentTime);
      sineOsc.connect(sineGain);
      sineGain.connect(masterGain);
      oscillators.push(sineOsc);
      oscillatorGains.push(sineGain);

      // Soft triangle wave: スマホでも聴き取りやすい少し柔らかい倍音
      const triangleOsc = audioCtx.createOscillator();
      const triangleGain = audioCtx.createGain();
      triangleOsc.type = "triangle";
      triangleOsc.frequency.setValueAtTime(
        adjustedFrequency,
        audioCtx.currentTime
      );
      triangleGain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      triangleOsc.connect(triangleGain);
      triangleGain.connect(masterGain);
      oscillators.push(triangleOsc);
      oscillatorGains.push(triangleGain);

      // Low boost: Cello / Double Bass の低音はスマホで聞こえにくいため、
      // 1オクターブ上の成分を少しだけ足します。
      if (note.lowBoost) {
        const octaveOsc = audioCtx.createOscillator();
        const octaveGain = audioCtx.createGain();
        octaveOsc.type = "sine";
        octaveOsc.frequency.setValueAtTime(
          adjustedFrequency * 2,
          audioCtx.currentTime
        );
        octaveGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        octaveOsc.connect(octaveGain);
        octaveGain.connect(masterGain);
        oscillators.push(octaveOsc);
        oscillatorGains.push(octaveGain);
      }

      masterGain.connect(audioCtx.destination);
      oscillators.forEach((oscillator) => oscillator.start());

      audioCtxRef.current = audioCtx;
      masterGainRef.current = masterGain;
      oscillatorRefs.current = oscillators;
      oscillatorGainRefs.current = oscillatorGains;

      setIsPlaying(true);
      setActiveNote(note);
      setAudioReadyMessage(`${note.label} を再生中です。`);
    } catch (error) {
      console.error(error);
      setIsPlaying(false);
      setActiveNote(null);
      setAudioReadyMessage(
        "音を開始できませんでした。ブラウザの音声許可をご確認ください。"
      );
    }
  };

  const handleToggleNote = (note: DroneNote) => {
    if (isPlaying && activeNote?.label === note.label) {
      stopDroneTone();
      return;
    }
    startDroneTone(note);
  };

  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      try {
        masterGainRef.current.gain.cancelScheduledValues(now);
        masterGainRef.current.gain.setTargetAtTime(volume, now, 0.04);
      } catch {
        // do nothing
      }
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying && activeNote) {
      startDroneTone(activeNote);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedA4]);

  useEffect(() => {
    return () => {
      stopDroneTone();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#1e293b_0,#020617_42%,#020617_100%)] px-4 py-5 text-slate-100 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-md flex-col">
        <header className="mb-5 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
                Orchestra Practice Tool
              </p>
              <h1 className="text-3xl font-black tracking-tight text-white">
                Drone Tone
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                鳴り続ける基準音に合わせて、耳で音程と響きを整えるための練習ツールです。
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-300 text-2xl font-black text-slate-950 shadow-lg shadow-cyan-500/20">
              D
            </div>
          </div>
        </header>

        <section className="mb-4 rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-4 shadow-xl shadow-black/20">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Instrument</h2>
              <p className="text-xs text-slate-400">楽器を選択してください</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {INSTRUMENTS.map((instrument) => {
              const selected = selectedInstrument === instrument.key;
              return (
                <button
                  key={instrument.key}
                  type="button"
                  onClick={() => {
                    setSelectedInstrument(instrument.key);
                    if (isPlaying) stopDroneTone();
                  }}
                  className={`rounded-2xl border px-2 py-3 text-center transition active:scale-[0.98] ${
                    selected
                      ? "border-cyan-300 bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/20"
                      : "border-white/10 bg-white/[0.05] text-slate-200 hover:bg-white/[0.09]"
                  }`}
                >
                  <div className="text-base font-black">{instrument.shortName}</div>
                  <div className="mt-1 text-[10px] font-semibold opacity-75">
                    {instrument.name}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-4 rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-4 shadow-xl shadow-black/20">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white">
                {currentInstrument.name} Drone Notes
              </h2>
              <p className="text-xs text-slate-400">
                {currentInstrument.subtitle}
              </p>
            </div>

            {isPlaying && (
              <button
                type="button"
                onClick={stopDroneTone}
                className="rounded-full bg-rose-500 px-4 py-2 text-xs font-black text-white shadow-lg shadow-rose-500/20 transition active:scale-95"
              >
                Stop
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {currentInstrument.notes.map((note) => {
              const selected = isPlaying && activeNote?.label === note.label;
              const adjustedFrequency = frequencyFromA4(
                note.frequency,
                selectedA4
              );

              return (
                <button
                  key={`${currentInstrument.key}-${note.label}`}
                  type="button"
                  onClick={() => handleToggleNote(note)}
                  className={`min-h-28 rounded-3xl border px-2 py-4 text-center transition active:scale-[0.98] ${
                    selected
                      ? "border-emerald-300 bg-emerald-300 text-slate-950 shadow-xl shadow-emerald-500/20"
                      : "border-white/10 bg-white/[0.05] text-slate-100 hover:bg-white/[0.09]"
                  }`}
                >
                  <div className="text-3xl font-black leading-none">
                    {note.stringName}
                  </div>
                  <div className="mt-2 text-sm font-extrabold">{note.label}</div>
                  <div className="mt-1 text-[10px] font-semibold opacity-70">
                    {formatFrequency(adjustedFrequency)} Hz
                  </div>
                  {note.description && (
                    <div className="mt-1 text-[9px] font-bold uppercase tracking-wide opacity-60">
                      {note.description}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-4 rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-4 shadow-xl shadow-black/20">
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-xs font-bold text-slate-300">
                A Reference
              </label>
              <select
                value={selectedA4}
                onChange={(event) => setSelectedA4(Number(event.target.value))}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-sm font-bold text-white outline-none focus:border-cyan-300"
              >
                {A_REFERENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-300">
                Status
              </label>
              <div
                className={`flex h-[46px] items-center justify-center rounded-2xl border px-3 text-center text-xs font-black ${
                  isPlaying
                    ? "border-emerald-300/50 bg-emerald-300/15 text-emerald-200"
                    : "border-white/10 bg-white/[0.04] text-slate-400"
                }`}
              >
                {isPlaying ? "Playing" : "Stopped"}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Volume</label>
              <span className="text-xs font-bold text-slate-400">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.6"
              step="0.01"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              className="h-2 w-full cursor-pointer accent-cyan-300"
            />
          </div>
        </section>

        <section className="mb-4 rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${
                isPlaying
                  ? "bg-emerald-300 text-slate-950"
                  : "bg-slate-800 text-slate-300"
              }`}
            >
              {activeNote?.stringName ?? "♪"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">{audioReadyMessage}</p>
              <p className="mt-1 text-xs text-slate-400">
                {activeNote && adjustedActiveFrequency
                  ? `${activeNote.label} / ${formatFrequency(
                      adjustedActiveFrequency
                    )} Hz / A=${selectedA4}Hz`
                  : "音を選択すると、基準音が鳴り続けます。"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-auto rounded-[1.75rem] border border-cyan-300/15 bg-cyan-300/[0.08] p-4">
          <h2 className="text-sm font-black text-cyan-100">Practice Note</h2>
          <p className="mt-2 text-xs leading-6 text-cyan-50/80">
            Drone Tone使用時は、スマホのスピーカー音をマイクが拾う場合があります。
            チューナーと併用する場合や細かい音程確認では、イヤホンの使用をおすすめします。
          </p>
          <p className="mt-3 text-[11px] leading-5 text-slate-400">
            HitoriBIZ by Olive Co., Ltd. / Orchestra Practice Tools
          </p>
        </section>
      </div>
    </main>
  );
}
