import { describe, expect, it } from "vitest";
import { NBSP, czk, czkRounded, dateCs, num, pct, typo } from "./format";

describe("format", () => {
  it("formátuje čísla s nezlomitelnou mezerou", () => {
    expect(num(377313)).toBe(`377${NBSP}313`);
    expect(czk(439000)).toBe(`439${NBSP}000${NBSP}Kč`);
    expect(czkRounded(377313)).toBe(`377${NBSP}000${NBSP}Kč`);
  });
  it("formátuje procenta a data česky", () => {
    expect(pct(0.03)).toBe(`0,03${NBSP}%`);
    expect(pct(1.46)).toBe(`1,46${NBSP}%`);
    expect(pct(0.0945, 4)).toBe(`0,0945${NBSP}%`);
    expect(pct(6, 0)).toBe(`6,00${NBSP}%`.replace(",00", ""));
    expect(dateCs("2026-09-30")).toBe(`30.${NBSP}9.${NBSP}2026`);
  });
  it("doplní nezlomitelné mezery po předložkách a u jednotek", () => {
    expect(typo("Z Česka v 25 letech")).toBe(`Z${NBSP}Česka v${NBSP}25 letech`);
    expect(typo("a v 5 %")).toBe(`a${NBSP}v${NBSP}5${NBSP}%`);
    expect(typo("výnos p. a.")).toBe(`výnos p.${NBSP}a.`);
  });
});
