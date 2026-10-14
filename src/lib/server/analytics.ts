import "server-only";
import { PostHog } from "posthog-node";

type Props = Record<string, string | number | boolean | null | undefined>;

/**
 * Serverová událost lead_created (PLAN §12). Pravdivý počet leadů je v DB, tohle je kopie pro funnel v PostHogu.
 * Bez NEXT_PUBLIC_POSTHOG_KEY nedělá nic. Chyba měření nesmí rozbít lead, proto se jen zaloguje.
 */
export async function serverTrack(name: "lead_created", distinctId: string, props: Props): Promise<void> {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return;
  const ph = new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
  try {
    ph.capture({ distinctId, event: name, properties: { ...props, $process_person_profile: false, source: "server" } });
  } finally {
    await ph.shutdown().catch((e: unknown) => console.error("posthog shutdown failed", e instanceof Error ? e.message : e));
  }
}
