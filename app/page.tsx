// app/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* ヒーローセクション */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10 md:py-12">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            {/* テキスト側 */}
            <div>
              <p className="text-xs font-semibold text-sky-600 sm:text-sm">
                ひとりビジネスのDXパートナー
              </p>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                HitoriBIZ は
                <br />
                あなたの小さなビジネスに
                <br />
                AIとWebの力を届けます。
              </h1>
              <p className="mt-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
                個人事業主・小規模ビジネスのための、
                ホームページ制作・デジタル集客・AI活用サポート。
                難しい専門用語は使わず、「一緒に手を動かす伴走者」として
                売上アップと業務効率化をお手伝いします。
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-sky-700 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-600 sm:text-sm"
                >
                  無料相談してみる
                </Link>
                <Link
                  href="/services"
                  className="text-xs font-semibold text-sky-700 hover:underline sm:text-sm"
                >
                  サービス内容を見る →
                </Link>
              </div>

              <p className="mt-4 text-[10px] text-slate-500 sm:text-xs">
                ※ 初回オンライン相談（30分）は無料です。Zoom／Google Meet に対応しています。
              </p>
            </div>

            {/* 画像側 */}
            <div className="relative h-40 sm:h-56 md:h-72">
              <Image
                src="/hero-home.png"
                alt="HitoriBIZ ホームページ制作・デジタル支援のイメージ"
                fill
                className="rounded-3xl object-cover shadow-md"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* サービス概要セクション */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <h2 className="text-lg font-semibold sm:text-xl">
            こんな方をサポートしています
          </h2>
          <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs sm:text-sm">
              <h3 className="font-semibold text-slate-800">
                ホームページを作りたい
              </h3>
              <p className="mt-2 text-slate-600">
                テンプレートではなく、自分のビジネスに合った
                シンプルで伝わるサイトを持ちたい方。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs sm:text-sm">
              <h3 className="font-semibold text-slate-800">
                既存サイトを活かして集客したい
              </h3>
              <p className="mt-2 text-slate-600">
                「作ったまま放置」になっているサイトを整え、
                問い合わせや予約につながる導線を作りたい方。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs sm:text-sm">
              <h3 className="font-semibold text-slate-800">
                AIをビジネスに取り入れたい
              </h3>
              <p className="mt-2 text-slate-600">
                ChatGPTなどのAIを活用して、ブログ執筆・SNS投稿・資料作成を効率化したい方。
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/about"
              className="text-xs font-semibold text-sky-700 hover:underline sm:text-sm"
            >
              HitoriBIZについて詳しく見る →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
