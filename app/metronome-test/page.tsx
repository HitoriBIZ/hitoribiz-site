"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import TesterForm from "./components/TesterForm";

type Lang = "ja" | "en";

const copy = {
  ja: {
    heroEyebrow: "無料ベータテスター募集中",
    heroTitle: "Orchestra Metronome",
    heroBody: (
      <>
        舞台で、本当に使えるテンポ設計。<br />
        練習と本番をつなぐ、新しいリズム体験。
      </>
    ),
    heroSub:
      "このページはテスター募集専用ページです。無料テスターとして参加し、App Store / Google Play 公開時に優先案内を受け取れます。",
    primaryCta: "無料テスターに参加する（限定公開）",
    secondaryCta: "登録フォームへ進む",
    appStoreSoon: "App Store（近日公開）",
    googlePlaySoon: "Google Play（近日公開）",
    releaseNote: "※公開日は審査状況により前後する場合があります。",

    featuresTitle: "アプリの特長",
    feature1: "✓ 大きく見やすい BPM 表示",
    feature2: "✓ 舞台照明下でも視認性の高いUI",
    feature3: "✓ テンポ微調整・拍子設定対応",
    feature4: "✓ 本番を想定したシンプル設計",

    benefitTitle: "参加メリット",
    benefit1: "正式公開前に先行体験できます",
    benefit2: "フィードバックが今後の改善に反映されます",
    benefit3: "公開時に優先案内を受け取れます",

    testerTitle: "無料テスター登録・公開通知",
    testerBody:
      "テスト参加や公開に関するご案内を優先してお送りします。スパム配信はありません。重要なお知らせのみお届けします。",
    trustNote:
      "登録は無料です。テストおよび公開に関する重要なお知らせのみお送りします。",

    midCtaTitle: "今すぐ登録して、最初のテスターになりませんか？",
    midCtaButton: "無料テスター登録はこちら",

    footerBrand: "Orchestra Metronome | HitoriBIZ by Olive Co., Ltd.",
    footerCopy: "© 2026 HitoriBIZ. All rights reserved.",
  },

  en: {
    heroEyebrow: "Now Inviting Free Beta Testers",
    heroTitle: "Orchestra Metronome",
    heroBody: (
      <>
        Tempo design that truly works on stage.<br />
        A new rhythm experience connecting practice and performance.
      </>
    ),
    heroSub:
      "This page is for beta tester registration. Join as a free beta tester and get priority updates when the app launches on the App Store and Google Play.",
    primaryCta: "Join Free Beta Testing (Limited Access)",
    secondaryCta: "Go to Registration Form",
    appStoreSoon: "App Store (Coming Soon)",
    googlePlaySoon: "Google Play (Coming Soon)",
    releaseNote: "*Release timing may change depending on review status.",

    featuresTitle: "App Features",
    feature1: "✓ Large, easy-to-read BPM display",
    feature2: "✓ High-visibility UI even under stage lighting",
    feature3: "✓ Fine tempo adjustment and time signature support",
    feature4: "✓ Simple design focused on real performance use",

    benefitTitle: "Why Join",
    benefit1: "Get early access before the public launch",
    benefit2: "Your feedback helps shape the final product",
    benefit3: "Receive priority launch updates",

    testerTitle: "Free Beta Registration / Release Notification",
    testerBody:
      "You will receive priority updates about the beta test and launch. No spam. Only important updates related to testing and release.",
    trustNote:
      "Registration is free. We only send important updates about the beta test and launch.",

    midCtaTitle: "Join now and become one of our first testers.",
    midCtaButton: "Join Free Beta Testing",

    footerBrand: "Orchestra Metronome | HitoriBIZ by Olive Co., Ltd.",
    footerCopy: "© 2026 HitoriBIZ. All rights reserved.",
  },
};

