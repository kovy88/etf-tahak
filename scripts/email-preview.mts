// Vykreslí e-mail po odeslání do docs/img/email-preview.png (bez odeslání). Použití: npx tsx --conditions=react-server scripts/email-preview.mts
import fs from "node:fs";
import { chromium } from "@playwright/test";
import { buildEmail } from "../src/lib/server/email.ts";

const mail = buildEmail({
  siteUrl: "https://etf-tahak.vercel.app",
  pdfUrl: "/tahak/ukazka.pdf",
  leadId: "00000000-0000-4000-8000-000000000000",
  calc: { monthly: 3000, years: 25, gross: 6, etfId: "SPYL" },
});
fs.mkdirSync("docs/img", { recursive: true });
fs.writeFileSync("/tmp/email-preview.html", mail.html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 420, height: 800 }, deviceScaleFactor: 2 });
await p.setContent(mail.html);
await p.screenshot({ path: "docs/img/email-preview.png", fullPage: true });
await b.close();
console.log("Předmět:", mail.subject);
