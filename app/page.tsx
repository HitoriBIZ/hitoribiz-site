// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 lg:grid-cols-2 lg:items-center lg:py-14">
          {/* Left */}
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-slate-500">
              PROJECT
            </p>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              HitoriBIZは、
              <span className="block text-slate-700">
                スモールなビジネスにAIとWebの力をお届けするプロジェクトです。
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">
              <span className="font-medium">個人事業主・フリーランスなど</span>
              、小規模事業のための
              <span className="font-medium">ホームページ・ECサイト制作</span>と
              <span className="font-medium">デジタル活用</span>をサポートしています。
              難しい専門用語はできるだけ使わず、
              <span className="font-medium">「一緒に手を動かすパートナー」</span>
              として、集客と業務効率化をお手伝いします。
            </p>

            {/* CTA */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                相談予約
              </Link>

              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                Blogを見る
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                サービスを見る
              </Link>
            </div>
          </div>

          {/* Right: hero-home.png */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
              <Image
                src="/hero-home.png"
                alt="HitoriBIZ ヒーロー画像"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 下段（例） */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Web制作</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              伝わる構成と文章づくりから、公開まで。スマホ最適化込みで整えます。
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Shopify（EC）</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              商品登録・決済・配送設定から、運用のコツまで伴走します。
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">AI活用</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              文章作成・企画・FAQ整備など、実務に効く使い方を整えます。
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-base font-bold text-slate-900">
            はじめに、どこから手を付けるべき？
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            いまの状況を整理して、優先順位を一緒に決めます。まずは気軽にご相談ください。
          </p>
          <div className="mt-4">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              無料相談へ
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
