// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "HitoriBIZ",
  description:
    "ひとりビジネスのための Web & デジタルパートナー HitoriBIZ の公式サイトです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-slate-50 text-slate-900">
        <div className="flex min-h-screen flex-col">
          {/* ===== 共通ヘッダー ===== */}
          <header className="border-b bg-white/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-3 sm:flex-row sm:justify-between">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/hitori-biz-logo.png"
                  alt="HitoriBIZ"
                  width={150} // PC でもスマホでもバランス良いサイズ
                  height={40}
                  priority
                />
              </Link>
                        <nav className="flex flex-wrap justify-center gap-4 text-xs sm:text-sm">
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            <Link href="/works">Works</Link>
            <Link href="/about">About</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
          </nav>

            </div>
          </header>

          {/* ===== 各ページの中身 ===== */}
          <main className="flex-1">{children}</main>

          {/* ===== 共通フッター ===== */}
          <footer className="border-t bg-white">
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
              <p>
                © {new Date().getFullYear()} HitoriBIZ / Olive Inc. All rights
                reserved.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/privacy" className="hover:underline">
                  プライバシーポリシー
                </Link>
                <Link href="/terms" className="hover:underline">
                  利用規約
                </Link>
                <Link href="/about" className="hover:underline">
                  事業者情報
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
