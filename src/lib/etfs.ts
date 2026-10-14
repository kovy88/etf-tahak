import { etfsData } from "@/content/data";

export type Etf = (typeof etfsData.etfs)[number];

/** Pořadí karet: 3 zdarma (PLAN §9.2), pak zbytek. */
export const FREE_TICKERS = ["VOO", "SPY", "VT"] as const;
const ORDER = ["VOO", "SPY", "VT", "IVV", "VTI", "VEA", "VWO", "SCHD", "VYM", "VUG", "AGG", "GLD"];

export const ETFS: Etf[] = [...etfsData.etfs].sort((a, b) => ORDER.indexOf(a.ticker) - ORDER.indexOf(b.ticker));
export const FREE = ETFS.filter((e) => (FREE_TICKERS as readonly string[]).includes(e.ticker));
export const LOCKED = ETFS.filter((e) => !(FREE_TICKERS as readonly string[]).includes(e.ticker));

/** Nejlevnější z ověřených dvojčat/alternativ (nebo undefined, když žádné není). */
export function bestTwin(e: Etf) {
  const f = e.ucits_twin.funds;
  if (!f.length) return undefined;
  return [...f].sort((a, b) => a.ter_pct.value - b.ter_pct.value)[0];
}

export function listingTicker(f: NonNullable<ReturnType<typeof bestTwin>>): string {
  return f.listings.xetra ?? f.listings.lse ?? f.id;
}

export function listingVenue(f: NonNullable<ReturnType<typeof bestTwin>>): string {
  return f.listings.xetra ? "Xetra" : "Londýn";
}

export const CATEGORY_LABEL: Record<string, string> = {
  sp500: "S&P 500",
  usa: "Celé USA",
  world: "Svět",
  dividend: "Dividendy",
  bonds_gold: "Dluhopisy a zlato",
};
