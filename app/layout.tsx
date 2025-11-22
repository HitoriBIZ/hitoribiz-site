// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import React from "react";

export const metadata: Metadata = {
  title: "HitoriBIZ | ひとりビジネスプロジェクト",
  description:
    "アプリ・WEB・EC・SNS・デザイン・メールまで一気通貫。有限会社オリーブ（Olive Inc.）が運営。",
  metadataBase: new URL("https://hitoribiz.com"),
  openGraph: {
    title: "HitoriBIZ | ひとりで全部できる、AIとあなたのビジネス。",
    description: "アプリ・WEB・EC・SNS・デザイン・メールまで一気通貫。",
    url: "https://hitoribiz.com",
    siteName: "HitoriBIZ",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "ja_JP",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {/* ヘッダー：スマホではロゴとナビを縦並びに */}
        <header className="border-b bg-white">
          <div className="container mx-auto flex flex-col gap-2 px-4 py-3 md:flex-row md:items-center md:justify-between">
            {/* ロゴ */}
            <a
              href="/"
              className="flex items-center justify-center md:justify-start"
            >
              <Image
                src="/hitori-biz-logo.png"
                alt="HitoriBIZ Logo"
                width={81} // 150% サイズ
                height={81}
                priority
              />
            </a>

            {/* ナビ：スマホでは中央寄せで2段になってもOKなように wrap */}
            <nav className="flex flex-wrap justify-center gap-4 text-sm md:justify-end">
              <a href="/services" className="hover:underline">
                Services
              </a>
              <a href="/works" className="hover:underline">
                Works
              </a>
              <a href="/about" className="hover:underline">
                About
              </a>
              <a href="/pricing" className="hover:underline">
                Pricing
              </a>
              <a href="/contact" className="hover:underline">
                Contact
              </a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="mt-16 border-t">
          <div className="container mx-auto py-8 px-4 text-sm text-neutral-600">
            <div>© 2025 HitoriBIZ / Olive Inc. All rights reserved.</div>
            <div className="mt-2">
              “Orchestra Metronome” is produced by HitoriBIZ under the
              sponsorship of Olive Inc. (Japan).
            </div>
            <div className="mt-2">
              <a href="/legal" className="hover:underline">
                Legal
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
