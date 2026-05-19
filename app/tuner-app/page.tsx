"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type TunerStatus = "idle" | "listening" | "error";

type PitchResult = {
  frequency: number;
  clarity: number;
};

type NoteInfo = {
  midi: number;
  noteName: string;
  octave: number;
  targetFrequency: number;
  cents: number;
};

const NOTE_NAMES_SHARP = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

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

const SOLFEGE = [
  "Do",
  "Di",
  "Re",
  "Ri",
  "Mi",
  "Fa",
  "Fi",
  "Sol",
  "Si",
  "La",
  "Li",
  "Ti",
];

const INSTRUMENT_PRESETS = [
  { label: "Concert Pitch", value: 0, description: "C instruments / Strings" },
  { label: "B♭ Instrument", value: 2, description: "Clarinet, Trumpet, etc." },
  { label: "E♭ Instrument", value: -3, description: "Alto Sax, etc." },
  { label: "F Instrument", value: 7, description: "Horn in F" },
];

const REFERENCE_NOTES = [
  { label: "A4", midi: 69 },
  { label: "B♭4", midi: 70 },
  { label: "C5", midi: 72 },
  { label: "D5", midi: 74 },
  { label: "E5", midi: 76 },
  { label: "F5", midi: 77 },
  { label: "G5", midi: 79 },
];

function midiToFrequency(midi: number, a4: number) {
  return a4 * Math.pow(2, (midi - 69) / 12);
}

function frequencyToNoteInfo(
  frequency: number,
  a4: number,
  preferFlats: boolean,
  transposeSemitones: number
): NoteInfo {
  const rawMidi = 69 + 12 * Math.log2(frequency / a4);
  const concertMidi = Math.round(rawMidi);
  const targetFrequency = midiToFrequency(concertMidi, a4);
  const cents = 1200 * Math.log2(frequency / targetFrequency);

  const displayMidi = concertMidi + transposeSemitones;
  const noteIndex = ((displayMidi % 12) + 12) % 12;
  const octave = Math.floor(displayMidi / 12) - 1;

  return {
    midi: concertMidi,
    noteName: preferFlats ? NOTE_NAMES_FLAT[noteIndex] : NOTE_NAMES_SHARP[noteIndex],
    octave,
    targetFrequency,
    cents,
  };
}

function getSolfege(midi: number, transposeSemitones: number) {
  const displayMidi = midi + transposeSemitones;
  const noteIndex = ((displayMidi % 12) + 12) % 12;
  return SOLFEGE[noteIndex];
}

function autoCorrelate(buffer: Float32Array, sampleRate: number): PitchResult | null {
  const size = buffer.length;

  let rms = 0;
  for (let i = 0; i < size; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / size);

  if (rms < 0.01) return null;

  let start = 0;
  let end = size - 1;
  const threshold = 0.2;

  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      start = i;
      break;
    }
  }

  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buffer[size - i]) < threshold) {
      end = size - i;
      break;
    }
  }

  const trimmed = buffer.slice(start, end);
  const trimmedSize = trimmed.length;
  if (trimmedSize < 64) return null;

  const correlations = new Array<number>(trimmedSize).fill(0);

  for (let offset = 0; offset < trimmedSize; offset++) {
    let correlation = 0;

    for (let i = 0; i < trimmedSize - offset; i++) {
      correlation += Math.abs(trimmed[i] - trimmed[i + offset]);
    }

    correlations[offset] = 1 - correlation / (trimmedSize - offset);
  }

  let foundGoodCorrelation = false;
  let bestOffset = -1;
  let bestCorrelation = 0;
  let lastCorrelation = 1;

  const minFrequency = 50;
  const maxFrequency = 1500;
  const minOffset = Math.floor(sampleRate / maxFrequency);
  const maxOffset = Math.floor(sampleRate / minFrequency);

  for (let offset = minOffset; offset < Math.min(maxOffset, trimmedSize); offset++) {
    const correlation = correlations[offset];

    if (correlation > 0.9 && correlation > lastCorrelation) {
      foundGoodCorrelation = true;

      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    } else if (foundGoodCorrelation) {
      const shift =
        (correlations[bestOffset + 1] - correlations[bestOffset - 1]) /
        correlations[bestOffset];

      const refinedOffset = bestOffset + 8 * shift;
      const frequency = sampleRate / refinedOffset;

      if (frequency >= minFrequency && frequency <= maxFrequency) {
        return {
          frequency,
          clarity: bestCorrelation,
        };
      }

      return null;
    }

    lastCorrelation = correlation;
  }

  if (bestOffset > 0) {
    const frequency = sampleRate / bestOffset;

    if (frequency >= minFrequency && frequency <= maxFrequency) {
      return {
        frequency,
        clarity: bestCorrelation,
      };
    }
  }

  return null;
}

