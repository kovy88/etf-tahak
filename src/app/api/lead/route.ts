import { after, NextResponse } from "next/server";
import { sendLeadEmail } from "@/lib/server/email";
import { serverTrack } from "@/lib/server/analytics";
import { domainCanReceiveMail } from "@/lib/server/mx";
import { leadSchema, MIN_FORM_TIME_MS } from "@/lib/server/schemas";
import { admin } from "@/lib/server/supabase";


const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "https://etf-tahak.vercel.app").replace(/\/$/, "");
const downloadUrl = () => process.env.LEAD_PDF_PATH || null;

/**
 * POST /api/lead
 * 1) zod, 2) honeypot, 3) MX, 4) zápis (duplicita = úspěch), 5) e-mail a serverová událost přes after().
 * Odpověď je pro duplicitu stejná jako pro nový lead (neprozradí, co už známe).
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }
  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  const b = parsed.data;

  // Honeypot: robot vyplnil skryté pole. Tváříme se, že vše dopadlo dobře, a nic neukládáme.
  if (b.hp) return NextResponse.json({ ok: true, lead_id: crypto.randomUUID(), downloadUrl: downloadUrl() });

  const domain = b.email.split("@")[1];
  if (!(await domainCanReceiveMail(domain))) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  const flags: string[] = [];
  if (b.elapsed_ms !== undefined && b.elapsed_ms < MIN_FORM_TIME_MS) flags.push("too_fast");

  const ua = req.headers.get("user-agent")?.slice(0, 300) ?? null;
  const row = {
    email: b.email,
    variant: b.variant ?? null,
    form_location: b.location,
    utm_source: b.utm_source ?? null,
    utm_medium: b.utm_medium ?? null,
    utm_campaign: b.utm_campaign ?? null,
    utm_content: b.utm_content ?? null,
    utm_term: b.utm_term ?? null,
    referrer: b.referrer ?? null,
    landing_path: b.landing_path ?? null,
    in_app_browser: b.in_app_browser ?? null,
    user_agent: ua,
    posthog_id: b.posthog_id ?? null,
    calc: b.calc ?? null,
    journey: b.journey ?? null,
    consent_text_version: b.consent_text_version ?? null,
    flags,
  };

  let leadId: string | null = null;
  let isDuplicate = false;
  try {
    const { data, error } = await admin().from("leads").insert(row).select("id").single();
    if (error) {
      if (error.code === "23505") isDuplicate = true; // unique(email)
      else throw error;
    } else {
      leadId = data.id as string;
    }
  } catch (e) {
    console.error("lead insert failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, error: "server" }, { status: 503 });
  }

  // Duplicita: vrátíme náhodné ID, které nic neodpovídá. Cizí e-mail tak nejde použít k přepisu profilu.
  const publicId = leadId ?? crypto.randomUUID();

  after(async () => {
    try {
      await serverTrack("lead_created", {
        location: b.location,
        is_duplicate: isDuplicate,
        variant: b.variant,
        utm_content: b.utm_content,
      });
      if (leadId && !flags.includes("too_fast")) {
        const r = await sendLeadEmail(b.email, {
          siteUrl: siteUrl(),
          pdfUrl: downloadUrl(),
          leadId,
          calc: b.calc ?? null,
        });
        if (r.sent) await admin().from("leads").update({ email_sent_at: new Date().toISOString() }).eq("id", leadId);
        else if (r.reason !== "disabled") console.error("email not sent:", r.reason);
      }
    } catch (e) {
      console.error("after() failed", e instanceof Error ? e.message : e);
    }
  });

  return NextResponse.json({ ok: true, lead_id: publicId, downloadUrl: downloadUrl() });
}
