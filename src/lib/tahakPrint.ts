import { etfsData, facts } from "@/content/data";
import { dateCs, num, pct, usdShort, NBSP } from "./format";
import { ETFS, type Etf } from "./etfs";

/**
 * Data pro tiskový tahák (/tahak/print). Vše se bere ze src/data/*.json,
 * žádné číslo se tu nepíše natvrdo. Každý řádek tabulky nese číslo zdroje [n].
 */

type Fund = Etf["ucits_twin"]["funds"][number];

export interface Source {
  n: number;
  label: string;
  url: string;
  /** Datumy jednotlivých údajů, např. „poplatek k 28. 4. 2026“ */
  dates: string;
}

const DISTRIBUTION: Record<string, string> = {
  accumulating: "akumulační",
  distributing: "distribuční",
  "no income": "bez výplat",
};

const STAR = "*";

/** Hodnota s hvězdičkou, když není ověřená (stejně jako na webu). */
const flag = (verified: boolean | undefined) => (verified === false ? STAR : "");

export const signed = (n: number) => `${n < 0 ? "−" : ""}${pct(Math.abs(n))}`;

/** Unikátní fondy v pořadí, v jakém se poprvé objeví v tabulce dvojčat. */
function uniqueFunds(): Fund[] {
  const seen = new Map<string, Fund>();
  for (const e of ETFS) for (const f of e.ucits_twin.funds) if (!seen.has(f.id)) seen.set(f.id, f);
  return [...seen.values()];
}

const FUNDS = uniqueFunds();

const fxStart = etfsData.meta.fx_usd_czk_start;
const fxEnd = etfsData.meta.fx_usd_czk_end;
const tax = facts.taxes;

interface Extra {
  key: string;
  label: string;
  url: string;
  dates: string;
}

/** Zdroje mimo ETF a fondy. Pořadí = číslování. */
const EXTRA: Extra[] = [
  { key: "cnb", label: "Kurzy USD/CZK, ČNB (30. 9. 2016, 2021, 2025 a 2026)", url: fxEnd.source, dates: `kurzy k ${dateCs(fxEnd.as_of)}` },
  { key: "law", label: "Zákon č. 586/1992 Sb., o daních z příjmů", url: tax.law.source, dates: `znění platné k ${dateCs(tax.law.as_of)}` },
  { key: "fs", label: "Finanční správa: lhůty přiznání za rok 2025", url: tax.filing_deadlines_2025.source, dates: `tisková zpráva z 27. 4. 2026` },
  { key: "irs1", label: "IRS Tax Treaty Table 1 (řádek Czech Republic)", url: tax.us_dividend_treaty_rate_pct.source, dates: "vydání květen 2023" },
  { key: "irs2", label: "IRS: pokyny k formuláři W-8BEN", url: tax.us_dividend_rate_without_w8ben_pct.source, dates: `čteno ${dateCs(tax.w8ben_validity.as_of)}` },
  { key: "esma", label: "ESMA: náklady a výkonnost retailových produktů v EU", url: facts.fund_costs.avg_equity_fund_ter_pct.source, dates: `data za rok 2024, zpráva z března 2026` },
  { key: "ib", label: "Interactive Brokers: FAQ k PRIIPs", url: facts.priips.claim.source, dates: `čteno ${dateCs(facts.priips.claim.as_of)}` },
  { key: "eurlex", label: "Nařízení (EU) č. 1286/2014 (PRIIPs)", url: facts.priips.regulation_art5_1.source, dates: `původní znění z roku 2014` },
];

function build() {
  const list: Source[] = [];
  const ids: Record<string, number> = {};
  const add = (key: string, label: string, url: string, dates: string) => {
    const n = list.length + 1;
    ids[key] = n;
    list.push({ n, label, url, dates });
  };
  for (const e of ETFS) {
    add(
      `etf:${e.ticker}`,
      `${e.ticker}, ${e.name}`,
      e.ter_pct.source,
      `poplatek k ${dateCs(e.ter_pct.as_of)}, velikost k ${dateCs(e.aum_usd.as_of)}, výnosy k ${dateCs(e.return_1y_pct.as_of)}, dividenda k ${dateCs(e.dividend_yield_pct.as_of)}`,
    );
  }
  for (const f of FUNDS) {
    add(`fund:${f.id}`, `${f.id}, ${f.name}`, f.ter_pct.source, `ISIN a poplatek k ${dateCs(f.ter_pct.as_of)}`);
  }
  for (const x of EXTRA) add(x.key, x.label, x.url, x.dates);
  return { list, ids };
}

