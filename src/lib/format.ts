/** České formátování čísel, dat a typografie (nezlomitelné mezery). */

export const NBSP = " ";

const nf = (min: number, max: number) =>
  new Intl.NumberFormat("cs-CZ", { minimumFractionDigits: min, maximumFractionDigits: max });

/** 377313 -> "377 313" (s nezlomitelnou mezerou jako oddělovačem tisíců) */
export function num(n: number, decimals = 0): string {
  return nf(decimals, decimals).format(n).replace(/\s/g, NBSP);
}

/** 377313 -> "377 313 Kč" */
export function czk(n: number): string {
  return `${num(Math.round(n))}${NBSP}Kč`;
}

/** Zaokrouhlí na násobek `step` a vrátí "377 000 Kč" */
export function czkRounded(n: number, step = 1000): string {
  return czk(Math.round(n / step) * step);
}

/** 0.0945 -> "0,0945 %", 1.46 -> "1,46 %" (bez zbytečných nul, minimálně 2 desetinná místa) */
export function pct(n: number, maxDecimals = 2): string {
  const min = Math.min(2, maxDecimals);
  return `${nf(min, maxDecimals).format(n).replace(/\s/g, NBSP)}${NBSP}%`;
}

/** "2026-09-30" -> "30. 9. 2026" */
export function dateCs(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}.${NBSP}${m}.${NBSP}${y}`;
}

const UNITS = "Kč|%|let|roků|roky|rok|měs\\.|tis\\.|mil\\.|mld\\.|USD|CZK|EUR|stran|stránek|ETF";

/**
 * Doplní nezlomitelné mezery:
 *  - po jednopísmenných předložkách a spojkách (k, s, v, z, o, u, a, i),
 *  - mezi číslem a jednotkou,
 *  - v "p. a.".
 */
export function typo(s: string): string {
  let out = s;
  for (let i = 0; i < 2; i++) {
    out = out.replace(/(^|[\s(„"])([ksvzouaiKSVZOUAI]) (?=\S)/g, `$1$2${NBSP}`);
  }
  out = out.replace(new RegExp(`(\\d) (${UNITS})(?![\\p{L}])`, "gu"), `$1${NBSP}$2`);
  out = out.replace(/p\. a\./g, `p.${NBSP}a.`);
  return out;
}

/** Projde objekt a aplikuje typo() na všechny řetězce, i na výsledky funkcí. */
export function typoDeep<T>(value: T): T {
  if (typeof value === "string") return typo(value) as T;
  if (typeof value === "function") {
    const fn = value as (...a: unknown[]) => unknown;
    return ((...a: unknown[]) => typoDeep(fn(...a))) as T;
  }
  if (Array.isArray(value)) return value.map(typoDeep) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, typoDeep(v)]),
    ) as T;
  }
  return value;
}
