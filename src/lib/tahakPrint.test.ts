import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { N, examples } from "@/content/data";
import { PAGES, tahakPrint } from "@/content/tahakPrint";
import manifest from "@/data/leadPdf.json";
import { ETFS } from "./etfs";
import { NBSP } from "./format";
import { ETF_ROWS, SOURCES, TWIN_GROUPS, fxIllustration } from "./tahakPrint";

const refNumber = (r: string) => Number(r.slice(1, -1));

describe("tiskový tahák: data", () => {
  it("má řádek a zdroj pro každé ETF", () => {
    expect(ETF_ROWS.map((r) => r.ticker)).toEqual(ETFS.map((e) => e.ticker));
    for (const r of ETF_ROWS) {
      const s = SOURCES.find((x) => x.n === refNumber(r.ref));
      expect(s?.url, r.ticker).toMatch(/^https:\/\//);
      expect(s?.dates, r.ticker).toContain("2026");
    }
  });

  it("zdroje jsou číslované od 1 bez děr a mají URL a datum", () => {
    SOURCES.forEach((s, i) => {
      expect(s.n).toBe(i + 1);
      expect(s.url).toMatch(/^https:\/\//);
      expect(s.dates.length).toBeGreaterThan(0);
    });
  });

  it("skupiny dvojčat pokrývají každé ETF právě jednou", () => {
    const all = TWIN_GROUPS.flatMap((g) => g.tickers).sort();
    expect(all).toEqual(ETFS.map((e) => e.ticker).sort());
    for (const g of TWIN_GROUPS) for (const f of g.funds) expect(SOURCES[refNumber(f.ref) - 1].label).toContain(f.id);
  });

  it("poplatek a výnosy v tabulce odpovídají datům", () => {
    const voo = ETF_ROWS.find((r) => r.ticker === "VOO")!;
    expect(voo.ter).toBe(`0,03${NBSP}%`);
    expect(voo.usd[2]).toBe(N.vooUsd10);
    expect(voo.czk[2]).toBe(N.vooCzk10);
  });

  it("záporný výnos má znaménko mínus", () => {
    const agg = ETF_ROWS.find((r) => r.ticker === "AGG")!;
    expect(agg.usd[0].startsWith("−")).toBe(true);
  });

  it("ilustrace převodu měny počítá z vkladu", () => {
    const rows = fxIllustration(3000, 25);
    expect(rows[1]).toEqual({
      pct: `0,5${NBSP}%`,
      month: `15${NBSP}Kč`,
      year: `180${NBSP}Kč`,
      total: `4${NBSP}500${NBSP}Kč`,
    });
  });
});

describe("tiskový tahák: texty", () => {
  it("číslo na titulce je stejné jako v hero a reklamách (PLAN pravidlo 6)", () => {
    expect(tahakPrint.cover.teaserValue).toBe(N.diffHeadline);
    expect(tahakPrint.cover.teaserText).toContain(N.monthly);
    expect(examples.default.monthly_czk).toBe(3000);
  });

  it("obsah odkazuje na existující strany", () => {
    const pages = Object.values(PAGES);
    for (const c of tahakPrint.cover.contents) expect(pages).toContain(c.page);
  });

  it("neslibuje e-mail (v produkci je vypnutý)", () => {
    expect(JSON.stringify(tahakPrint)).not.toMatch(/e-mail|pošl|schránk/i);
  });
});

describe("vyrobené PDF", () => {
  const file = join(process.cwd(), "public", manifest.path ?? "missing");
  it("existuje, má název podle hashe a je menší než 3 MB", () => {
    expect(manifest.path, "spusťte npm run pdf").toMatch(/^\/tahak\/[0-9a-f]{10}\.pdf$/);
    expect(existsSync(file)).toBe(true);
    expect(statSync(file).size).toBeLessThan(3 * 1024 * 1024);
    expect(manifest.pages).toBe(Object.keys(PAGES).length);
  });

  it("má náhledy stran", () => {
    for (const p of Object.values(manifest.previews)) expect(existsSync(join(process.cwd(), "public", p)), p).toBe(true);
  });
});
