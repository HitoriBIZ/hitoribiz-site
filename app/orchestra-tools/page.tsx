"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";
type ToolIconType = "metronome" | "tuner" | "drone" | "tempo";

const tools = [
  {
    name: "Metronome",
    subtitle: "Orchestra Practice Metronome",
    description:
      "オーケストラ練習・個人練習に使いやすい、視認性の高いメトロノームツール。",
    points: ["テンポ確認", "基礎練習", "合奏前の準備"],
    iconType: "metronome" as ToolIconType,
    iconBg: "from-cyan-300 to-sky-400",
    manualUrl: "/manuals/metronome.pdf",
  },
  {
    name: "Tuner",
    subtitle: "Instrument Tuning Tool",
    description:
      "弦楽器・管楽器・声楽など、日々の音程確認をサポートするシンプルなチューナー。",
    points: ["音程確認", "楽器調整", "練習前チェック"],
    iconType: "tuner" as ToolIconType,
    iconBg: "from-emerald-300 to-teal-400",
    manualUrl: "/manuals/tuner.pdf",
  },
  {
    name: "Drone Tone",
    subtitle: "Pitch & Harmony Training",
    description:
      "ロングトーン、音程感、ハーモニー練習に役立つ持続音トレーニングツール。",
    points: ["ロングトーン", "純正律感覚", "ハーモニー練習"],
    iconType: "drone" as ToolIconType,
    iconBg: "from-violet-300 to-fuchsia-400",
    manualUrl: "/manuals/drone-tone.pdf",
  },
  {
    name: "Tempo Practice",
    subtitle: "Step-by-Step Tempo Training",
    description:
      "難しいパッセージを、ゆっくりから段階的にテンポアップして練習するためのツール。",
    points: ["反復練習", "段階的テンポアップ", "苦手箇所の克服"],
    iconType: "tempo" as ToolIconType,
    iconBg: "from-amber-300 to-orange-400",
    manualUrl: "/manuals/tempo-practice.pdf",
  },
];

const audiences = [
  "プロ・アマチュアオーケストラ団員",
  "弦楽器・管楽器・打楽器・鍵盤楽器の演奏者",
  "室内楽・アンサンブルのメンバー",
  "音楽教室・個人レッスンの先生と生徒",
  "クラシック音楽を愛するすべての方",
];

function ToolIcon({
  type,
  className = "h-6 w-6",
}: {
  type: ToolIconType;
  className?: string;
}) {
  switch (type) {
    case "metronome":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M8 20h8" />
          <path d="M9.5 20L11 5h2l1.5 15" />
          <path d="M10.5 9h3" />
          <path d="M12 3v6" />
          <path d="M14.5 6.5L12 10" />
        </svg>
      );

    case "tuner":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M8 4v8" />
          <path d="M16 4v8" />
          <path d="M8 4c-2 0-3 1.5-3 3.5V12" />
          <path d="M16 4c2 0 3 1.5 3 3.5V12" />
          <path d="M12 10v10" />
          <path d="M9 20h6" />
        </svg>
      );

    case "drone":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M2 12c2.2 0 2.2-4 4.4-4s2.2 8 4.4 8 2.2-8 4.4-8 2.2 4 4.4 4 2.2-2 2.4-2" />
          <path d="M2 16h20" opacity="0.35" />
        </svg>
      );

    case "tempo":
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
          aria-hidden="true"
        >
          <path d="M4 18h16" />
          <path d="M6 16l4-4 3 2 5-6" />
          <path d="M15 8h3v3" />
        </svg>
      );

    default:
      return null;
  }
}

