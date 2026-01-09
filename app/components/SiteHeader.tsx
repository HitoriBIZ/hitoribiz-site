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

  // メニューOPEN中は背景スクロールを止める
  useEffect(() => {
    const prev = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESCで閉じる（PCでも便利）
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      {/* ===== Header（常時） ===== */}
      <header className="fixed left-0 right-0 top-0 z-[9999] border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* ロゴ */}
          <Link
            href="/"
            className="text-sm font-extrabold tracking-tight text-slate-900"
            onClick={() => setOpen(false)}
          >
            HitoriBIZ
          </Link>

          {/* PC ナビ */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
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
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/contact"
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              相談予約
            </Link>
            <Link
              href="/blog"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Blogを見る
            </Link>
          </div>

          {/* スマホ Menu ボタン */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
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
          {/* 背景（押したら閉じる） */}
          <button
            className="fixed inset-0 z-[9998] bg-white"
            aria-label="メニュー背景"
            onClick={() => setOpen(false)}
          />

          {/* パネル（中身） */}
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

            {/* 説明 */}
            <p className="px-4 pt-3 text-xs text-slate-500">
              Closeで閉じます。
            </p>

            {/* ナビ：横一列（横スクロール） */}
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
            <div className="px-4 py-5">
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/contact"
                  className="inline-flex w-fit items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
                  onClick={() => setOpen(false)}
                >
                  相談予約
                </Link>

                <Link
                  href="/blog"
                  className="inline-flex w-fit items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  Blogを見る
                </Link>
              </div>

              <p className="mt-4 text-center text-xs text-slate-500">
                ※ メニューから各ページへ移動できます。
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
