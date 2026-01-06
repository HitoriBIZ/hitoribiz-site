// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

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
        {/* ===== Header ===== */}
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            {/* ロゴ */}
            <Link
              href="/"
              className="text-sm font-extrabold tracking-tight text-slate-900"
            >
              HitoriBIZ
            </Link>

            {/* ナビ（PC） */}
            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
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
              <Link href="/blog" className="hover:text-sky-700">
                Blog
              </Link>
            </nav>

            {/* 右側CTA */}
            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                相談予約
              </Link>

              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Blogを見る
              </Link>
            </div>
          </div>
        </header>

        {/* ===== Main ===== */}
        <main>{children}</main>

        {/* ===== Footer ===== */}
        <footer className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600">
            © {new Date().getFullYear()} HitoriBIZ
          </div>
        </footer>
      </body>
    </html>
  );
}
