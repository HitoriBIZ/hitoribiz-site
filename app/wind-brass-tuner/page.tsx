"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type TunerStatus = "idle" | "listening" | "error";
type TranspositionId = "concert" | "bb" | "eb" | "f";

type PitchResult = {
  frequency: number;
  clarity: number;
  rms: number;
  harmonic: number;
};

type DroneNode = {
  oscillator: OscillatorNode;
  gain: GainNode;
  harmonic: number;
};

type TranspositionPreset = {
  id: TranspositionId;
  label: string;
  shortLabel: string;
  concertOffset: number;
  description: string;
};

type TargetNote = {
  label: string;
  midi: number;
};

const NOTE_NAMES_FLAT = [
  "C",
  "D♭",
  "D",
  "E♭",
  "E",
  "F",
  "G♭",
  "G",
  "A♭",
  "A",
  "B♭",
  "B",
];

const TRANSPOSITIONS: TranspositionPreset[] = [
  {
    id: "concert",
    label: "Concert Pitch",
    shortLabel: "Concert",
    concertOffset: 0,
    description: "実際に鳴っている音をそのまま表示します",
  },
  {
    id: "bb",
    label: "B♭ Instrument",
    shortLabel: "B♭",
    concertOffset: -2,
    description: "記譜Cを吹くと実音B♭が鳴る楽器用",
  },
  {
    id: "eb",
    label: "E♭ Instrument",
    shortLabel: "E♭",
    concertOffset: -9,
    description: "記譜Cを吹くと実音E♭が鳴る楽器用",
  },
  {
    id: "f",
    label: "F Instrument",
    shortLabel: "F",
    concertOffset: -7,
    description: "記譜Cを吹くと実音Fが鳴る楽器用",
  },
];

const TARGET_NOTES: TargetNote[] = [
  { label: "A4", midi: 69 },
  { label: "B♭4", midi: 70 },
  { label: "C5", midi: 72 },
  { label: "D5", midi: 74 },
  { label: "E♭5", midi: 75 },
  { label: "F5", midi: 77 },
  { label: "G5", midi: 79 },
];

const A4_OPTIONS = [440, 441, 442, 443, 444];
const PITCH_UPDATE_INTERVAL_MS = 180;
const HISTORY_SIZE = 7;
const SILENCE_RESET_MS = 1200;
const MINIMUM_RMS = 0.004;
const MINIMUM_CLARITY = 0.2;
const TARGET_RANGE_CENTS = 650;
const MAX_HARMONIC_FREQUENCY = 3200;

function midiToFrequency(midi: number, a4: number) {
  return a4 * Math.pow(2, (midi - 69) / 12);
}

function getOctave(midi: number) {
  return Math.floor(midi / 12) - 1;
}

function getNoteLabel(midi: number) {
  const noteIndex = ((midi % 12) + 12) % 12;
  return `${NOTE_NAMES_FLAT[noteIndex]}${getOctave(midi)}`;
}

function median(values: number[]) {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 1
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
}

function calculateRms(buffer: Float32Array) {
  let sum = 0;

  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }

  return Math.sqrt(sum / buffer.length);
}

function getCorrelationAtOffset(buffer: Float32Array, offset: number) {
  let sum = 0;
  let sumA = 0;
  let sumB = 0;
  const limit = buffer.length - offset;

  for (let i = 0; i < limit; i++) {
    const a = buffer[i];
    const b = buffer[i + offset];

    sum += a * b;
    sumA += a * a;
    sumB += b * b;
  }

  const denominator = Math.sqrt(sumA * sumB);

  return denominator === 0 ? 0 : sum / denominator;
}

