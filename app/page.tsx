// app/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* ヘッダー */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {/* HitoriBIZ ロゴ画像（例） */}
            <Image
              src="/hitori-biz-logo.png"
              alt="HitoriBIZ"
              width={180}
              height={40}
              priority
            />
          </div>
          <nav className="hidden gap-6 text-sm md:flex">
            <Link href="#services">サービス</Link>
            <Link href="#works">事例</Link>
            <Link href="#about">HitoriBIZとは</Link>
            <Link href="#blog">ブログ</Link>
            <Link href="#contact" className="font-semibold">
              お問い合わせ
            </Link>
          </nav>
        </div>
      </header>

      {/* Home バナー */}
      <section aria-label="Home banner" className="border-b bg-slate-900">
        <div className="banner-wrap relative">
          <Image
            src="/banners/home.png"
            alt="HitoriBIZ Home Banner"
            fill
            className="banner-image"
            priority
          />
          {/* バナー上に薄くキャッチコピーをのせる場合 */}
          <div className="pointer-events-none absolute inset-0 flex items-center bg-slate-900/20">
            <div className="mx-auto max-w-6xl px-4">
              <p className="text-xs tracking-[0.25em] text-slate-100/80">
                HitoriBIZ
              </p>
              <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                ひとりで全部できる、AIとあなたのビジネス。
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ヒーロー（テキスト＋CTA） */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <h2 className="text-xl font-semibold md:text-2xl">
              ひとり社長・フリーランスのための
              <br />
              「AI × デジタル活用」伴走サービス。
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">
              HitoriBIZ は、ひとりビジネスや小さなチームの
              「ホームページ・EC・LINE・SNS・AI活用」を、
              企画から運用まで横に並んでサポートするデジタルパートナーです。
            </p>
            <ul className="mt-4 space-y-1 text-sm text-slate-700">
              <li>・ホームページ / EC サイトの立ち上げ・リニューアル</li>
              <li>・LINE公式アカウント・SNSを使った集客設計</li>
              <li>・ChatGPT を活かした業務効率化・情報発信の仕組みづくり</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="#contact"
                className="rounded-full bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                無料オンライン相談を予約する
              </Link>
              <Link
                href="#services"
                className="rounded-full border border-slate-400 px-6 py-2 text-sm hover:bg-slate-100"
              >
                サービス内容を見る
              </Link>
            </div>
          </div>

          {/* 右側に他ページのバナーのミニプレビューを並べる例 */}
          <div className="space-y-4 text-xs text-slate-500">
            <p className="font-semibold text-slate-600">
              ページごとに雰囲気の違うバナーでご案内します。
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <Link href="/service" className="group relative block overflow-hidden rounded-xl border bg-white">
                <div className="relative h-24 w-full">
                  <Image
                    src="/banners/service.png"
                    alt="Service Banner"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-semibold text-slate-800">
                    Service
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    会議・打合せのイメージでサービス内容をご紹介。
                  </p>
                </div>
              </Link>

              <Link href="/work" className="group relative block overflow-hidden rounded-xl border bg-white">
                <div className="relative h-24 w-full">
                  <Image
                    src="/banners/work.png"
                    alt="Work Banner"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-semibold text-slate-800">
                    Work
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    プレゼンテーション風景で制作・導入事例を。
                  </p>
                </div>
              </Link>

              <Link href="/about" className="group relative block overflow-hidden rounded-xl border bg-white">
                <div className="relative h-24 w-full">
                  <Image
                    src="/banners/about.png"
                    alt="About Banner"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-semibold text-slate-800">
                    About
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    日常の仕事シーンで、HitoriBIZの想いを紹介。
                  </p>
                </div>
              </Link>

              <Link href="/price" className="group relative block overflow-hidden rounded-xl border bg-white">
                <div className="relative h-24 w-full">
                  <Image
                    src="/banners/price.jpg"
                    alt="Price Banner"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-semibold text-slate-800">
                    Price
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    見積もり・料金イメージをわかりやすく整理。
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* サービス紹介 */}
      <section id="services" className="border-b bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="text-lg font-semibold md:text-xl">サービス内容</h2>
          <p className="mt-3 text-sm text-slate-700 md:text-base">
            「全部お願い」から「相談しながら一緒に進めたい」まで、
            規模や予算に合わせて柔軟に対応します。
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                ホームページ / ECサイト制作
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                Shopify・Next.js・WordPress など、ビジネスに合った形でサイトを制作。
                デザインだけでなく、導線・導入後の運用も一緒に考えます。
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                デジタル集客・LINE活用
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                LINE公式アカウント、Yahooショッピング、Instagram などを組み合わせて、
                無理なく続けられる集客導線づくりを支援します。
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                AI活用・業務効率化
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700 md:text-sm">
                ChatGPT をはじめとするAIツールを、日々の業務や情報発信にどう組み込むか。
                プロンプト設計や社内向けマニュアル作成もサポートします。
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/service"
              className="text-sm font-semibold text-slate-900 underline underline-offset-4"
            >
              詳しいサービス内容を見る
            </Link>
          </div>
        </div>
      </section>

      {/* 事例紹介（ダイジェスト） */}
      <section id="works" className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="text-lg font-semibold md:text-xl">制作・導入事例</h2>
          <p className="mt-3 text-sm text-slate-700 md:text-base">
            これまでにご一緒したプロジェクトの一部をご紹介します。
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Case 01
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900">
                IoTコーヒーメーカー ブランドサイト
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                新製品のコンセプト整理から、写真・動画・ストーリー設計、
                EC連携までトータルでサポート。
              </p>
            </article>

            <article className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Case 02
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900">
                Yahooショッピング × LINE活用
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                既存ショップにLINE公式アカウントを組み合わせ、
                リピート購入のしくみづくりを支援。
              </p>
            </article>

            <article className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Case 03
              </p>
              <h3 className="mt-1 text-sm font-semibold text-slate-900">
                伝統工房 × ガラスプロダクト
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-700">
                伝統技術を活かした新ブランド立ち上げ。
                コンセプトメイクからサイト・EC・ビジュアル制作まで。
              </p>
            </article>
          </div>

          <div className="mt-6">
            <Link
              href="/work"
              className="text-sm font-semibold text-slate-900 underline underline-offset-4"
            >
              もっと事例を見る
            </Link>
          </div>
        </div>
      </section>

      {/* HitoriBIZとは / プロフィール */}
      <section id="about" className="border-b bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="text-lg font-semibold md:text-xl">HitoriBIZとは</h2>
          <p className="mt-3 text-sm text-slate-700 md:text-base">
            HitoriBIZ は、制作会社でもコンサル会社でもなく、
            「ひとりビジネスの右腕」として並走するための小さな伴走サービスです。
          </p>

          <div className="mt-6 grid gap-8 md:grid-cols-[2fr,3fr]">
            <div className="space-y-3 text-sm leading-relaxed text-slate-700">
              <p>
                自分自身も、IoT機器・ガラスプロダクト・EC・デジタルサイネージなど、
                いくつかの事業を横断して進めてきました。
              </p>
              <p>
                その中で感じたのは、
                「ひとりで全部抱えている人ほど、ちょうどいい外部パートナーを見つけづらい」
                ということです。
              </p>
              <p>
                HitoriBIZ は、そうした方の
                「とりあえず話を聞いてほしい」「一緒に考えてほしい」に応える存在でありたいと思っています。
              </p>
              <Link
                href="/about"
                className="inline-block pt-2 text-sm font-semibold text-slate-900 underline underline-offset-4"
              >
                プロフィール・ストーリーを読む
              </Link>
            </div>

            <div className="relative h-48 md:h-56">
              <Image
                src="/banners/about.png"
                alt="About HitoriBIZ"
                fill
                className="rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ブログ紹介 */}
      <section id="blog" className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <h2 className="text-lg font-semibold md:text-xl">ブログ / ノート</h2>
          <p className="mt-3 text-sm text-slate-700 md:text-base">
            試行錯誤のメモや気づきを、ブログとして少しずつまとめています。
            「こんなブログを自分も作りたい」と思っていただけるように、できるだけ具体的に。
          </p>

          {/* ダミーの記事3件 */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border bg-slate-50 p-4 text-sm">
              <h3 className="font-semibold text-slate-900">
                ひとりビジネスがホームページを持つタイミング
              </h3>
              <p className="mt-2 text-xs text-slate-700">
                SNSだけで発信してきた方が、サイトを持つときに考えておきたいポイント。
              </p>
            </article>
            <article className="rounded-2xl border bg-slate-50 p-4 text-sm">
              <h3 className="font-semibold text-slate-900">
                ChatGPTを「秘書」として使うための3つのコツ
              </h3>
              <p className="mt-2 text-xs text-slate-700">
                プロンプトをテンプレ化し、業務の一部として組み込む考え方について。
              </p>
            </article>
            <article className="rounded-2xl border bg-slate-50 p-4 text-sm">
              <h3 className="font-semibold text-slate-900">
                Yahooショッピング × LINEでリピートを増やす
              </h3>
              <p className="mt-2 text-xs text-slate-700">
                実際の運用フローをもとに、無理なく続けられる仕組みを解説します。
              </p>
            </article>
          </div>

          <div className="mt-6">
            <Link
              href="/blog"
              className="text-sm font-semibold text-slate-900 underline underline-offset-4"
            >
              ブログ記事一覧へ
            </Link>
          </div>
        </div>
      </section>

      {/* お問い合わせ */}
      <section id="contact" className="bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center md:py-20">
          <h2 className="text-xl font-semibold md:text-2xl">
            まずは、今の状況を教えてください。
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200 md:text-base">
            まだ具体的な計画が固まっていなくても大丈夫です。
            「こういうことはできる？」「どこから手をつければいい？」といった
            ざっくりしたご相談から歓迎しています。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              フォームから問い合わせる
            </Link>
            <Link
              href="https://line.me/"
              className="rounded-full border border-slate-300 px-6 py-2 text-sm text-slate-100 hover:bg-slate-800"
            >
              LINEで相談する
            </Link>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t bg-slate-950 py-5 text-xs text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 md:flex-row">
          <div>© {new Date().getFullYear()} HitoriBIZ. All rights reserved.</div>
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
