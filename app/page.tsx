// app/works/page.tsx
import Image from "next/image";

export default function WorksPage() {
  return (
    <main>
      {/* ヒーローセクション */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="relative overflow-hidden rounded-3xl bg-sky-900 text-white">
            {/* ヒーロー画像 */}
            <Image
              src="/2ef18b1d-b6e5-4712-ba8c-cba4cb8a80b3.png"
              alt="HitoriBIZ works hero"
              fill
              className="object-cover opacity-80"
              priority
            />

            <div className="relative z-10 px-6 py-12 md:px-10 md:py-16">
              <p className="text-xs font-semibold tracking-[0.2em] text-sky-100">
                WORKS
              </p>
              <h1 className="mt-3 text-2xl font-bold leading-snug md:text-3xl">
                「つくって終わり」ではなく、  
                届けるところまで一緒に。
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-sky-50/90 md:text-base">
                実際にご一緒したプロジェクトの一部を、公開できる範囲でご紹介します。
                非公開案件も多くありますので、お気軽にお問い合わせください。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 以下：既存の案件リスト */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 pb-12">
          {/* ここにカード一覧（前のコードをそのまま残す） */}
        </div>
      </section>
    </main>
  );
}
