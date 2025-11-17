export const metadata = {
  title: "About | HitoriBIZ",
  description: "HitoriBIZ（ひとりビジネスプロジェクト）と有限会社オリーブの概要。",
};

export default function About() {
  return (
    <section className="container py-12">
      <h1 className="text-3xl md:text-4xl font-bold">About</h1>

      <div className="mt-6 grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-semibold">HitoriBIZ（ひとりビジネスプロジェクト）</h2>
          <p className="mt-3 text-neutral-700">
            アプリ制作・WEB構築・EC・SNS・デザイン・メールまで、デジタルの全部を一気通貫で。“ひとり”で推進できる体制を、AIと実務ノウハウで構築します。
          </p>
          <ul className="mt-4 list-disc pl-5 space-y-2 text-neutral-700">
            <li>AI活用前提の制作フロー（要件→設計→制作→運用）</li>
            <li>Next.js + Vercel + Cloudflare による高速・安定の運用</li>
            <li>Google Workspace / SPF・DKIM・DMARCでの到達率対策</li>
          </ul>

          <h3 className="mt-8 text-lg font-semibold">プロジェクトの背景</h3>
          <p className="mt-2 text-neutral-700">
            従来は十数名規模で必要だった制作・運用を、ChatGPT（将来的にSora等）と体系化により“ひとり”で完結可能にする「AI革命」を実証します。
          </p>
        </div>

        <div className="rounded-2xl border p-6 shadow-soft">
          <h2 className="text-xl font-semibold">運営会社</h2>
          <p className="mt-3"><span className="font-semibold">有限会社オリーブ（Olive Inc. / Japan）</span></p>
          <p className="text-neutral-700">代表者：松村 衆三（Shuzo Matsumura）</p>
          <p className="mt-2 text-neutral-700">
            クリエイティブとテクノロジーを横断し、ブランド/プロダクトを“手触りよく”立ち上げることを目指します。
          </p>
          <div className="mt-6 text-sm text-neutral-600">
            “Orchestra Metronome” is produced by HitoriBIZ under the sponsorship of Olive Inc. (Japan).
          </div>
        </div>
      </div>
    </section>
  );
}
