"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type TunerStatus = "idle" | "listening" | "error";

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

const NOTE_NAMES_SHARP = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const NOTE_NAMES_FLAT = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const SOLFEGE = ["Do", "Di", "Re", "Ri", "Mi", "Fa", "Fi", "Sol", "Si", "La", "Li", "Ti"];

const INSTRUMENT_PRESETS = [
  { label: "Concert Pitch", value: 0, description: "C instruments / Strings" },
  { label: "B♭ Instrument", value: 2, description: "Clarinet, Trumpet, etc." },
  { label: "E♭ Instrument", value: -3, description: "Alto Sax, etc." },
  { label: "F Instrument", value: 7, description: "Horn in F" },
];

const VIOLIN_STRINGS = [
  { label: "G", name: "G3", midi: 55 },
  { label: "D", name: "D4", midi: 62 },
  { label: "A", name: "A4", midi: 69 },
  { label: "E", name: "E5", midi: 76 },
];

const REFERENCE_NOTES = [
  { label: "G3", midi: 55 },
  { label: "D4", midi: 62 },
  { label: "A4", midi: 69 },
  { label: "E5", midi: 76 },
  { label: "B♭4", midi: 70 },
  { label: "C5", midi: 72 },
  { label: "F5", midi: 77 },
  { label: "G5", midi: 79 },
];

/**
 * 実用調弦向け設定
 */
const PITCH_UPDATE_INTERVAL_MS = 420;
const HISTORY_SIZE = 7;
const SILENCE_RESET_MS = 1200;
const MINIMUM_RMS = 0.01;
const MINIMUM_CLARITY = 0.28;
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

