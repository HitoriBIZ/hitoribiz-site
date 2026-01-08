// app/pricing/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing｜HitoriBIZ",
  description: "HitoriBIZの料金の考え方とプランをご案内します。",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">Pricing</h1>
      <p className="mt-4 text-slate-700">
        ただいま準備中です。相談内容に応じて最適な形をご提案します。
      </p>
      <div className="mt-8">
        <Link href="/contact" className="text-sm font-semibold text-sky-700 hover:underline">
          相談してみる
        </Link>
      </div>
    </main>
  );
}
