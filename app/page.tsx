// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      {/* Hero */}
      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-500">
            PROJECT
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            HitoriBIZは、
            <br className="hidden sm:block" />
            スモールなビジネスにAIとWebの力を
          </h1>

          <p className="mt-6 text-base leading-relaxed text-slate-600">
            個人事業主・フリーランスなど、小規模事業のための
            ホームページ・ECサイト制作とデジタル活用をサポートしています。
            難しい専門用語はできるだけ使わず、
            「一緒に手を動かすパートナー」として、
            集客と業務効率化をお手伝いします。
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              相談予約
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              サービスを見る
            </Link>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative mx-auto w-full max-w-xl">
          <Image
            src="/hero-home.png"
            alt="HitoriBIZ ヒーロー画像"
            width={1200}
            height={900}
            priority
            className="h-auto w-full rounded-2xl border border-slate-200 shadow-sm"
          />
        </div>
      </section>

      {/* Services */}
      <section className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Web制作</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            伝わる構成と文章づくりから、公開まで。スマホ最適化込みで整えます。
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">Shopify（EC）</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            商品登録・決済・配送設定から、運用のコツまで伴走します。
          </p>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">AI活用</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            文章作成・企画・FAQ整備など、実務に効く使い方を整えます。
          </p>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mt-24 rounded-2xl bg-slate-50 px-6 py-10 text-center">
        <h2 className="text-xl font-bold text-slate-900">
          はじめに、どこから手を付けるべき？
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600">
          いまの状況を整理して、優先順位を一緒に決めます。まずは気軽にご相談ください。
        </p>

        <div className="mt-6">
          <Link
            href="/booking"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            無料相談へ
          </Link>
        </div>
      </section>
    </main>
  );
}
