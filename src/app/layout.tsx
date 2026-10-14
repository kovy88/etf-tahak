import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { legal } from "@/content/legal";
import { openGraph, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";
import { CookieBar } from "@/components/CookieBar";

// Fraunces a IBM Plex Mono zmenšené na znaky češtiny (data/subset_fonts.py): 64 kB místo 110 kB (LCP, PLAN §16)
const serif = localFont({
  src: [
    { path: "./fonts/fraunces-400.woff2", weight: "400" },
    { path: "./fonts/fraunces-600.woff2", weight: "600" },
  ],
  variable: "--font-serif",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
});
const mono = localFont({
  src: [
    { path: "./fonts/plex-mono-400.woff2", weight: "400" },
    { path: "./fonts/plex-mono-600.woff2", weight: "600" },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

/** Absolutní URL pro OG obrázky: produkční doména na Vercelu, jinak NEXT_PUBLIC_SITE_URL. */
const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: openGraph({ title: SITE_TITLE, description: SITE_DESCRIPTION, url: "/", image: "srovnani" }),
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4F1EA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${serif.variable} ${mono.variable}`}>
      <body>
        {children}
        <Analytics />
        <CookieBar copy={{ ...legal.cookie, privacy: legal.footer.privacy }} />
      </body>
    </html>
  );
}
