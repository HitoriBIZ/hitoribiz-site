import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Wind & Brass Tuner | HitoriBIZ",
  description:
    "Browser-based tuner for wind and brass players with Written Pitch and Concert Pitch support for B-flat, E-flat, and F instruments.",
  manifest: "/wind-brass-tuner.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Wind & Brass Tuner",
  },
  icons: {
    icon: [
      { url: "/icons/wind-brass-tuner/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/wind-brass-tuner/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/wind-brass-tuner/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/wind-brass-tuner/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/wind-brass-tuner/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/icons/wind-brass-tuner/favicon-32.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#b8872a",
};

export default function WindBrassTunerLayout({ children }: { children: ReactNode }) {
  return children;
}