const built = build();
export const SOURCES = built.list;
export const ref = (key: string): string => `[${built.ids[key]}]`;
export const etfRef = (ticker: string) => ref(`etf:${ticker}`);

export interface EtfRow {
  ticker: string;
  name: string;
  index: string;
  ref: string;
  ter: string;
  aum: string;
  div: string;
  usd: [string, string, string];
  czk: [string, string, string];
}

export const ETF_ROWS: EtfRow[] = ETFS.map((e) => ({
  ticker: e.ticker,
  name: e.name,
  index: e.index.value,
  ref: etfRef(e.ticker),
  ter: pct(e.ter_pct.value, 4),
  aum: usdShort(e.aum_usd.value, false),
  div: `${pct(e.dividend_yield_pct.value)}${flag(e.dividend_yield_pct.verified)}`,
  usd: [
    signed(e.return_1y_pct.value),
    signed(e.return_5y_pct.value),
    signed(e.return_10y_pct.value),
  ],
  czk: [
    signed(e.returns_czk_pct["1y"].value),
    signed(e.returns_czk_pct["5y"].value),
    signed(e.returns_czk_pct["10y"].value),
  ],
}));

export interface FundRow {
  id: string;
  name: string;
  isin: string;
  ter: string;
  kind: string;
  venues: string;
  ref: string;
}

export interface TwinGroup {
  /** Americká ETF, která sdílejí stejné alternativy */
  tickers: string[];
  match: "exact" | "similar" | "none";
  note: string;
  funds: FundRow[];
}

function fundRow(f: Fund): FundRow {
  const venues = [f.listings.xetra && `Xetra ${f.listings.xetra}`, f.listings.lse && `Londýn ${f.listings.lse}`]
    .filter(Boolean)
    .join(", ");
  return {
    id: f.id,
    name: f.name,
    isin: f.isin.value,
    ter: pct(f.ter_pct.value, 2),
    kind: DISTRIBUTION[f.distribution.value] ?? f.distribution.value,
    venues,
    ref: ref(`fund:${f.id}`),
  };
}

export const TWIN_GROUPS: TwinGroup[] = (() => {
  const groups = new Map<string, TwinGroup>();
  for (const e of ETFS) {
    const t = e.ucits_twin;
    const key = t.funds.length ? t.funds.map((f) => f.id).join("+") : `none:${e.ticker}`;
    const g = groups.get(key);
    if (g) g.tickers.push(e.ticker);
    else
      groups.set(key, {
        tickers: [e.ticker],
        match: t.match as TwinGroup["match"],
        note: t.note,
        funds: t.funds.map(fundRow),
      });
  }
  // Skupiny bez alternativy až na konec
  return [...groups.values()].sort((a, b) => Number(a.match === "none") - Number(b.match === "none"));
})();

/** Ilustrace poplatku za převod měny: vklad × sazba (modelový předpoklad). */
export function fxIllustration(monthlyCzk: number, years: number) {
  return facts.assumptions.fx_fee_illustration_pct.value.map((p) => {
    const month = (monthlyCzk * p) / 100;
    return {
      pct: pct(p, 1),
      month: `${num(month, month < 10 ? 1 : 0)}${NBSP}Kč`,
      year: `${num(month * 12, 0)}${NBSP}Kč`,
      total: `${num(month * 12 * years, 0)}${NBSP}Kč`,
    };
  });
}

export const FX = {
  end: num(fxEnd.value, 3),
  y1: num(fxStart["1y"].value, 3),
  y5: num(fxStart["5y"].value, 3),
  y10: num(fxStart["10y"].value, 3),
};
