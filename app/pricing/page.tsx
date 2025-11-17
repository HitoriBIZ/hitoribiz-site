export const metadata = {
  title: "Pricing | HitoriBIZ",
  description: "HitoriBIZの料金プラン。ライト/標準/プロの3構成で、要件に応じて柔軟に設計します。",
};

type Plan = {
  name: string;
  price: string;
  pitch: string;
  items: string[];
  cta?: string;
  note?: string;
};

const plans: Plan[] = [
  {
    name: "ライト",
    price: "¥98,000〜",
    pitch: "最短で“動くサイト/LP”を公開。小規模スタートに最適。",
    items: [
      "Next.js + Vercelで高速公開",
      "基本ページ（Home/Services/About/Contact）",
      "OGP/SEOの初期最適化",
      "公開後1週間の軽微修正",
    ],
    cta: "このプランで相談",
  },
  {
    name: "標準",
    price: "¥280,000〜",
    pitch: "要件定義からコンテンツ制作まで一気通貫の実務プラン。",
    items: [
      "情報設計/コピーライティング",
      "事例/価格ページ・フォーム導線強化",
      "アナリティクス/サーチコンソール設定",
      "SNS/メール運用の初期セット",
    ],
    cta: "見積りを依頼",
    note: "要件次第で増減します。月次運用プランとの組合せ可。",
  },
  {
    name: "プロ",
    price: "¥580,000〜",
    pitch: "アプリ/EC/SNS/広告/CRMまで統合。“ひとりで全部”の実戦体制。",
    items: [
      "Shopify導入・商品登録テンプレート",
      "Flutter/PWAなどアプリ連携",
      "メール配信（SPF/DKIM/DMARC）到達率対策",
      "月次KPIレビュー・改善提案",
    ],
    cta: "プロで相談する",
  },
];

export default function Pricing() {
  return (
    <section className="container py-12">
      <h1 className="text-3xl md:text-4xl font-bold">Pricing</h1>
      <p className="mt-4 text-neutral-600">
        企画/制作/運用の範囲に応じて柔軟に設計します。まずは無料相談で要件を整理し、3パターンの御見積をご提示します。
      </p>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div key={p.name} className="rounded-2xl border p-6 shadow-soft flex flex-col">
            <div className="text-sm text-neutral-500">{p.name}</div>
            <div className="mt-1 text-2xl font-bold">{p.price}</div>
            <div className="mt-2 text-neutral-700">{p.pitch}</div>
            <ul className="mt-4 list-disc pl-5 space-y-2 text-neutral-700">
              {p.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
            {p.note && <div className="mt-3 text-sm text-neutral-500">{p.note}</div>}
            <div className="mt-6">
              <a href="/contact" className="btn-primary">{p.cta ?? "相談する"}</a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-sm text-neutral-600">
        ※ 価格は税抜表示。撮影/素材/有料ライセンス/広告費/外部SaaS費用は別途。<br/>
        ※ 既存サイトの移管/リニューアルも対応します。
      </div>
    </section>
  );
}
