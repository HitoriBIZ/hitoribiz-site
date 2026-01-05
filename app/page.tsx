// app/page.tsx
export default function HomePage() {
  return (
    <main className="bg-white text-slate-900">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="max-w-3xl">
            {/* H1 */}
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              HitoriBIZは、
              <br />
              スモールビジネスに
              <br />
              AIとWebの力を届けるプロジェクトです。
            </h1>

            {/* Lead */}
            <p className="mt-6 whitespace-pre-line text-base leading-7 text-slate-700 sm:text-lg">
              {`個人事業主・フリーランスなど、
小規模事業のための
ホームページ・ECサイト制作と
デジタル活用をサポートしています。

難しい専門用語はできるだけ使わず、
「一緒に手を動かすパートナー」として、
集客と業務効率化をお手伝いします。`}
            </p>

            {/* CTA (必要なら使ってください) */}
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                相談してみる
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                HitoriBIZについて
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
