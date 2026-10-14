import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "ETF tahák: 12 ETF z NYSE pro české investory",
  description:
    "Srovnání 12 ETF z NYSE, jejich evropských alternativ, poplatků a českých daní. Zdroje u každého čísla.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4F1EA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
