"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type TunerStatus = "idle" | "listening" | "error";
type InstrumentFamily = "violin" | "viola" | "cello";

type PitchResult = {
  frequency: number;
  clarity: number;
  rms: number;
  harmonic: number;
};

type NoteInfo = {
  midi: number;
  noteName: string;
  octave: number;
  targetFrequency: number;
  cents: number;
};

type StringPreset = {
  label: string;
  name: string;
  midi: number;
};

type InstrumentPreset = {
  id: InstrumentFamily;
  label: string;
  description: string;
  defaultMidi: number;
  strings: StringPreset[];
};

type DroneNode = {
  oscillator: OscillatorNode;
  gain: GainNode;
  harmonic: number;
};

const NOTE_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_NAMES_FLAT = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const SOLFEGE = ["Do", "Di", "Re", "Ri", "Mi", "Fa", "Fi", "Sol", "Si", "La", "Li", "Ti"];

const TRANSPOSITION_PRESETS = [
  { label: "Concert Pitch", value: 0, description: "Strings / C instruments" },
  { label: "B♭ Instrument", value: 2, description: "Clarinet, Trumpet, etc." },
  { label: "E♭ Instrument", value: -3, description: "Alto Sax, etc." },
  { label: "F Instrument", value: 7, description: "Horn in F" },
];

const INSTRUMENTS: InstrumentPreset[] = [
  {
    id: "violin",
    label: "Violin",
    description: "G3 / D4 / A4 / E5",
    defaultMidi: 69,
    strings: [
      { label: "G", name: "G3", midi: 55 },
      { label: "D", name: "D4", midi: 62 },
      { label: "A", name: "A4", midi: 69 },
      { label: "E", name: "E5", midi: 76 },
    ],
  },
  {
    id: "viola",
    label: "Viola",
    description: "C3 / G3 / D4 / A4",
    defaultMidi: 69,
    strings: [
      { label: "C", name: "C3", midi: 48 },
      { label: "G", name: "G3", midi: 55 },
      { label: "D", name: "D4", midi: 62 },
      { label: "A", name: "A4", midi: 69 },
    ],
  },
  {
    id: "cello",
    label: "Cello",
    description: "C2 / G2 / D3 / A3",
    defaultMidi: 57,
    strings: [
      { label: "C", name: "C2", midi: 36 },
      { label: "G", name: "G2", midi: 43 },
      { label: "D", name: "D3", midi: 50 },
      { label: "A", name: "A3", midi: 57 },
    ],
  },
];

const EXTRA_REFERENCE_NOTES = [
  { label: "A4", midi: 69 },
  { label: "B♭4", midi: 70 },
  { label: "C5", midi: 72 },
  { label: "F5", midi: 77 },
];

const PITCH_UPDATE_INTERVAL_MS = 300;
const HISTORY_SIZE = 7;
const SILENCE_RESET_MS = 1500;
const MINIMUM_RMS = 0.003;
const MINIMUM_CLARITY = 0.18;
const MAX_HARMONIC_FREQUENCY = 2600;

function midiToFrequency(midi: number, a4: number) {
  return a4 * Math.pow(2, (midi - 69) / 12);
}

function getNoteName(midi: number, preferFlats: boolean) {
  const noteIndex = ((midi % 12) + 12) % 12;
  return preferFlats ? NOTE_NAMES_FLAT[noteIndex] : NOTE_NAMES_SHARP[noteIndex];
}

function getOctave(midi: number) {
  return Math.floor(midi / 12) - 1;
}

function getSolfege(midi: number) {
  const noteIndex = ((midi % 12) + 12) % 12;
  return SOLFEGE[noteIndex];
}

