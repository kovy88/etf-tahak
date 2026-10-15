import { afterEach, expect, it, vi } from "vitest";

afterEach(() => vi.unstubAllGlobals());

it("odemkne obsah i když lze storage číst, ale zápis selže (kvóta / soukromé prohlížení)", async () => {
  vi.resetModules();
  vi.stubGlobal("sessionStorage", {
    getItem: () => null,
    setItem: () => { throw new Error("QuotaExceededError"); },
  });
  const { setLead, getLead, subscribeLead } = await import("./leadStore");
  const result = { email: "test@example.com", leadId: "test", downloadUrl: "/tahak/test.pdf", location: "hero" };
  const listener = vi.fn();
  const unsubscribe = subscribeLead(listener);
  setLead(result);
  expect(listener).toHaveBeenCalledOnce();
  expect(getLead()).toEqual(result);
  expect(getLead()).toEqual(result);
  unsubscribe();
});
