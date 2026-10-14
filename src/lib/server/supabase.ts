import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Klient se service role klíčem. Jen na serveru, klíč nikdy nejde do prohlížeče. */
export function admin(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase není nakonfigurovaný (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