function detectNearFrequency(
  buffer: Float32Array,
  sampleRate: number,
  centerFrequency: number,
  rangeCents: number
) {
  const lowFrequency = centerFrequency * Math.pow(2, -rangeCents / 1200);
  const highFrequency = centerFrequency * Math.pow(2, rangeCents / 1200);
  const minOffset = Math.max(2, Math.floor(sampleRate / highFrequency));
  const maxOffset = Math.min(buffer.length - 2, Math.ceil(sampleRate / lowFrequency));

  let bestOffset = -1;
  let bestCorrelation = -1;

  for (let offset = minOffset; offset <= maxOffset; offset++) {
    const correlation = getCorrelationAtOffset(buffer, offset);

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  if (bestOffset <= 0 || bestCorrelation < MINIMUM_CLARITY) {
    return null;
  }

  const previousOffset = Math.max(minOffset, bestOffset - 1);
  const nextOffset = Math.min(maxOffset, bestOffset + 1);
  const previous = getCorrelationAtOffset(buffer, previousOffset);
  const current = getCorrelationAtOffset(buffer, bestOffset);
  const next = getCorrelationAtOffset(buffer, nextOffset);
  const divisor = previous - 2 * current + next;
  const shift = divisor === 0 ? 0 : (0.5 * (previous - next)) / divisor;
  const refinedOffset = bestOffset + Math.max(-0.5, Math.min(0.5, shift));
  const frequency = sampleRate / refinedOffset;

  if (frequency < lowFrequency || frequency > highFrequency) {
    return null;
  }

  return {
    frequency,
    clarity: bestCorrelation,
  };
}

function detectWindPitch(
  buffer: Float32Array,
  sampleRate: number,
  targetFrequency: number
): PitchResult | null {
  const rms = calculateRms(buffer);

  if (rms < MINIMUM_RMS) return null;

  let best: PitchResult | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let harmonic = 1; harmonic <= 5; harmonic++) {
    const harmonicFrequency = targetFrequency * harmonic;

    if (harmonicFrequency > MAX_HARMONIC_FREQUENCY) continue;

    const detected = detectNearFrequency(
      buffer,
      sampleRate,
      harmonicFrequency,
      harmonic === 1 ? TARGET_RANGE_CENTS : TARGET_RANGE_CENTS + 120
    );

    if (!detected) continue;

    const fundamentalFrequency = detected.frequency / harmonic;
    const centsFromTarget = 1200 * Math.log2(fundamentalFrequency / targetFrequency);

    if (Math.abs(centsFromTarget) > TARGET_RANGE_CENTS + 80) continue;

    const harmonicWeight =
      harmonic === 1 ? 1 : harmonic === 2 ? 0.9 : harmonic === 3 ? 0.84 : 0.76;
    const score = detected.clarity * harmonicWeight - Math.abs(centsFromTarget) / 900;

    if (score > bestScore) {
      bestScore = score;
      best = {
        frequency: fundamentalFrequency,
        clarity: detected.clarity,
        rms,
        harmonic,
      };
    }
  }

  return best;
}

function getReferenceToneSettings(frequency: number) {
  if (frequency < 220) {
    return [
      { harmonic: 1, gain: 0.08 },
      { harmonic: 2, gain: 0.045 },
      { harmonic: 3, gain: 0.02 },
    ];
  }

  return [
    { harmonic: 1, gain: 0.07 },
    { harmonic: 2, gain: 0.025 },
    { harmonic: 3, gain: 0.012 },
  ];
}

