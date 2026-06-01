import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Orchestra Score Reader",
  description: "Orchestra Score Reader for iPad and tablet performance use.",
  manifest: "/score-reader.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Score Reader",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icons/score-reader/icon-192.png",
    icon: [
      {
        url: "/icons/score-reader/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/score-reader/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function ScoreReaderAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}