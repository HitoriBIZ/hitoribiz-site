// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12">
          {/* 上の大きいロゴは置かない */}

          {/* ヒーローセクション（見出し＋説明） */}
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <p className="text-xs font-semibold tracking-widest text-slate-500">
                HitoriBIZ
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
                ひとりで全部できる、AIとあなたのビジネス。
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
                HitoriBIZ は、ひとりビジネスや小さなチームの
                「ホームページ・EC・LINE・SNS・AI活用」を、
                企画から運用まで横に並んでサポートするデジタルパートナーです。
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="rounded-full bg-sky-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-800"
                >
                  サービスを見る
                </Link>
                <Link
                  href="/works"
                  className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-sky-500 hover:text-sky-700"
                >
                  制作事例を見る
                </Link>
              </div>
            </div>

            {/* 右側：特徴カード */}
            <div className="grid gap-4 text-sm md:text-xs">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-800">
                  1. 企画から一緒に
                </h2>
                <p className="mt-2 text-slate-600">
                  「何から始めればいいのか分からない」状態から、
                  言語化・情報設計・サイト構造まで伴走します。
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-800">
                  2. 制作と運用まで
                </h2>
                <p className="mt-2 text-slate-600">
                  Webサイト、LP、ブログ、アプリなど、制作後の運用・改善も継続サポート可能です。
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <h2 className="text-sm font-semibold text-slate-800">
                  3. 外部サービスに依存しすぎない設計
                </h2>
                <p className="mt-2 text-slate-600">
                  将来的に「自社の資産になるメディア」を育てる設計を大切にしています。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