function getTargetRangeCents(midi: number) {
  if (midi === 69) return 180; // A線
  if (midi === 76) return 260; // E線
  if (midi === 62) return 360; // D線
  if (midi === 55) return 440; // G線
  return 260;
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

/**
 * 特定周波数付近だけを探す自己相関。
 */
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

/**
 * 選択した弦の基音だけでなく、2倍音・3倍音・4倍音も見て、
 * 最終的に基音へ換算する。
 */
function detectViolinStringPitch(
  buffer: Float32Array,
  sampleRate: number,
  targetFrequency: number,
  targetRangeCents: number
): PitchResult | null {
  const rms = calculateRms(buffer);

  if (rms < MINIMUM_RMS) return null;

  let best: PitchResult | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let harmonic = 1; harmonic <= 5; harmonic++) {
    const harmonicFrequency = targetFrequency * harmonic;

    if (harmonicFrequency > MAX_HARMONIC_FREQUENCY) continue;

    const harmonicRange = harmonic === 1 ? targetRangeCents : targetRangeCents + 80;

    const detected = detectNearFrequency(
      buffer,
      sampleRate,
      harmonicFrequency,
      harmonicRange
    );

    if (!detected) continue;

    const fundamentalFrequency = detected.frequency / harmonic;
    const centsFromTarget = 1200 * Math.log2(fundamentalFrequency / targetFrequency);

    if (Math.abs(centsFromTarget) > targetRangeCents + 60) continue;

    const harmonicWeight =
      harmonic === 1 ? 1.0 : harmonic === 2 ? 0.92 : harmonic === 3 ? 0.86 : 0.8;

    const score =
      detected.clarity * harmonicWeight - Math.abs(centsFromTarget) / 900;

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

export default function OrchestraTunerPage() {
  const [status, setStatus] = useState<TunerStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [frequency, setFrequency] = useState<number | null>(null);
  const [clarity, setClarity] = useState(0);
  const [detectedHarmonic, setDetectedHarmonic] = useState<number | null>(null);
  const [a4, setA4] = useState(442);
  const [preferFlats, setPreferFlats] = useState(true);
  const [transposeSemitones, setTransposeSemitones] = useState(0);
  const [isDronePlaying, setIsDronePlaying] = useState(false);
  const [droneMidi, setDroneMidi] = useState(69);
  const [selectedViolinStringMidi, setSelectedViolinStringMidi] = useState(69);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastPitchUpdateRef = useRef(0);
  const lastSuccessfulPitchRef = useRef(0);
  const frequencyHistoryRef = useRef<number[]>([]);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const selectedViolinStringMidiRef = useRef(selectedViolinStringMidi);
  const a4Ref = useRef(a4);

  useEffect(() => {
    selectedViolinStringMidiRef.current = selectedViolinStringMidi;
  }, [selectedViolinStringMidi]);

  useEffect(() => {
    a4Ref.current = a4;
  }, [a4]);

  const selectedString = useMemo(() => {
    return (
      VIOLIN_STRINGS.find((item) => item.midi === selectedViolinStringMidi) ??
      VIOLIN_STRINGS[2]
    );
  }, [selectedViolinStringMidi]);

  const targetFrequency = useMemo(() => {
    return midiToFrequency(selectedViolinStringMidi, a4);
  }, [selectedViolinStringMidi, a4]);

  const noteInfo = useMemo<NoteInfo | null>(() => {
    if (!frequency) return null;

    const cents = 1200 * Math.log2(frequency / targetFrequency);
    const displayMidi = selectedViolinStringMidi + transposeSemitones;

    return {
      midi: selectedViolinStringMidi,
      noteName: getNoteName(displayMidi, preferFlats),
      octave: getOctave(displayMidi),
      targetFrequency,
      cents,
    };
  }, [
    frequency,
    targetFrequency,
    selectedViolinStringMidi,
    transposeSemitones,
    preferFlats,
  ]);

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

  async function startTuner() {
    try {
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
        const currentMidi = selectedViolinStringMidiRef.current;
        const currentA4 = a4Ref.current;
        const currentTargetFrequency = midiToFrequency(currentMidi, currentA4);
        const currentTargetRangeCents = getTargetRangeCents(currentMidi);

        const result = detectViolinStringPitch(
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
        oscillatorRef.current?.stop();
        oscillatorRef.current?.disconnect();
        gainRef.current?.disconnect();
        oscillatorRef.current = null;
        gainRef.current = null;
        setIsDronePlaying(false);
        return;
      }

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = midiToFrequency(droneMidi, a4);

      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.08);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();

      oscillatorRef.current = oscillator;
      gainRef.current = gain;
      setIsDronePlaying(true);
    } catch (error) {
      console.error(error);
      setErrorMessage("基準音を再生できませんでした。ブラウザの音声再生設定をご確認ください。");
    }
  }

  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = midiToFrequency(droneMidi, a4);
    }
  }, [droneMidi, a4]);

  useEffect(() => {
    return () => {
      stopTuner();

      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }

      gainRef.current?.disconnect();
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
              iPhone / Android のブラウザで使える、オーケストラ練習向けチューナー。
              基音だけでなく倍音も検出し、G / D / A / E の各弦を安定して調弦します。
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
                  SELECTED VIOLIN STRING
                </div>
                <div className="mt-1 text-3xl font-bold text-cyan-100">
                  {selectedString.label} String / {selectedString.name}
                </div>
                <div className="mt-1 text-xs text-slate-300">
                  Target: {targetFrequency.toFixed(1)} Hz
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
                    {noteInfo
                      ? `${getSolfege(noteInfo.midi)} / ${selectedString.name}`
                      : "Waiting"}
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

              {errorMessage && (
                <div className="mt-4 w-full rounded-2xl border border-rose-400/40 bg-rose-400/10 p-4 text-sm leading-6 text-rose-100">
                  {errorMessage}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-lg font-semibold">Violin String</h2>
              <p className="mt-1 text-sm text-slate-400">
                調弦する弦を選んでください。選択した弦の基準音も自動で切り替わります。
              </p>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {VIOLIN_STRINGS.map((string) => (
                  <button
                    key={string.name}
                    onClick={() => {
                      setSelectedViolinStringMidi(string.midi);
                      setDroneMidi(string.midi);
                      resetDisplay();
                    }}
                    className={`rounded-xl px-3 py-4 text-center text-sm font-semibold transition ${
                      selectedViolinStringMidi === string.midi
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
              <h2 className="text-lg font-semibold">Instrument Mode</h2>
              <p className="mt-1 text-sm text-slate-400">
                ヴァイオリンは通常 Concert Pitch のままで使用します。
              </p>

              <div className="mt-4 space-y-2">
                {INSTRUMENT_PRESETS.map((preset) => (
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
                    <div className="text-xs text-slate-400">
                      {preset.description}
                    </div>
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
              </p>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {REFERENCE_NOTES.map((note) => (
                  <button
                    key={note.label}
                    onClick={() => setDroneMidi(note.midi)}
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
                <li>Violin String で G / D / A / E の弦を選びます。</li>
                <li>選んだ弦に合わせて Reference Tone も自動で変わります。</li>
                <li>Start Tuning を押します。</li>
                <li>ブラウザのマイク使用を許可します。</li>
                <li>スマホを楽器から30〜50cmほど離します。</li>
                <li>選んだ弦を、弓で静かに長めに鳴らします。</li>
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