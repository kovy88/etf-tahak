/**
 * Měření událostí podle tracking plánu (PLAN §12). Jediný vstup pro události.
 * Typované názvy, společné vlastnosti (varianta, UTM, in-app prohlížeč) a zrcadlení do window.__events (testy).
 * Události před připojením cíle (PostHog, Meta Pixel přes setSink) se drží ve frontě.
 */
import { detectInApp, getAttribution } from "./attribution";

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
const QUEUE_MAX = 100;
const queue: [EventName, EventProps][] = [];

/** Zrcadlení do window.__events: v testovacím režimu a mimo produkci. */
const MIRROR =
  process.env.NEXT_PUBLIC_TEST_MODE === "true" || process.env.NODE_ENV !== "production";

export function setSink(fn: Sink | null): void {
  sink = fn;
  if (!fn) return;
  for (const [name, props] of queue.splice(0)) fn(name, props);
}

function common(): EventProps {
  if (typeof window === "undefined") return {};
  const a = getAttribution();
  return {
    variant: document.documentElement.dataset.variant,
    utm_source: a?.utm_source,
    utm_medium: a?.utm_medium,
    utm_campaign: a?.utm_campaign,
    utm_content: a?.utm_content,
    utm_term: a?.utm_term,
    in_app_browser: detectInApp(navigator.userAgent),
    viewport_w: window.innerWidth,
    ms_since_landing: Math.round(performance.now() - t0),
  };
}

/** Souhrn cesty návštěvníka, ukládá se k leadu (PLAN §11, journey). */
export interface Journey {
  time_to_submit_ms?: number;
  sections_seen: string[];
  calc_used: boolean;
  compare_unlock_clicked: boolean;
  cta_clicks: number;
}

const journey: Journey = { sections_seen: [], calc_used: false, compare_unlock_clicked: false, cta_clicks: 0 };

export function getJourney(): Journey {
  const now = typeof performance !== "undefined" ? performance.now() : 0;
  return { ...journey, sections_seen: [...journey.sections_seen], time_to_submit_ms: Math.round(now - t0) };
}

function updateJourney(name: EventName, props: EventProps): void {
  if (name === "calc_interacted") journey.calc_used = true;
  else if (name === "compare_gate_clicked") journey.compare_unlock_clicked = true;
  else if (name === "cta_clicked") journey.cta_clicks += 1;
  else if (name === "section_viewed" && typeof props.section_id === "string" && !journey.sections_seen.includes(props.section_id))
    journey.sections_seen.push(props.section_id);
}

export function track(name: EventName, props: EventProps = {}): void {
  if (typeof window === "undefined") return;
  updateJourney(name, props);
  const all = { ...common(), ...props };
  if (MIRROR) (window.__events ??= []).push({ name, props: all });
  if (sink) sink(name, all);
  else if (queue.length < QUEUE_MAX) queue.push([name, all]);
}