function getTargetRangeCents(instrument: InstrumentFamily, midi: number) {
  if (instrument === "violin") {
    if (midi === 69) return 220;
    if (midi === 76) return 320;
    if (midi === 62) return 430;
    if (midi === 55) return 520;
    return 320;
  }

  if (instrument === "viola") {
    if (midi === 69) return 240;
    if (midi === 62) return 420;
    if (midi === 55) return 520;
    if (midi === 48) return 600;
    return 420;
  }

  if (instrument === "cello") {
    if (midi === 57) return 420;
    if (midi === 50) return 560;
    if (midi === 43) return 700;
    if (midi === 36) return 820;
    return 600;
  }

  return 360;
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
  const maxOffset = Math.ceil(sampleRate / lowFrequency);

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
  const shift = divisor === 0 ? 0 : 0.5 * (previous - next) / divisor;
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

function detectStringPitch(
  buffer: Float32Array,
  sampleRate: number,
  targetFrequency: number,
  targetRangeCents: number
): PitchResult | null {
  const rms = calculateRms(buffer);

  if (rms < MINIMUM_RMS) return null;

  let best: PitchResult | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let harmonic = 1; harmonic <= 6; harmonic++) {
    const harmonicFrequency = targetFrequency * harmonic;

    if (harmonicFrequency > MAX_HARMONIC_FREQUENCY) continue;

    const harmonicRange = harmonic === 1 ? targetRangeCents : targetRangeCents + 120;

    const detected = detectNearFrequency(
      buffer,
      sampleRate,
      harmonicFrequency,
      harmonicRange
    );

    if (!detected) continue;

    const fundamentalFrequency = detected.frequency / harmonic;
    const centsFromTarget = 1200 * Math.log2(fundamentalFrequency / targetFrequency);

    if (Math.abs(centsFromTarget) > targetRangeCents + 100) continue;

    const harmonicWeight =
      harmonic === 1
        ? 1.0
        : harmonic === 2
          ? 0.94
          : harmonic === 3
            ? 0.88
            : harmonic === 4
              ? 0.82
              : harmonic === 5
                ? 0.78
                : 0.74;

    const score = detected.clarity * harmonicWeight - Math.abs(centsFromTarget) / 1000;

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

function getDroneHarmonicSettings(midi: number) {
  if (midi <= 43) {
    return [
      { harmonic: 1, gain: 0.16 },
      { harmonic: 2, gain: 0.12 },
      { harmonic: 3, gain: 0.08 },
      { harmonic: 4, gain: 0.05 },
    ];
  }

  if (midi <= 50) {
    return [
      { harmonic: 1, gain: 0.15 },
      { harmonic: 2, gain: 0.1 },
      { harmonic: 3, gain: 0.065 },
      { harmonic: 4, gain: 0.035 },
    ];
  }

  if (midi <= 57) {
    return [
      { harmonic: 1, gain: 0.14 },
      { harmonic: 2, gain: 0.075 },
      { harmonic: 3, gain: 0.04 },
    ];
  }

  return [
    { harmonic: 1, gain: 0.12 },
    { harmonic: 2, gain: 0.035 },
    { harmonic: 3, gain: 0.018 },
  ];
}

export default function OrchestraTunerPage() {
  const [status, setStatus] = useState<TunerStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [instrumentFamily, setInstrumentFamily] = useState<InstrumentFamily>("violin");
  const [frequency, setFrequency] = useState<number | null>(null);
  const [clarity, setClarity] = useState(0);
  const [detectedHarmonic, setDetectedHarmonic] = useState<number | null>(null);
  const [a4, setA4] = useState(442);
  const [preferFlats, setPreferFlats] = useState(true);
  const [transposeSemitones, setTransposeSemitones] = useState(0);
  const [isDronePlaying, setIsDronePlaying] = useState(false);
  const [droneMidi, setDroneMidi] = useState(69);
  const [selectedStringMidi, setSelectedStringMidi] = useState(69);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastPitchUpdateRef = useRef(0);
  const lastSuccessfulPitchRef = useRef(0);
  const frequencyHistoryRef = useRef<number[]>([]);
  const droneNodesRef = useRef<DroneNode[]>([]);

  const selectedStringMidiRef = useRef(selectedStringMidi);
  const a4Ref = useRef(a4);
  const instrumentFamilyRef = useRef(instrumentFamily);

  useEffect(() => {
    selectedStringMidiRef.current = selectedStringMidi;
  }, [selectedStringMidi]);

  useEffect(() => {
    a4Ref.current = a4;
  }, [a4]);

  useEffect(() => {
    instrumentFamilyRef.current = instrumentFamily;
  }, [instrumentFamily]);

  const currentInstrument = useMemo(() => {
    return INSTRUMENTS.find((item) => item.id === instrumentFamily) ?? INSTRUMENTS[0];
  }, [instrumentFamily]);

  const selectedString = useMemo(() => {
    return (
      currentInstrument.strings.find((item) => item.midi === selectedStringMidi) ??
      currentInstrument.strings[0]
    );
  }, [currentInstrument, selectedStringMidi]);

  const targetFrequency = useMemo(() => {
    return midiToFrequency(selectedStringMidi, a4);
  }, [selectedStringMidi, a4]);

  const referenceNotes = useMemo(() => {
    const stringNotes = currentInstrument.strings.map((item) => ({
      label: item.name,
      midi: item.midi,
    }));

    const merged = [...stringNotes, ...EXTRA_REFERENCE_NOTES];
    const unique = new Map<number, { label: string; midi: number }>();

    for (const note of merged) {
      if (!unique.has(note.midi)) unique.set(note.midi, note);
    }

    return Array.from(unique.values());
  }, [currentInstrument]);

  const noteInfo = useMemo<NoteInfo | null>(() => {
    if (!frequency) return null;

    const cents = 1200 * Math.log2(frequency / targetFrequency);
    const displayMidi = selectedStringMidi + transposeSemitones;

    return {
      midi: selectedStringMidi,
      noteName: getNoteName(displayMidi, preferFlats),
      octave: getOctave(displayMidi),
      targetFrequency,
      cents,
    };
  }, [frequency, targetFrequency, selectedStringMidi, transposeSemitones, preferFlats]);

  const cents = noteInfo?.cents ?? 0;
  const meterValue = Math.max(-50, Math.min(50, cents));
  const needleRotation = meterValue * 1.2;

  const tuningMessage = useMemo(() => {
    if (status === "idle") return "Start Tuning を押してください";
    if (!noteInfo) return `${selectedString.name} の音を長めに鳴らしてください`;
    if (Math.abs(cents) <= 3) return "In Tune";
    if (cents > 3) return "少し高いです";
    return "少し低いです";
  }, [status, noteInfo, cents, selectedString.name]);

  const tuningColor = useMemo(() => {
    if (!noteInfo) return "text-slate-400";
    if (Math.abs(cents) <= 3) return "text-emerald-500";
    if (Math.abs(cents) <= 10) return "text-amber-500";
    return "text-rose-500";
  }, [noteInfo, cents]);

  const centsDisplay = useMemo(() => {
    if (!noteInfo) return "--";
    const rounded = Math.round(cents);
    return `${rounded > 0 ? "+" : ""}${rounded}`;
  }, [noteInfo, cents]);

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
      throw new Error("このブラウザはWeb Audio APIに対応していません。");
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

  function stopDrone() {
    for (const node of droneNodesRef.current) {
      try {
        node.oscillator.stop();
      } catch {
        // already stopped
      }

      node.oscillator.disconnect();
      node.gain.disconnect();
    }

    droneNodesRef.current = [];
    setIsDronePlaying(false);
  }

  function handleInstrumentChange(nextInstrumentId: InstrumentFamily) {
    const nextInstrument = INSTRUMENTS.find((item) => item.id === nextInstrumentId) ?? INSTRUMENTS[0];

    stopDrone();
    setInstrumentFamily(nextInstrument.id);
    setSelectedStringMidi(nextInstrument.defaultMidi);
    setDroneMidi(nextInstrument.defaultMidi);
    resetDisplay();
  }

  async function startTuner() {
    try {
      stopDrone();
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
      analyser.smoothingTimeConstant = 0.65;

      source.connect(analyser);
      analyserRef.current = analyser;

      const buffer = new Float32Array(analyser.fftSize);

      const detectPitch = () => {
        if (!analyserRef.current || !audioContextRef.current) return;

        analyserRef.current.getFloatTimeDomainData(buffer);

        const now = performance.now();
        const currentMidi = selectedStringMidiRef.current;
        const currentA4 = a4Ref.current;
        const currentInstrument = instrumentFamilyRef.current;
        const currentTargetFrequency = midiToFrequency(currentMidi, currentA4);
        const currentTargetRangeCents = getTargetRangeCents(currentInstrument, currentMidi);

        const result = detectStringPitch(
          buffer,
          audioContextRef.current.sampleRate,
          currentTargetFrequency,
          currentTargetRangeCents
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
        "マイクを開始できませんでした。ブラウザのマイク許可、HTTPS接続、または端末設定をご確認ください。"
      );
    }
  }

  function stopTuner() {
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

  async function toggleDrone() {
    try {
      const audioContext = await getOrCreateAudioContext();

      if (isDronePlaying) {
        stopDrone();
        return;
      }

      if (status === "listening") {
        stopTuner();
      }

      resetDisplay();

      const baseFrequency = midiToFrequency(droneMidi, a4);
      const settings = getDroneHarmonicSettings(droneMidi);

      const nodes: DroneNode[] = [];

      for (const setting of settings) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = setting.harmonic === 1 ? "sine" : "triangle";
        oscillator.frequency.value = baseFrequency * setting.harmonic;

        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          setting.gain,
          audioContext.currentTime + 0.12
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();

        nodes.push({
          oscillator,
          gain,
          harmonic: setting.harmonic,
        });
      }

      droneNodesRef.current = nodes;
      setIsDronePlaying(true);
    } catch (error) {
      console.error(error);
      setErrorMessage("基準音を再生できませんでした。ブラウザの音声再生設定をご確認ください。");
    }
  }

  useEffect(() => {
    if (droneNodesRef.current.length === 0) return;

    const baseFrequency = midiToFrequency(droneMidi, a4);

    for (const node of droneNodesRef.current) {
      node.oscillator.frequency.value = baseFrequency * node.harmonic;
    }
  }, [droneMidi, a4]);

  useEffect(() => {
    return () => {
      stopTuner();
      stopDrone();
      audioContextRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium tracking-[0.3em] text-cyan-300">
              HitoriBIZ ORCHESTRA TOOLS
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Orchestra Tuner
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Violin / Viola / Cello に対応した、iPhone・Androidブラウザ用チューナー。
              低音Reference Toneには倍音を加え、小型スピーカーでも聞き取りやすくしています。
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
            <div className="text-xs uppercase tracking-widest text-cyan-300">
              Reference
            </div>
            <div className="mt-1 text-2xl font-semibold">A4 = {a4}Hz</div>
          </div>
        </header>

        <div className="grid flex-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-cyan-950/40 sm:p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-center">
                <div className="text-xs tracking-[0.25em] text-cyan-300">
                  SELECTED INSTRUMENT / STRING
                </div>
                <div className="mt-1 text-3xl font-bold text-cyan-100">
                  {currentInstrument.label} / {selectedString.label} String
                </div>
                <div className="mt-1 text-xs text-slate-300">
                  {selectedString.name} / Target: {targetFrequency.toFixed(1)} Hz
                  {detectedHarmonic ? ` / detected harmonic: x${detectedHarmonic}` : ""}
                </div>
              </div>

              <div className="relative mb-6 flex h-72 w-72 items-center justify-center rounded-full border border-white/10 bg-slate-900 shadow-inner shadow-black/60 sm:h-96 sm:w-96">
                <div className="absolute inset-5 rounded-full border border-white/10" />
                <div className="absolute inset-12 rounded-full border border-white/5" />

                <div
                  className="absolute bottom-1/2 left-1/2 h-32 w-1 origin-bottom rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/40 transition-transform duration-1000 ease-out sm:h-44"
                  style={{
                    transform: `translateX(-50%) rotate(${needleRotation}deg)`,
                  }}
                />

                <div className="absolute bottom-1/2 left-1/2 h-5 w-5 -translate-x-1/2 translate-y-1/2 rounded-full bg-white shadow-lg" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`text-8xl font-bold tracking-tight sm:text-9xl ${tuningColor}`}>
                    {noteInfo ? noteInfo.noteName : "--"}
                  </div>

                  <div className="mt-1 text-2xl text-slate-300">
                    {noteInfo ? `${getSolfege(noteInfo.midi)} / ${selectedString.name}` : "Waiting"}
                  </div>

                  <div className={`mt-5 text-xl font-semibold ${tuningColor}`}>
                    {tuningMessage}
                  </div>
                </div>
              </div>

              <div className="mb-5 grid w-full grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="text-xs tracking-widest text-slate-400">
                    FREQUENCY
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {frequency ? `${frequency.toFixed(1)} Hz` : "--"}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="text-xs tracking-widest text-slate-400">
                    CENTS
                  </div>
                  <div className={`mt-1 text-2xl font-bold ${tuningColor}`}>
                    {centsDisplay}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="text-xs tracking-widest text-slate-400">
                    STABILITY
                  </div>
                  <div className="mt-1 text-xl font-semibold">
                    {clarity ? `${Math.round(clarity * 100)}%` : "--"}
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 sm:flex-row">
                {status !== "listening" ? (
                  <button
                    onClick={startTuner}
                    className="flex-1 rounded-2xl bg-cyan-300 px-6 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-cyan-900/40 transition hover:bg-cyan-200"
                  >
                    Start Tuning
                  </button>
                ) : (
                  <button
                    onClick={stopTuner}
                    className="flex-1 rounded-2xl bg-rose-400 px-6 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-rose-900/40 transition hover:bg-rose-300"
                  >
                    Stop
                  </button>
                )}

                <button
                  onClick={toggleDrone}
                  className="flex-1 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-lg font-semibold text-white transition hover:bg-white/15"
                >
                  {isDronePlaying ? "Stop Reference Tone" : "Play Reference Tone"}
                </button>
              </div>

              {isDronePlaying && (
                <div className="mt-3 w-full rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 text-center text-sm text-cyan-100">
                  Reference Tone再生中は、測定を自動停止しています。
                </div>
              )}

              {errorMessage && (
                <div className="mt-4 w-full rounded-2xl border border-rose-400/40 bg-rose-400/10 p-4 text-sm leading-6 text-rose-100">
                  {errorMessage}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-lg font-semibold">Instrument</h2>
              <p className="mt-1 text-sm text-slate-400">
                楽器を選ぶと、調弦用の開放弦セットが切り替わります。
              </p>

              <div className="mt-4 grid grid-cols-1 gap-2">
                {INSTRUMENTS.map((instrument) => (
                  <button
                    key={instrument.id}
                    onClick={() => handleInstrumentChange(instrument.id)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      instrumentFamily === instrument.id
                        ? "border-cyan-300 bg-cyan-300/15"
                        : "border-white/10 bg-slate-900/60 hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="font-semibold">{instrument.label}</div>
                    <div className="text-xs text-slate-400">{instrument.description}</div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-lg font-semibold">String</h2>
              <p className="mt-1 text-sm text-slate-400">
                調弦する弦を選んでください。基準音も自動で切り替わります。
              </p>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {currentInstrument.strings.map((string) => (
                  <button
                    key={`${currentInstrument.id}-${string.name}`}
                    onClick={() => {
                      stopDrone();
                      setSelectedStringMidi(string.midi);
                      setDroneMidi(string.midi);
                      resetDisplay();
                    }}
                    className={`rounded-xl px-3 py-4 text-center text-sm font-semibold transition ${
                      selectedStringMidi === string.midi
                        ? "bg-cyan-300 text-slate-950"
                        : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    <div className="text-2xl">{string.label}</div>
                    <div className="text-xs opacity-80">{string.name}</div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-lg font-semibold">A4 Reference</h2>
              <p className="mt-1 text-sm text-slate-400">
                オーケストラ練習では 442Hz を初期値にしています。
              </p>

              <div className="mt-4 grid grid-cols-5 gap-2">
                {[440, 441, 442, 443, 444].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setA4(value);
                      resetDisplay();
                    }}
                    className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      a4 === value
                        ? "bg-cyan-300 text-slate-950"
                        : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-lg font-semibold">Transposition</h2>
              <p className="mt-1 text-sm text-slate-400">
                弦楽器では通常 Concert Pitch のままで使用します。
              </p>

              <div className="mt-4 space-y-2">
                {TRANSPOSITION_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setTransposeSemitones(preset.value);
                      resetDisplay();
                    }}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      transposeSemitones === preset.value
                        ? "border-cyan-300 bg-cyan-300/15"
                        : "border-white/10 bg-slate-900/60 hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="font-semibold">{preset.label}</div>
                    <div className="text-xs text-slate-400">{preset.description}</div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-lg font-semibold">Notation</h2>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPreferFlats(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    !preferFlats
                      ? "bg-cyan-300 text-slate-950"
                      : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  Sharps
                </button>
                <button
                  onClick={() => setPreferFlats(true)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    preferFlats
                      ? "bg-cyan-300 text-slate-950"
                      : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  Flats
                </button>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-lg font-semibold">Reference Tone</h2>
              <p className="mt-1 text-sm text-slate-400">
                選択中の弦、または下のボタンで選んだ基準音を鳴らせます。
                低音には倍音を加えて聞こえやすくしています。
              </p>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {referenceNotes.map((note) => (
                  <button
                    key={`${note.label}-${note.midi}`}
                    onClick={() => {
                      setDroneMidi(note.midi);
                      resetDisplay();
                    }}
                    className={`rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      droneMidi === note.midi
                        ? "bg-cyan-300 text-slate-950"
                        : "bg-slate-900 text-slate-200 hover:bg-slate-800"
                    }`}
                  >
                    {note.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5">
              <h2 className="text-lg font-semibold">How to Use</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-300">
                <li>Instrument で Violin / Viola / Cello を選びます。</li>
                <li>String で調弦する開放弦を選びます。</li>
                <li>選んだ弦に合わせて Reference Tone も自動で変わります。</li>
                <li>Reference Toneで耳確認する場合、測定は自動停止します。</li>
                <li>Start Tuning を押します。</li>
                <li>ブラウザのマイク使用を許可します。</li>
                <li>iPhoneでは、下部マイクを楽器側へ向けます。</li>
                <li>スマホを楽器から20〜30cmほど離します。</li>
                <li>選んだ弦を、弓で静かに2〜3秒長めに鳴らします。</li>
                <li>CENTS が 0 に近づけば調弦完了です。</li>
              </ol>
            </section>
          </aside>
        </div>

        <footer className="mt-6 border-t border-white/10 pt-5 text-center text-xs text-slate-500">
          Orchestra Tuner by HitoriBIZ / Olive Co., Ltd.
        </footer>
      </section>
    </main>
  );
}