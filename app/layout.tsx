// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HitoriBIZ | ひとりビジネスのAI × デジタル活用パートナー",
  description:
    "HitoriBIZは、ひとり社長・フリーランス・小さなチームのための「ホームページ・EC・LINE・SNS・AI活用」伴走サービスです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <div className="flex min-h-screen flex-col">
          {/* 共通ヘッダー */}
          <header className="border-b bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-3 py-3 md:flex-row md:justify-between md:py-4">
              {/* ロゴ：スマホ時は少し小さめ、PCは大きめ */}
              <Link href="/" className="flex items-center justify-center">
                <Image
                  src="/hitori-biz-logo.png"
                  alt="HitoriBIZ"
                  width={160}
                  height={40}
                  className="h-auto w-32 md:w-40"
                  priority
                />
              </Link>

              {/* ナビ：スマホでは横スクロール可能にして詰める */}
              <nav className="flex w-full justify-center overflow-x-auto text-xs md:w-auto md:justify-end md:text-sm">
                <div className="flex min-w-max gap-4 md:gap-6">
                  <Link href="/" className="hover:text-sky-700">
                    Home
                  </Link>
                  <Link href="/services" className="hover:text-sky-700">
                    Services
                  </Link>
                  <Link href="/works" className="hover:text-sky-700">
                    Works
                  </Link>
                  <Link href="/about" className="hover:text-sky-700">
                    About
                  </Link>
                  <Link href="/pricing" className="hover:text-sky-700">
                    Pricing
                  </Link>
                  <Link href="/contact" className="hover:text-sky-700">
                    Contact
                  </Link>
                </div>
              </nav>
            </div>
          </header>

          {/* 各ページ内容 */}
          <main className="flex-1">{children}</main>

          {/* フッター */}
          <footer className="border-t bg-white/80">
            <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
              <div>
                &copy; {new Date().getFullYear()} HitoriBIZ / Shu Matsumura. All
                rights reserved.
              </div>
              <div className="flex flex-wrap gap-4">
                <span>Produced by Olive Inc.</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
