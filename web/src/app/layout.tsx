import type { Metadata } from "next";
import { JetBrains_Mono, Permanent_Marker, Space_Grotesk } from "next/font/google";
import { AppProviders } from "@/providers/app-providers";
import { BufferPolyfill } from "@/components/buffer-polyfill";
import "./globals.css";

const marker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-permanent-marker",
  display: "swap",
});

const grotek = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const mono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Outer Rim · Gorbagana $GOR bridge",
  description:
    "Bridge native $GOR on Gorchain against SPL $GOR on Solana via Hyperlane warp.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${marker.variable} ${grotek.variable} ${mono.variable} antialiased`}>
        <BufferPolyfill />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
