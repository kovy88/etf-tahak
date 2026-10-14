/**
 * Screenshoty průchodu na mobilu (375×667) do docs/img/ pro README (PLAN F10).
 * Odeslání formuláře se mockuje, takže do DB nic nezapíše. UTM claude_test odfiltruje PostHog.
 * Použití: node scripts/walkthrough.mjs [baseUrl]
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "https://etf-tahak.vercel.app";
const out = "docs/img";
mkdirSync(out, { recursive: true });
const q = "?utm_source=claude_test&utm_medium=readme";

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 375, height: 667 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  reducedMotion: "reduce",
});
await ctx.route("**/api/lead", (r) => r.fulfill({ json: { ok: true, lead_id: crypto.randomUUID(), downloadUrl: "/favicon.ico" } }));
await ctx.route("**/api/lead/profile", (r) => r.fulfill({ json: { ok: true } }));

const shot = (page, name) => page.screenshot({ path: `${out}/${name}.png` });
const decline = async (page) => {
  const b = page.getByRole("button", { name: "Odmítnout" });
  await b.waitFor({ timeout: 5000 }).then(() => b.click()).catch(() => {});
};

// A: /poplatky
const a = await ctx.newPage();
await a.goto(base + "/poplatky" + q, { waitUntil: "networkidle" });
await shot(a, "01-poplatky-hero");
await a.locator("#kalkulacka form").scrollIntoViewIfNeeded();
await decline(a); // lišta cookies se ukáže po odrolování a zakrývala by obsah
await a.evaluate(() => {
  const r = document.querySelector("#kalkulacka .marker").getBoundingClientRect();
  window.scrollBy(0, r.top - 80);
});
await shot(a, "02-kalkulacka-vysledek");
await a.evaluate(() => {
  const r = document.querySelector("#kalkulacka form").getBoundingClientRect();
  window.scrollBy(0, r.top - 140);
});
await shot(a, "03-kalkulacka-formular");
await a.locator("#srovnani").scrollIntoViewIfNeeded();
await a.getByRole("button", { name: /Odemknout zbylých/ }).scrollIntoViewIfNeeded();
await a.evaluate(() => window.scrollBy(0, -260));
await shot(a, "04-srovnani-gate");
const form = a.locator("#kalkulacka form");
await form.scrollIntoViewIfNeeded();
await form.locator("input[type=email]").fill("ukazka@seznam.cz");
await a.waitForTimeout(2100); // minimální čas formuláře
await form.locator("button[type=submit]").click();
await a.locator("#kalkulacka").getByRole("link", { name: /Stáhnout/ }).waitFor();
await a.locator("#kalkulacka").getByRole("link", { name: /Stáhnout/ }).scrollIntoViewIfNeeded();
await a.evaluate(() => window.scrollBy(0, -120));
await a.waitForTimeout(500); // lepivá lišta po odeslání odjede
await shot(a, "05-dekovny-stav");

// B: /srovnani
const b = await ctx.newPage();
await b.goto(base + "/srovnani" + q, { waitUntil: "networkidle" });
await shot(b, "06-srovnani-hero");

await browser.close();
console.log(`Hotovo: ${out}/01–06*.png`);
