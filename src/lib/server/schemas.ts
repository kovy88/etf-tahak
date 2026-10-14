import { z } from "zod";

export const LOCATIONS = ["calc", "compare_gate", "hero", "sticky", "tahak", "final"] as const;
export const BROKERS = ["XTB", "Trading 212", "Revolut", "Fio", "Portu", "IBKR", "Jinde", "Zatím nikde"] as const;

const short = (n: number) => z.string().max(n).optional();

export const leadSchema = z.object({
  email: z.string().trim().toLowerCase().min(5).max(254).regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
  location: z.enum(LOCATIONS),
  hp: z.string().max(200).optional().default(""),
  elapsed_ms: z.number().int().min(0).max(86_400_000).optional(),
  variant: z.enum(["poplatky", "srovnani"]).optional(),
  calc: z
    .object({
      monthly: z.number().min(100).max(1_000_000),
      years: z.number().int().min(1).max(60),
      gross: z.number().min(0).max(30),
      etfId: z.string().max(20),
    })
    .nullable()
    .optional(),
  journey: z
    .object({
      time_to_submit_ms: z.number().optional(),
      sections_seen: z.array(z.string().max(40)).max(20),
      calc_used: z.boolean(),
      compare_unlock_clicked: z.boolean(),
      cta_clicks: z.number().int().min(0).max(1000),
    })
    .optional(),
  utm_source: short(200),
  utm_medium: short(200),
  utm_campaign: short(200),
  utm_content: short(200),
  utm_term: short(200),
  referrer: short(300),
  landing_path: short(200),
  in_app_browser: z.enum(["facebook", "instagram", "tiktok", "none"]).optional(),
  posthog_id: short(100),
  consent_text_version: short(40),
});
export type LeadBody = z.infer<typeof leadSchema>;

export const profileSchema = z.object({
  lead_id: z.string().uuid(),
  broker: z.enum(BROKERS),
});

/** Odeslání rychlejší než tohle je podezřelé (ale reálný člověk s automatickým vyplněním to stihnout může). */
export const MIN_FORM_TIME_MS = 2000;
