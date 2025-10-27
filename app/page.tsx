export default function Page() {
  return (<section className="container py-16">
    <div className="grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          ひとりで、全部できる。<br/>AI と、あなたのビジネスに。
        </h1>
        <p className="mt-6 text-lg text-neutral-600">
          アプリ・WEB・EC・SNS・デザイン・販促・メール——デジタルの全部を一気通貫で。
          運営：有限会社オリーブ（Olive Inc.）/ 代表：松村 衆三
        </p>
        <div className="mt-8 flex gap-3">
          <a className="btn-primary" href="/contact">無料相談を予約</a>
          <a className="btn-ghost" href="/works">制作実績を見る</a>
        </div>
        <p className="mt-4 text-sm text-neutral-600">“Do it all—solo, with AI.”</p>
      </div>
      <div className="rounded-2xl shadow-soft border p-8">
        <ul className="space-y-4">
          <li><span className="font-semibold">Services:</span> アプリ / ホームページ / EC / SNS / デザイン / メール</li>
          <li><span className="font-semibold">Tech:</span> Next.js + Tailwind + Vercel + Cloudflare</li>
          <li><span className="font-semibold">Contact:</span> contact@hitoribiz.com</li>
        </ul>
      </div>
    </div>
    <div className="mt-16 grid md:grid-cols-3 gap-6">
      {['相談 → 設計 → 制作 → 運用','3プラン見積（ライト/標準/プロ）','1営業日以内に返信'].map((t,i)=>(
        <div key={i} className="rounded-2xl border p-6 shadow-soft">
          <div className="text-lg font-semibold">Point {i+1}</div>
          <div className="mt-2 text-neutral-600">{t}</div>
        </div>
      ))}
    </div>
  </section>)
}
