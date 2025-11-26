// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
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
            <Link href="/" className="font-semibold">
              Home
            </Link>
            <Link href="/services">Services</Link>
            <Link href="/works">Works</Link>
            <Link href="/about">About</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>
      </header>

      {/* ===== ヒーローセクション ===== */}
      <section className="border-b bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="overflow-hidden rounded-3xl bg-sky-900 text-white">
            <Image
              src="/hero-home.png"
              alt="HitoriBIZ hero"
              width={1200}
              height={600}
              className="h-auto w-full object-cover"
              priority
            />
          </div>

          <div className="mt-8 space-y-4">
            <h1 className="text-2xl font-bold sm:text-3xl">
              ひとりで全部できる、AIとあなたのビジネス。
            </h1>
            <p className="text-sm leading-relaxed text-slate-700 md:text-base">
              HitoriBIZ は、ひとりビジネスや小さなチームの
              「ホームページ・EC・LINE・SNS・AI活用」を
              企画から運用まで横に並んでサポートするデジタルパートナーです。
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold md:text-base">
                1. 企画から一緒に
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-700 md:text-sm">
                「何から始めればいいのか分からない」状態から、
                言語化・情報設計・サイト構造まで伴走します。
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold md:text-base">
                2. 制作と運用まで
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-700 md:text-sm">
                Webサイト、LP、ブログ、アプリなど、
                制作後の運用・改善も継続サポート可能です。
              </p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <h2 className="text-sm font-semibold md:text-base">
                3. 外部サービスに依存しすぎない設計
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-slate-700 md:text-sm">
                将来的に「自社の資産になるメディア」を育てる設計を
                大切にしています。
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
