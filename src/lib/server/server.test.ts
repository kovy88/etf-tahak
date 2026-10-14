import { beforeEach, describe, expect, it, vi } from "vitest";

// --- mocky (Supabase, MX, Resend) ---
const insert = vi.fn();
const update = vi.fn();
const eq = vi.fn();
vi.mock("@/lib/server/supabase", () => ({
  admin: () => ({
    from: () => ({
      insert: (row: unknown) => {
        insert(row);
        return { select: () => ({ single: () => insertResult() }) };
      },
      update: (v: unknown) => {
        update(v);
        return { eq: (...a: unknown[]) => { eq(...a); return Promise.resolve({ error: null }); } };
      },
    }),
  }),
}));
let insertResult: () => Promise<{ data: { id: string } | null; error: { code: string } | null }>;
const mx = vi.fn();
vi.mock("@/lib/server/mx", () => ({ domainCanReceiveMail: (d: string) => mx(d) }));
const sendEmail = vi.fn();
vi.mock("@/lib/server/email", async (orig) => ({
  ...(await orig<typeof import("@/lib/server/email")>()),
  sendLeadEmail: (...a: unknown[]) => sendEmail(...a),
}));
vi.mock("next/server", async (orig) => ({
  ...(await orig<typeof import("next/server")>()),
  after: (fn: () => unknown) => fn(),
}));

import { POST as leadPost } from "@/app/api/lead/route";
import { POST as profilePost } from "@/app/api/lead/profile/route";
import { GET as unsubGet, POST as unsubPost } from "@/app/api/unsubscribe/route";

const NEW_ID = "11111111-2222-4333-8444-555555555555";
const req = (body: unknown, url = "http://localhost/api/lead") =>
  new Request(url, { method: "POST", headers: { "content-type": "application/json", "user-agent": "vitest" }, body: JSON.stringify(body) });
const good = { email: "Jan.Novak@Seznam.cz", location: "calc", elapsed_ms: 5000, hp: "" };

beforeEach(() => {
  vi.clearAllMocks();
  mx.mockResolvedValue(true);
  sendEmail.mockResolvedValue({ sent: true, id: "x" });
  insertResult = async () => ({ data: { id: NEW_ID }, error: null });
});

describe("POST /api/lead", () => {
  it("uloží lead (e-mail malými písmeny), vrátí lead_id a pošle e-mail přes after()", async () => {
    process.env.LEAD_PDF_PATH = "/tahak/test.pdf";
    const r = await leadPost(req({ ...good, utm_content: "a_poplatky_feed", variant: "poplatky", calc: { monthly: 3000, years: 25, gross: 6, etfId: "SPYL" } }));
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j).toEqual({ ok: true, lead_id: NEW_ID, downloadUrl: "/tahak/test.pdf" });
    const row = insert.mock.calls[0][0];
    expect(row.email).toBe("jan.novak@seznam.cz");
    expect(row.utm_content).toBe("a_poplatky_feed");
    expect(row.variant).toBe("poplatky");
    expect(row.flags).toEqual([]);
    expect(row.calc).toMatchObject({ monthly: 3000, years: 25 });
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail.mock.calls[0][0]).toBe("jan.novak@seznam.cz");
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ email_sent_at: expect.any(String) }));
  });

  it("duplicita je úspěch, nevrátí skutečné ID a neposílá e-mail", async () => {
    insertResult = async () => ({ data: null, error: { code: "23505" } });
    const r = await leadPost(req(good));
    expect(r.status).toBe(200);
    const j = await r.json();
    expect(j.ok).toBe(true);
    expect(j.lead_id).not.toBe(NEW_ID);
    expect(j.lead_id).toMatch(/^[0-9a-f-]{36}$/);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("honeypot: fingovaný úspěch, nic se neukládá", async () => {
    const r = await leadPost(req({ ...good, hp: "http://spam" }));
    expect(r.status).toBe(200);
    expect((await r.json()).ok).toBe(true);
    expect(insert).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("příliš rychlé odeslání se uloží s příznakem a bez e-mailu", async () => {
    const r = await leadPost(req({ ...good, elapsed_ms: 400 }));
    expect(r.status).toBe(200);
    expect(insert.mock.calls[0][0].flags).toEqual(["too_fast"]);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("neplatný e-mail vrací 422", async () => {
    for (const email of ["", "neplatny", "a@b", "a b@c.cz"]) {
      const r = await leadPost(req({ ...good, email }));
      expect(r.status, email).toBe(422);
    }
    expect(insert).not.toHaveBeenCalled();
  });

  it("doména bez MX vrací 422", async () => {
    mx.mockResolvedValue(false);
    const r = await leadPost(req(good));
    expect(r.status).toBe(422);
    expect(insert).not.toHaveBeenCalled();
  });

  it("chyba databáze vrací 503 (klient stejně vydá PDF)", async () => {
    insertResult = async () => ({ data: null, error: { code: "XX000" } });
    const r = await leadPost(req(good));
    expect(r.status).toBe(503);
  });

  it("špatné JSON a neznámé umístění", async () => {
    const bad = await leadPost(new Request("http://localhost/api/lead", { method: "POST", body: "{" }));
    expect(bad.status).toBe(400);
    expect((await leadPost(req({ ...good, location: "jinde" }))).status).toBe(422);
  });
});

describe("POST /api/lead/profile", () => {
  it("uloží broker podle lead_id", async () => {
    const r = await profilePost(req({ lead_id: NEW_ID, broker: "XTB" }));
    expect(r.status).toBe(200);
    expect(update).toHaveBeenCalledWith({ broker: "XTB" });
    expect(eq).toHaveBeenCalledWith("id", NEW_ID);
  });
  it("odmítne neplatné ID a neznámého brokera", async () => {
    expect((await profilePost(req({ lead_id: "abc", broker: "XTB" }))).status).toBe(422);
    expect((await profilePost(req({ lead_id: NEW_ID, broker: "Hack" }))).status).toBe(422);
    expect(update).not.toHaveBeenCalled();
  });
});

describe("odhlášení", () => {
  it("GET nastaví unsubscribed_at a přesměruje na /odhlaseno", async () => {
    const r = await unsubGet(new Request(`http://localhost/api/unsubscribe?id=${NEW_ID}`));
    expect(r.status).toBe(303);
    expect(r.headers.get("location")).toBe("http://localhost/odhlaseno");
    expect(update).toHaveBeenCalledWith({ unsubscribed_at: expect.any(String) });
  });
  it("POST (List-Unsubscribe-Post) funguje a špatné ID nic nezmění", async () => {
    expect((await unsubPost(new Request(`http://localhost/api/unsubscribe?id=${NEW_ID}`, { method: "POST" }))).status).toBe(200);
    update.mockClear();
    expect((await unsubPost(new Request("http://localhost/api/unsubscribe?id=nope", { method: "POST" }))).status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });
});
