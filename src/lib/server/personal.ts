import "server-only";
import { etfsData, examples } from "@/content/data";
import { scenario } from "@/lib/calc";

export interface CalcSnapshot {
  monthly: number;
  years: number;
  gross: number;
  etfId: string;
}

/** Osobní rozdíl v poplatcích přepočtený na serveru (z uložených dat, ne z hodnot od klienta). */
export function personalDifference(c: CalcSnapshot): number {
  const funds: { id: string; ter_pct: { value: number } }[] = [];
  for (const e of etfsData.etfs) for (const f of e.ucits_twin.funds) funds.push(f);
  const fund = funds.find((f) => f.id === c.etfId);
  const etfTer = fund ? fund.ter_pct.value : examples.inputs.etf.ter_pct.value;
  const g = c.gross / 100;
  const a = scenario(c.monthly, c.years, g, etfTer / 100);
  const b = scenario(
    c.monthly,
    c.years,
    g,
    examples.inputs.avg_fund.ter_pct.value / 100,
    examples.inputs.avg_fund.entry_fee_pct.value / 100,
  );
  return a.final - b.final;
}
