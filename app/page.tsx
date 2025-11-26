// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* ヒーロー画像＋タイトル */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8">

          {/* ← 高さが絶対必要！！ */}
          <div className="relative h-[220px] overflow-hidden rounded-3xl bg-sky-900 text-white md:h-[280px]">
            {/* 背景イラスト */}
            <Image
              src="/15952b6c-cf30-47d1-8f5b-a7965e4beee3.png"
              alt="HitoriBIZ hero"
              fill
              className="object-cover opacity-80"
              priority
            />

            {/* 文字 */}
            <div className="relative z-10 px-6 py-12 md:px-10 md:py-16">
              <p className="text-xs font-semibold tracking-[0.2em] text-sky-100">
                HitoriBIZ
              </p>
              <h1 className="mt-3 text-2xl font-bold leading-snug md:text-3xl">
                ひとりで全部できる、AIとあなたのビジネス。
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-sky-50/90 md:text-base">
                HitoriBIZ は、ひとりビジネスや小さなチームの
                「ホームページ・EC・LINE・SNS・AI活用」を、
                企画から運用まで横に並んでサポートするデジタルパートナーです。
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
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
