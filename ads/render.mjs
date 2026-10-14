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

const field = (md, name) => {
  const m = new RegExp(`- \\*\\*${name}:\\*\\* (.+)`).exec(md);
  if (!m) throw new Error(`pole ${name} chybí v copy.md`);
  return m[1].trim();
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
/** Nezlomitelná mezera po jednopísmenných předložkách a mezi číslem a jednotkou (CLAUDE.md, typografie). */
const nb = (s) =>
  s
    .replace(/(^|\s)([ksvzouai])\s/gi, "$1$2 ")
    .replace(/(\d)\s(?=Kč|%|let|měsíčně)/g, "$1 ")
    .replace(/(\d)\s(\d{3})/g, "$1 $2");

const ads = {
  "A-poplatky": (md) => ({
    template: "a.html",
    vars: { bigNumber: field(md, "Velké číslo"), caption: field(md, "Řádek pod číslem"), fine: field(md, "Drobně") },
  }),
  "B-voo": (md) => ({
    template: "b.html",
    vars: {
      rows: field(md, "Tabule")
        .replace(/ jako .*$/, "")
        .split("·")
        .map((t) => `<div class="row"><span class="t">${esc(t.trim())}</span><span class="x">NYSE</span></div>`)
        .join(""),
      stamp: field(md, "Razítko"),
      cta: field(md, "Výzva"),
      fine: field(md, "Drobně"),
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
      const tmp = join(SRC, `.tmp-${dir}-${fmt}.html`);
      writeFileSync(tmp, html);
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      await page.goto(`file://${tmp}`);
      await page.evaluate(() => document.fonts.ready);
      const overflow = await page.evaluate(() => {
        const m = document.querySelector("main");
        const wide = Math.max(0, ...[...m.querySelectorAll("*")].map((e) => e.getBoundingClientRect().right - (innerWidth - 40)));
        return Math.max(m.scrollHeight - m.clientHeight, wide);
      });
      if (overflow > 1) throw new Error(`${dir} ${fmt}: obsah přetéká o ${Math.round(overflow)} px`);
      mkdirSync(join(ROOT, "ads", dir), { recursive: true });
      await page.screenshot({ path: join(ROOT, "ads", dir, `${fmt}-${w}x${h}.png`) });
      await page.close();
    }
  }
} finally {
  await browser.close();
}
console.log("Hotovo: ads/A-poplatky a ads/B-voo");
