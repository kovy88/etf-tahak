import { NextResponse } from "next/server";
import { z } from "zod";
import { admin } from "@/lib/server/supabase";


const idSchema = z.string().uuid();

async function unsubscribe(id: string | null): Promise<boolean> {
  const p = idSchema.safeParse(id);
  if (!p.success) return false;
  try {
    await admin().from("leads").update({ unsubscribed_at: new Date().toISOString() }).eq("id", p.data);
    return true;
  } catch (e) {
    console.error("unsubscribe failed", e instanceof Error ? e.message : e);
    return false;
  }
}

/** Odhlášení jedním klikem z odkazu v e-mailu. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  await unsubscribe(url.searchParams.get("id"));
  return NextResponse.redirect(new URL("/odhlaseno", url.origin), 303);
}

/** Odhlášení přes List-Unsubscribe-Post (RFC 8058). */
export async function POST(req: Request) {
  const ok = await unsubscribe(new URL(req.url).searchParams.get("id"));
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}
