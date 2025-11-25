// app/works/page.tsx
import Image from "next/image";

const works = [
  {
    category: "WEBサイト設計・制作",
    title: "HARIO Memorial Tsubo 特設サイト",
    description:
      "ブランドコンセプト設計から情報設計、商品ストーリーの文章構成までを担当。",
    tags: ["ブランド設計", "商品ストーリー", "Shopify"],
  },
  {
    category: "IOTプロダクト",
    title: "IoT電動ドリップコーヒーメーカー アプリUI",
    description:
      "Bluetooth連携アプリの情報設計・画面フロー・コピーライティングを支援。",
    tags: ["モバイルアプリ", "UI/UX", "IoT"],
  },
  {
    category: "ブログ / メディア",
    title: "Andante & Allegro ブログ構築",
    description:
      "クラシック音楽とライフスタイルをテーマにしたブログ立ち上げの企画・構成。",
    tags: ["WordPress", "コンテンツ設計", "SEO"],
  },
];

export default function WorksPage() {
  return (
    <main>
      {/* ヒーローセクション */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="relative h-[220px] overflow-hidden rounded-3xl bg-slate-100 text-white md:h-[260px]">
            {/* 背景イラストそのもの */}
            <Image
              src="/2ef18b1d-b6e5-4712-ba8c-cba4cb8a80b3.png"
              alt="HitoriBIZ works hero"
              fill
              className="object-cover"
              priority
            />

            {/* 下半分にグラデーション＋テキスト */}
            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/90 via-sky-900/60 to-transparent" />

            <div className="relative z-10 flex h-full flex-col justify-center gap-4 px-6 md:px-10">
              <p className="text-xs font-semibold tracking-[0.2em] text-sky-100">
                WORKS
              </p>
              <h1 className="text-2xl font-bold leading-snug md:text-3xl">
                「つくって終わり」ではなく、届けるところまで一緒に。
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-sky-50/90 md:text-base">
                実際にご一緒したプロジェクトの一部を、公開できる範囲でご紹介します。
                非公開案件も多くありますので、近い事例があるかどうかは
                お気軽にお問い合わせください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 制作・導入事例カード一覧 */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <p className="mb-4 text-xs text-slate-500">
            公開可能な事例の一部をご紹介しています。
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {works.map((work) => (
              <article
                key={work.title}
                className="flex flex-col rounded-2xl bg-white p-5 shadow-sm"
              >
                <div className="text-[11px] font-semibold uppercase tracking-wide text-sky-700">
                  {work.category}
                </div>
                <h2 className="mt-2 text-sm font-semibold text-slate-900 md:text-base">
                  {work.title}
                </h2>
                <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-600 md:text-sm">
                  {work.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600 md:text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
