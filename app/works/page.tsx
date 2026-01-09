// app/works/page.tsx
import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    title: "HitoriBIZ（当サイト）",
    purpose: "相談につながる導線づくり",
    points: ["スマホ最適化", "Blog連携", "シンプルで迷わない構成"],
    status: "公開中",
  },
  {
    title: "（サンプル）工房・作家サイト",
    purpose: "作品の魅力を伝え、問い合わせにつなげる",
    points: ["ストーリー重視", "写真配置", "購入・相談導線"],
    status: "掲載準備中",
  },
  {
    title: "（サンプル）小規模EC（Shopify）",
    purpose: "少ない商品点数でも買いやすく",
    points: ["情報整理", "FAQ設計", "安心感のある導線"],
    status: "掲載準備中",
  },
];

export default function WorksPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:py-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-slate-500">
              WORKS
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              実績は順次追加していきます。
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">
              いまは、制作の考え方が伝わる内容を中心に掲載しています。
              実案件の掲載が可能になり次第、具体的な事例を追加していきます。
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                サービスを見る
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                相談する
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

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-bold text-slate-900">制作事例</h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                  {c.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-700">
                <span className="font-medium">目的：</span>
                {c.purpose}
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {c.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-base font-bold text-slate-900">制作ポリシー</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>見た目より「伝わる」こと</li>
            <li>公開後に「育てられる」こと</li>
            <li>難しい言葉を使わないこと</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
