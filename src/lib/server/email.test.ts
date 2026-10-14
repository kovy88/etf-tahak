import { describe, expect, it } from "vitest";
import { buildEmail } from "./email";
import { personalDifference } from "./personal";

const base = { siteUrl: "https://etf-tahak.vercel.app", pdfUrl: "/tahak/x.pdf", leadId: "11111111-2222-4333-8444-555555555555" };

describe("buildEmail", () => {
  it("osobní číslo v předmětu a v textu se počítá na serveru", () => {
    const calc = { monthly: 3000, years: 25, gross: 6, etfId: "SPYL" };
    const e = buildEmail({ ...base, calc });
    expect(e.subject).toMatch(/Váš výpočet: 377 000 Kč na poplatcích/);
    expect(e.text).toContain("377 000 Kč");
    expect(e.text).toContain("https://etf-tahak.vercel.app/tahak/x.pdf");
    expect(personalDifference(calc)).toBeGreaterThan(376_000);
  });
  it("bez kalkulačky se použije obecný předmět a řádek s výpočtem se vynechá", () => {
    const e = buildEmail({ ...base, calc: null });
    expect(e.subject).toContain("ETF tahák");
    expect(e.text).not.toContain("Váš výpočet");
    expect(e.text).not.toContain("{");
  });
  it("obsahuje odhlášení a upozornění, HTML escapuje a nemá zakázané vzory", () => {
    const e = buildEmail({ ...base, calc: null });
    expect(e.unsubscribeUrl).toBe(`https://etf-tahak.vercel.app/api/unsubscribe?id=${base.leadId}`);
    expect(e.html).toContain(e.unsubscribeUrl);
    expect(e.text).toMatch(/Nejde o investiční doporučení/);
    expect(e.text).toMatch(/Odhlásit se můžete jedním klikem/);
    expect(e.html + e.text).not.toMatch(/—|!!/);
  });
});
