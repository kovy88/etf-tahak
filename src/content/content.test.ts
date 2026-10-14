import { describe, expect, it } from "vitest";
import {
  AUTHOR,
  N,
  about,
  calc,
  compare,
  email,
  faq,
  finalCta,
  formCopy,
  hero,
  legal,
  tahak,
  threeThings,
} from "./index";
import { NBSP } from "@/lib/format";

/** Posbírá všechny řetězce z objektu. Funkce zavolá s ukázkovým argumentem. */
function strings(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") out.push(v);
  else if (typeof v === "function") {
    for (const arg of [9, "seznam.cz"]) {
      try {
        const r = (v as (a: unknown) => unknown)(arg);
        if (typeof r === "string") {
          out.push(r);
          break;
        }
      } catch {
        /* zkusit další argument */
      }
    }
  } else if (Array.isArray(v)) v.forEach((x) => strings(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => strings(x, out));
  return out;
}

const plain = (s: string) => s.replaceAll(NBSP, " ");

const bundle = (emailEnabled: boolean) => ({
  hero,
  calc,
  compare,
  threeThings,
  about,
  legal,
  AUTHOR,
  tahak: tahak(emailEnabled),
  finalCta: finalCta(emailEnabled),
  faq: faq(emailEnabled),
  form: formCopy(emailEnabled),
});

const all = [
  ...strings(bundle(true)),
  ...strings(bundle(false)),
  ...strings(email),
];

const FORBIDDEN = [
  "odemkněte svůj potenciál",
  "v dnešní době",
  "revoluční",
  "jednoduše a rychle",
  "pojďme se podívat",
  "cesta k finanční svobodě",
  "nejlepší etf",
  "zaručený výnos",
  "bez rizika",
  "není to jen",
];

describe("texty v src/content", () => {
  it("jsou neprázdné", () => {
    expect(all.length).toBeGreaterThan(100);
    expect(all.every((s) => s.trim().length > 0)).toBe(true);
  });

  it("neobsahují zakázané fráze", () => {
    for (const s of all) {
      const l = s.toLowerCase();
      for (const f of FORBIDDEN) expect(l, `„${f}“ v: ${s}`).not.toContain(f);
    }
  });

  it("nemají em-dash, vykřičníky za sebou ani emoji", () => {
    for (const s of all) {
      expect(s, s).not.toContain("—");
      expect(s, s).not.toContain("!!");
      expect(/\p{Extended_Pictographic}/u.test(s), s).toBe(false);
      expect(s, s).not.toContain('"');
    }
  });

  it("mají nezlomitelné mezery po jednopísmenných předložkách", () => {
    const bad = /(^|[\s(„])[ksvzouaiKSVZOUAI] \S/;
    for (const s of all) expect(bad.test(s), s).toBe(false);
  });

  it("mají nezlomitelnou mezeru mezi číslem a jednotkou", () => {
    const bad = /\d (Kč|%|let|roků|roky|rok|USD|CZK|EUR|ETF)(?![\p{L}])/u;
    for (const s of all) expect(bad.test(s), s).toBe(false);
  });

  it("používají české uvozovky a pomlčku s mezerami", () => {
    for (const s of all) expect(/\w–\w/.test(s), s).toBe(false);
  });

  it("bez e-mailu nic neslibují e-mailem (PLAN §11)", () => {
    const off = strings({
      // sdílení odkazu kamarádovi („Pošlete kamarádovi…“) není slib e-mailu
      form: { ...formCopy(false), share: null },
      faq: faq(false),
      finalCta: finalCta(false),
      tahak: tahak(false),
    }).join("\n");
    expect(off).not.toMatch(/pošle|posla|posíl|do schránky|odhlášení|odhlásit se|e-mailem|Promoakc|Newsletter/i);
  });

  it("s e-mailem ho zmiňují a mají odhlášení", () => {
    const on = strings(formCopy(true)).join("\n");
    expect(on).toMatch(/Odhlášení jedním klikem/);
  });

  it("hero A, příklad a reklamy sdílejí stejné číslo", () => {
    expect(hero.poplatky.h1).toContain(N.diffHeadline);
    expect(hero.poplatky.proof.value).toBe(N.diffHeadline);
    expect(hero.poplatky.sub).toContain(N.monthly);
  });

  it("každé číslo v hero B pochází z dat", () => {
    expect(plain(hero.srovnani.sub)).toContain(`${N.exactTwins} z ${N.etfCount}`);
    expect(N.exactTwins + N.similarTwins + N.noTwins).toBe(N.etfCount);
  });

  it("obsahují povinná upozornění", () => {
    const d = plain(legal.disclaimerShort).toLowerCase();
    expect(d).toContain("nejde o investiční doporučení");
    expect(d).toContain("minulé výnosy nezaručují budoucí");
    expect(d).toContain("kurz usd/czk");
    expect(d).toContain("modelové");
  });
});
