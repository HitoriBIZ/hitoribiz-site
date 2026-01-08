"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/works", label: "Works" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  // メニューOPEN中は背景スクロールを止める（スマホ操作性UP）
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
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
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-sky-700">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 右側（PC: CTA / スマホ: ハンバーガー） */}
        <div className="flex items-center gap-2">
          {/* PC用CTA */}
          <div className="hidden items-center gap-2 md:flex">
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

          {/* スマホ用ハンバーガー */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 md:hidden"
            aria-label="メニューを開く"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
        </div>
      </div>

      {/* スマホ用：スライドメニュー */}
      {open && (
        <div className="md:hidden">
          {/* 背景オーバーレイ */}
          <button
            className="fixed inset-0 z-40 cursor-default bg-black/30"
            aria-label="メニューを閉じる"
            onClick={() => setOpen(false)}
          />

          {/* パネル */}
          <div className="fixed right-0 top-0 z-50 h-full w-[84%] max-w-sm border-l border-slate-200 bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-extrabold tracking-tight text-slate-900">
                HitoriBIZ
              </p>
              <button
                type="button"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                aria-label="メニューを閉じる"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
            </div>

            <div className="mt-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-3 text-base font-medium text-slate-800 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 grid gap-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
                onClick={() => setOpen(false)}
              >
                相談予約
              </Link>

              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                onClick={() => setOpen(false)}
              >
                Blogを見る
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              ※ スマホではメニューから各ページへ移動できます。
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
