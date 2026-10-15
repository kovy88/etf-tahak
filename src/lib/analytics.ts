/**
 * Klientské cíle událostí: PostHog (EU) a Meta Pixel (PLAN §12).
 * - PostHog se načítá lazy (po načtení stránky), do souhlasu běží bez cookies (persistence: 'memory').
 * - Session replay se zapíná až po souhlasu, vstupy jsou maskované (e-mail).
 * - Meta Pixel se načte až po souhlasu s reklamními cookies a jen s ID v env.
 * Události před načtením knihovny drží fronta.
 */
import type { PostHog } from "posthog-js";
import { getConsent, subscribeConsent, type Consent } from "./consent";
import { setSink, track, type EventName, type EventProps } from "./track";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

let ph: PostHog | null = null;
let started = false;
// Rychlé odeslání může předběhnout lazy import SDK. Server i fronta pak musí použít stejné ID.
let earlyDistinctId: string | undefined;
const pending: [EventName, EventProps][] = [];

type Fbq = ((...a: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[][]; loaded?: boolean; version?: string; push?: unknown };
declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const PERSISTENCE = (c: Consent | null) => (c?.analytics ? "localStorage+cookie" : "memory");

function applyConsentToPostHog(c: Consent | null): void {
  if (!ph) return;
  ph.set_config({ persistence: PERSISTENCE(c) });
  if (c?.analytics) ph.startSessionRecording();
  else ph.stopSessionRecording();
}

function loadPixel(): void {
  if (!PIXEL_ID || typeof window === "undefined") return;
  if (window.fbq) {
    window.fbq("consent", "grant");
    return;
  }
  const f: Fbq = function (...a: unknown[]) {
    if (f.callMethod) f.callMethod(...a);
    else f.queue.push(a);
  } as Fbq;
  f.queue = [];
  f.loaded = true;
  f.version = "2.0";
  window.fbq = f;
  window._fbq = f;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  f("init", PIXEL_ID);
  f("track", "PageView");
}

function applyConsentToPixel(c: Consent | null): void {
  if (c?.marketing) loadPixel();
  else window.fbq?.("consent", "revoke");
}

function dispatch(name: EventName, props: EventProps): void {
  // Meta Pixel: úspěšná odpověď API, nikoli fallback při výpadku serveru.
  // Kvůli ochraně adres rozhraní nerozlišuje duplicity; nové kontakty měří serverový lead_created a DB.
  if (name === "thankyou_viewed" && props.saved === true && getConsent()?.marketing) window.fbq?.("track", "Lead");
  if (!KEY) return;
  if (ph) ph.capture(name, props);
  else if (pending.length < 100) pending.push([name, props]);
}

async function loadPostHog(): Promise<void> {
  if (!KEY || ph) return;
  const { default: posthog } = await import("posthog-js");
  const c = getConsent();
  posthog.init(KEY, {
    api_host: HOST,
    bootstrap: earlyDistinctId ? { distinctID: earlyDistinctId, isIdentifiedID: false } : {},
    persistence: PERSISTENCE(c),
    autocapture: false,
    capture_pageview: false,
    capture_pageleave: false,
    disable_session_recording: true,
    session_recording: { maskAllInputs: true },
    person_profiles: "identified_only",
    disable_surveys: true,
    // PostHog jinak zahazuje události z automatizovaných prohlížečů, to by znemožnilo ověření v Playwrightu
    opt_out_useragent_filter: process.env.NEXT_PUBLIC_TEST_MODE === "true",
  });
  ph = posthog;
  applyConsentToPostHog(c);
  for (const [n, p] of pending.splice(0)) posthog.capture(n, p);
}

/** ID návštěvníka v PostHogu, posílá se s leadem, aby šly spojit klientské a serverové události. */
export function getDistinctId(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return ph?.get_distinct_id() ?? (earlyDistinctId ??= crypto.randomUUID());
}

export function startAnalytics(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  setSink(dispatch);

  const c = getConsent();
  if (c?.marketing) applyConsentToPixel(c);

  subscribeConsent(() => {
    const next = getConsent();
    applyConsentToPostHog(next);
    applyConsentToPixel(next);
  });

  // Knihovnu načteme, až stránka vykreslí první obrazovku.
  const go = () => void loadPostHog().catch((e: unknown) => {
    console.error("analytics unavailable", e instanceof Error ? e.message : e);
  });
  const idle = () => (window.requestIdleCallback ? window.requestIdleCallback(go, { timeout: 2000 }) : setTimeout(go, 1500));
  if (document.readyState === "complete") idle();
  else window.addEventListener("load", idle, { once: true });
}

export function trackConsent(c: Consent): void {
  track("consent_updated", { analytics: c.analytics, marketing: c.marketing });
}
