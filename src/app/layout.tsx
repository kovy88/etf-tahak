import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { legal } from "@/content/legal";
import { openGraph, SITE_DESCRIPTION, SITE_TITLE } from "@/lib/seo";
import { CookieBar } from "@/components/CookieBar";

const serif = Fraunces({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  display: "swap",
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
