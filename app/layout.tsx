// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HitoriBIZ",
  description: "ひとりビジネスのための Web & デジタルパートナー HitoriBIZ の公式サイトです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      {/* ここではロゴなどは一切出さず、各ページの内容だけを表示します */}
      <body className="bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
