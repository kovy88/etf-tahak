import { beforeEach, expect, it, vi } from "vitest";

const dns = vi.hoisted(() => ({ resolveMx: vi.fn(), resolve4: vi.fn() }));
vi.mock("node:dns/promises", () => dns);
import { domainCanReceiveMail } from "./mx";

beforeEach(() => vi.resetAllMocks());

it("Null MX odmítne, i když má doména web na A záznamu", async () => {
  dns.resolveMx.mockResolvedValue([{ priority: 0, exchange: "" }]);
  dns.resolve4.mockResolvedValue(["192.0.2.1"]);
  expect(await domainCanReceiveMail("example.com")).toBe(false);
  expect(dns.resolve4).not.toHaveBeenCalled();
});

it("běžný MX povolí a při chybějícím MX použije A záznam", async () => {
  dns.resolveMx.mockResolvedValueOnce([{ priority: 10, exchange: "mail.example.com" }]);
  expect(await domainCanReceiveMail("mail.example.com")).toBe(true);
  dns.resolveMx.mockRejectedValueOnce({ code: "ENODATA" });
  dns.resolve4.mockResolvedValueOnce(["192.0.2.1"]);
  expect(await domainCanReceiveMail("legacy.example.com")).toBe(true);
});

it("neexistující doménu odmítne, dočasný výpadek DNS člověka nezablokuje", async () => {
  dns.resolveMx.mockRejectedValueOnce({ code: "ENOTFOUND" });
  dns.resolve4.mockRejectedValueOnce({ code: "ENOTFOUND" });
  expect(await domainCanReceiveMail("invalid.example.com")).toBe(false);
  dns.resolveMx.mockRejectedValueOnce({ code: "ETIMEOUT" });
  expect(await domainCanReceiveMail("temporary.example.com")).toBe(true);
});
