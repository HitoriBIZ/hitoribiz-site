import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Tempo Practice | Orchestra Tools",
  description:
    "Tempo Practice is a progressive tempo training tool for orchestra musicians.",
  manifest: "/tempo-practice.webmanifest",
  icons: {
    icon: [
      {
        url: "/icons/tempo-practice/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icons/tempo-practice/favicon-16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/icons/tempo-practice/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/tempo-practice/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/tempo-practice/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Tempo Practice",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#166534",
};

export default function TempoPracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}