"use client";

import { useEffect, useRef } from "react";
import { startAnalytics } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";
import { track } from "@/lib/track";
import { observeWebVitals } from "@/lib/vitals";

const DEPTHS = [25, 50, 75, 100] as const;

/** Spustí cíle událostí (PostHog, Meta Pixel) a posílá web vitals. Je v layoutu, takže běží na každé stránce. */
export function Analytics() {
  useEffect(() => {
    startAnalytics();
    return observeWebVitals();
  }, []);
  return null;
}

/**
 * Události landing page (PLAN §12): landing_viewed, section_viewed, scroll_depth.
 * Varianta se nastavuje tady, aby byla u všech událostí od první. Ostatní události posílají komponenty, kde vznikají.
 */
export function LandingAnalytics({ variant }: { variant: string }) {
  const viewed = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.variant = variant;
    const a = captureAttribution();
    if (viewed.current) return;
    viewed.current = true;
    track("landing_viewed", { landing_path: a.landing_path ?? window.location.pathname, referrer: a.referrer ?? "" });
  }, [variant]);

  // section_viewed: sekce je z ≥ 50 % ve viewportu, jednou
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = (e.target as HTMLElement).id;
          const half = e.intersectionRatio >= 0.5 || e.intersectionRect.height >= window.innerHeight * 0.5;
          if (!half || seen.has(id)) continue;
          seen.add(id);
          track("section_viewed", { section_id: id, order: sections.indexOf(e.target as HTMLElement) + 2 });
          io.unobserve(e.target);
        }
      },
      // Vysoké sekce nikdy nedosáhnou 50 % své výšky, proto stačí i 50 % výšky okna.
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // scroll_depth: 25/50/75/100 % výšky stránky
  useEffect(() => {
    const fired = new Set<number>();
    let raf = 0;
    const check = () => {
      raf = 0;
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = (window.scrollY / total) * 100;
      for (const d of DEPTHS) {
        if (!fired.has(d) && pct >= (d === 100 ? 98 : d)) {
          fired.add(d);
          track("scroll_depth", { depth: d });
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
