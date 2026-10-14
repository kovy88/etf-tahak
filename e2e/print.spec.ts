import { expect, test } from "@playwright/test";

test("/tahak/print: noindex, 11 stran A4, bez lišty cookies a bez měření", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/tahak/print");
  await expect(page.locator("[data-sheet]")).toHaveCount(11);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(500);
  await expect(page.getByRole("region", { name: "Souhlas s cookies" })).toHaveCount(0);
  expect(await page.evaluate(() => window.__events?.length ?? 0)).toBe(0);
  expect(requests.filter((u) => /posthog|facebook|fbevents/.test(u))).toEqual([]);
  const box = await page.locator('[data-sheet="1"]').boundingBox();
  expect(Math.round(box!.width)).toBe(794); // 210 mm
});

test("sekce „Co je v taháku“ ukazuje 3 skutečné strany a nic neposouvá", async ({ page }) => {
  await page.goto("/poplatky");
  const section = page.locator("#tahak");
  await section.scrollIntoViewIfNeeded();
  const imgs = section.locator("img");
  await expect(imgs).toHaveCount(3);
  await expect
    .poll(() => imgs.evaluateAll((els) => els.every((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0)))
    .toBe(true);
  for (const i of await imgs.all()) await expect(i).toHaveAttribute("alt", /Strana \d taháku/);
  const cls = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let v = 0;
        new PerformanceObserver((l) => {
          for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) v += e.value;
        }).observe({ type: "layout-shift", buffered: true });
        setTimeout(() => resolve(v), 500);
      }),
  );
  expect(cls).toBeLessThan(0.05);
});
