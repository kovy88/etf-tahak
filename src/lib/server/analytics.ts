import "server-only";

/**
 * Serverová událost lead_created (PLAN §12). F5 jen drží místo volání, PostHog (posthog-node) připojí F6.
 */
export async function serverTrack(name: "lead_created", props: Record<string, string | number | boolean | null | undefined>): Promise<void> {
  void name;
  void props;
}