export default function OrchestraTunerPage() {
  const [status, setStatus] = useState<TunerStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [frequency, setFrequency] = useState<number | null>(null);
  const [clarity, setClarity] = useState(0);
  const [a4, setA4] = useState(442);
  const [preferFlats, setPreferFlats] = useState(true);
  const [transposeSemitones, setTransposeSemitones] = useState(0);
  const [isDronePlaying, setIsDronePlaying] = useState(false);
  const [droneMidi, setDroneMidi] = useState(69);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const noteInfo = useMemo(() => {
    if (!frequency) return null;
    return frequencyToNoteInfo(frequency, a4, preferFlats, transposeSemitones);
  }, [frequency, a4, preferFlats, transposeSemitones]);

  const cents = noteInfo?.cents ?? 0;
  const meterValue = Math.max(-50, Math.min(50, cents));
  const needleRotation = meterValue * 1.2;

  const tuningMessage = useMemo(() => {
    if (!noteInfo) return "音を鳴らしてください";
    if (Math.abs(cents) <= 3) return "In Tune";
    if (cents > 3) return "少し高いです";
    return "少し低いです";
  }, [noteInfo, cents]);

  const tuningColor = useMemo(() => {
    if (!noteInfo) return "text-slate-400";
    if (Math.abs(cents) <= 3) return "text-emerald-500";
    if (Math.abs(cents) <= 10) return "text-amber-500";
    return "text-rose-500";
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

  async function startTuner() {
    try {
      setErrorMessage("");
      setStatus("listening");

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

      analyser.fftSize = 4096;
      analyser.smoothingTimeConstant = 0.2;

      source.connect(analyser);
      analyserRef.current = analyser;

      const buffer = new Float32Array(analyser.fftSize);

      const detectPitch = () => {
        if (!analyserRef.current || !audioContextRef.current) return;

        analyserRef.current.getFloatTimeDomainData(buffer);
        const result = autoCorrelate(buffer, audioContextRef.current.sampleRate);

        if (result) {
          setFrequency((prev) => {
            if (!prev) return result.frequency;
            return prev * 0.72 + result.frequency * 0.28;
          });
          setClarity(result.clarity);
        } else {
          setClarity(0);
        }

        animationFrameRef.current = requestAnimationFrame(detectPitch);
      };

      detectPitch();
    } catch (error) {
      console.error(error);
      setStatus("error");
      setFrequency(null);
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
    setFrequency(null);
    setClarity(0);
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
              A4基準、移調楽器、基準音再生に対応したURL版MVPです。
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-100">
            <div className="text-xs uppercase tracking-widest text-cyan-300">Reference</div>
            <div className="mt-1 text-2xl font-semibold">A4 = {a4}Hz</div>
          </div>
        </header>

        <div className="grid flex-1 gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-cyan-950/40 sm:p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="relative mb-6 flex h-72 w-72 items-center justify-center rounded-full border border-white/10 bg-slate-900 shadow-inner shadow-black/60 sm:h-96 sm:w-96">
                <div className="absolute inset-5 rounded-full border border-white/10" />
                <div className="absolute inset-12 rounded-full border border-white/5" />

                <div
                  className="absolute bottom-1/2 left-1/2 h-32 w-1 origin-bottom rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/40 transition-transform duration-150 sm:h-44"
                  style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
                />

                <div className="absolute bottom-1/2 left-1/2 h-5 w-5 -translate-x-1/2 translate-y-1/2 rounded-full bg-white shadow-lg" />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className={`text-8xl font-bold tracking-tight sm:text-9xl ${tuningColor}`}>
                    {noteInfo ? noteInfo.noteName : "--"}
                  </div>
                  <div className="mt-1 text-2xl text-slate-300">
                    {noteInfo
                      ? `${getSolfege(noteInfo.midi, transposeSemitones)} / Oct ${noteInfo.octave}`
                      : "Waiting"}
                  </div>
                  <div className={`mt-5 text-xl font-semibold ${tuningColor}`}>
                    {tuningMessage}
                  </div>
                </div>
              </div>

              <div className="mb-5 grid w-full grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="text-xs tracking-widest text-slate-400">FREQUENCY</div>
                  <div className="mt-1 text-xl font-semibold">
                    {frequency ? `${frequency.toFixed(2)} Hz` : "--"}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="text-xs tracking-widest text-slate-400">CENTS</div>
                  <div className={`mt-1 text-xl font-semibold ${tuningColor}`}>
                    {noteInfo ? `${cents > 0 ? "+" : ""}${cents.toFixed(1)}` : "--"}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="text-xs tracking-widest text-slate-400">CLARITY</div>
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
              <h2 className="text-lg font-semibold">A4 Reference</h2>
              <p className="mt-1 text-sm text-slate-400">
                オーケストラ練習では 442Hz を初期値にしています。
              </p>

              <div className="mt-4 grid grid-cols-5 gap-2">
                {[440, 441, 442, 443, 444].map((value) => (
                  <button
                    key={value}
                    onClick={() => setA4(value)}
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
                移調楽器では、実音に対する記譜上の音名を表示できます。
              </p>

              <div className="mt-4 space-y-2">
                {INSTRUMENT_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setTransposeSemitones(preset.value)}
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
                合奏前の調音用に、基準音を鳴らせます。
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
                <li>Start Tuning を押します。</li>
                <li>ブラウザのマイク使用を許可します。</li>
                <li>楽器で長めに音を出します。</li>
                <li>針が中央、CENTS が 0 に近づけば調音完了です。</li>
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