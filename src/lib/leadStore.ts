/** Výsledek odeslání formuláře, uložený v sessionStorage a sdílený mezi všemi formuláři. */
export interface LeadResult {
  email: string;
  /** Nehádatelné ID z odpovědi serveru. Chybí, když server selhal nebo šlo o duplicitu. */
  leadId: string | null;
  downloadUrl: string | null;
  /** Kde byl formulář odeslán (tam se ukáže celý děkovný stav) */
  location: string;
}

const KEY = "etf_lead";
const listeners = new Set<() => void>();
let cache: LeadResult | null | undefined;
let raw: string | null = null;

function load(): LeadResult | null {
  try {
    const s = sessionStorage.getItem(KEY);
    if (s === raw && cache !== undefined) return cache;
    raw = s;
    cache = s ? (JSON.parse(s) as LeadResult) : null;
  } catch {
    // úložiště zablokované: držíme jen to, co je v paměti
    cache = cache ?? null;
  }
  return cache ?? null;
}

export function getLead(): LeadResult | null {
  return load();
}

export function setLead(r: LeadResult): void {
  cache = r;
  try {
    raw = JSON.stringify(r);
    sessionStorage.setItem(KEY, raw);
  } catch {
    /* zůstane v paměti */
  }
  listeners.forEach((l) => l());
}

export function subscribeLead(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
