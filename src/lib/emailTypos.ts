/**
 * Návrh opravy překlepu v doméně e-mailu pro české schránky (PLAN §11).
 * Vrací celou opravenou adresu, nebo null, když překlep neodhalí.
 */

const KNOWN = [
  "seznam.cz",
  "email.cz",
  "centrum.cz",
  "post.cz",
  "volny.cz",
  "atlas.cz",
  "gmail.com",
  "icloud.com",
  "outlook.com",
];

/** Platné domény, které se nesmí „opravovat“ (blízké známým, ale správné). */
const FINE = new Set([
  ...KNOWN,
  "centrum.sk",
  "post.sk",
  "atlas.sk",
  "outlook.cz",
  "mail.com",
  "email.com",
  "yahoo.com",
  "yahoo.cz",
  "hotmail.com",
  "live.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "tiscali.cz",
  "quick.cz",
  "firmy.cz",
]);

/** Damerauova–Levenshteinova vzdálenost (záměna sousedních znaků se počítá za 1). */
export function distance(a: string, b: string): number {
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

export function suggestEmail(raw: string): string | null {
  const email = raw.trim();
  const at = email.lastIndexOf("@");
  if (at < 1 || at === email.length - 1) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (FINE.has(domain) || domain.length < 6) return null;

  // Stejný název s jinou koncovkou (gmail.cz, seznam.com) opravíme na známou koncovku.
  const label = domain.split(".")[0];
  const sameLabel = KNOWN.find((k) => k.split(".")[0] === label);
  if (sameLabel) return `${local}@${sameLabel}`;

  let best: { d: string; dist: number } | null = null;
  for (const k of KNOWN) {
    const dist = distance(domain, k);
    if (dist <= 2 && (!best || dist < best.dist)) best = { d: k, dist };
  }
  return best ? `${local}@${best.d}` : null;
}

/** Jednoduchá kontrola tvaru e-mailu (přesnější ověření dělá server). */
export function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim());
}
