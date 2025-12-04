// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-slate-50">
      {/* HERO（ABOUT 専用・右に小さめイラスト） */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:p-8">
            {/* テキスト側 */}
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-sky-700">
                ABOUT
              </p>
              <h1 className="mt-3 text-2xl font-bold leading-tight md:text-3xl">
                HitoriBIZ は、ひとりビジネスの
                <br />
                「デジタル係」を引き受ける存在です。
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-700 md:text-base">
                Webサイト制作やアプリ開発、デジタル集客の設計は、
                多くのひとりビジネスにとって「本業ではないけれど必要なもの」。
                HitoriBIZ は、その部分を横で支える小さなパートナーです。
              </p>
            </div>

            {/* 右側イラスト（HOME のイラストを小さく使用） */}
            <div className="relative hidden h-52 w-full overflow-hidden rounded-2xl bg-slate-100 md:block">
              <Image
                src="/hero-home.png"
                alt="デジタルサポートのイメージ"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 本文セクション */}
      <section className="bg-slate-50 pb-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          {/* テキスト側 */}
          <div className="space-y-6 text-sm leading-relaxed text-slate-700 md:text-base">
            <section>
              <h2 className="text-base font-bold text-slate-900 md:text-lg">
                ひとりビジネスだからこそ、「デジタル一等地」を。
              </h2>
              <p className="mt-2">
                広告費を大きくかけずとも、きちんと伝わる Web とデジタルの仕組みを
                持つことで、ひとりビジネスでも「選ばれる理由」を丁寧に届けることができます。
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 md:text-lg">
                代表プロフィール
              </h2>
              <p className="mt-2">
                Web / アプリ開発、IoT プロダクト、EC サイト運営など、
                デジタルを軸にした事業づくりに長く携わってきました。
                その経験を活かし、「ひとり / 小さなチーム」の事業を
                デジタル面から支えることを目的に HitoriBIZ を立ち上げました。
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 md:text-lg">
                得意なこと
              </h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>ゼロからのサービス・ブランドコンセプトの言語化</li>
                <li>Next.js / Shopify / Flutter などを使った実装</li>
                <li>LINE公式・EC・SNS を組み合わせた集客導線設計</li>
              </ul>
            </section>
          </div>

          {/* サイドカード */}
          <aside className="space-y-4 text-sm text-slate-700">
            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900">概要</h3>
              <dl className="mt-3 space-y-2 text-xs md:text-sm">
                <div className="flex gap-2">
                  <dt className="w-20 text-slate-500">名称</dt>
                  <dd>HitoriBIZ（ひとりビジネス・デジタル支援）</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 text-slate-500">運営</dt>
                  <dd>Olive Inc.</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 text-slate-500">拠点</dt>
                  <dd>東京 ※オンライン中心に全国対応</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border bg-white p-5 text-xs shadow-sm md:text-sm">
              <h3 className="text-sm font-bold text-slate-900">
                ご相談について
              </h3>
              <p className="mt-2">
                「まだ何も決まっていないけれど、アイデアを整理したい」
                という段階からのご相談も歓迎しています。
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-flex rounded-full bg-sky-900 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-800"
              >
                お問い合わせフォームへ
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
