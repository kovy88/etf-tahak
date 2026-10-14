import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { N, hero } from "@/content";
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
});
