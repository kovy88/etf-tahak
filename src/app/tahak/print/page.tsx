import type { Metadata } from "next";
import { TahakPrint } from "@/components/print/TahakPrint";

export const metadata: Metadata = {
  title: "ETF tahák 2026",
  robots: { index: false, follow: false },
};

/** Zdroj pro scripts/render-pdf.ts. Měření a lišta cookies se tu nespouští (viz Analytics a CookieBar). */
export default function Page() {
  return (
    <main className="bg-paper-deep py-6 print:bg-paper print:py-0">
      <style>{`@page { size: A4; margin: 0; } @media print { html, body { background: var(--paper); } }`}</style>
      <TahakPrint />
    </main>
  );
}
