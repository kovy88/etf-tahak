import { expect, test, type Page } from "@playwright/test";

/** Šířky a orientace z PLAN §16. Screenshoty jdou do .shots/ (mimo test-results, který Playwright maže) ke kontrole očima. */
const SIZES = [
  { w: 320, h: 568 },
  { w: 360, h: 640 },
  { w: 375, h: 667 },
  { w: 414, h: 896 },
  { w: 667, h: 375, name: "landscape" },
];

async function overflow(page: Page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const wide = [...document.querySelectorAll("body *")]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        // skryté a záměrně ořezané prvky (burzovní pruh, rozmazané karty) nevadí
        return r.width > 0 && r.right > vw + 1 && !e.closest(".ticker-track, [aria-hidden=true], dialog:not([open])");
      })
      .map((e) => `${e.tagName}.${String(e.className).slice(0, 40)} → ${Math.round(e.getBoundingClientRect().right)}`);
    return { scroll: document.documentElement.scrollWidth - vw, wide: wide.slice(0, 5) };
  });
}

for (const variant of ["poplatky", "srovnani"] as const) {
  for (const s of SIZES) {
    const label = s.name ?? `${s.w}`;
    test(`${variant} ${label}: bez vodorovného posunu, CTA v hero je vidět`, async ({ page }) => {
      await page.setViewportSize({ width: s.w, height: s.h });
      await page.goto(`/${variant}`);
      // Screenshot nesmí změnit caret style před dokončením hydratace formulářů.
      await page.waitForFunction(() => window.__events?.some((e) => e.name === "landing_viewed"));
      await page.evaluate(() => document.fonts.ready);
      const o = await overflow(page);
      expect(o.scroll, o.wide.join("\n")).toBeLessThanOrEqual(0);
      const cta = page.locator("header").getByRole("button").last();
      await expect(cta).toBeVisible();
      // na výšku od 600 px se hero s CTA vejde do první obrazovky (CLAUDE.md: 360×600). Na 320×568
      // (iPhone SE 1. gen.) a na šířku stačí, že je CTA dosažitelné krátkým posunem.
      if (!s.name && s.h >= 600) {
        const box = await cta.boundingBox();
        expect(box!.y + box!.height).toBeLessThanOrEqual(s.h);
      }
      await page.screenshot({ path: `.shots/${variant}-${label}.png` });
      await page.screenshot({ path: `.shots/${variant}-${label}-full.png`, fullPage: true });
    });
  }
}

/** Klávesnice v Playwrightu nevyjede, proto zmenšíme visualViewport stejně jako mobilní prohlížeč. */
async function openKeyboard(page: Page, px = 300) {
  await page.evaluate((px) => {
    const vv = window.visualViewport!;
    const h = window.innerHeight - px;
    Object.defineProperty(vv, "height", { configurable: true, get: () => h });
    vv.dispatchEvent(new Event("resize"));
  }, px);
}

test("klávesnice: sheet z hero má pole ve fokusu a lepivá lišta zmizí", async ({ page }) => {
  // lišta cookies by schovala lepivé CTA, tady testujeme jen jeho vlastní logiku
  await page.addInitScript(() => localStorage.setItem("etf_consent", JSON.stringify({ analytics: false, marketing: false })));
  await page.goto("/poplatky");
  const sticky = page.locator("[data-past-hero]");
  // odrolovat za hero, aby lišta byla vidět
  await page.locator("main > section").nth(1).scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 200);
  await expect(sticky).toHaveAttribute("data-visible", "true");
  await sticky.getByRole("button").click();
  const input = page.locator("dialog[open] input[type=email]");
  await expect(input).toBeFocused();
  await openKeyboard(page);
  await expect(sticky).toHaveAttribute("data-keyboard", "true");
  await expect(sticky).toHaveAttribute("data-visible", "false");
  // pole i tlačítko odeslání jsou uvnitř okna a nejsou zakryté lištou
  const dialog = await page.locator("dialog[open]").boundingBox();
  expect(dialog!.y).toBeGreaterThanOrEqual(0);
  await expect(page.locator("dialog[open] button[type=submit]")).toBeInViewport();
  await page.screenshot({ path: ".shots/sheet-keyboard.png" });
});

test("klávesnice ve formuláři pod kalkulačkou schová lepivou lištu", async ({ page }) => {
  await page.goto("/poplatky");
  const form = page.locator("main form[data-location=calc]");
  await form.scrollIntoViewIfNeeded();
  await form.locator("input[type=email]").focus();
  await openKeyboard(page);
  await expect(page.locator("[data-past-hero]")).toHaveAttribute("data-visible", "false");
});
