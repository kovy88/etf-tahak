/**
 * Měření událostí podle tracking plánu (PLAN §12). Jediný vstup pro události.
 * Teď: typované názvy, společné vlastnosti a zrcadlení do window.__events (testy).
 * F6 připojí PostHog a Meta Pixel přes setSink().
 */

export type EventName =
  | "landing_viewed"
  | "section_viewed"
  | "scroll_depth"
  | "cta_clicked"
  | "calc_interacted"
  | "calc_changed"
  | "compare_filter_changed"
  | "compare_gate_clicked"
  | "form_viewed"
  | "form_started"
  | "form_error"
  | "email_typo_suggested"
  | "email_typo_accepted"
  | "form_submitted"
  | "thankyou_viewed"
  | "pdf_downloaded"
  | "profile_answered"
  | "share_clicked"
  | "consent_updated"
  | "web_vitals";

export type EventProps = Record<string, string | number | boolean | null | undefined>;
export type Sink = (name: EventName, props: EventProps) => void;

declare global {
  interface Window {
    __events?: { name: EventName; props: EventProps }[];
  }
}

const t0 = typeof performance !== "undefined" ? performance.now() : 0;
let sink: Sink | null = null;

/** Zrcadlení do window.__events: v testovacím režimu a mimo produkci. */
const MIRROR =
  process.env.NEXT_PUBLIC_TEST_MODE === "true" || process.env.NODE_ENV !== "production";

export function setSink(fn: Sink | null): void {
  sink = fn;
}

function common(): EventProps {
  if (typeof window === "undefined") return {};
  return {
    variant: document.documentElement.dataset.variant,
    viewport_w: window.innerWidth,
    ms_since_landing: Math.round(performance.now() - t0),
  };
}

export function track(name: EventName, props: EventProps = {}): void {
  if (typeof window === "undefined") return;
  const all = { ...common(), ...props };
  if (MIRROR) (window.__events ??= []).push({ name, props: all });
  sink?.(name, all);
}
