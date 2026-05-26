import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HitoriBIZ Orchestra Tools",
  description:
    "Metronome, Tuner, Drone Tone and Tempo Practice for orchestral musicians.",
  manifest: "/orchestra-tools.webmanifest",
  icons: {
    icon: [
      {
        url: "/icons/orchestra-tools/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/icons/orchestra-tools/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/orchestra-tools/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Orchestra Tools",
    statusBarStyle: "black-translucent",
  },
};

export default function OrchestraToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}