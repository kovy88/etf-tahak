import { afterEach, beforeEach, expect, it, vi } from "vitest";

const ph = vi.hoisted(() => ({
  init: vi.fn(), set_config: vi.fn(), capture: vi.fn(),
  get_distinct_id: vi.fn(), startSessionRecording: vi.fn(), stopSessionRecording: vi.fn(),
}));
vi.mock("posthog-js", () => ({ default: ph }));
vi.mock("./consent", () => ({ getConsent: () => null, subscribeConsent: vi.fn() }));
vi.mock("./track", () => ({ setSink: vi.fn(), track: vi.fn() }));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "test-project");
  vi.stubGlobal("window", { requestIdleCallback: (go: () => void) => go() });
  vi.stubGlobal("document", { readyState: "complete" });
  ph.get_distinct_id.mockReturnValue(undefined);
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

it("rychlý lead před lazy importem dostane stejné ID jako pozdější klientské události", async () => {
  const { getDistinctId, startAnalytics } = await import("./analytics");
  const id = getDistinctId();
  expect(id).toMatch(/^[0-9a-f-]{36}$/);
  expect(getDistinctId()).toBe(id);
  startAnalytics();
  await vi.waitFor(() => expect(ph.init).toHaveBeenCalled());
  expect(ph.init.mock.calls[0][1].bootstrap).toEqual({ distinctID: id, isIdentifiedID: false });
});

it("běžná návštěva ponechá SDK načíst existující identitu se souhlasem", async () => {
  const { getDistinctId, startAnalytics } = await import("./analytics");
  startAnalytics();
  await vi.waitFor(() => expect(ph.init).toHaveBeenCalled());
  expect(ph.init.mock.calls[0][1].bootstrap).toEqual({});
  ph.get_distinct_id.mockReturnValue("existing-consented-id");
  expect(getDistinctId()).toBe("existing-consented-id");
});
