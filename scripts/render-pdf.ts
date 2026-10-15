/**
 * Vyrobí PDF taháku a PNG náhledy ze stránky /tahak/print (PLAN F7).
 *
 * Spuštění: npm run pdf   (postaví web a spustí tenhle skript)
 * Bez PDF_BASE_URL skript sám nastartuje `next start` na portu 3110 (potřebuje hotový build).
 *
 * Výstup:
 *  - public/tahak/<hash>.pdf          (hash = prvních 10 znaků SHA-256 obsahu stránky; starší odkazy zůstávají funkční)
 *  - public/tahak/preview-*.png       (náhledy 3 stran pro sekci „Co je v taháku“)
 *  - src/data/leadPdf.json            (cesta k PDF; web ji použije, když nejsou nastavené LEAD_PDF_PATH)
 *
 * Skript selže, když se některá strana přeteče nebo když PDF nemá 3 MB a méně.
 */
import { spawn, type ChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "tahak");
const MAX_BYTES = 3 * 1024 * 1024;
const PORT = 3110;

/** Strany, které ukazuje sekce „Co je v taháku“ (čísla stran v src/content/tahakPrint.ts PAGES). */
const PREVIEWS: Record<string, number> = { compare: 2, twins: 5, tax: 6 };
const PREVIEW_WIDTH_PX = 640;
const A4_WIDTH_PX = 794; // 210 mm při 96 dpi

async function waitFor(url: string, ms = 60_000) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* server ještě neběží */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server neodpovídá: ${url}`);
}

async function main() {
  let server: ChildProcess | null = null;
  let base = process.env.PDF_BASE_URL;
  if (!base) {
    base = `http://localhost:${PORT}`;
    server = spawn(join(ROOT, "node_modules", ".bin", "next"), ["start", "-p", String(PORT)], {
      cwd: ROOT,
      stdio: "ignore",
    });
  }
  const browser = await chromium.launch();
  try {
    await waitFor(`${base}/tahak/print`);
    const context = await browser.newContext({
      viewport: { width: A4_WIDTH_PX, height: 1123 },
      deviceScaleFactor: PREVIEW_WIDTH_PX / A4_WIDTH_PX,
      reducedMotion: "reduce", // zvýrazňovač je hned celý, ne uprostřed animace
      locale: "cs-CZ",
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`${base}/tahak/print`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print" });

    // Přetečení: obsah strany nesmí přesáhnout její tělo ani celou stranu.
    const overflow = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("[data-sheet]")]
        .map((s) => {
          const body = s.querySelector<HTMLElement>("[data-body]");
          const over = Math.max(s.scrollHeight - s.clientHeight, body ? body.scrollHeight - body.clientHeight : 0);
          return { page: s.dataset.sheet, over };
        })
        .filter((x) => x.over > 1),
    );
    if (overflow.length) {
      throw new Error(`Přetečení stran (px): ${overflow.map((o) => `${o.page}: +${o.over}`).join(", ")}`);
    }
    if (errors.length) throw new Error(`Chyby v konzoli: ${errors.join(" | ")}`);

    const sheets = await page.locator("[data-sheet]").count();
    const html = await page.evaluate(() => document.querySelector("main")?.innerHTML ?? "");
    const hash = createHash("sha256").update(html).digest("hex").slice(0, 10);

    mkdirSync(OUT, { recursive: true });
    // Staré verze ponecháváme: odkazy v e-mailech a v již odemčených relacích nesmí vracet 404.

    // PDF
    const file = `${hash}.pdf`;
    const buf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    writeFileSync(join(OUT, file), buf);
    const pdfPages = (buf.toString("latin1").match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length;
    if (pdfPages !== sheets) throw new Error(`PDF má ${pdfPages} stran, očekáváno ${sheets}`);
    if (buf.length >= MAX_BYTES) throw new Error(`PDF má ${buf.length} B, limit je ${MAX_BYTES} B`);

    // Náhledy
    for (const [name, n] of Object.entries(PREVIEWS)) {
      await page.locator(`[data-sheet="${n}"]`).screenshot({ path: join(OUT, `preview-${name}.png`), animations: "disabled" });
    }

    const png = readFileSync(join(OUT, "preview-compare.png"));
    const manifest = {
      path: `/tahak/${file}`,
      pages: pdfPages,
      bytes: buf.length,
      content_hash: hash,
      preview_size: { width: png.readUInt32BE(16), height: png.readUInt32BE(20) },
      previews: Object.fromEntries(Object.keys(PREVIEWS).map((k) => [k, `/tahak/preview-${k}.png`])),
    };
    writeFileSync(join(ROOT, "src", "data", "leadPdf.json"), `${JSON.stringify(manifest, null, 2)}\n`);

    const kb = (b: number) => `${(b / 1024).toFixed(0)} kB`;
    console.log(`PDF: public/tahak/${file}, ${pdfPages} stran, ${kb(buf.length)}`);
    for (const k of Object.keys(PREVIEWS)) console.log(`náhled ${k}: ${kb(statSync(join(OUT, `preview-${k}.png`)).size)}`);
    console.log(`Cesta k PDF je v src/data/leadPdf.json: ${manifest.path}`);
  } finally {
    await browser.close();
    server?.kill();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
