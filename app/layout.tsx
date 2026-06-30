// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "HitoriBIZ｜スモールビジネスにAIとWebの力を",
  description:
    "HitoriBIZは、個人事業主・フリーランスなど小規模事業のための、Web制作とAI・デジタル活用支援を行うプロジェクトです。",

  // PWA / ホーム画面追加用
  manifest: "/manifest.json",

  // ブラウザ・スマホ用アイコン
  icons: {
    icon: [
      {
        url: "/icons/hitoribiz/icon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icons/hitoribiz/icon-16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/icons/hitoribiz/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/hitoribiz/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/hitoribiz/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/icons/hitoribiz/icon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  },

  // iPhoneで「ホーム画面に追加」した時の見え方
  appleWebApp: {
    capable: true,
    title: "HitoriBIZ",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
        {/* Header */}
        <SiteHeader />

        {/* Main */}
        <main className="relative z-0 flex-1">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
