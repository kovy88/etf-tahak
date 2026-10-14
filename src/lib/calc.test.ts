import { describe, expect, it } from "vitest";
import cases from "../../data/tests/calc_cases.json";
import { project, scenario, series } from "./calc";

describe("calc.ts vs. sdílené případy z data/tests/calc_cases.json", () => {
  for (const c of cases.cases) {
    it(c.name, () => {
      const s = scenario(c.monthly, c.years, c.gross, c.ter, c.entry);
      expect(Math.abs(s.final - c.expected.final)).toBeLessThanOrEqual(cases.tolerance_czk);
      expect(s.deposited).toBe(c.expected.deposited);
      expect(Math.abs(s.feeCost - c.expected.fee_cost)).toBeLessThanOrEqual(cases.tolerance_czk);
    });
  }
});

describe("calc.ts", () => {
  it("řada končí stejnou hodnotou jako project()", () => {
    const s = series(3000, 25, 0.06, 0.0146);
    expect(s).toHaveLength(26);
    expect(s[0]).toBe(0);
    expect(s[25]).toBeCloseTo(project(3000, 25, 0.06, 0.0146), 6);
  });
  it("řada je rostoucí", () => {
    const s = series(1000, 10, 0.04, 0.01);
    for (let i = 1; i < s.length; i++) expect(s[i]).toBeGreaterThan(s[i - 1]);
  });
  it("vyšší poplatek vždy dává méně", () => {
    expect(project(3000, 25, 0.06, 0.0003)).toBeGreaterThan(project(3000, 25, 0.06, 0.0146));
  });
});
