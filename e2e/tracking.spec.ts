import { expect, test, type Page } from "@playwright/test";

const LEAD_OK = { ok: true, lead_id: "11111111-2222-4333-8444-555555555555", downloadUrl: "/favicon.ico" };

const events = (page: Page) => page.evaluate(() => window.__events ?? []);

/** Lišta se ukáže až po odrolování první obrazovky. */
async function showBar(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 900));
  const bar = page.getByRole("region", { name: "Souhlas s cookies" });
  await expect(bar).toBeVisible();
  return bar;
}

async function mockLead(page: Page) {
  await page.route("**/api/lead", (route) => route.fulfill({ status: 200, json: LEAD_OK }));
}

/** Funnel z PLAN §12: landing_viewed → engaged → form_viewed → form_started → odeslání. */
for (const [path, variant] of [
  ["/poplatky", "poplatky"],
  ["/srovnani", "srovnani"],
] as const) {
  test(`události projdou funnelem ve správném pořadí (${variant})`, async ({ page }) => {
    await mockLead(page);
    await page.goto(path);
    await (await showBar(page)).getByRole("button", { name: "Odmítnout" }).click();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.6));
    await page.waitForTimeout(300);

    const f = page.locator("#zaver form[data-location=final]");
    await f.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2200);
    await f.getByLabel("Váš e-mail").fill("jan.novak@firma.cz");
    await f.getByRole("button", { name: /tahák zdarma/i }).click();
    await expect(page.locator("#zaver").getByText("Hotovo. Tahák je váš.")).toBeVisible();

    const ev = await events(page);
    const n = ev.map((e) => e.name);
    const first = (name: string) => n.indexOf(name as never);
    expect(n[0]).toBe("landing_viewed");
    const funnel = ["landing_viewed", "scroll_depth", "form_viewed", "form_started", "form_submitted", "thankyou_viewed"];
    const idx = funnel.map(first);
    expect(idx.every((i) => i >= 0), `chybí událost: ${funnel.filter((_, i) => idx[i] < 0)}`).toBe(true);
    expect([...idx].sort((a, b) => a - b)).toEqual(idx);
    expect(n).toContain("section_viewed");
    expect(n.filter((x) => x === "thankyou_viewed")).toHaveLength(1);

    // společné vlastnosti
    for (const e of ev) {
      expect(e.props.variant).toBe(variant);
      expect(e.props.in_app_browser).toBe("none");
      expect(typeof e.props.viewport_w).toBe("number");
      expect(typeof e.props.ms_since_landing).toBe("number");
    }
    expect(ev[0].props.landing_path).toBe(path);
    expect(ev.find((e) => e.name === "thankyou_viewed")?.props.saved).toBe(true);
  });
}

test("UTM a in-app prohlížeč jsou společné vlastnosti všech událostí", async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 [FBAN/FBIOS;FBAV/450.0]",
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3100/poplatky?utm_source=meta&utm_content=a_poplatky_feed");
  await (await showBar(page)).getByRole("button", { name: "Odmítnout" }).click();
  const ev = await events(page);
  expect(ev.length).toBeGreaterThan(1);
  for (const e of ev) {
    expect(e.props.utm_source).toBe("meta");
    expect(e.props.utm_content).toBe("a_poplatky_feed");
    expect(e.props.in_app_browser).toBe("facebook");
  }
  await ctx.close();
});

test("cookie lišta: stejná tlačítka, odmítnutí nic neukládá, volba se pamatuje", async ({ page, context }) => {
  await page.goto("/poplatky");
  const bar = await showBar(page);
  const [a, d] = await Promise.all([
    bar.getByRole("button", { name: "Přijmout" }).boundingBox(),
    bar.getByRole("button", { name: "Odmítnout" }).boundingBox(),
  ]);
  expect(a?.width).toBeCloseTo(d?.width ?? 0, 0);
  expect(a?.height).toBeCloseTo(d?.height ?? 0, 0);

  expect(await context.cookies()).toHaveLength(0);
  await bar.getByRole("button", { name: "Odmítnout" }).click();
  await expect(bar).toBeHidden();
  const c = (await events(page)).find((e) => e.name === "consent_updated");
  expect(c?.props).toMatchObject({ analytics: false, marketing: false });
  expect(await context.cookies()).toHaveLength(0);

  await page.reload();
  await expect(bar).toBeHidden();

  // odvolání z patičky
  await page.getByRole("button", { name: "Nastavení cookies" }).click();
  await expect(bar).toBeVisible();
  await bar.getByRole("button", { name: "Přijmout" }).click();
  const last = (await events(page)).filter((e) => e.name === "consent_updated").at(-1);
  expect(last?.props).toMatchObject({ analytics: true, marketing: true });
});

test("bez klíčů a ID se nenačítá PostHog ani Meta Pixel", async ({ page }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (u.hostname !== "localhost") external.push(u.hostname);
  });
  await page.goto("/srovnani");
  await (await showBar(page)).getByRole("button", { name: "Přijmout" }).click();
  await page.waitForTimeout(2500);
  expect(external.filter((h) => /posthog|facebook/.test(h))).toEqual([]);
  expect(await page.evaluate(() => typeof window.fbq)).toBe("undefined");
});

test("na první obrazovce lišta není a tlačítko v hero je celé vidět (360×600)", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 600 });
  await page.goto("/poplatky");
  await page.waitForTimeout(500);
  await expect(page.getByRole("region", { name: "Souhlas s cookies" })).toHaveCount(0);
  const cta = page.locator("header").getByRole("button", { name: /tahák zdarma/i });
  const bottom = async () => {
    const b = await cta.boundingBox();
    return (b?.y ?? 0) + (b?.height ?? 0);
  };
  expect(await bottom()).toBeLessThanOrEqual(600);
  // nejdelší věta pod číslem (10 000 Kč) nesmí tlačítko posunout pod okraj
  await page.getByRole("group", { name: "Měsíční vklad" }).first().getByRole("button", { name: /10\s000/ }).click();
  expect(await bottom()).toBeLessThanOrEqual(600);
});

test("po odrolování lišta nezakrývá lepivé CTA a sticky odskočí nad ni", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 600 });
  await page.goto("/poplatky");
  const bar = await showBar(page);
  await page.waitForTimeout(500); // přechod lepivé lišty
  const b = await bar.boundingBox();
  const sticky = await page.locator("[data-visible=true]").first().boundingBox();
  expect(sticky).not.toBeNull();
  expect((sticky?.y ?? 0) + (sticky?.height ?? 0)).toBeLessThanOrEqual((b?.y ?? 0) + 1);
});

test("lišta nezvyšuje CLS", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { cls: number }).cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[])
        if (!e.hadRecentInput) (window as unknown as { cls: number }).cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("/poplatky");
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => (window as unknown as { cls: number }).cls)).toBeLessThan(0.05);
});

test("skrytá lepivá lišta nevykukuje nad lištou cookies", async ({ page }) => {
  await page.goto("/poplatky");
  await showBar(page);
  // zpět do hero: lepivá lišta je skrytá, lišta cookies zůstává
  await page.evaluate(() => window.scrollTo(0, 0));
  const sticky = page.locator("[data-past-hero]");
  await expect(sticky).toHaveAttribute("data-visible", "false");
  await page.waitForTimeout(400); // přechod
  await expect(sticky).not.toBeInViewport();
});