export default function MetronomePage() {
  const [lang, setLang] = useState<Lang>("ja");
  const t = useMemo(() => copy[lang], [lang]);

  const scrollToTester = () => {
    const el = document.getElementById("tester");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="bg-black">
      {/* HERO */}
      <section className="relative flex min-h-[92vh] w-full items-center justify-center overflow-hidden text-white">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/metronome-hero-stage.jpg"
            alt="Orchestra Metronome Stage"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>

        {/* Language Switch */}
        <div className="absolute right-6 top-6 z-20">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-sm backdrop-blur">
            <span className="text-gray-300">🌐</span>

            <button
              type="button"
              onClick={() => setLang("ja")}
              className={`rounded px-2 py-1 transition ${
                lang === "ja"
                  ? "bg-yellow-500 font-semibold text-black"
                  : "text-white hover:bg-white/10"
              }`}
            >
              JP
            </button>

            <span className="text-gray-400">/</span>

            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded px-2 py-1 transition ${
                lang === "en"
                  ? "bg-yellow-500 font-semibold text-black"
                  : "text-white hover:bg-white/10"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div className="mb-5 inline-flex rounded-full border border-yellow-400/40 bg-yellow-500/20 px-4 py-2 text-sm font-medium text-yellow-300">
            {t.heroEyebrow}
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-wide md:text-6xl">
            {t.heroTitle}
          </h1>

          <p className="mb-6 text-lg leading-relaxed text-gray-200 md:text-2xl">
            {t.heroBody}
          </p>

          <p className="mx-auto mb-8 max-w-3xl text-sm leading-7 text-gray-300 md:text-base">
            {t.heroSub}
          </p>

          <div className="flex flex-col justify-center gap-4 md:flex-row">
            <button
              type="button"
              onClick={scrollToTester}
              className="rounded-xl bg-yellow-500 px-8 py-4 text-lg font-semibold text-black transition hover:bg-yellow-600"
            >
              {t.primaryCta}
            </button>

            <button
              type="button"
              onClick={scrollToTester}
              className="rounded-xl border border-gray-300 px-8 py-4 text-lg text-white transition hover:bg-white/10"
            >
              {t.secondaryCta}
            </button>
          </div>

          <div className="mt-6 flex flex-col justify-center gap-3 md:flex-row">
            <div className="rounded-xl border border-gray-400 px-6 py-3 text-gray-300">
              {t.appStoreSoon}
            </div>

            <div className="rounded-xl border border-gray-400 px-6 py-3 text-gray-300">
              {t.googlePlaySoon}
            </div>
          </div>

          <p className="mt-6 text-sm text-gray-400">{t.releaseNote}</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white px-6 py-20 text-center text-gray-800">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-3xl font-bold">{t.featuresTitle}</h2>

          <div className="grid gap-8 text-lg md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5">
              {t.feature1}
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5">
              {t.feature2}
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5">
              {t.feature3}
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5">
              {t.feature4}
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-gray-100 px-6 py-20 text-gray-900">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="mb-10 text-3xl font-bold">{t.benefitTitle}</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
              <p className="text-lg leading-8">{t.benefit1}</p>
            </div>
            <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
              <p className="text-lg leading-8">{t.benefit2}</p>
            </div>
            <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
              <p className="text-lg leading-8">{t.benefit3}</p>
            </div>
          </div>
        </div>
      </section>

      {/* MID CTA */}
      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-2xl font-bold md:text-3xl">
            {t.midCtaTitle}
          </h2>

          <button
            type="button"
            onClick={scrollToTester}
            className="rounded-xl bg-yellow-500 px-8 py-4 text-lg font-semibold text-black transition hover:bg-yellow-600"
          >
            {t.midCtaButton}
          </button>
        </div>
      </section>

      {/* TESTER FORM */}
      <section id="tester" className="bg-white px-6 py-20 text-gray-900">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-center text-3xl font-bold">
            {t.testerTitle}
          </h2>

          <p className="mb-4 text-center text-gray-600">{t.testerBody}</p>

          <p className="mb-10 text-center text-sm text-gray-500">
            {t.trustNote}
          </p>

          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm md:p-8">
            <TesterForm lang={lang} />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 bg-black px-6 py-10 text-center text-gray-400">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm">{t.footerBrand}</p>
          <p className="mt-2 text-sm">{t.footerCopy}</p>
        </div>
      </footer>
    </main>
  );
}