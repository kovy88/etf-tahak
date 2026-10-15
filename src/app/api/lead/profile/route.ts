import { NextResponse } from "next/server";
import { profileSchema } from "@/lib/server/schemas";
import { admin } from "@/lib/server/supabase";


/** POST /api/lead/profile: uloží dobrovolnou odpověď (broker). Lead se identifikuje nehádatelným lead_id. */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const p = profileSchema.safeParse(json);
  if (!p.success) return NextResponse.json({ ok: false }, { status: 422 });
  try {
    const { error } = await admin().from("leads").update({ broker: p.data.broker }).eq("id", p.data.lead_id);
    if (error) throw error;
  } catch (e) {
    console.error("profile update failed", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false }, { status: 503 });
  }
  // Odpověď je stejná, i když lead_id nic neodpovídá.
  return NextResponse.json({ ok: true });
}
