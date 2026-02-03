// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "./components/SiteHeader";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "HitoriBIZ｜スモールビジネスにAIとWebの力を",
  description:
    "HitoriBIZは、個人事業主・フリーランスなど小規模事業のための、Web制作とAI・デジタル活用支援を行うプロジェクトです。",
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
        <main className="relative z-0 pt-16 flex-1">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
