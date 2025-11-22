// app/pricing/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* バナー */}
      <section aria-label="Pricing banner" className="border-b bg-slate-900">
        <div className="banner-wrap relative">
          <Image
            src="/banners/price.png" // ← 実ファイル名に合わせて png
            alt="HitoriBIZ Pricing Banner"
            fill
            className="banner-image"
            priority
          />
          <div className="pointer-events-none absolute inset-0 flex items-center bg-slate-900/25">
            <div className="mx-auto max-w-6xl px-4">
              <p className="text-xs tracking-[0.25em] text-slate-100/80">
                PRICING
              </p>
              <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                「まずは相談しやすい」ことを
                <br className="hidden md:block" />
                いちばん大事にしています。
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* 本文 */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="text-lg font-semibold md:text-xl">
            料金の考え方（目安）
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-700 md:text-base">
            HitoriBIZ では、案件ごとに内容とボリュームを伺ったうえで
            お見積りをお出ししています。下記はあくまで
            「検討の目安」としてのレンジです。
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                相談・壁打ちセッション
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                ・オンライン（60〜90分）
                <br />
                ・現状の棚卸し、優先順位整理
                <br />
                ・ツール選定、進め方の提案 など
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                目安：¥15,000〜 / 回
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                サイト制作・リニューアル
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                ・小規模サイト（3〜5ページ程度）
                <br />
                ・デザイン・実装・簡易な原稿支援
                <br />
                ・基本の使い方レクチャー付き
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                目安：¥250,000〜
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                継続サポート・伴走プラン
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                ・月数回のオンラインミーティング
                <br />
                ・チャットでの軽い相談
                <br />
                ・改善提案・小さな改修作業 など
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-900">
                目安：¥30,000〜 / 月
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-700 md:text-base">
            <p>
              実際のお見積りは、
              「どこまでお願いしたいか」「どのくらいの期間ご一緒するか」によって変わります。
            </p>
            <p className="mt-2">
              まずはオンラインで状況を伺い、
              予算感も含めてすり合わせた上で進めるかどうかを決めていただければ大丈夫です。
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              具体的な見積もりを相談する
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-slate-400 px-6 py-2 text-sm hover:bg-slate-100"
            >
              どんなサポートが可能かを見る（Services）
            </Link>
          </div>
        </div>
      </section>

      {/* フッター（必要なら。layout.tsx で共通フッターがあるなら削除OK） */}
      {/* いまは layout.tsx にフッターがあるので、このブロックは実際には不要かもしれません */}
    </main>
  );
}
