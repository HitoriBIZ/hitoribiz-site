import type { Metadata } from "next";
import { en } from "@/dictionaries/en";
import { ja, type SiteDictionary } from "@/dictionaries/ja";

export type Locale = "ja" | "en";
export type MarketingPath = "/" | "/services" | "/works" | "/about" | "/pricing" | "/contact" | "/booking" | "/company" | "/privacy" | "/legal";

export const siteUrl = "https://www.hitori-biz.com";
export const marketingPaths: MarketingPath[] = ["/", "/services", "/works", "/about", "/pricing", "/contact", "/booking", "/company", "/privacy", "/legal"];

export function getDictionary(locale: Locale): SiteDictionary {
  return locale === "en" ? en : ja;
}

export function localizedPath(path: MarketingPath, locale: Locale) {
  if (locale === "ja") return path;
  return path === "/" ? "/en" : `/en${path}`;
}

export function languageSwitchPath(pathname: string) {
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const basePath = isEnglish ? pathname.replace(/^\/en(?=\/|$)/, "") || "/" : pathname;
  const supportedPath = marketingPaths.includes(basePath as MarketingPath) ? (basePath as MarketingPath) : "/";
  return localizedPath(supportedPath, isEnglish ? "ja" : "en");
}

export function pageMetadata(locale: Locale, path: MarketingPath, title: string, description: string): Metadata {
  const canonical = localizedPath(path, locale);
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "ja-JP": localizedPath(path, "ja"),
        "en-US": localizedPath(path, "en"),
        "x-default": localizedPath(path, "ja"),
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title,
      description,
      siteName: "HitoriBIZ",
      locale: locale === "en" ? "en_US" : "ja_JP",
      alternateLocale: locale === "en" ? ["ja_JP"] : ["en_US"],
    },
  };
}
