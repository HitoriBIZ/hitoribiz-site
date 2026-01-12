// app/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About｜HitoriBIZ",
  description:
    "HitoriBIZ代表・松村衆三のプロフィールと、HitoriBIZの考え方についてご紹介します。",
};

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* =========================
          Profile Section
      ========================= */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            {/* Profile Image */}
            <div className="mx-auto w-full max-w-sm">
              <Image
                src="/profile-matsumura.jpg"
                alt="松村衆三 プロフィール写真"
                width={600}
                height={800}
                className="rounded-2xl object-cover shadow-sm"
                priority
              />
              <p className="mt-3 text-xs text-slate-500">
                2025年8月 ホノルル・ワイキキにて撮影
              </p>
            </div>

            {/* Profile Text */}
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-slate-500">
                PROFILE
              </p>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                代表者プロフィール
              </h1>

              <p className="mt-4 text-base leading-7 text-slate-700">
                <span className="font-medium">松村 衆三（まつむら しゅうぞう）</span>
                <br />
                1949年 東京生まれ
                <br />
                HitoriBIZ ／ 有限会社オリーブ 代表
                <br />
                趣味：ヴァイオリン
              </p>

              <div className="mt-6 space-y-4 text-base leading-7 text-slate-700">
                <p className="font-medium text-slate-900">
                  国際物流とものづくりの現場から、デジタルの世界へ。
                </p>

                <p>
                  松村衆三は、1971年より国際ビジネスの最前線で経験を積んできました。
                  東京・港区の泰運商会にて外資系計測機器メーカーの国際業務部門に携わり、
                  国際物流・貿易実務を基礎から学んだことが、キャリアの原点です。
                </p>

                <p>
                  1987年にはHARIO株式会社に入社。
                  国際貿易部門の立ち上げに関わり、見積書や契約書、
                  輸出入関連書類を効率的に管理するため、
                  FileMaker Proを用いた独自の業務システムを一人で構築しました。
                  その後、6か国における現地法人設立にも関与し、
                  グローバルな販売・調達の現場を長年支えてきました。
                </p>

                <p>
                  2000年代に入り、ECとインターネット販売が急速に広がる中、
                  社内でネット事業部門を立ち上げ、ECビジネスの推進を担当。
                  「良い商品を、必要としている人にどう届けるか」
                  という課題に、実務の立場から向き合い続けてきました。
                </p>

                <p>
                  2025年にHARIOを定年退社。
                  そして2026年、これまでの実務経験と、
                  AIをはじめとする新しいデジタル技術を組み合わせた
                  <span className="font-medium">
                    ひとりビジネス支援プロジェクト「HitoriBIZ」
                  </span>
                  を立ち上げました。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Existing About Content
      ========================= */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          {/* ↓↓↓ ここに「既存のAboutページ本文」をそのまま貼ってください ↓↓↓ */}

          <h2 className="text-2xl font-bold tracking-tight">
            HitoriBIZについて
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-700">
            HitoriBIZは、個人事業主や小規模事業者のための、
            Web制作とデジタル活用支援を行うプロジェクトです。
            専門用語をできるだけ使わず、
            一緒に手を動かしながら進める伴走型の支援を大切にしています。
          </p>

          <div className="mt-10">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              相談してみる
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
