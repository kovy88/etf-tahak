// Screenshoty a kontroly rozvržení přes Playwright. Použití: node scripts/shots.mjs [baseUrl] [outDir]
import { chromium } from "@playwright/test";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3100";
const out = process.argv[3] ?? "/tmp/etf-shots";
fs.mkdirSync(out, { recursive: true });

const sizes = [
  [320, 568],
  [360, 600],
  [375, 667],
  [414, 896],
  [1280, 800],
];
const pages = ["/poplatky", "/srovnani", "/"];
const browser = await chromium.launch();
const report = [];
for (const [w, h] of sizes) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    isMobile: w < 600,
    hasTouch: w < 600,
  });
  for (const p of pages) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(base + p, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const name = `${p === "/" ? "root" : p.slice(1)}-${w}`;
    await page.screenshot({ path: `${out}/${name}-hero.png` });
    const m = await page.evaluate(() => {
      const cta = [...document.querySelectorAll("header button")].find((b) => b.textContent?.includes("tahák"));
      const r = cta?.getBoundingClientRect();
      return {
        scrollW: document.documentElement.scrollWidth,
        innerW: innerWidth,
        ctaBottom: r ? Math.round(r.bottom) : null,
        h1: document.querySelector("h1")?.textContent?.slice(0, 60),
      };
    });
    if (w <= 414) await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
    report.push({ page: p, w, h, ...m, overflowX: m.scrollW > m.innerW, ctaFits: m.ctaBottom !== null && m.ctaBottom <= h, errors });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
for (const r of report) console.log(JSON.stringify(r));
