/**
 * Souhlas s cookies (PLAN §12, §15). Uložený v localStorage, bez rozhodnutí platí „nic“.
 * Do souhlasu běží jen anonymní analytika bez cookies, Meta Pixel se nenačte.
 */
export interface Consent {
  analytics: boolean;
  marketing: boolean;
}

const KEY = "etf_consent";
const listeners = new Set<() => void>();
let cache: Consent | null | undefined;

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const j = JSON.parse(raw) as Partial<Consent>;
    return { analytics: j.analytics === true, marketing: j.marketing === true };
  } catch {
    return null;
  }
}

/** null = návštěvník se ještě nerozhodl. */
export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  if (cache === undefined) cache = read();
  return cache;
}

export function setConsent(c: Consent): void {
  cache = c;
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...c, at: new Date().toISOString() }));
  } catch {
    /* úložiště zablokované: volba platí do zavření stránky */
  }
  listeners.forEach((l) => l());
}

export function subscribeConsent(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
