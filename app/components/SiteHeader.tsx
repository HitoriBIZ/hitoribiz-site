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

  // OPEN中は背景スクロールを止める
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESCで閉じる
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {/* ===== Header（常時表示） ===== */}
      <header className="fixed left-0 right-0 top-0 z-[9999] border-b border-slate-200 bg-white/90 backdrop-blur pointer-events-auto">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 py-0">
          {/* ロゴ */}
          <Link
            href="/"
            className="relative z-10 text-sm font-extrabold tracking-tight text-slate-900"
            onClick={() => setOpen(false)}
          >
            HitoriBIZ
          </Link>

          {/* PC ナビ */}
          <nav className="relative z-10 hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-sky-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* PC CTA */}
          <div className="relative z-10 hidden items-center gap-2 md:flex">
            {/* 相談予約：/booking */}
            <Link
              href="/booking"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              相談予約
            </Link>

            {/* Blog */}
            <Link
              href="/blog"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            >
              Blogを見る
            </Link>
          </div>

          {/* スマホ Menu ボタン */}
          <button
            type="button"
            className="relative z-10 md:hidden inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
            onClick={() => setOpen(true)}
            aria-label="メニューを開く"
            aria-expanded={open}
          >
            Menu
          </button>
        </div>
      </header>

      {/* ===== スマホ：全画面メニュー（openの時だけ） ===== */}
      {open && (
        <div className="md:hidden">
          {/* 背景：クリックで閉じる */}
          <button
            type="button"
            className="fixed inset-0 z-[9998] bg-white"
            aria-label="メニュー背景"
            onClick={() => setOpen(false)}
          />

          {/* パネル本体（ここが最前面） */}
          <div className="fixed inset-0 z-[9999] bg-white">
            {/* 上段：タイトル＋Close */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <span className="text-sm font-extrabold text-slate-900">
                HitoriBIZ
              </span>

              <button
                type="button"
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                onClick={() => setOpen(false)}
                aria-label="メニューを閉じる"
              >
                Close
              </button>
            </div>

            <p className="px-4 pt-3 text-xs text-slate-500">
              メニューから各ページへ移動できます。
            </p>

            {/* 横一列ナビ（横スクロール） */}
            <nav className="mt-3 border-b border-slate-200 px-4 py-3">
              <div className="flex gap-5 overflow-x-auto whitespace-nowrap text-sm font-semibold text-slate-800">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:text-sky-700"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* CTA：中央寄せ＆横いっぱいにならない */}
            <div className="px-4 py-6">
              <div className="flex flex-col items-center gap-2">
                {/* 相談予約：/booking */}
                <Link
                  href="/booking"
                  className="inline-flex w-fit items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                  onClick={() => setOpen(false)}
                >
                  相談予約
                </Link>

                {/* Blog */}
                <Link
                  href="/blog"
                  className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  Blogを見る
                </Link>

                {/* Contact（問い合わせフォーム） */}
                <Link
                  href="/contact"
                  className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  お問い合わせ
                </Link>
              </div>
            </div>

            <div className="px-4 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} HitoriBIZ
            </div>
          </div>
        </div>
      )}
    </>
  );
}
