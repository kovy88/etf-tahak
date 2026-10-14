/**
 * Čísla pro texty. Vše pochází ze src/data/*.json (generuje data/build.py).
 * Žádné číslo v textech se nepíše natvrdo, bere se odsud.
 */
import examplesJson from "@/data/examples.json";
import etfsJson from "@/data/etfs.json";
import factsJson from "@/data/facts.json";
import leadPdfJson from "@/data/leadPdf.json";
import { czk, czkRounded, dateCs, num, pct } from "@/lib/format";

export const examples = examplesJson;
export const etfsData = etfsJson;
export const facts = factsJson;

const def = examples.default;
const etfs = etfsData.etfs;

const byTicker = (t: string) => {
  const e = etfs.find((x) => x.ticker === t);
  if (!e) throw new Error(`ETF ${t} chybí v datech`);
  return e;
};

const count = (m: string) => etfs.filter((e) => e.ucits_twin.match === m).length;

const voo = byTicker("VOO");
const spy = byTicker("SPY");
const ivv = byTicker("IVV");

export const N = {
  /** Výchozí stav kalkulačky = hero = reklamy (PLAN pravidlo 6) */
  monthly: czk(def.monthly_czk),
  years: def.years,
  gross: pct(def.gross_pct, 0),
  deposited: czk(def.deposited_czk),
  diffExact: czk(def.difference_czk),
  diffHeadline: czkRounded(def.difference_czk),
  /** Výsledky kalkulačky se zobrazují zaokrouhlené na tisíce, shodně s hero a reklamami */
  etfFinal: czkRounded(def.etf_final_czk),
  avgFinal: czkRounded(def.avg_fund_final_czk),
  feeCostEtf: czkRounded(def.etf_fee_cost_czk),
  feeCostAvg: czkRounded(def.avg_fund_fee_cost_czk),
  etfTer: pct(examples.inputs.etf.ter_pct.value),
  avgTer: pct(examples.inputs.avg_fund.ter_pct.value),
  etfName: examples.inputs.etf.name,
  etfId: examples.inputs.etf.id,
  dataDate: dateCs(etfsData.meta.data_as_of),
  etfCount: etfs.length,
  exactTwins: count("exact"),
  similarTwins: count("similar"),
  noTwins: count("none"),
  /** ETF, ke kterým existuje evropská alternativa (dvojče nebo podobný fond) */
  withAlternative: count("exact") + count("similar"),
  /** Počet stran PDF taháku (scripts/render-pdf.ts) */
  pdfPages: leadPdfJson.pages,
  /** Tři ETF na stejný index S&P 500 (micro-insight) */
  sp500Ters: {
    VOO: pct(voo.ter_pct.value, 4),
    SPY: pct(spy.ter_pct.value, 4),
    IVV: pct(ivv.ter_pct.value, 4),
  },
  /** Kurz: VOO 10 let p. a. v USD a v CZK */
  vooUsd10: pct(voo.return_10y_pct.value),
  vooCzk10: pct(voo.returns_czk_pct["10y"].value),
  timeTestYears: facts.taxes.time_test_years.value as number,
  valueTestCzk: czk(facts.taxes.value_test_czk.value as number),
} as const;

export { num };
