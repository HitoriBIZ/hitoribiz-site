export const metadata = {
  title: "Works | HitoriBIZ",
  description: "制作実績・プロジェクト。Orchestra Metronome など、アプリ/WEB/EC/SNSの事例。",
};

type Work = {
  title: string;
  tag: string;
  summary: string;
  link?: string;
};

const works: Work[] = [
  {
    title: "Orchestra Metronome",
    tag: "App (Flutter) / Google Play",
    summary: "オーケストラ練習に最適化したメトロノーム。テンポ/拍/キューを直感的に。申請・審査・ストア素材まで包括支援。",
  },
  {
    title: "HitoriBIZ Official Website",
    tag: "Web (Next.js + Vercel)",
    summary: "本サイト。App Router構成・OGP/SEO最適化・Cloudflareで独自ドメイン運用・自動デプロイを実装。",
    link: "https://www.hitori-biz.com",
  },
  {
    title: "VentVert（ブランドサイト）",
    tag: "Web / 撮影・レタッチ・EC導線",
    summary: "ガラス/クリスタルの世界観を重視。写真/動画制作と合わせてShopify導線を設計。",
  },
];

export default function Works() {
  return (
    <section className="container py-12">
      <h1 className="text-3xl md:text-4xl font-bold">Works / Case Studies</h1>
      <p className="mt-4 text-neutral-600">
        公開可能な範囲の実績を抜粋して掲載しています。詳細はお問い合わせください。
      </p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {works.map((w) => (
          <div key={w.title} className="rounded-2xl border p-6 shadow-soft">
            <div className="text-sm text-neutral-500">{w.tag}</div>
            <h2 className="mt-1 text-xl font-semibold">{w.title}</h2>
            <p className="mt-2 text-neutral-700">{w.summary}</p>
            {w.link && (
              <a className="mt-4 inline-block btn-ghost" href={w.link} target="_blank" rel="noreferrer">
                Visit
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <a href="/contact" className="btn-primary">案件のご相談をする</a>
      </div>
    </section>
  );
}
