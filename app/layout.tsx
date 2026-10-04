import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Priya Foods — The Joy of Good Taste",
  description: "Discover authentic Priya pickles and roti pachadis. Familiar flavours, rooted in tradition since 1980.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
