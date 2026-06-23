import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Orchestra Tuner | HitoriBIZ",
  description:
    "Browser-based orchestra tuner for iPhone and Android. Tune with microphone input, reference tones, and orchestral pitch settings.",
  manifest: "/tuner.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Orchestra Tuner",
  },
  icons: {
    icon: [
      { url: "/icons/tuner/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/tuner/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/tuner/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/tuner/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/icons/tuner/favicon-32.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function TunerLayout({ children }: { children: ReactNode }) {
  return children;
}
