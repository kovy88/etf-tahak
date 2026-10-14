import { expect, test, type Page } from "@playwright/test";

const LEAD_OK = { ok: true, lead_id: "11111111-2222-4333-8444-555555555555", downloadUrl: "/favicon.ico" };

async function mock(page: Page, status: number, json: unknown) {
  const calls: Record<string, unknown>[] = [];
  await page.route("**/api/lead", async (route) => {
    calls.push(route.request().postDataJSON());
    await route.fulfill({ status, json });
  });
  return calls;
}

const finalForm = (page: Page) => page.locator("#zaver form[data-location=final]");

test("odeslání pošle e-mail, UTM, variantu, výpočet a cestu a ukáže děkovný stav s PDF", async ({ page }) => {
  const calls = await mock(page, 200, LEAD_OK);
  await page.route("**/api/lead/profile", async (route) => {
    calls.push({ profile: route.request().postDataJSON() });
    await route.fulfill({ json: { ok: true } });
  });
  await page.goto("/poplatky?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_tahak_launch&utm_content=a_poplatky_feed");
  await page.getByRole("button", { name: "10 000" }).first().click();
  const f = finalForm(page);
  await f.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2200);
  await f.getByLabel("Váš e-mail").fill("jan.novak@firma.cz");
  await f.getByRole("button", { name: /tahák zdarma/i }).click();

  const done = page.locator("#zaver");
  await expect(done.getByText("Hotovo. Tahák je váš.")).toBeVisible();
  await expect(done.getByRole("link", { name: "Stáhnout PDF" })).toHaveAttribute("href", "/favicon.ico");

  const body = calls[0] as Record<string, unknown> & { journey: { calc_used: boolean } };
  expect(body.email).toBe("jan.novak@firma.cz");
  expect(body.location).toBe("final");
  expect(body.variant).toBe("poplatky");
  expect(body.utm_content).toBe("a_poplatky_feed");
  expect(body.utm_source).toBe("meta");
  expect(body.landing_path).toBe("/poplatky");
  expect(body.calc).toMatchObject({ monthly: 10000, years: 25, gross: 6 });
  expect(body.journey.calc_used).toBe(true);
  expect(body.hp).toBe("");
  expect(body.elapsed_ms).toBeGreaterThan(2000);

  // dobrovolná otázka na 1 ťuk
  await done.getByRole("button", { name: "XTB" }).click();
  await expect(done.getByText("Díky, zapsali jsme si to.")).toBeVisible();
  expect(calls.at(-1)).toEqual({ profile: { lead_id: LEAD_OK.lead_id, broker: "XTB" } });

  // jiná místa jsou přepnutá do krátkého „hotovo“, jen se stažením
  await expect(page.locator("form[data-location]")).toHaveCount(0);
  await expect(page.locator("#tahak").getByText("Hotovo.", { exact: true })).toBeVisible();
  const ev = await page.evaluate(() => (window.__events ?? []).map((e) => e.name));
  for (const n of ["form_submitted", "profile_answered"]) expect(ev).toContain(n);
});

test("chyba serveru: návštěvník stejně dostane PDF", async ({ page }) => {
  await mock(page, 503, { ok: false, error: "server" });
  await page.goto("/srovnani");
  const f = finalForm(page);
  await f.scrollIntoViewIfNeeded();
  await f.getByLabel("Váš e-mail").fill("jan@firma.cz");
  await f.getByRole("button", { name: /tahák zdarma/i }).click();
  await expect(page.locator("#zaver").getByRole("link", { name: "Stáhnout PDF" })).toBeVisible();
  const ev = await page.evaluate(() => (window.__events ?? []).filter((e) => e.name === "form_error").map((e) => e.props.reason));
  expect(ev).toContain("server");
});

test("doména bez MX (422) ukáže chybu zadání a formulář zůstane", async ({ page }) => {
  await mock(page, 422, { ok: false, error: "invalid_email" });
  await page.goto("/srovnani");
  const f = finalForm(page);
  await f.scrollIntoViewIfNeeded();
  await f.getByLabel("Váš e-mail").fill("jan@neexistuje-domena.cz");
  await f.getByRole("button", { name: /tahák zdarma/i }).click();
  await expect(f.getByText(/nevypadá jako e-mail/)).toBeVisible();
  await expect(page.locator("form[data-location=final]")).toHaveCount(1);
});

test("duplicita: stejná odpověď jako u nového leadu", async ({ page }) => {
  await mock(page, 200, { ...LEAD_OK, lead_id: "99999999-2222-4333-8444-555555555555" });
  await page.goto("/srovnani");
  const f = finalForm(page);
  await f.scrollIntoViewIfNeeded();
  await f.getByLabel("Váš e-mail").fill("uz@znam.cz");
  await f.getByRole("button", { name: /tahák zdarma/i }).click();
  await expect(page.locator("#zaver").getByText("Hotovo. Tahák je váš.")).toBeVisible();
});

test("honeypot je pro člověka neviditelný a mimo tab pořadí", async ({ page }) => {
  await page.goto("/srovnani");
  const hp = page.locator("form[data-location=final] input[name=website]");
  await expect(hp).toHaveAttribute("tabindex", "-1");
  expect(await hp.evaluate((el) => el.getBoundingClientRect().x < -1000 || el.getBoundingClientRect().width === 0)).toBe(true);
});

test("bez e-mailu (výchozí) texty neslibují e-mail", async ({ page }) => {
  await page.goto("/srovnani");
  const text = await page.locator("body").innerText();
  expect(text).not.toMatch(/Odhlášení jedním klikem|Kopii posíláme|Promoakc/);
});

test("stránky zásad a odhlášení existují", async ({ page }) => {
  for (const [path, h1] of [["/zasady-ochrany-udaju", /Zásady ochrany/], ["/odhlaseno", /Odhlášeno/]] as const) {
    const r = await page.goto(path);
    expect(r?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(h1);
  }
});
