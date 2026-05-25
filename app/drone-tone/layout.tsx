import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drone Tone | Orchestra Practice Tool",
  description: "A continuous reference tone tool for orchestra practice.",
  manifest: "/drone-tone.webmanifest",
  themeColor: "#f97316",
  appleWebApp: {
    capable: true,
    title: "Drone Tone",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      {
        url: "/icons/drone-tone/drone-tone-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/drone-tone/drone-tone-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/drone-tone/drone-tone-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function DroneToneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}