export default function WindBrassTunerPage() {
  const [status, setStatus] = useState<TunerStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [transpositionId, setTranspositionId] = useState<TranspositionId>("concert");
  const [targetMidi, setTargetMidi] = useState(69);
  const [a4, setA4] = useState(442);
  const [frequency, setFrequency] = useState<number | null>(null);
  const [clarity, setClarity] = useState(0);
  const [detectedHarmonic, setDetectedHarmonic] = useState<number | null>(null);
  const [isReferencePlaying, setIsReferencePlaying] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastPitchUpdateRef = useRef(0);
  const lastSuccessfulPitchRef = useRef(0);
  const frequencyHistoryRef = useRef<number[]>([]);
  const referenceNodesRef = useRef<DroneNode[]>([]);
  const targetConcertFrequencyRef = useRef(0);

  const selectedTransposition = useMemo(() => {
    return TRANSPOSITIONS.find((item) => item.id === transpositionId) ?? TRANSPOSITIONS[0];
  }, [transpositionId]);

  const pitchInfo = useMemo(() => {
    const writtenPitch = getNoteLabel(targetMidi);
    const concertMidi = targetMidi + selectedTransposition.concertOffset;
    const concertPitch = getNoteLabel(concertMidi);
    const targetFrequency = midiToFrequency(concertMidi, a4);

    return {
      writtenPitch,
      concertMidi,
      concertPitch,
      targetFrequency,
    };
  }, [targetMidi, selectedTransposition, a4]);

  useEffect(() => {
    targetConcertFrequencyRef.current = pitchInfo.targetFrequency;
  }, [pitchInfo.targetFrequency]);

  const cents = useMemo(() => {
    if (!frequency) return null;
    return 1200 * Math.log2(frequency / pitchInfo.targetFrequency);
  }, [frequency, pitchInfo.targetFrequency]);

  const detectedNote = useMemo(() => {
    if (!frequency) return "--";
    const midi = Math.round(69 + 12 * Math.log2(frequency / a4));
    return getNoteLabel(midi);
  }, [frequency, a4]);

  const roundedCents = cents === null ? null : Math.round(cents);
  const meterValue = cents === null ? 0 : Math.max(-50, Math.min(50, cents));
  const meterPercent = ((meterValue + 50) / 100) * 100;

  const tuningState = useMemo(() => {
    if (status === "idle") return "Ready";
    if (status === "error") return "Check microphone";
    if (cents === null) return "Listening";
    if (Math.abs(cents) <= 5) return "In Tune";
    return cents > 0 ? "Sharp" : "Flat";
  }, [status, cents]);

  const tuningColor = useMemo(() => {
    if (cents === null) return "text-slate-300";
    if (Math.abs(cents) <= 5) return "text-emerald-300";
    if (Math.abs(cents) <= 15) return "text-amber-300";
    return "text-rose-300";
  }, [cents]);

  const targetNoteLabel = useMemo(() => {
    return TARGET_NOTES.find((note) => note.midi === targetMidi)?.label ?? getNoteLabel(targetMidi);
  }, [targetMidi]);

  async function getOrCreateAudioContext() {
    if (audioContextRef.current) {
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      return audioContextRef.current;
    }

    const AudioContextClass =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) {
      throw new Error("This browser does not support Web Audio API.");
    }

    const audioContext = new AudioContextClass();
    audioContextRef.current = audioContext;

    return audioContext;
  }

  function resetDisplay() {
    setFrequency(null);
    setClarity(0);
    setDetectedHarmonic(null);
    frequencyHistoryRef.current = [];
    lastPitchUpdateRef.current = 0;
    lastSuccessfulPitchRef.current = 0;
  }

  function stopReferenceTone() {
    for (const node of referenceNodesRef.current) {
      try {
        node.gain.gain.cancelScheduledValues(node.gain.context.currentTime);
        node.gain.gain.setTargetAtTime(0.0001, node.gain.context.currentTime, 0.03);
        node.oscillator.stop(node.gain.context.currentTime + 0.12);
      } catch {
        // The oscillator may already be stopped.
      }

      window.setTimeout(() => {
        try {
          node.oscillator.disconnect();
          node.gain.disconnect();
        } catch {
          // The node may already be disconnected.
        }
      }, 180);
    }

    referenceNodesRef.current = [];
    setIsReferencePlaying(false);
  }

  function stopTuning() {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    analyserRef.current = null;
    setStatus("idle");
    resetDisplay();
  }

  async function startTuning() {
    try {
      stopReferenceTone();
      setErrorMessage("");
      setStatus("listening");
      resetDisplay();

      const audioContext = await getOrCreateAudioContext();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });

      streamRef.current = stream;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 16384;
      analyser.smoothingTimeConstant = 0.62;
      source.connect(analyser);
      analyserRef.current = analyser;

      const buffer = new Float32Array(analyser.fftSize);

      const detectPitch = () => {
        if (!analyserRef.current || !audioContextRef.current) return;

        analyserRef.current.getFloatTimeDomainData(buffer);

        const now = performance.now();
        const result = detectWindPitch(
          buffer,
          audioContextRef.current.sampleRate,
          targetConcertFrequencyRef.current
        );

        if (result && now - lastPitchUpdateRef.current >= PITCH_UPDATE_INTERVAL_MS) {
          frequencyHistoryRef.current.push(result.frequency);

          if (frequencyHistoryRef.current.length > HISTORY_SIZE) {
            frequencyHistoryRef.current.shift();
          }

          const stableFrequency = median(frequencyHistoryRef.current);

          if (stableFrequency) {
            setFrequency(stableFrequency);
            setClarity(result.clarity);
            setDetectedHarmonic(result.harmonic);
            lastSuccessfulPitchRef.current = now;
            lastPitchUpdateRef.current = now;
          }
        } else if (
          lastSuccessfulPitchRef.current > 0 &&
          now - lastSuccessfulPitchRef.current > SILENCE_RESET_MS
        ) {
          resetDisplay();
        }

        animationFrameRef.current = requestAnimationFrame(detectPitch);
      };

      detectPitch();
    } catch (error) {
      console.error(error);
      setStatus("error");
      resetDisplay();
      setErrorMessage(
        "マイクを開始できませんでした。ブラウザのマイク許可、HTTPS接続、端末設定を確認してください。"
      );
    }
  }

  async function toggleReferenceTone() {
    try {
      const audioContext = await getOrCreateAudioContext();

      if (isReferencePlaying) {
        stopReferenceTone();
        return;
      }

      if (status === "listening") {
        stopTuning();
      }

      resetDisplay();

      const settings = getReferenceToneSettings(pitchInfo.targetFrequency);
      const nodes: DroneNode[] = [];

      for (const setting of settings) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = setting.harmonic === 1 ? "sine" : "triangle";
        oscillator.frequency.value = pitchInfo.targetFrequency * setting.harmonic;
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(setting.gain, audioContext.currentTime + 0.14);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();

        nodes.push({
          oscillator,
          gain,
          harmonic: setting.harmonic,
        });
      }

      referenceNodesRef.current = nodes;
      setIsReferencePlaying(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Reference Toneを再生できませんでした。ブラウザの音声再生設定を確認してください。"
      );
    }
  }

  function handleTranspositionChange(nextId: TranspositionId) {
    stopReferenceTone();
    setTranspositionId(nextId);
    resetDisplay();
  }

  function handleTargetChange(nextMidi: number) {
    stopReferenceTone();
    setTargetMidi(nextMidi);
    resetDisplay();
  }

  function handleA4Change(nextA4: number) {
    stopReferenceTone();
    setA4(nextA4);
    resetDisplay();
  }

  useEffect(() => {
    if (referenceNodesRef.current.length === 0) return;

    for (const node of referenceNodesRef.current) {
      node.oscillator.frequency.value = pitchInfo.targetFrequency * node.harmonic;
    }
  }, [pitchInfo.targetFrequency]);

  useEffect(() => {
    return () => {
      stopTuning();
      stopReferenceTone();
      audioContextRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.25),_transparent_34%),linear-gradient(135deg,_#020617_0%,_#0f172a_48%,_#1e1b4b_100%)] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="border-b border-white/10 pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.28em] text-sky-300">
                HitoriBIZ ORCHESTRA TOOLS
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
                Wind & Brass Tuner
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                移調楽器の Written Pitch と Concert Pitch を確認しながら、管楽器・金管楽器の調音に使えるWebチューナーです。
              </p>
            </div>

            <div className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              <div className="text-xs uppercase tracking-widest text-amber-200">Reference</div>
              <div className="mt-1 text-2xl font-semibold">A4 = {a4} Hz</div>
            </div>
          </div>
        </header>

        <div className="grid flex-1 gap-5 py-5 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-2xl shadow-blue-950/40 sm:p-6">
            <div className="rounded-lg border border-sky-300/20 bg-sky-300/10 p-4 text-center">
              <div className="text-xs font-semibold tracking-[0.25em] text-sky-200">
                TARGET CONCERT PITCH
              </div>
              <div className="mt-2 text-5xl font-bold text-sky-50 sm:text-7xl">
                {pitchInfo.concertPitch}
              </div>
              <div className="mt-2 text-sm text-slate-300">
                Written Pitch: {pitchInfo.writtenPitch} / {pitchInfo.targetFrequency.toFixed(1)} Hz
              </div>
            </div>

            <div className="mt-5 rounded-lg border border-white/10 bg-slate-950/60 p-4 sm:p-6">
              <div className="flex flex-col items-center">
                <div className="text-xs font-semibold tracking-[0.25em] text-slate-400">
                  DETECTED NOTE
                </div>
                <div className={`mt-2 text-7xl font-bold tracking-tight sm:text-8xl ${tuningColor}`}>
                  {detectedNote}
                </div>
                <div className={`mt-2 text-3xl font-semibold ${tuningColor}`}>{tuningState}</div>

                <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-center">
                    <div className="text-xs font-semibold tracking-widest text-slate-400">
                      CENTS
                    </div>
                    <div className={`mt-1 text-4xl font-bold ${tuningColor}`}>
                      {roundedCents === null ? "--" : `${roundedCents > 0 ? "+" : ""}${roundedCents}`}
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-center">
                    <div className="text-xs font-semibold tracking-widest text-slate-400">
                      FREQUENCY
                    </div>
                    <div className="mt-2 text-2xl font-semibold">
                      {frequency ? `${frequency.toFixed(1)} Hz` : "--"}
                    </div>
                  </div>

                  <div className="col-span-2 rounded-lg border border-white/10 bg-white/[0.04] p-4 text-center sm:col-span-1">
                    <div className="text-xs font-semibold tracking-widest text-slate-400">
                      STABILITY
                    </div>
                    <div className="mt-2 text-2xl font-semibold">
                      {clarity ? `${Math.round(clarity * 100)}%` : "--"}
                    </div>
                  </div>
                </div>

                <div className="mt-6 w-full">
                  <div className="relative h-16 rounded-lg border border-white/10 bg-slate-900">
                    <div className="absolute left-1/2 top-0 h-full w-px bg-emerald-300/80" />
                    <div className="absolute left-[45%] top-0 h-full w-px bg-white/10" />
                    <div className="absolute left-[55%] top-0 h-full w-px bg-white/10" />
                    <div
                      className="absolute top-2 h-12 w-2 -translate-x-1/2 rounded-full bg-amber-300 shadow-lg shadow-amber-300/40 transition-all duration-300 ease-out"
                      style={{ left: `${meterPercent}%` }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                    <span>Flat</span>
                    <span>In Tune ±5 cents</span>
                    <span>Sharp</span>
                  </div>
                </div>

                <div className="mt-6 grid w-full gap-3 sm:grid-cols-2">
                  {status !== "listening" ? (
                    <button
                      onClick={startTuning}
                      className="rounded-lg bg-sky-300 px-6 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-sky-950/40 transition hover:bg-sky-200"
                    >
                      Start Tuning
                    </button>
                  ) : (
                    <button
                      onClick={stopTuning}
                      className="rounded-lg bg-rose-400 px-6 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-rose-950/40 transition hover:bg-rose-300"
                    >
                      Stop Tuning
                    </button>
                  )}

                  <button
                    onClick={toggleReferenceTone}
                    className="rounded-lg border border-amber-300/40 bg-amber-300/10 px-6 py-4 text-lg font-semibold text-amber-50 transition hover:bg-amber-300/20"
                  >
                    {isReferencePlaying ? "Reference Tone Stop" : "Reference Tone Start"}
                  </button>
                </div>

                {isReferencePlaying && (
                  <div className="mt-3 w-full rounded-lg border border-amber-300/30 bg-amber-300/10 p-3 text-center text-sm text-amber-100">
                    Reference Tone再生中は、端末スピーカー音の回り込みを避けるため測定を停止しています。
                  </div>
                )}

                {detectedHarmonic && frequency && (
                  <div className="mt-3 text-xs text-slate-500">
                    detected harmonic: x{detectedHarmonic}
                  </div>
                )}

                {errorMessage && (
                  <div className="mt-4 w-full rounded-lg border border-rose-400/40 bg-rose-400/10 p-4 text-sm leading-6 text-rose-100">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4 sm:p-5">
              <h2 className="text-lg font-semibold">Transposition / Instrument Type</h2>
              <div className="mt-4 grid grid-cols-1 gap-2">
                {TRANSPOSITIONS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleTranspositionChange(preset.id)}
                    className={`rounded-lg border px-4 py-3 text-left transition ${
                      transpositionId === preset.id
                        ? "border-sky-300 bg-sky-300/15"
                        : "border-white/10 bg-slate-950/50 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{preset.label}</span>
                      <span className="rounded bg-white/10 px-2 py-1 text-xs text-slate-200">
                        {preset.shortLabel}
                      </span>
                    </div>
                    <div className="mt-1 text-xs leading-5 text-slate-400">{preset.description}</div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4 sm:p-5">
              <h2 className="text-lg font-semibold">Target Note / 記譜音</h2>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {TARGET_NOTES.map((note) => (
                  <button
                    key={note.label}
                    onClick={() => handleTargetChange(note.midi)}
                    className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${
                      targetMidi === note.midi
                        ? "bg-sky-300 text-slate-950"
                        : "bg-slate-950/70 text-slate-100 hover:bg-slate-900"
                    }`}
                  >
                    {note.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-white/[0.055] p-4 sm:p-5">
              <h2 className="text-lg font-semibold">A4 Reference</h2>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {A4_OPTIONS.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleA4Change(value)}
                    className={`rounded-lg px-2 py-3 text-sm font-semibold transition ${
                      a4 === value
                        ? "bg-amber-300 text-slate-950"
                        : "bg-slate-950/70 text-slate-100 hover:bg-slate-900"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-slate-950/55 p-4 sm:p-5">
              <h2 className="text-lg font-semibold">Pitch Summary</h2>
              <dl className="mt-4 grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Written Pitch</dt>
                  <dd className="font-semibold">{pitchInfo.writtenPitch}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Concert Pitch</dt>
                  <dd className="font-semibold">{pitchInfo.concertPitch}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Target Note</dt>
                  <dd className="font-semibold">{targetNoteLabel}</dd>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Transposition</dt>
                  <dd className="font-semibold">{selectedTransposition.label}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-400">A4 Reference</dt>
                  <dd className="font-semibold">{a4} Hz</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-50 sm:p-5">
              <p>
                B♭ / E♭ / F の移調楽器では、楽譜に書かれた音と実際に鳴る音が異なります。このTunerでは、Written Pitch と Concert Pitch の両方を確認できます。
              </p>
            </section>

            <section className="rounded-lg border border-white/10 bg-white/[0.045] p-4 sm:p-5">
              <h2 className="text-lg font-semibold">Notes</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                <li>Concert Pitchは実際に鳴っている音です。</li>
                <li>Written Pitchは移調楽器の楽譜上の音です。</li>
                <li>B♭ Instrumentでは記譜Cが実音B♭として鳴ります。</li>
                <li>E♭ Instrumentでは記譜Cが実音E♭として鳴ります。</li>
                <li>F Instrumentでは記譜Cが実音Fとして鳴ります。</li>
              </ul>
            </section>
          </aside>
        </div>

        <footer className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
          Wind & Brass Tuner by HitoriBIZ / Olive Co., Ltd.
        </footer>
      </section>
    </main>
  );
}
