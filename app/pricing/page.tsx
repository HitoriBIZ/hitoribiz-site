// app/pricing/page.tsx
import Image from "next/image";
import Link from "next/link";

const priceNotes = [
  "※表示金額は目安です。内容・ページ数・素材の有無により変わります。",
  "※お見積りはヒアリング後にご提示します。",
  "※制作後の運用サポート（更新・改善）もご相談可能です。",
];

const plans = [
  {
    name: "ライト",
    desc: "まずは名刺代わりの1ページから。必要最小限で早く整えます。",
    price: "目安：¥50,000〜",
    items: [
      "1ページ（LP）構成",
      "スマホ最適化",
      "文章の整え・簡易添削",
      "お問い合わせ導線の設置",
    ],
    badge: "最短で公開",
  },
  {
    name: "スタンダード",
    desc: "サービス紹介・実績・プロフィールなど、基本ページを揃えて信頼感を作ります。",
    price: "目安：¥120,000〜",
    items: [
      "〜5ページ構成（例：Home/Services/Works/About/Contact）",
      "スマホ最適化",
      "基本SEO（タイトル/ディスクリプション等）",
      "公開後の軽微調整（1回）",
    ],
    badge: "おすすめ",
  },
  {
    name: "EC（Shopify）",
    desc: "商品登録〜決済・配送設定まで。運用しやすい形に整えます。",
    price: "目安：¥200,000〜",
    items: [
      "Shopify初期設定",
      "商品登録サポート（目安：〜10点）",
      "決済・配送・税設定",
      "運用の基本レクチャー",
    ],
    badge: "EC向け",
  },
];

export default function PricingPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-10 lg:grid-cols-2 lg:items-center lg:py-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-slate-500">
              PRICING
            </p>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              料金の目安
              <span className="block text-slate-700">
                まずは状況に合わせて、最適な進め方をご提案します
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">
              HitoriBIZは、<span className="font-medium">小規模事業のためのWeb制作</span>と
              <span className="font-medium">AI・デジタル活用</span>を伴走支援します。
              料金は一律ではなく、ゴールと作業範囲に合わせてお見積りします。
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/booking"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                無料相談（30分）を予約する
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                サービスを見る
              </Link>
            </div>
          </div>

          {/* Right: Kaitoくん */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-sm">
              <Image
                src="/hero-kaito.png"
                alt="HitoriBIZ メインアンバサダー Kaitoくん"
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-extrabold text-slate-900">{p.name}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {p.badge}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-700">{p.desc}</p>

              <div className="mt-4 text-xl font-extrabold text-slate-900">
                {p.price}
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {p.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="mt-[0.35rem] h-1.5 w-1.5 flex-none rounded-full bg-slate-400" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Link
                  href="/booking"
                  className="inline-flex w-fit items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                >
                  相談してみる
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* NOTES */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-base font-bold text-slate-900">補足</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {priceNotes.map((n) => (
              <li key={n} className="flex gap-2">
                <span className="mt-[0.35rem] h-1.5 w-1.5 flex-none rounded-full bg-slate-400" />
                <span>{n}</span>
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              無料相談（30分）を予約する
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
