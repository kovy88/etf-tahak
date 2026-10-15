"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { startAnalytics } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";
import { track } from "@/lib/track";
import { observeWebVitals } from "@/lib/vitals";

const DEPTHS = [25, 50, 75, 100] as const;

/** Tisková verze taháku (zdroj pro PDF) se neměří a nezobrazuje na ní lištu cookies. */
export const isPrintPath = (path: string | null) => Boolean(path?.startsWith("/tahak/print"));

/** Spustí cíle událostí (PostHog, Meta Pixel) a posílá web vitals. Je v layoutu, takže běží na každé stránce. */
export function Analytics() {
  const skip = isPrintPath(usePathname());
  useEffect(() => {
    if (skip) return;
    startAnalytics();
    return observeWebVitals();
  }, [skip]);
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
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
    const seen = new Set<string>();
    let raf = 0;
    const check = () => {
      raf = 0;
      for (const [index, section] of sections.entries()) {
        if (seen.has(section.id)) continue;
        const r = section.getBoundingClientRect();
        const visible = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
        // IO s pevnými poměry u dlouhého srovnání nepřekročil žádný threshold,
        // přestože sekce vyplnila většinu obrazovky. Nejvýše šest měření za snímek.
        if (visible < Math.min(r.height, window.innerHeight) * 0.5) continue;
        seen.add(section.id);
        track("section_viewed", { section_id: section.id, order: index + 2 });
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
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
