// app/works/page.tsx
import Image from "next/image";
import Link from "next/link";

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
      {/* Works用ヒーロー画像 */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="relative overflow-hidden rounded-3xl bg-sky-900 text-white">
            <Image
              src="/2ef18b1d-b6e5-4712-ba8c-cba4cb8a80b3.png"
              alt="HitoriBIZ works hero"
              fill
              className="object-cover opacity-80"
              priority
            />

            <div className="relative z-10 px-6 py-12 md:px-10 md:py-16">
              <p className="text-xs font-semibold tracking-[0.2em] text-sky-100">
                WORKS
              </p>
              <h1 className="mt-3 text-2xl font-bold leading-snug md:text-3xl">
                「つくって終わり」ではなく、<br />
                届けるところまで一緒に。
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-sky-50/90 md:text-base">
                実際にご一緒したプロジェクトの一部を、公開できる範囲でご紹介します。
                ここに掲載していない非公開案件も多数ありますので、
                近い業種の事例があるかどうかはお問い合わせください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* カード一覧 */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              公開可能な事例の一部をご紹介しています。
            </span>
            <Link
              href="/contact"
              className="hidden text-xs font-semibold text-sky-700 hover:text-sky-900 md:inline-block"
            >
              近い事例があるか問い合わせる →
            </Link>
          </div>

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
