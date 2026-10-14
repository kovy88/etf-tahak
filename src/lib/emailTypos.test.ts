import { describe, expect, it } from "vitest";
import { distance, isValidEmail, suggestEmail } from "./emailTypos";

describe("suggestEmail", () => {
  it.each([
    ["jan@seznam.com", "jan@seznam.cz"],
    ["jan@seznan.cz", "jan@seznam.cz"],
    ["jan@seznm.cz", "jan@seznam.cz"],
    ["jan@gmial.com", "jan@gmail.com"],
    ["jan@gmai.com", "jan@gmail.com"],
    ["jan@gmail.cz", "jan@gmail.com"],
    ["jan@icoud.com", "jan@icloud.com"],
    ["jan@centrun.cz", "jan@centrum.cz"],
    ["jan@outlok.com", "jan@outlook.com"],
    ["Jan.Novak@Seznam.com", "Jan.Novak@seznam.cz"],
  ])("%s -> %s", (input, out) => {
    expect(suggestEmail(input)).toBe(out);
  });

  it.each(["jan@seznam.cz", "jan@gmail.com", "jan@firma.cz", "jan@mail.com", "jan@centrum.sk", "jan@proton.me", "x@a.cz"])(
    "nechá %s být",
    (input) => {
      expect(suggestEmail(input)).toBeNull();
    },
  );

  it("nepadá na špatném vstupu", () => {
    for (const s of ["", "bez-zavinace", "@seznam.com", "jan@", "  "]) expect(suggestEmail(s)).toBeNull();
  });
});

describe("distance", () => {
  it("počítá záměnu sousedních znaků jako 1", () => {
    expect(distance("gmial.com", "gmail.com")).toBe(1);
    expect(distance("abc", "abc")).toBe(0);
  });
});

describe("isValidEmail", () => {
  it("rozlišuje platný a neplatný tvar", () => {
    expect(isValidEmail("jan@seznam.cz")).toBe(true);
    expect(isValidEmail(" jan@seznam.cz ")).toBe(true);
    for (const s of ["", "jan", "jan@", "jan@seznam", "jan @seznam.cz", "@seznam.cz"]) expect(isValidEmail(s)).toBe(false);
  });
});
