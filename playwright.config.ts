import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices["Pixel 5"],
    viewport: { width: 375, height: 667 },
  },
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: `http://localhost:${PORT}/poplatky`,
    reuseExistingServer: true,
    env: {
      NEXT_PUBLIC_TEST_MODE: "true",
      NEXT_PUBLIC_LEAD_PDF_PATH: "/favicon.ico",
      // testy nesmí posílat události do skutečného projektu PostHogu, i když je klíč v .env.local
      NEXT_PUBLIC_POSTHOG_KEY: "",
      NEXT_PUBLIC_META_PIXEL_ID: "",
    },
    timeout: 120_000,
  },
});
