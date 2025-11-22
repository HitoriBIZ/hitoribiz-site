// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
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
            <Link href="/works">Works</Link>
            <Link href="/about" className="font-semibold">
              About
            </Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </div>
      </header>

      {/* バナー */}
      <section aria-label="About banner" className="border-b bg-slate-900">
        <div className="banner-wrap relative">
          <Image
            src="/banners/about.png"
            alt="About HitoriBIZ Banner"
            fill
            className="banner-image"
            priority
          />
          <div className="pointer-events-none absolute inset-0 flex items-center bg-slate-900/25">
            <div className="mx-auto max-w-6xl px-4">
              <p className="text-xs tracking-[0.25em] text-slate-100/80">
                ABOUT
              </p>
              <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                ひとりで悩みすぎないための、
                <br className="hidden md:block" />
                小さな伴走サービス。
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* 本文 */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-[3fr,2fr]">
            <div className="space-y-4 text-sm leading-relaxed text-slate-700 md:text-base">
              <h2 className="text-lg font-semibold md:text-xl">
                HitoriBIZ の背景
              </h2>
              <p>
                HitoriBIZ は、松村 衆三（Shu Matsumura）が運営する
                小さなデジタル伴走サービスです。
              </p>
              <p>
                IoTコーヒーメーカーの企画・販促、ガラスプロダクト、
                ECサイト運営、デジタルサイネージなど、
                いくつかのプロジェクトを横断して進める中で、
                「デジタルまわりを一人で抱えている人」が多いと感じてきました。
              </p>
              <p>
                「制作会社に頼むほど大きな案件ではないけれど、
                自分だけでは進めづらい」といった領域を、一緒に埋めていきたい。
                そんな思いから HitoriBIZ を立ち上げています。
              </p>

              <h3 className="pt-2 text-sm font-semibold text-slate-900 md:text-base">
                スタイルについて
              </h3>
              <ul className="list-disc pl-5 text-sm md:text-base">
                <li>専門用語をできるだけ使わず、噛み砕いて説明します。</li>
                <li>「こうすべき」ではなく、選択肢を一緒に検討します。</li>
                <li>一度作って終わりではなく、運用して育てていく前提で考えます。</li>
              </ul>

              <p>
                相談のスタート地点は、ちいさくて大丈夫です。
                「今の状態だと、どこから手をつけたら良いか」を一緒に整理するところから始めましょう。
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="relative h-52 overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src="/banners/home.png"
                  alt="HitoriBIZ Daily Work"
                  fill
                  className="object-cover"
                />
              </d
