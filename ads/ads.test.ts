import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { N, hero } from "@/content";
import { etfsData } from "@/content/data";
import { NBSP } from "@/lib/format";

const read = (dir: string) =>
  readFileSync(path.join(__dirname, dir, "copy.md"), "utf8").replaceAll(NBSP, " ");
const field = (md: string, name: string) => {
  const m = new RegExp(`- \\*\\*${name}:\\*\\* (.+)`).exec(md);
  if (!m) throw new Error(`pole ${name} chybí`);
  return m[1].trim();
};
const plain = (s: string) => s.replaceAll(NBSP, " ");

describe("reklamy", () => {
  const a = read("A-poplatky");
  const b = read("B-voo");

  it("titulek má nejvýš 40 znaků", () => {
    expect(field(a, "Titulek").length).toBeLessThanOrEqual(40);
    expect(field(b, "Titulek").length).toBeLessThanOrEqual(40);
  });

  it("prvních 125 znaků primárního textu nese sdělení", () => {
    for (const md of [a, b]) {
      const t = field(md, "Primární text");
      expect(t.length).toBeLessThanOrEqual(125);
    }
  });

  it("čísla v A shodná s examples.json a hero", () => {
    expect(a).toContain(plain(N.diffHeadline));
    expect(a).toContain(plain(N.avgTer));
    expect(a).toContain(plain(N.etfTer));
    expect(a).toContain(plain(N.monthly));
    expect(a).toContain(`${N.years} let`);
    expect(a).toContain("modelový výpočet");
  });

  it("hero A opakuje slib reklamy A a hero B reklamy B", () => {
    expect(a).toContain(plain(hero.poplatky.h1));
    expect(b).toContain(plain(hero.srovnani.h1.split(".")[1].trim()).slice(0, 8));
    expect(plain(hero.srovnani.h1)).toContain("VOO, SPY, VTI.");
  });

  it("čísla v B shodná s daty", () => {
    expect(b).toContain(`U ${N.exactTwins} z ${N.etfCount}`);
    expect(b).toContain(`dalších ${N.similarTwins}`);
  });

  it("ukázka B používá skutečná evropská dvojčata se stejným indexem a listingem", () => {
    const pairs = field(b, "Ukázka").split("·");
    expect(pairs).toHaveLength(2);
    for (const pair of pairs) {
      const [ticker, id] = pair.split("→").map((x) => x.trim());
      const etf = etfsData.etfs.find((e) => e.ticker === ticker);
      const fund = etf?.ucits_twin.funds.find((f) => f.id === id);
      expect(etf?.ucits_twin.match).toBe("exact");
      expect(fund?.index.value).toBe(etf?.index.value);
      expect(fund?.listings.xetra).toBeTruthy();
      expect(fund?.ter_pct.verified).not.toBe(false);
    }
  });

  it("obě kreativy mají vlastní nabídku a výzvu i bez primárního textu", () => {
    for (const md of [a, b]) {
      expect(field(md, "Nabídka")).toContain("tahák");
      expect(field(md, "Výzva").length).toBeGreaterThan(10);
      expect(field(md, "Detail nabídky")).toContain("daně");
      expect(field(md, "Pokračování primárního textu")).toContain("e-mailu");
    }
    expect(field(b, "Pokračování primárního textu")).toContain(`${N.pdfPages} stran`);
  });

  it("nemá zakázané fráze ani osobní oslovení", () => {
    for (const md of [a.split("## Kontrola")[0], b.split("## Kontrola")[0]]) {
      const l = md.toLowerCase();
      for (const f of ["bez rizika", "zaručený", "nejlepší etf", "!!", "—", "máte peníze"])
        expect(l).not.toContain(f);
    }
  });

  it("UTM odkazy mají povinné parametry", () => {
    for (const md of [a, b]) {
      const links = md.match(/https:\/\/etf-tahak\.vercel\.app\/\S+?(?=`)/g) ?? [];
      expect(links.length).toBe(2);
      for (const l of links) {
        const u = new URL(l);
        expect(u.searchParams.get("utm_source")).toBe("meta");
        expect(u.searchParams.get("utm_medium")).toBe("paid_social");
        expect(u.searchParams.get("utm_campaign")).toBe("etf_tahak_launch");
        expect(u.searchParams.get("utm_content")).toMatch(/_(feed|story)$/);
      }
    }
  });

  it("kreativy existují ve správných rozměrech", () => {
    for (const dir of ["A-poplatky", "B-voo"]) {
      for (const [file, w, h] of [
        ["feed-1080x1350.png", 1080, 1350],
        ["story-1080x1920.png", 1080, 1920],
      ] as const) {
        const png = readFileSync(path.join(__dirname, dir, file));
        expect(png.readUInt32BE(16)).toBe(w);
        expect(png.readUInt32BE(20)).toBe(h);
      }
    }
  });
});