export default function OrchestraToolsPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [instrument, setInstrument] = useState("");
  const [organization, setOrganization] = useState("");
  const [consent, setConsent] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email || !consent) {
      setFormState("error");
      setMessage("メールアドレスと同意チェックは必須です。");
      return;
    }

    try {
      setFormState("submitting");
      setMessage("");

      const res = await fetch("/api/orchestra-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          nickname,
          instrument,
          organization,
          consent,
          source: "orchestra-tools-lp",
          clientTimestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error("送信に失敗しました。");
      }

      setFormState("success");
      setMessage(
        "ご登録ありがとうございます。無料ツールのURL・QRコード・使い方説明書をメールでご案内します。"
      );

      setEmail("");
      setNickname("");
      setInstrument("");
      setOrganization("");
      setConsent(false);
    } catch (error) {
      console.error(error);
      setFormState("error");
      setMessage(
        "送信中にエラーが発生しました。時間をおいて再度お試しください。"
      );
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.25),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.22),_transparent_35%)]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 py-20 lg:flex-row lg:items-center lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-100">
              HitoriBIZ Orchestra Tools
            </p>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              オーケストラ練習を、
              <span className="block bg-gradient-to-r from-cyan-200 to-violet-200 bg-clip-text text-transparent">
                もっとスマートに。
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
              Metronome、Tuner、Drone Tone、Tempo Practice。
              演奏者の毎日を支える4つの無料ツールを、メール登録者限定でご案内します。
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#register"
                className="rounded-full bg-cyan-300 px-7 py-3 text-center text-sm font-bold text-slate-950 shadow-lg shadow-cyan-300/20 transition hover:bg-cyan-200"
              >
                無料ツールを受け取る
              </a>
              <a
                href="#tools"
                className="rounded-full border border-white/20 px-7 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
              >
                ツールを見る
              </a>
            </div>

            <p className="mt-5 text-sm text-slate-400">
              ※登録後、自動返信メールにて各アプリのURL・QRコード・使い方説明書PDFをご案内します。
            </p>
          </div>

          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-slate-900/80 p-6">
              <p className="text-sm font-semibold text-cyan-200">
                Free Tools for Musicians
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <div
                    key={tool.name}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                  >
                    <div
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tool.iconBg}`}
                    >
                      <ToolIcon
                        type={tool.iconType}
                        className="h-5 w-5 text-slate-950"
                      />
                    </div>
                    <h3 className="font-bold">{tool.name}</h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {tool.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4 text-sm text-cyan-50">
                登録者には、URL・QRコード・説明書PDFをまとめてメールでお届けします。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="bg-white py-20 text-slate-950">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-700">
              Concept
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              練習の小さな不便を、デジタルで解決する。
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              HitoriBIZ Orchestra Toolsは、演奏者が日々の練習で必要とする基本ツールを、
              もっと手軽に使える形で提供するプロジェクトです。
              個人練習、合奏前の確認、音程感のトレーニング、テンポアップ練習まで、
              音楽家の実用に寄り添います。
            </p>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="bg-slate-50 py-20 text-slate-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-700">
              Free Tools
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              登録者限定で受け取れる4つの無料ツール
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              各ツールは、スマートフォンやPCから使えるURL形式を想定しています。
              QRコードをスマホで読み取れば、すぐに練習で活用できます。
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {tools.map((tool) => (
              <article
                key={tool.name}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.iconBg}`}
                >
                  <ToolIcon
                    type={tool.iconType}
                    className="h-6 w-6 text-slate-950"
                  />
                </div>
                <h3 className="text-xl font-bold">{tool.name}</h3>
                <p className="mt-1 text-sm font-medium text-cyan-700">
                  {tool.subtitle}
                </p>
                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {tool.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {tool.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How to get */}
      <section className="bg-white py-20 text-slate-950">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-700">
                How to Get
              </p>
              <h2 className="mt-4 text-3xl font-bold">
                無料ツールの受け取り方法
              </h2>
            </div>

            <div className="grid gap-5 lg:col-span-2">
              {[
                {
                  step: "01",
                  title: "メールアドレスを登録",
                  text: "メールアドレスとニックネームを入力して、無料メルマガに登録します。",
                },
                {
                  step: "02",
                  title: "自動返信メールを受信",
                  text: "登録後、各ツールのURL・QRコード・使い方説明書PDFをメールでお送りします。",
                },
                {
                  step: "03",
                  title: "スマホやPCで利用開始",
                  text: "QRコードを読み取るか、URLを開いて、すぐに練習でご利用いただけます。",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold">{item.title}</h3>
                      <p className="mt-2 leading-7 text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
                For Musicians
              </p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                こんな方におすすめです
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                HitoriBIZ Orchestra Toolsは、演奏の現場に近い目線で設計された、
                シンプルで実用的な練習支援ツールです。
              </p>
            </div>

            <div className="grid gap-3">
              {audiences.map((audience) => (
                <div
                  key={audience}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4"
                >
                  {audience}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PWA Guide */}
      <section className="bg-white py-20 text-slate-950">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-700">
                PWA Style
              </p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                スマホのホーム画面に追加して、アプリのように使えます。
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                HitoriBIZ Orchestra Toolsは、URLを開くだけで使えるWebアプリ形式です。
                iPhoneやAndroidのホーム画面に追加すれば、通常のアプリのようにすぐ起動できます。
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-500">
                App StoreやGoogle Playからのインストールを待たずに、
                練習現場でそのまま使えるのが大きなメリットです。
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="grid gap-5">
                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold">iPhoneの場合</h3>
                  <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                    <li>1. SafariでツールのURLを開きます。</li>
                    <li>2. 画面下の共有ボタンをタップします。</li>
                    <li>3. 「ホーム画面に追加」を選びます。</li>
                    <li>4. 追加をタップすると、ホーム画面から起動できます。</li>
                  </ol>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold">Androidの場合</h3>
                  <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                    <li>1. ChromeでツールのURLを開きます。</li>
                    <li>2. 右上のメニュー「︙」をタップします。</li>
                    <li>3. 「ホーム画面に追加」または「アプリをインストール」を選びます。</li>
                    <li>4. 追加すると、ホーム画面からすぐに起動できます。</li>
                  </ol>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-5 text-sm leading-7 text-cyan-900">
                <strong>ポイント：</strong>
                一度ホーム画面に追加しておくと、練習前にブラウザ検索をしなくても、
                メトロノームやチューナーをすぐに開けます。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="bg-white py-20 text-slate-950">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-slate-950 to-slate-800 p-8 text-white shadow-2xl sm:p-12">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-200">
              Future Vision
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              将来的には、演奏者と楽団を支えるWebshopへ。
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              HitoriBIZ Orchestra Toolsは、無料アプリの提供だけでなく、
              将来的にオーケストラ関連設備、音響製品、楽器メンテナンスツール、
              楽器レンタル情報などを紹介するWebshop併設型の音楽家向けプラットフォームを目指します。
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {[
                "オーケストラ設備商品の紹介",
                "音響製品・練習環境ツールの紹介",
                "楽器メンテナンス用品の紹介",
                "楽器レンタル・機材レンタル情報",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"
                >
                  <p className="font-semibold">{item}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm leading-7 text-slate-400">
              ※将来的に、Sunphonix社など音楽関連企業との連携も視野に入れ、
              演奏者・楽団・音楽教室を支援する実用的な情報とサービスを展開していきます。
            </p>
          </div>
        </div>
      </section>

      {/* Register */}
      <section id="register" className="bg-slate-50 py-20 text-slate-950">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-700">
                Free Registration
              </p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                無料ツールをメールで受け取る
              </h2>
              <p className="mt-5 text-slate-600">
                ご登録いただいた方に、4つの無料ツールのURL・QRコード・使い方説明書PDFをお送りします。
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  required
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold">
                    ニックネーム
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="例：音楽太郎"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    主な楽器
                  </label>
                  <input
                    type="text"
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value)}
                    placeholder="例：Violin / Flute / Piano"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold">
                  所属・活動形態
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="例：アマチュアオーケストラ / 音楽教室 / 個人演奏者"
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              <label className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                  required
                />
                <span>
                  HitoriBIZ Orchestra Toolsの無料ツール案内、使い方説明、今後のアップデート情報、
                  音楽家向けサービスに関するメールを受け取ることに同意します。
                </span>
              </label>

              <button
                type="submit"
                disabled={formState === "submitting"}
                className="w-full rounded-full bg-slate-950 px-7 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formState === "submitting"
                  ? "送信中..."
                  : "無料ツールを受け取る"}
              </button>

              {message && (
                <div
                  className={`rounded-2xl p-4 text-sm ${
                    formState === "success"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </form>

            <p className="mt-6 text-center text-xs leading-6 text-slate-500">
              ご登録情報は、HitoriBIZ Orchestra Toolsのご案内および関連情報の配信目的で利用します。
              不要になった場合は、配信メール内の案内に従っていつでも解除できます。
            </p>
          </div>
        </div>
      </section>

      {/* User Guides */}
      <section className="bg-white py-20 text-slate-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-700">
              User Guides
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              使い方説明書
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              各ツールの基本操作、スマホのホーム画面への追加方法、練習での活用例を、
              日本語・英語併記のPDFでご覧いただけます。
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {tools.map((tool) => (
              <article
                key={`${tool.name}-manual`}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.iconBg}`}
                >
                  <ToolIcon
                    type={tool.iconType}
                    className="h-6 w-6 text-slate-950"
                  />
                </div>

                <h3 className="text-xl font-bold">{tool.name}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  日本語・英語併記の使い方説明書をPDFで開きます。
                </p>

                <a
                  href={tool.manualUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  PDFを開く
                </a>
              </article>
            ))}
          </div>

          <p className="mt-8 text-center text-sm leading-7 text-slate-500">
            ※PDFはブラウザで閲覧できます。必要に応じて保存・印刷してご利用ください。
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 px-6 py-10 text-center text-sm text-slate-400">
        <p className="font-semibold text-white">HitoriBIZ Orchestra Tools</p>
        <p className="mt-2">HitoriBIZ by Olive Co., Ltd.</p>
        <p className="mt-1">contact@hitori-biz.com</p>
      </footer>
    </main>
  );
}