// app/services/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:py-14">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-slate-500">
              SERVICES
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              ひとりビジネスの「困った」を、
              <span className="block text-slate-700">一緒に解決します。</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">
              HitoriBIZは、個人事業主・フリーランス・小規模事業のための
              <span className="font-medium">ホームページ／EC制作</span>と、
              <span className="font-medium">AI・デジタル活用</span>の伴走パートナーです。
              「何から始めればいいか分からない」状態から、優先順位を整理して進めます。
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                まずは無料で相談する
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
              >
                料金を見る
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
            <p className="mt-2 text-center text-xs text-slate-500">
              HitoriBIZアンバサダー：Kaitoくん
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-xl font-bold text-slate-900">提供している主なサービス</h2>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {
              title: "ホームページ制作（小規模事業向け）",
              body: "伝わる構成・文章づくりから、デザイン・公開まで。スマホ最適化を前提に、無理なく更新できる形で作ります。",
            },
            {
              title: "ECサイト制作（Shopify）",
              body: "商品登録・決済・配送設定から、運用の考え方まで。「売る仕組み」を一緒に整理します。",
            },
            {
              title: "ブログ／YouTube導線づくり",
              body: "何を書けばいいか、どこに置けばいいか。集客につながる“流れ”を作ります。",
            },
            {
              title: "AI活用サポート（実務向け）",
              body: "ChatGPTなどを使って、文章作成・企画・FAQ・商品説明を効率化。使い方を“型”にします。",
            },
            {
              title: "公開後の改善・運用サポート",
              body: "公開して終わりではなく、見直し・改善・更新が続く形を整えます。",
            },
            {
              title: "進め方（シンプル3ステップ）",
              body: "①無料相談（約30分）→ ②目的と優先順位の整理 → ③必要な部分だけ制作・サポート",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-base font-bold text-slate-900">よくある相談</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>名刺代わりのサイトが欲しい</li>
            <li>既存サイトが古い／スマホで見づらい</li>
            <li>Shopifyを作ったが運用が続かない</li>
            <li>ブログやSNSが続かない（導線が作れない）</li>
            <li>AIを使いたいが何から始めればいいか分からない</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
