"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/works", label: "Works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  // Contact は使わず、相談は booking に統一
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-slate-900"
        >
           HitoriBIZ
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              {item.label}
            </Link>
          ))}

          {/* CTA */}
          <Link
            href="/booking"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            オンライン相談
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-700 md:hidden"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="flex flex-col gap-2 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              オンライン相談
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
