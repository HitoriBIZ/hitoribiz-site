// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* ヒーロー画像＋タイトル */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* 横長バナー：高さ固定＆relative */}
          <div className="relative h-[260px] overflow-hidden rounded-3xl bg-sky-900 text-white md:h-[320px]">
            {/* 背景イラスト */}
            <Image
              src="/hero-home.png"
              alt="HitoriBIZ hero"
              fill
              className="object-cover opacity-80"
              priority
            />

            {/* 文字オーバーレイ */}
            <div className="relative z-10 flex h-full flex-col justify-center gap-4 px-6 md:px-10">
              <p className="text-xs font-semibold tracking-[0.2em] text-sky-100">
                HitoriBIZ
              </p>
              <h1 className="text-2xl font-bold leading-snug md:text-3xl">
                ひとりで全部できる、AIとあなたのビジネス。
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-sky-50/90 md:text-base">
                HitoriBIZ は、ひとりビジネスや小さなチームの
                「ホームページ・EC・LINE・SNS・AI活用」を、
                企画から運用まで横に並んでサポートする
                デジタルパートナーです。
              </p>

              <div className="mt-2 flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-sky-900 shadow-sm hover:bg-sky-50"
                >
                  サービスを見る
                </Link>
                <Link
                  href="/works"
                  className="rounded-full border border-sky-200/80 bg-sky-900/30 px-5 py-2 text-sm font-semibold text-white backdrop-blur hover:bg-sky-800/60"
                >
                  制作事例を見る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 特徴カード３つ */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <div className="grid gap-4 text-sm md:grid-cols-3 md:text-xs">
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
                Webサイト、LP、ブログ、アプリなど、
                制作後の運用・改善も継続サポート可能です。
              </p>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-slate-800">
                3. 外部サービスに依存しすぎない設計
              </h2>
              <p className="mt-2 text-slate-600">
                将来的に「自社の資産になるメディア」を
                育てる設計を大切にしています。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
