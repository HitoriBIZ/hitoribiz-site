import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Orchestra Metronome | HitoriBIZ",
  description: "A performance-focused metronome for orchestra musicians.",
  manifest: "/orchestra-metronome.webmanifest",
  icons: {
    icon: [{ url: "/icons/orchestra-metronome-icon-1024.png", sizes: "1024x1024", type: "image/png" }],
    apple: [{ url: "/icons/orchestra-metronome-icon-1024.png", sizes: "1024x1024", type: "image/png" }],
  },
  appleWebApp: { capable: true, title: "Orchestra Metronome", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#000000" };
export default function MetronomeLayout({ children }: { children: React.ReactNode }) { return children; }
