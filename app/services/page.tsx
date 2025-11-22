// app/services/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">


      {/* バナー */}
      <section aria-label="Services banner" className="border-b bg-slate-900">
        <div className="banner-wrap relative">
          <Image
            src="/banners/service.png"
            alt="HitoriBIZ Service Banner"
            fill
            className="banner-image"
            priority
          />
          <div className="pointer-events-none absolute inset-0 flex items-center bg-slate-900/25">
            <div className="mx-auto max-w-6xl px-4">
              <p className="text-xs tracking-[0.25em] text-slate-100/80">
                SERVICES
              </p>
              <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                デジタルまわりを、まとめて相談できる窓口。
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* 本文 */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="text-lg font-semibold md:text-xl">
            HitoriBIZ ができること
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
            「ホームページ制作だけ」「SNSだけ」ではなく、
            ひとりビジネスの現場で必要になるデジタルまわりを
            まとめて並走するのが HitoriBIZ のスタイルです。
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                ホームページ / EC サイト制作
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                Shopify・Next.js・WordPress など、
                規模や予算に合わせて最適な構成を一緒に検討しながら制作します。
                原稿づくりや写真の整理もご相談ください。
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                LINE公式アカウント / SNS 集客設計
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                すでにあるお客様リストや既存チャネルを活かしつつ、
                LINE・Instagram・Yahooショッピングなどを組み合わせて、
                無理なく続けられる導線を設計します。
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                AI活用・業務効率化サポート
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                ChatGPT をはじめとしたAIツールを、日々の業務にどう組み込むか。
                プロンプトテンプレートや簡単なマニュアル整備も含めて伴走します。
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-700 md:text-base">
            <p>
              「この中にないことでも、相談してみて大丈夫かな？」という場合は、
              いったんお気軽にお問い合わせください。
            </p>
            <p className="mt-2">
              できること・できないことを正直にお話ししたうえで、
              他のパートナーをご紹介することも含めて一緒に考えます。
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/pricing"
              className="text-sm font-semibold text-slate-900 underline underline-offset-4"
            >
              料金イメージを見る（Pricing）
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
