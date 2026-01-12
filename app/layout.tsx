// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import SiteHeader from "./components/SiteHeader";

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
      <body className="bg-white text-slate-900 antialiased">
        {/* Header */}
        <SiteHeader />

        {/* Main */}
        <main className="relative z-0 pt-16">
  {children}
</main>
        {/* Footer */}
        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600">
            © {new Date().getFullYear()} HitoriBIZ
          </div>
        </footer>
      </body>
    </html>
  );
}
