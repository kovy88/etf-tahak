/**
 * Výpočet kalkulačky poplatků. Stejný vzorec jako data/calc.py (sdílené případy v data/tests/calc_cases.json).
 * gross, ter, entry jsou desetinná čísla (0.06 = 6 %).
 *
 * Čistý roční výnos = gross − ter. Měsíční sazba = (1 + čistý)^(1/12) − 1.
 * Vklad na začátku měsíce, vstupní poplatek ho krátí, pak se připíše měsíční úrok.
 */

export interface Scenario {
  final: number;
  deposited: number;
  /** Rozdíl proti stejnému výpočtu bez TER a vstupního poplatku */
  feeCost: number;
}

export function project(monthly: number, years: number, gross: number, ter: number, entry = 0): number {
  const m = (1 + (gross - ter)) ** (1 / 12) - 1;
  let balance = 0;
  for (let i = 0; i < years * 12; i++) balance = (balance + monthly * (1 - entry)) * (1 + m);
  return balance;
}

export function scenario(monthly: number, years: number, gross: number, ter: number, entry = 0): Scenario {
  const final = project(monthly, years, gross, ter, entry);
  return {
    final,
    deposited: monthly * years * 12,
    feeCost: project(monthly, years, gross, 0, 0) - final,
  };
}

/** Hodnota portfolia na konci každého roku (index 0 = začátek, 0 Kč). Pro graf. */
export function series(monthly: number, years: number, gross: number, ter: number, entry = 0): number[] {
  const m = (1 + (gross - ter)) ** (1 / 12) - 1;
  const out = [0];
  let balance = 0;
  for (let y = 1; y <= years; y++) {
    for (let i = 0; i < 12; i++) balance = (balance + monthly * (1 - entry)) * (1 + m);
    out.push(balance);
  }
  return out;
}
