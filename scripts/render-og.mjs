/**
 * OG obrázky pro sdílení (1200×630) a ikony (PLAN §16).
 * Výstup: public/og/{poplatky,srovnani}.png, src/app/apple-icon.png, src/app/favicon.ico.
 * Texty bere z oddílu „Kreativa“ v ads/*\/copy.md, stejně jako ads/render.mjs, takže čísla sedí s reklamou i hero.
 * Spuštění: npm run og
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "ads", "_src");

const field = (md, name) => {
  const m = new RegExp(`- \\*\\*${name}:\\*\\* (.+)`).exec(md);
  if (!m) throw new Error(`pole ${name} chybí v copy.md`);
  return m[1].trim();
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const nb = (s) =>
  s
    .replace(/(^|\s)([ksvzouai])\s/gi, "$1$2\u00a0")
    .replace(/(\d)\s(?=Kč|%|let|měsíčně)/g, "$1\u00a0")
    .replace(/(\d)\s(\d{3})/g, "$1\u00a0$2");
const t = (s) => nb(esc(s));

const a = readFileSync(join(ROOT, "ads", "A-poplatky", "copy.md"), "utf8");
const b = readFileSync(join(ROOT, "ads", "B-voo", "copy.md"), "utf8");
const tickers = field(b, "Tabule").replace(/ jako .*$/, "").split("·").map((x) => x.trim());

const shell = (body) => `<!doctype html><html lang="cs"><head><meta charset="utf-8">
<link rel="stylesheet" href="ad.css">
<style>
  html, body { width: 1200px; height: 630px; }
  .og { height: 630px; padding: 56px 72px; display: flex; flex-direction: column; justify-content: center; gap: 26px;
    background-image: repeating-linear-gradient(to bottom, transparent 0 41px, var(--line) 41px 42px); }
  .tag { font-family: var(--mono); font-size: 22px; letter-spacing: .04em; text-transform: uppercase; color: var(--loss); font-weight: 600; }
  .num { font-size: 132px; line-height: 1; font-weight: 700; letter-spacing: -.03em; white-space: nowrap; }
  .lead { font-size: 40px; line-height: 1.18; font-weight: 500; max-width: 21em; }
  .site { font-family: var(--mono); font-size: 22px; color: var(--grey); display: flex; justify-content: space-between; }
  .board { display: flex; gap: 14px; position: relative; }
  .tk { background: var(--ink); color: var(--paper); font-family: var(--mono); font-weight: 600; font-size: 76px; padding: 14px 22px; position: relative; }
  .tk::after { content: ""; position: absolute; left: 10px; right: 10px; top: 50%; height: 6px; background: var(--loss); transform: rotate(-4deg); }
  .stamp { display: inline-block; transform: rotate(-3deg); border: 5px solid var(--loss); color: var(--loss); font-family: var(--mono); font-weight: 600;
    font-size: 30px; padding: 8px 18px; text-transform: uppercase; letter-spacing: .03em; align-self: flex-start; }
  .h { font-size: 56px; line-height: 1.1; font-weight: 600; }
</style></head><body><main class="og">${body}</main></body></html>`;

const site = `<p class="site"><span>etf-tahak.vercel.app</span><span>ETF tahák 2026</span></p>`;
const pages = {
  poplatky: shell(`
    <p class="tag">modelový výpočet</p>
    <p class="num serif"><span class="hl">${t(field(a, "Velké číslo"))}</span></p>
    <p class="lead">${t(field(a, "Řádek pod číslem"))}</p>
    ${site}`),
  srovnani: shell(`
    <div class="board">${tickers.map((x) => `<span class="tk">${esc(x)}</span>`).join("")}</div>
    <p class="stamp">${t(field(b, "Razítko"))}</p>
    <p class="h"><span class="hl">${t(field(b, "Výzva"))}</span></p>
    ${site}`),
};

/** ICO s vloženými PNG (podporují všechny současné prohlížeče). */
function ico(pngs) {
  const head = Buffer.alloc(6 + 16 * pngs.length);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(pngs.length, 4);
  let offset = head.length;
  pngs.forEach(({ size, data }, i) => {
    const o = 6 + 16 * i;
    head.writeUInt8(size >= 256 ? 0 : size, o);
    head.writeUInt8(size >= 256 ? 0 : size, o + 1);
    head.writeUInt16LE(1, o + 4);
    head.writeUInt16LE(32, o + 6);
    head.writeUInt32LE(data.length, o + 8);
    head.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...pngs.map((p) => p.data)]);
}

const browser = await chromium.launch();
try {
  mkdirSync(join(ROOT, "public", "og"), { recursive: true });
  for (const [name, html] of Object.entries(pages)) {
    const tmp = join(SRC, `.tmp-og-${name}.html`);
    writeFileSync(tmp, html);
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.goto(`file://${tmp}`);
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => {
      const m = document.querySelector("main");
      const wide = Math.max(0, ...[...m.querySelectorAll("*")].map((e) => e.getBoundingClientRect().right - (innerWidth - 40)));
      return Math.max(m.scrollHeight - m.clientHeight, wide);
    });
    if (overflow > 1) throw new Error(`OG ${name}: obsah přetéká o ${Math.round(overflow)} px`);
    await page.screenshot({ path: join(ROOT, "public", "og", `${name}.png`) });
    await page.close();
  }

  const svg = readFileSync(join(ROOT, "src", "app", "icon.svg"), "utf8");
  const shot = async (size, pad = 0, bg = "transparent") => {
    const page = await browser.newPage({ viewport: { width: size, height: size } });
    await page.setContent(
      `<body style="margin:0;background:${bg}"><div style="padding:${pad}px;width:${size}px;height:${size}px;box-sizing:border-box">${svg.replace("<svg ", `<svg width="${size - 2 * pad}" height="${size - 2 * pad}" `)}</div></body>`,
    );
    const data = await page.screenshot({ omitBackground: bg === "transparent" });
    await page.close();
    return data;
  };
  // Apple ikona nesmí být průhledná, iOS ji jinak podloží černou
  writeFileSync(join(ROOT, "src", "app", "apple-icon.png"), await shot(180, 0, "#15140F"));
  writeFileSync(
    join(ROOT, "src", "app", "favicon.ico"),
    ico([
      { size: 32, data: await shot(32) },
      { size: 48, data: await shot(48) },
    ]),
  );
} finally {
  await browser.close();
}
console.log("Hotovo: public/og/*.png, src/app/apple-icon.png, src/app/favicon.ico");
