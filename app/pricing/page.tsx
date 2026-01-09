// app/pricing/page.tsx
import Image from "next/image";
import Link from "next/link";

const plans = [
  {
    name: "スタータープラン",
    desc: "名刺代わりのシンプルなサイト",
    price: "¥99,000〜",
    items: ["1ページ構成", "スマホ最適化", "問い合わせ導線"],
    badge: "最初の一歩",
  },
  {
    name: "ベーシックプラン",
    desc: "標準的な事業サイト",
    price: "¥198,000〜",
    items: ["5ページ構成", "文章・構成整理サポート", "導線の整備"],
    badge: "おすすめ",
    highlight: true,
  },
  {
    name: "グロースプラン",
    desc: "集客・運用まで視野に入れた構成",
    price: "¥298,000〜",
    items: ["ベーシック＋Blog導線", "更新・改善の考え方共有", "育てる前提の設計"],
    badge: "育てる",
  },
];

export default function PricingPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:py-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-slate-500">
              PRICING
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              必要なものだけを選べる、
              <span className="block text-slate-700">小さく始める料金設計。</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">
              HitoriBIZは、まずは小さく始めて、状況に合わせて育てていくことを前提にしています。
              無理に高いプランをすすめず、いま必要な範囲を一緒に整理します。
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                無料相談（30分）
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                サービスを見る
              </Link>
            </div>
          </div>

          {/* 右：Kaitoくん */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
              <Image
                src="/hero-kaito.png"
                alt="HitoriBIZのアンバサダー「Kaitoくん」"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-bold text-slate-900">目安プラン</h2>
        <p className="mt-2 text-sm text-slate-600">
          ※内容や規模により前後します。詳細は相談時にご案内します。
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={[
                "rounded-3xl border bg-white p-6 shadow-sm",
                p.highlight ? "border-slate-900" : "border-slate-200",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                  {p.badge}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-700">{p.desc}</p>
              <p className="mt-4 text-2xl font-extrabold text-slate-900">
                {p.price}
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {p.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>

              <div className="mt-6">
                <Link
                  href="/contact"
                  className={[
                    "inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm",
                    p.highlight
                      ? "bg-slate-900 text-white hover:bg-slate-800"
                      : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
                  ].join(" ")}
                >
                  相談してみる
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Shopify */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-base font-bold text-slate-900">EC（Shopify）</h3>
          <p className="mt-2 text-sm text-slate-700">
            新規構築：<span className="font-medium">¥298,000〜</span>
            （商品登録・決済・配送設定を含む）
          </p>
          <p className="mt-3 text-sm text-slate-700">
            商品点数や運用方針に合わせて、最小構成から一緒に設計します。
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-bold text-slate-900">大切にしていること</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>無理に高いプランをすすめない</li>
            <li>今の状況に合った提案をする</li>
            <li>分からないことを分からないままにしない</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
