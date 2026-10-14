/**
 * Odeslání leadu na POST /api/lead. Při chybě serveru návštěvníka netrestáme (PLAN §6):
 * volající stejně vydá PDF a chybu jen zaloguje.
 */
import type { FormLocation } from "@/content/form";
import { captureAttribution, detectInApp } from "./attribution";
import { getJourney } from "./track";

export interface LeadInput {
  email: string;
  location: FormLocation;
  /** honeypot (musí být prázdný) */
  hp: string;
  /** ms od zobrazení formuláře */
  elapsedMs: number;
  calc: { monthly: number; years: number; gross: number; etfId: string } | null;
}

export type LeadResponse =
  | { ok: true; leadId: string | null; downloadUrl: string | null }
  | { ok: false; reason: "invalid" | "server" };

export async function submitLead(input: LeadInput): Promise<LeadResponse> {
  const a = captureAttribution();
  const body = {
    email: input.email,
    location: input.location,
    hp: input.hp,
    elapsed_ms: Math.round(input.elapsedMs),
    variant: document.documentElement.dataset.variant,
    calc: input.calc,
    journey: getJourney(),
    ...a,
    in_app_browser: detectInApp(navigator.userAgent),
    consent_text_version: "2026-10-a",
  };
  try {
    const r = await fetch("/api/lead", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.status === 422) return { ok: false, reason: "invalid" };
    if (!r.ok) return { ok: false, reason: "server" };
    const j = (await r.json()) as { lead_id?: string | null; downloadUrl?: string | null };
    return { ok: true, leadId: j.lead_id ?? null, downloadUrl: j.downloadUrl ?? null };
  } catch {
    return { ok: false, reason: "server" };
  }
}

export async function submitProfile(leadId: string, broker: string): Promise<boolean> {
  try {
    const r = await fetch("/api/lead/profile", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ lead_id: leadId, broker }),
    });
    return r.ok;
  } catch {
    return false;
  }
}
