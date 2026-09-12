import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "弦楽チューナー | String Tuner for Violin, Viola & Cello",
  description:
    "バイオリン、ビオラ、チェロの開放弦調弦に。A4 440〜444Hz、基準音、リアルタイム音程検出を備えたiPhone・iPadアプリです。",
};

const instruments = [
  { name: "Violin / バイオリン", strings: "G3 · D4 · A4 · E5" },
  { name: "Viola / ビオラ", strings: "C3 · G3 · D4 · A4" },
  { name: "Cello / チェロ", strings: "C2 · G2 · D3 · A3" },
];

export default function OrchestraTunerProductPage() {
  return (
    <main className="min-h-screen bg-[#120d18] text-white">
      <section className="overflow-hidden border-b border-white/10">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:py-28">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">
              HitoriBIZ Orchestra Tools
            </p>
            <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-7xl">
              弦楽チューナー
            </h1>
            <p className="mt-3 text-2xl font-semibold text-white/70">String Tuner</p>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75">
              バイオリン、ビオラ、チェロの開放弦を、練習前や合奏前にすばやく調弦。
              Clear open-string tuning for violin, viola, and cello.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <span className="rounded-full bg-violet-500 px-5 py-3 font-semibold">iPhone &amp; iPad</span>
              <span className="rounded-full border border-white/20 px-5 py-3 font-semibold">iOS 17+</span>
              <span className="rounded-full border border-white/20 px-5 py-3 font-semibold">¥600</span>
            </div>
            <p className="mt-7 text-sm text-white/55">App Store release coming soon.</p>
          </div>

          <div className="mx-auto w-full max-w-sm rounded-[2.75rem] border border-white/15 bg-gradient-to-b from-violet-500/25 to-orange-400/10 p-7 shadow-2xl shadow-violet-950/60">
            <Image
              src="/icons/string-tuner-icon-1024.png"
              width={220}
              height={220}
              priority
              alt="String Tuner app icon"
              className="mx-auto mb-7 rounded-[2rem] shadow-xl"
            />
            <div className="rounded-3xl bg-black/25 p-6 text-center">
              <p className="text-sm text-white/60">TARGET</p>
              <p className="mt-2 text-8xl font-black">A</p>
              <p className="font-mono text-lg text-white/70">A4 · 442.00 Hz</p>
              <div className="mt-8 h-2 rounded-full bg-gradient-to-r from-orange-400 via-emerald-400 to-orange-400" />
              <p className="mt-8 text-emerald-300">IN TUNE</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-3xl font-bold">Open strings / 対応開放弦</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {instruments.map((instrument) => (
            <article key={instrument.name} className="rounded-3xl border border-white/10 bg-white/[0.06] p-7">
              <h3 className="text-xl font-bold">{instrument.name}</h3>
              <p className="mt-4 font-mono text-lg text-violet-200">{instrument.strings}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.035]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-20 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Built for rehearsal</h2>
            <ul className="mt-6 space-y-3 leading-7 text-white/75">
              <li>リアルタイムのマイク音程検出</li>
              <li>A4 Reference：440 / 441 / 442 / 443 / 444 Hz</li>
              <li>各開放弦のReference Tone</li>
              <li>iPhone・iPad対応</li>
              <li>日本語・英語対応</li>
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Privacy by design</h2>
            <p className="mt-6 leading-8 text-white/75">
              音声は端末内だけで解析されます。録音、保存、アップロードは行いません。
              Audio is analyzed only on your device and is never recorded, stored, or uploaded.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 text-sm text-white/60">
        <div className="flex flex-wrap gap-6">
          <Link className="underline underline-offset-4" href="/orchestra-tuner/support">Support</Link>
          <Link className="underline underline-offset-4" href="/orchestra-tuner/privacy">Privacy Policy</Link>
          <Link className="underline underline-offset-4" href="/orchestra-tools">Other Orchestra Tools</Link>
        </div>
        <p className="mt-8">© 2026 Olive Co., Ltd.</p>
      </section>
    </main>
  );
}
