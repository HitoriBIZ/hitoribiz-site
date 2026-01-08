// app/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services｜HitoriBIZ",
  description: "HitoriBIZの提供サービスをご紹介します。",
};

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">Services</h1>
      <p className="mt-4 text-slate-700">
        ただいま準備中です。公開まで今しばらくお待ちください。
      </p>
      <div className="mt-8">
        <Link href="/" className="text-sm font-semibold text-sky-700 hover:underline">
          Homeに戻る
        </Link>
      </div>
    </main>
  );
}
