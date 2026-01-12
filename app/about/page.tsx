// app/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About｜HitoriBIZ",
  description:
    "HitoriBIZ代表・松村衆三のプロフィールと、プロジェクトの背景をご紹介します。",
};

export default function AboutPage() {
  return (
    <main className="bg-white text-slate-900">
      {/* =========================
          Profile Section
      ========================= */}
      <section className="border-b border-slate-200">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:py-14">
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              代表者プロフィール
            </h1>

            <p className="mt-4 text-lg font-medium">
              松村 衆三（まつむら しゅうぞう）
            </p>

            <p className="mt-2 text-slate-600">
              1949年 東京生まれ<br />
              趣味：ヴァイオリン<br />
              HitoriBIZ ／ 有限会社オリーブ 代表
            </p>

            <p className="mt-6 leading-7 text-slate-700">
              国際物流とものづくりの現場から、デジタルの世界へ。<br />
              1970年代より国際ビジネスの現場に携わり、貿易実務、
              業務システム構築、EC立ち上げなどを一貫して経験してきました。
            </p>

            <p className="mt-4 leading-7 text-slate-700">
              定年退職後、これまでの実務経験とAI・Web技術を組み合わせ、
              「ひとりで事業を続ける人の、現実的な支え」になることを
              目指して HitoriBIZ を立ち上げました。
            </p>
          </div>

          <div className="flex justify-center">
            <Image
              src="/profile-matsumura.jpg"
              alt="松村衆三 プロフィール写真"
              width={360}
              height={360}
              className="rounded-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* =========================
          Project Section
      ========================= */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold">HitoriBIZについて</h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-700">
          HitoriBIZは、個人事業主・フリーランスなど小規模事業のための
          Web制作・EC・AI活用を支援するプロジェクトです。
        </p>

        <p className="mt-4 max-w-3xl leading-7 text-slate-700">
          難しい専門用語はできるだけ使わず、
          「一緒に手を動かすパートナー」として、
          集客と業務効率化をお手伝いします。
        </p>

        <div className="mt-10 text-center">
          <Link
            href="/booking"
            className="inline-block rounded-md bg-slate-900 px-6 py-3 text-white hover:bg-slate-800"
          >
            オンライン相談のご予約（30分・無料）
          </Link>
        </div>
      </section>
    </main>
  );
}
