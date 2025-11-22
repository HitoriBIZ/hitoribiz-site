// app/works/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function WorksPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* ヘッダー */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/hitori-biz-logo.png"
              alt="HitoriBIZ"
              width={160}
              height={36}
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
          </nav>
        </div>
      </header>

      {/* バナー */}
      <section aria-label="Works banner" className="border-b bg-slate-900">
        <div className="banner-wrap relative">
          <Image
            src="/banners/work.png"
            alt="HitoriBIZ Works Banner"
            fill
            className="banner-image"
            priority
          />
          <div className="pointer-events-none absolute inset-0 flex items-center bg-slate-900/25">
            <div className="mx-auto max-w-6xl px-4">
              <p className="text-xs tracking-[0.25em] text-slate-100/80">
                WORKS
              </p>
              <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                「つくって終わり」ではなく、
                <br className="hidden md:block" />
                届けるところまで一緒に。
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* 本文 */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="text-lg font-semibold md:text-xl">
            制作・導入事例（一部）
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
            実際にご一緒したプロジェクトの一部を、公開できる範囲でご紹介します。
            ここに掲載していない非公開案件も多数ありますので、
            近い業種の事例があるかどうかはお問い合わせください。
          </p>

          <div className="mt-8 space-y-6">
            <article className="rounded-2xl border bg-slate-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Case 01
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900 md:text-base">
                IoTコーヒーメーカー ブランドサイト &amp; EC 導線設計
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                新製品ローンチに合わせて、ブランドストーリー・撮影ディレクション・
                サイト構成・ECへの導線までトータルでサポート。海外ユーザー向けの
                情報設計も含めて伴走しました。
              </p>
            </article>

            <article className="rounded-2xl border bg-slate-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Case 02
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900 md:text-base">
                伝統工房 × ガラス骨壺ブランドの立ち上げ
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                奈良井宿の漆器工房とのコラボレーションによる
                高級ガラス骨壺ブランド。コンセプト設計・商品ネーミング・
                サイト制作・プロモーション画像作成などを担当しました。
              </p>
            </article>

            <article className="rounded-2xl border bg-slate-50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Case 03
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900 md:text-base">
                Yahooショッピング店舗の改善 &amp; LINE連携
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                既存ストアの導線整理・商品ページ改善に加え、
                LINE公式アカウントとの連携によるリピート導線づくりを支援。
                クーポン配布やレビュー獲得フローの設計も行いました。
              </p>
            </article>
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-700 md:text-base">
            <p>
              ここに掲載しているのは、あくまで一部のイメージです。
              「自分のケースだとどうなるか」を知りたい場合は、
              お仕事内容や状況を添えてお問い合わせください。
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/pricing"
              className="text-sm font-semibold text-slate-900 underline underline-offset-4"
            >
              このレベルの支援で、どのくらいの費用感か見る（Pricing）
            </Link>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t bg-slate-950 py-5 text-xs text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 md:flex-row">
          <div>
            © {new Date().getFullYear()} HitoriBIZ. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link
              href="/privacy.html"
              className="underline underline-offset-4"
            >
              プライバシーポリシー
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
