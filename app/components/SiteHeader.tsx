"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { en } from "@/dictionaries/en";
import { ja } from "@/dictionaries/ja";
import { languageSwitchPath, localizedPath, type Locale, type MarketingPath } from "@/lib/i18n";

const navItems = [
  { href: "/", key: "home", localized: true },
  { href: "/services", key: "services", localized: true },
  { href: "/works", key: "works", localized: true },
  { href: "/pricing", key: "pricing", localized: true },
  { href: "/about", key: "about", localized: true },
  { href: "/company", key: "company", localized: true },
] as const;

function navHref(item: (typeof navItems)[number], locale: Locale) {
  return item.localized ? localizedPath(item.href as MarketingPath, locale) : item.href;
}

const hideHeaderPaths = [
  "/metronome-app",
  "/tuner-app",
  "/drone-tone",
  "/tempo-practice",
  "/orchestra-tools",
  "/score-reader-app",
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const locale: Locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ja";
  const dictionary = locale === "en" ? en : ja;
  const alternateLocale = locale === "en" ? "ja" : "en";

  const shouldHideHeader = hideHeaderPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (shouldHideHeader) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          href={localizedPath("/", locale)}
          className="text-lg font-extrabold tracking-tight text-slate-900"
        >
          HitoriBIZ
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={navHref(item, locale)}
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              {dictionary.nav[item.key]}
            </Link>
          ))}

          <Link
            href={languageSwitchPath(pathname)}
            hrefLang={alternateLocale}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            aria-label={dictionary.nav.switchLanguage}
          >
            {locale === "ja" ? "JP / EN" : "EN / JP"}
          </Link>

          {/* CTA */}
          <Link
            href={localizedPath("/booking", locale)}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            {dictionary.nav.booking}
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setOpen(!open)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 p-2 text-slate-700 md:hidden"
          aria-label={open ? dictionary.nav.menuClose : dictionary.nav.menuOpen}
          type="button"
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
                href={navHref(item, locale)}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {dictionary.nav[item.key]}
              </Link>
            ))}

            <Link
              href={languageSwitchPath(pathname)}
              hrefLang={alternateLocale}
              onClick={() => setOpen(false)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              {dictionary.nav.switchLanguage}
            </Link>

            <Link
              href={localizedPath("/booking", locale)}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              {dictionary.nav.booking}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
