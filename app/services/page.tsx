export const metadata = {
  title: "Services | HitoriBIZ",
  description: "アプリ・WEB・EC・SNS・デザイン・メールまで一気通貫。HitoriBIZの提供サービス一覧。",
};

export default function Services() {
  const groups = [
    {
      title: "アプリ制作支援",
      items: [
        "Flutter / React Native / PWA の新規開発・運用",
        "Google Play / App Store 申請・審査対応",
        "計測（Firebase/GA4）・改善運用・KPI設計",
      ],
    },
    {
      title: "ホームページ制作支援",
      items: [
        "Next.js + Vercel（超高速CDN）で構築",
        "UI設計・コピーライティング・写真/動画編集",
        "SEO/OGP最適化・高速化・アクセシビリティ",
      ],
    },
    {
      title: "ショッピングサイト構築支援",
      items: [
        "Shopify 構築・テーマ調整・商品登録・在庫/配送設定",
        "決済/送料/税対応・レシート/請求書テンプレート",
        "Shopifyアプリ導入（レビュー/CRM/ポイント等）",
      ],
    },
    {
      title: "SNS 構築・運用支援",
      items: [
        "Instagram / TikTok / LINE 公式アカウント立上げ",
        "投稿カレンダー設計・動画/画像テンプレート作成",
        "UGC活用・広告出稿・運用レポート/改善提案",
      ],
    },
    {
      title: "デザイン・コンテンツ制作",
      items: [
        "ロゴ/シンボル/アイコン設計（ブランドガイド付き）",
        "写真合成・イラスト・パンフレット/LPO資料作成",
        "商品パッケージ・店頭POP・チラシ・名刺",
      ],
    },
    {
      title: "メール/CRM・デジタルマーケ全般",
      items: [
        "Google Workspace 導入/独自ドメインメール",
        "メルマガ設計・ステップ配信・到達率改善（SPF/DKIM/DMARC）",
        "KPI設計・ダッシュボード可視化・施策レビュー",
      ],
    },
  ];

  return (
    <section className="container py-12">
      <h1 className="text-3xl md:text-4xl font-bold">Services</h1>
      <p className="mt-4 text-neutral-600">
        ひとりで、全部できる。AIと共に、企画から運用まで一気通貫でサポートします。運営：有限会社オリーブ（Olive Inc. / 代表 松村衆三）。
      </p>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        {groups.map((g) => (
          <div key={g.title} className="rounded-2xl border p-6 shadow-soft">
            <h2 className="text-xl font-semibold">{g.title}</h2>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-neutral-700">
              {g.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a href="/pricing" className="btn-primary">料金プランを見る</a>
        <a href="/contact" className="btn-ghost">無料相談を予約</a>
      </div>
    </section>
  );
}
