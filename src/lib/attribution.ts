/**
 * First-touch atribuce (UTM, referrer, vstupní stránka) uložená v sessionStorage a typ in-app prohlížeče.
 * Ukládá se k leadu (PLAN §11) a bude společná vlastnost událostí (F6).
 */
export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_path?: string;
}

export type InAppBrowser = "facebook" | "instagram" | "tiktok" | "none";

const KEY = "etf_attr";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export function detectInApp(ua: string): InAppBrowser {
  if (/Instagram/i.test(ua)) return "instagram";
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return "facebook";
  if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) return "tiktok";
  return "none";
}

/** Zavolat při prvním načtení. Pozdější návštěvy v téže relaci atribuci nepřepisují. */
export function captureAttribution(): Attribution {
  const existing = getAttribution();
  if (existing) return existing;
  const q = new URLSearchParams(window.location.search);
  const a: Attribution = { landing_path: window.location.pathname };
  for (const p of PARAMS) {
    const v = q.get(p);
    if (v) a[p] = v.slice(0, 200);
  }
  if (document.referrer) a.referrer = document.referrer.slice(0, 300);
  try {
    sessionStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* úložiště může být zablokované */
  }
  return a;
}

export function getAttribution(): Attribution | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
}
