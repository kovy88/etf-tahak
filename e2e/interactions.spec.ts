import { expect, test, type Page } from "@playwright/test";
import { scenario } from "../src/lib/calc";
import { czkRounded } from "../src/lib/format";

const ETF_TER = 0.0003;
const AVG_TER = 0.0146;
const diff = (monthly: number, years = 25, gross = 0.06, etfTer = ETF_TER) =>
  scenario(monthly, years, gross, etfTer).final - scenario(monthly, years, gross, AVG_TER).final;
const num = (s: string) => s.replace(/\s/g, " ");
/** Regulár, který bere nezlomitelnou i běžnou mezeru */
const re = (s: string) => new RegExp(s.replace(/ /g, "\\s"));

async function events(page: Page) {
  return (await page.evaluate(() => window.__events ?? [])).map((e) => e.name);
}

async function heroNumber(page: Page) {
  return num((await page.locator("h1 .marker").first().textContent()) ?? "");
}

/** Serverové odpovědi se v testech mockují (Supabase tu není). Skutečný zápis ověřuje e2e/leads.spec.ts s reálnou DB. */
const LEAD_OK = { ok: true, lead_id: "11111111-2222-4333-8444-555555555555", downloadUrl: "/favicon.ico" };

test.beforeEach(async ({ page }) => {
  await page.route("**/api/lead", (route) => route.fulfill({ json: LEAD_OK }));
  await page.route("**/api/lead/profile", (route) => route.fulfill({ json: { ok: true } }));
  // lišta cookies by schovala lepivé CTA, tady testujeme jen jeho vlastní logiku
  await page.addInitScript(() => localStorage.setItem("etf_consent", JSON.stringify({ analytics: false, marketing: false })));
  await page.addInitScript(() => {
    (window as unknown as { __cls: number }).__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries() as unknown as { value: number; hadRecentInput: boolean }[])
        if (!e.hadRecentInput) (window as unknown as { __cls: number }).__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
});

test("výchozí stav: hero, kalkulačka a reklama mají stejné číslo", async ({ page }) => {
  await page.goto("/poplatky");
  const expected = num(czkRounded(diff(3000)));
  expect(await heroNumber(page)).toBe(expected);
  await expect(page.locator("#kalkulacka .marker")).toHaveText(re(expected));
  expect(expected).toBe("377 000 Kč");
});

test("volba částky v hero přepočítá číslo okamžitě i v kalkulačce", async ({ page }) => {
  await page.goto("/poplatky");
  await page.getByRole("group", { name: "Měsíční vklad" }).first().getByRole("button", { name: /5\s000/ }).click();
  expect(await heroNumber(page)).toBe(num(czkRounded(diff(5000))));
  await expect(page.locator("#kalkulacka button[aria-pressed=true]").first()).toContainText(/5\s000/);
  // věta pod číslem musí říkat stejnou částku jako zvolené tlačítko
  await expect(page.locator("header").getByText(/^Při\s5\s000\sKč\směsíčně\sa\svýnosu\s6\s%\sročně/)).toBeVisible();
  const ev = await events(page);
  expect(ev).toContain("calc_interacted");
});

test("kalkulačka: horizont, výnos, vlastní částka, výběr ETF a graf", async ({ page }) => {
  await page.goto("/poplatky");
  const calc = page.locator("#kalkulacka");
  await calc.scrollIntoViewIfNeeded();
  await calc.getByRole("button", { name: /20\slet/ }).click();
  await calc.getByRole("button", { name: /8\s%/ }).click();
  await expect(calc.locator(".marker")).toHaveText(re(num(czkRounded(diff(3000, 20, 0.08)))));
  await calc.getByLabel("Jiná částka (Kč)").fill("7500");
  await expect(calc.locator(".marker")).toHaveText(re(num(czkRounded(diff(7500, 20, 0.08)))));
  // ETF s vyšším TER dává menší rozdíl
  const before = await calc.locator(".marker").textContent();
  const opts = await calc.locator("select option").allTextContents();
  const idx = opts.findIndex((o) => /All-World UCITS/.test(o) && !/Dividend/.test(o));
  expect(idx).toBeGreaterThan(-1);
  await calc.getByRole("combobox").selectOption({ index: idx });
  expect(await calc.locator(".marker").textContent()).not.toBe(before);
  await expect(calc.locator("svg path.chart-line")).toHaveCount(3);
  await page.waitForTimeout(1200);
  const ev = await page.evaluate(() => (window.__events ?? []).filter((e) => e.name === "calc_changed"));
  expect(ev.length).toBeGreaterThan(0);
  expect(ev.at(-1)?.props.years).toBe(20);
});

test("srovnávač: filtr, brána, překlep v e-mailu a odemknutí bez reloadu", async ({ page }) => {
  await page.goto("/srovnani");
  const cmp = page.locator("#srovnani");
  await cmp.scrollIntoViewIfNeeded();
  await expect(cmp.locator("article")).toHaveCount(6); // 3 zdarma + 3 rozmazané
  await cmp.getByRole("button", { name: "Dividendy" }).click();
  await expect(cmp.locator("article")).toHaveCount(2);
  await cmp.getByRole("button", { name: "Vše" }).click();

  await cmp.getByRole("button", { name: /Odemknout zbylých 9/ }).click();
  const input = cmp.locator("form[data-location=compare_gate] input[type=email]");
  await expect(input).toBeFocused();
  await input.fill("jan@seznam.com");
  await cmp.getByRole("button", { name: "Odemknout srovnání" }).click();
  await expect(cmp.getByText("Mysleli jste @seznam.cz?")).toBeVisible();
  await cmp.getByRole("button", { name: "Opravit" }).click();
  await expect(input).toHaveValue("jan@seznam.cz");
  await cmp.getByRole("button", { name: "Odemknout srovnání" }).click();

  await expect(cmp.locator("form[data-location=compare_gate]")).toHaveCount(0);
  await expect(cmp.locator("article")).toHaveCount(12);
  // Brána musí po odemčení zachovat celé poděkování i PDF, nejen zpřístupnit karty.
  const thanks = cmp.locator("#srovnani-form");
  await expect(thanks.getByText("Hotovo. Tahák je váš.")).toBeVisible();
  await expect(thanks.getByRole("link", { name: "Stáhnout PDF" })).toBeInViewport();
  await thanks.getByRole("button", { name: "XTB" }).click();
  await expect(thanks.getByText("Díky, zapsali jsme si to.")).toBeVisible();
  // všechna místa přepnutá do stavu „hotovo“
  await expect(page.locator("form[data-location]")).toHaveCount(0);
  const ev = await events(page);
  for (const n of ["compare_filter_changed", "compare_gate_clicked", "form_started", "email_typo_suggested", "email_typo_accepted", "form_submitted", "thankyou_viewed", "profile_answered"])
    expect(ev).toContain(n);
});

test("chyby formuláře: prázdné a neplatné pole", async ({ page }) => {
  await page.goto("/poplatky");
  const f = page.locator("#zaver form");
  await f.scrollIntoViewIfNeeded();
  await f.getByRole("button", { name: /tahák zdarma/i }).click();
  await expect(f.getByText(/Doplňte e-mail/)).toBeVisible();
  await f.getByLabel("Váš e-mail").fill("neplatny");
  await f.getByLabel("Váš e-mail").blur();
  await expect(f.getByText(/nevypadá jako e-mail/)).toBeVisible();
  expect(await events(page)).toContain("form_error");
});

test("hero CTA otevře sheet s fokusem na poli a odeslání přepne všechna místa", async ({ page }) => {
  await page.goto("/poplatky");
  await page.locator("header").getByRole("button", { name: "Chci tahák zdarma" }).tap();
  const dlg = page.locator("dialog[open]");
  await expect(dlg).toBeVisible();
  await expect(dlg.locator("input[type=email]")).toBeFocused();
  await dlg.locator("input[type=email]").fill("jan.novak@firma.cz");
  await dlg.getByRole("button", { name: "Chci tahák zdarma" }).tap();
  await expect(dlg.getByText("Hotovo. Tahák je váš.")).toBeVisible();
  await dlg.getByRole("button", { name: "Zavřít" }).tap();
  await expect(page.locator("form[data-location]")).toHaveCount(0);
  await expect(page.locator("main [data-state=done]").first()).toBeVisible();
  // hero i lepivá lišta už nenabízí formulář, ale rovnou PDF
  await expect(page.locator("header").getByRole("link", { name: "Stáhnout PDF" })).toBeVisible();
  await expect(page.locator("header").getByRole("button", { name: "Chci tahák zdarma" })).toHaveCount(0);
  // lepivá lišta po odeslání zmizí, PDF je v děkovném stavu i v hero
  await page.locator("main > section").nth(1).scrollIntoViewIfNeeded();
  await expect(page.locator("[data-past-hero]")).toHaveAttribute("data-visible", "false");
  // skrytá lišta nesmí vykukovat nad lištou cookies
  await expect(page.locator("[data-past-hero]")).not.toBeInViewport();
});

test("sticky lišta: schovaná v hero a u formuláře, ukáže se mezi nimi", async ({ page }) => {
  await page.goto("/poplatky");
  const bar = page.locator("[data-visible]");
  await expect(bar).toHaveAttribute("data-visible", "false");
  await page.locator("#tri-veci").scrollIntoViewIfNeeded();
  await expect(bar).toHaveAttribute("data-visible", "true");
  await page.locator("#tahak form").scrollIntoViewIfNeeded();
  await expect(bar).toHaveAttribute("data-visible", "false");
});

test("sticky lišta: schová se i u formuláře, který se vykreslí až po odemknutí gate", async ({ page }) => {
  await page.goto("/poplatky");
  const bar = page.locator("[data-past-hero]");
  await page.getByRole("button", { name: /Odemknout zbylých/ }).click();
  const gate = page.locator("main form[data-location=compare_gate]");
  await gate.scrollIntoViewIfNeeded();
  await expect(gate).toBeInViewport();
  await expect(bar).toHaveAttribute("data-visible", "false");
});

test("bez posunů layoutu při interakcích (CLS < 0,05)", async ({ page }) => {
  await page.goto("/poplatky");
  await page.waitForLoadState("networkidle");
  const calc = page.locator("#kalkulacka");
  await calc.scrollIntoViewIfNeeded();
  for (const y of [10, 30, 20]) await calc.getByRole("button", { name: new RegExp(`^${y}\\slet`) }).click();
  await calc.getByRole("button", { name: /10\s000/ }).click();
  await page.locator("#srovnani").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Svět" }).click();
  await page.getByRole("button", { name: "Vše" }).click();
  const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
  expect(cls).toBeLessThan(0.05);
});
