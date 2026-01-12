// app/services/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-10 lg:grid-cols-2 lg:py-14">
          {/* Text */}
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-slate-500">
              SERVICES
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              小さなビジネスに、
              <span className="block text-slate-700">
                ちょうどいいデジタル支援を
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">
              ホームページ制作、EC構築、AI活用、業務効率化まで。
              難しい言葉は使わず、一緒に手を動かしながら進めます。
            </p>

            <div className="mt-8">
              <Link
                href="/booking"
                className="inline-flex items-center rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700"
              >
                オンライン相談のご予約（30分・無料）
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center">
            <Image
              src="/hero-kaito.png"
              alt="Kaitoくん"
              width={420}
              height={420}
              className="h-auto w-full max-w-sm"
              priority
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Web / EC 制作
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              ホームページ、ブログ、Shopifyを中心としたECサイトを、
              目的に合わせて設計・制作します。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              AI・業務効率化
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              ChatGPTやAIツールを活用し、
              日々の業務や情報整理をラクにします。
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              伴走サポート
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              一度作って終わりではなく、
              更新・改善・運用まで一緒に考えます。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
