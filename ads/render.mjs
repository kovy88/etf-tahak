/**
 * Vyrobí kreativy reklam (PLAN F8): ads/<varianta>/feed-1080x1350.png a story-1080x1920.png.
 * Spuštění: node ads/render.mjs
 * Texty bere z oddílu „Kreativa“ v ads/*\/copy.md (čísla v nich hlídá ads/ads.test.ts proti src/data).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "ads", "_src");
const FORMATS = { feed: [1080, 1350], story: [1080, 1920] };
const examples = JSON.parse(readFileSync(join(ROOT, "src/data/examples.json"), "utf8"));
const etfs = JSON.parse(readFileSync(join(ROOT, "src/data/etfs.json"), "utf8")).etfs;
const pdf = JSON.parse(readFileSync(join(ROOT, "src/data/leadPdf.json"), "utf8"));
const num = (n) => new Intl.NumberFormat("cs-CZ").format(n);
const pct = (n) => `${num(n)} %`;

const field = (md, name) => {
  const m = new RegExp(`- \\*\\*${name}:\\*\\* (.+)`).exec(md);
  if (!m) throw new Error(`pole ${name} chybí v copy.md`);
  return m[1].trim();
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
/** Nezlomitelná mezera po jednopísmenných předložkách a mezi číslem a jednotkou (CLAUDE.md, typografie). */
const nb = (s) =>
  s
    .replace(/(^|\s)([ksvzouai])\s/gi, "$1$2 ")
    .replace(/(\d)\s(?=Kč|%|let|měsíčně)/g, "$1 ")
    .replace(/(\d)\s(\d{3})/g, "$1 $2");

const common = (md) => ({ pages: String(pdf.pages), offer: field(md, "Nabídka"), offerDetail: field(md, "Detail nabídky"), cta: field(md, "Výzva"), fine: field(md, "Drobně"), headline: field(md, "Nadpis") });

function comparisonRows(md) {
  return field(md, "Ukázka").split("·").map((pair) => {
    const [ticker, id] = pair.split("→").map((x) => x.trim());
    const etf = etfs.find((e) => e.ticker === ticker);
    const fund = etf?.ucits_twin.funds.find((f) => f.id === id);
    if (etf?.ucits_twin.match !== "exact" || !fund?.listings.xetra) throw new Error(`Neověřená přesná alternativa: ${pair}`);
    return `<div class="comparison-row"><span class="ticker">${esc(ticker)}</span><span class="comparison-arrow">→</span><span class="ticker eu">${esc(fund.listings.xetra)}</span></div>`;
  }).join("");
}

const ads = {
  "A-poplatky": (md) => ({
    template: "a.html",
    vars: { ...common(md), amount: num(Math.round(examples.default.difference_czk / 1000) * 1000), resultLabel: field(md, "Popisek výsledku"), fundLabel: field(md, "Fond"), etfLabel: field(md, "ETF"), fundTer: pct(examples.inputs.avg_fund.ter_pct.value), etfTer: pct(examples.inputs.etf.ter_pct.value) },
  }),
  "B-voo": (md) => ({
    template: "b.html",
    vars: {
      ...common(md), rows: comparisonRows(md), subhead: field(md, "Podnadpis"), usLabel: field(md, "Sloupec USA"), euLabel: field(md, "Sloupec Evropa"), comparisonNote: field(md, "Poznámka srovnání"),
    },
  }),
};

const browser = await chromium.launch();
try {
  for (const [dir, build] of Object.entries(ads)) {
    const md = readFileSync(join(ROOT, "ads", dir, "copy.md"), "utf8");
    const { template, vars } = build(md);
    for (const [fmt, [w, h]] of Object.entries(FORMATS)) {
      let html = readFileSync(join(SRC, template), "utf8").replaceAll("{{format}}", fmt);
      for (const [k, v] of Object.entries(vars)) html = html.replaceAll(`{{${k}}}`, k === "rows" ? v : nb(esc(v)));
      if (/\{\{\w+\}\}/.test(html)) throw new Error(`${dir}: nevyplněná šablona`);
      const tmp = join(SRC, `.tmp-${dir}-${fmt}.html`);
      writeFileSync(tmp, html);
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      await page.goto(`file://${tmp}`);
      await page.evaluate(() => document.fonts.ready);
      await page.locator("img").evaluateAll((images) => {
        if (images.some((img) => !img.complete || img.naturalWidth === 0)) throw new Error("Chybí skutečný náhled PDF");
      });
      const overflow = await page.evaluate(() => {
        const m = document.querySelector("main");
        const wide = Math.max(0, ...[...m.querySelectorAll("*")].map((e) => e.getBoundingClientRect().right - (innerWidth - 40)));
        return Math.max(m.scrollHeight - m.clientHeight, wide);
      });
      if (overflow > 1) throw new Error(`${dir} ${fmt}: obsah přetéká o ${Math.round(overflow)} px`);
      if (fmt === "story") {
        const safe = await page.evaluate(() => [...document.querySelector("main").children].every((el) => {
          const r = el.getBoundingClientRect();
          return r.top >= 270 && r.bottom <= innerHeight - 270;
        }));
        if (!safe) throw new Error(`${dir}: obsah je mimo bezpečnou plochu Stories`);
      }
      mkdirSync(join(ROOT, "ads", dir), { recursive: true });
      await page.screenshot({ path: join(ROOT, "ads", dir, `${fmt}-${w}x${h}.png`) });
      await page.close();
    }
  }
} finally {
  await browser.close();
}
console.log("Hotovo: ads/A-poplatky a ads/B-voo");
