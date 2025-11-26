// app/works/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function WorksPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* ===== ヘッダー ===== */}
      <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/hitori-biz-logo.png"
              alt="HitoriBIZ"
              width={200}
              height={45}
              priority
            />
          </Link>
          <nav className="hidden gap-6 text-sm md:flex">
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            <Link href="/works" className="font-semibold">
              Works
            </Link>
            <Link href="/about">About</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      {/* ===== ヒーロー ===== */}
      <section className="border-b bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="overflow-hidden rounded-3xl bg-sky-900 px-5 py-8 text-white md:px-8 md:py-10">
            <p className="text-xs font-semibold tracking-[0.2em] text-sky-200">
              WORKS
            </p>
            <h1 className="mt-3 text-2xl font-bold leading-tight md:text-3xl">
              「つくって終わり」ではなく、<br />
              届けるところまで一緒に。
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-sky-100 md:text-base">
              実際にご一緒したプロジェクトの一部を、公開できる範囲でご紹介します。
              非公開案件も多くありますので、近い事例があるかどうかは
              お気軽にお問い合わせください。
            </p>
          </div>

          <p className="mt-6 text-xs text-slate-600 md:text-sm">
            ※ 公開可能な事例のみを掲載しています。
          </p>
        </div>
      </section>

      {/* ===== 事例リスト ===== */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <div className="mt-4 grid gap-6 md:mt-6 md:grid-cols-2">
            {/* 事例 1：HARIO Memorial Tsubo */}
            <article className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
              <p className="text-xs font-semibold text-sky-700">
                WEBサイト設計・制作
              </p>
              <h2 className="mt-1 text-base font-bold md:text-lg">
                HARIO Memorial Tsubo 特設サイト
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                ブランドコンセプト設計から情報設計、商品ストーリーの文章構成までを担当。
                Shopify を土台とした特設サイトとして構築しました。
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  #ブランド設計
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  #商品ストーリー
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  #Shopify
                </span>
              </div>
            </article>

            {/* 事例 2：IoT コーヒーメーカー */}
            <article className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
              <p className="text-xs font-semibold text-sky-700">
                アプリ＋Web連携
              </p>
              <h2 className="mt-1 text-base font-bold md:text-lg">
                IoT 電気ドリップコーヒーメーカー 用アプリ＆LP
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                スマホアプリと連動するコーヒーメーカーのプロモーション用 LP と、
                アプリストア向けスクリーンショット・説明文の制作を支援。
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  #IoT
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  #Flutter
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  #アプリ連携
                </span>
              </div>
            </article>

            {/* 事例 3：HitoriBIZ 自社サイト */}
            <article className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
              <p className="text-xs font-semibold text-sky-700">
                自社サイト
              </p>
              <h2 className="mt-1 text-base font-bold md:text-lg">
                HitoriBIZ 公式サイト（本サイト）
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">
                Next.js + Vercel + Tailwind CSS の構成で制作。
                ひとりビジネスの世界観を、最小限のページ構成で表現しています。
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  #Next.js
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  #TailwindCSS
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  #Vercel
                </span>
              </div>
            </article>
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-100 px-4 py-5 text-xs text-slate-600 md:text-sm">
            非公開案件については、概要レベルであればお話できるものもあります。
            「こういうことはできますか？」という形でお気軽に
            <Link href="/contact" className="font-semibold text-sky-700 underline-offset-2 hover:underline">
              お問い合わせ
            </Link>
            ください。
          </div>
        </div>
      </section>

      {/* ===== フッター ===== */}
      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} HitoriBIZ / Olive Inc. All rights
            reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:underline">
              プライバシーポリシー
            </Link>
            <Link href="/terms" className="hover:underline">
              利用規約
            </Link>
            <Link href="/about" className="hover:underline">
              事業者情報
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
