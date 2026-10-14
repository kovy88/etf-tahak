import { NextResponse } from "next/server";
import { admin } from "@/lib/server/supabase";

/**
 * GET /api/keepalive: jeden levný dotaz do DB, volá ho denně Vercel Cron (vercel.json).
 * Free projekt Supabase se po 7 dnech bez aktivity pozastaví a formulář by přestal ukládat leady.
 * Když je nastavený CRON_SECRET, Vercel ho posílá v hlavičce Authorization a nic jiného endpoint nespustí.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  try {
    const { error } = await admin().from("leads").select("id", { head: true, count: "exact" }).limit(1);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("keepalive failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
