"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { trackConsent } from "@/lib/analytics";
import { getConsent, setConsent, subscribeConsent } from "@/lib/consent";

const noopSubscribe = () => () => {};

/**
 * Malá lišta dole (PLAN §15). Ukáže se, až návštěvník odroluje první obrazovku, aby nezakrývala hero a jeho tlačítko.
 * Do rozhodnutí běží jen anonymní měření bez cookies. „Přijmout“ i „Odmítnout“ jsou stejně výrazná tlačítka.
 * Výšku lišty předává CSS proměnná --cookie-h, aby o ni lepivé CTA odskočilo.
 * Znovu se otevře z patičky (událost etf:cookie-settings).
 */
export interface CookieCopy {
  text: string;
  accept: string;
  decline: string;
  label: string;
  privacy: string;
}

/** Texty přicházejí z layoutu (server), aby se do klientského bundlu netáhl celý obsah webu. */
export function CookieBar({ copy: c }: { copy: CookieCopy }) {
  const consent = useSyncExternalStore(subscribeConsent, getConsent, () => null);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [reopened, setReopened] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener("etf:cookie-settings", open);
    return () => window.removeEventListener("etf:cookie-settings", open);
  }, []);

  useEffect(() => {
    if (consent !== null || scrolled) return;
    const on = () => {
      if (window.scrollY > window.innerHeight * 0.6) setScrolled(true);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [consent, scrolled]);

  const visible = mounted && ((consent === null && scrolled) || reopened);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!visible || !el) {
      root.style.removeProperty("--cookie-h");
      return;
    }
    const set = () => root.style.setProperty("--cookie-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--cookie-h");
    };
  }, [visible]);

  if (!visible) return null;

  const choose = (all: boolean) => {
    const next = { analytics: all, marketing: all };
    setConsent(next);
    trackConsent(next);
    setReopened(false);
  };

  const btn =
    "h-11 flex-1 border border-ink px-3 text-[0.9375rem] font-medium bg-paper text-ink hover:bg-paper-deep active:bg-line";

  return (
    <div
      ref={ref}
      role="region"
      aria-label={c.label}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink bg-paper px-[var(--gutter)] pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5"
    >
      <div className="mx-auto max-w-[var(--measure)]">
        <p className="text-[0.8125rem] leading-snug">
          {c.text}{" "}
          <a href="/zasady-ochrany-udaju#cookies" className="underline underline-offset-2">
            {c.privacy}
          </a>
          .
        </p>
        <div className="mt-2 flex gap-2">
          <button type="button" className={btn} onClick={() => choose(false)}>
            {c.decline}
          </button>
          <button type="button" className={btn} onClick={() => choose(true)}>
            {c.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
