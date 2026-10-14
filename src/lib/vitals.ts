/**
 * Web vitals bez knihovny (JS rozpočet, CLAUDE.md pravidlo 9): LCP, CLS a INP se odešlou jednou, když stránka přejde do pozadí.
 * CLS se počítá po „session windows“ (mezera 1 s, okno max 5 s), INP je nejdelší interakce (zjednodušení p98).
 */
import { track } from "./track";

const rate = (name: "LCP" | "CLS" | "INP", v: number) => {
  const [good, poor] = name === "LCP" ? [2500, 4000] : name === "CLS" ? [100, 250] : [200, 500];
  return v <= good ? "good" : v <= poor ? "needs-improvement" : "poor";
};

type LayoutShift = PerformanceEntry & { value: number; hadRecentInput: boolean };
type EventTiming = PerformanceEntry & { interactionId?: number };

export function observeWebVitals(): () => void {
  if (typeof PerformanceObserver === "undefined") return () => {};
  let lcp = 0;
  let cls = 0;
  let windowValue = 0;
  let windowStart = 0;
  let lastShift = 0;
  let inp = 0;
  let sent = false;
  const observers: PerformanceObserver[] = [];

  const observe = (type: string, cb: (e: PerformanceEntry) => void, extra: object = {}) => {
    try {
      const o = new PerformanceObserver((l) => l.getEntries().forEach(cb));
      o.observe({ type, buffered: true, ...extra } as PerformanceObserverInit);
      observers.push(o);
    } catch {
      /* typ měření prohlížeč nepodporuje */
    }
  };

  observe("largest-contentful-paint", (e) => {
    lcp = e.startTime;
  });
  observe("layout-shift", (e) => {
    const s = e as LayoutShift;
    if (s.hadRecentInput) return;
    if (windowValue && s.startTime - lastShift < 1000 && s.startTime - windowStart < 5000) windowValue += s.value;
    else {
      windowValue = s.value;
      windowStart = s.startTime;
    }
    lastShift = s.startTime;
    cls = Math.max(cls, windowValue);
  });
  observe(
    "event",
    (e) => {
      if ((e as EventTiming).interactionId) inp = Math.max(inp, e.duration);
    },
    { durationThreshold: 40 },
  );

  const send = () => {
    if (sent || document.visibilityState !== "hidden") return;
    sent = true;
    const clsMs = Math.round(cls * 1000); // CLS × 1000, ať jde ukládat jako celé číslo
    if (lcp) track("web_vitals", { metric: "LCP", value: Math.round(lcp), rating: rate("LCP", lcp) });
    track("web_vitals", { metric: "CLS", value: clsMs, rating: rate("CLS", clsMs) });
    if (inp) track("web_vitals", { metric: "INP", value: Math.round(inp), rating: rate("INP", inp) });
  };
  document.addEventListener("visibilitychange", send);
  window.addEventListener("pagehide", send);
  return () => {
    document.removeEventListener("visibilitychange", send);
    window.removeEventListener("pagehide", send);
    observers.forEach((o) => o.disconnect());
  };
}
