import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HitoriBIZ | ひとりで全部できる、AIとあなたのビジネス。",
  description:
    "アプリ・WEB・EC・SNS・デザイン・メールまで一気通貫。有限会社オリーブ（Olive Inc.）が運営する、ひとりビジネス支援プロジェクト。",
};

export default function Home() {
  return (
    <section className="border-b">
      <div className="container py-16 space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            ひとりで全部できる、AIとあなたのビジネス。
          </h1>
          <p className="text-neutral-600">
            アプリ制作・ホームページ・ショッピングサイト・SNS・デザイン・メール配信まで。
            かつては十数名のチームが必要だった仕事を、AIとワークフロー設計により
            「ひとり」で回せるようにするプロジェクトです。
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="/services" className="btn-primary">
            サービス一覧を見る
          </a>
          <a href="/works" className="btn-ghost">
            事例を見る
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-sm text-neutral-700">
          <div className="rounded-2xl border p-4">
            <div className="font-semibold">App / Web</div>
            <p className="mt-2">
              Next.js + Vercel / Flutter などを用いた、スモールスタート向けの実装と運用。
            </p>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="font-semibold">EC / SNS / Design</div>
            <p className="mt-2">
              Shopify・Instagram・LINE公式・パンフレット・ロゴなど、販売導線を一気通貫で設計。
            </p>
          </div>
          <div className="rounded-2xl border p-4">
            <div className="font-semibold">Consulting</div>
            <p className="mt-2">
              「ひとりでやり切る」ための仕組みづくり、AI活用、運用フロー設計を伴走支援します。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
