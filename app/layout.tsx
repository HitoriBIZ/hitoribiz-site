import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";

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
        <header className="border-b">
          <div className="container flex items-center justify-between h-16">
            {/* ← 新しいロゴ + テキスト */}
            <a href="/" className="flex items-center gap-2">
              <Image
                src="/hitori-biz-logo.png" // public に置いたロゴ
                alt="HitoriBIZ"
                width={36}
                height={36}
              />
              <span className="font-semibold text-lg">HitoriBIZ</span>
            </a>

            <nav className="flex gap-4 text-sm">
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
          <div className="container py-8 text-sm text-neutral-600">
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
