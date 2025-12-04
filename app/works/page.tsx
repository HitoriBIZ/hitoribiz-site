// app/works/page.tsx
import Image from "next/image";

export default function WorksPage() {
  return (
    <main className="bg-slate-50">
      {/* HERO（WORKS 専用） */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="relative overflow-hidden rounded-3xl bg-sky-900 text-white">
            {/* 背景イラスト */}
            <Image
              src="/hero-home.png"
              alt="制作事例のイメージ"
              fill
              priority
              className="object-cover opacity-70"
            />
            {/* オーバーレイテキスト */}
            <div className="relative z-10 px-6 py-10 md:px-10 md:py-14">
              <p className="text-xs font-semibold tracking-[0.2em] text-sky-200">
                WORKS
              </p>
              <h1 className="mt-3 max-w-xl text-2xl font-bold leading-tight md:text-3xl">
                「つくって終わり」ではなく、
                <br />
                届けるところまで一緒に。
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-sky-50/90 md:text-base">
                実際にご一緒したプロジェクトの一部を、公開できる範囲でご紹介します。
                非公開案件も多くありますので、近い事例があるかどうかは
                お気軽にお問い合わせください。
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            ※ 公開可能な事例のみを掲載しています。
          </p>
        </div>
      </section>

      {/* 事例カード一覧 */}
      <section className="bg-slate-50 pb-14">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
          {/* 1件目 */}
          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-sky-700">
              WEBサイト設計・制作
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">
              HARIO Memorial Tsubo 特設サイト
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              ブランドコンセプト設計から情報設計、商品ストーリーの文章構成までを担当。
              Shopify を土台とした特設サイトとして構築しました。
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                #ブランド設計
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                #商品ストーリー
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                #Shopify
              </span>
            </div>
          </article>

          {/* 2件目 */}
          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold text-sky-700">
              アプリ + Web 連携
            </p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">
              IoT 電気ドリップコーヒーメーカー 用アプリ＆LP
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              スマホアプリと連動するコーヒーメーカーのプロモーション用 LP と、
              アプリストア向けスクリーンショット・説明文の制作を支援。
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                #IoT
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                #Flutter
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                #アプリ連携
              </span>
            </div>
          </article>

          {/* 3件目 */}
          <article className="rounded-3xl bg-white p-6 shadow-sm md:col-span-2">
            <p className="text-xs font-semibold text-sky-700">自社サイト</p>
            <h2 className="mt-2 text-lg font-bold text-slate-900">
              HitoriBIZ 公式サイト（本サイト）
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">
              Next.js・Vercel・Tailwind CSS の構成で、
              ひとりビジネス向けの世界観と、具体的なサービス内容を分かりやすく伝えることを意識して設計しています。
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                #Nextjs
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                #TailwindCSS
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                #自社メディア
              </span>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
