"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { scenario, type Scenario } from "@/lib/calc";
import { getLead, setLead, subscribeLead, type LeadResult } from "@/lib/leadStore";
import { captureAttribution } from "@/lib/attribution";
import { track } from "@/lib/track";

export interface EtfOption {
  id: string;
  name: string;
  /** TER v procentech (0.03 = 0,03 %) */
  ter: number;
}

export interface CalcConfig {
  options: EtfOption[];
  avgTer: number;
  avgEntry: number;
  defaults: { monthly: number; years: number; gross: number; etfId: string };
}

export interface CalcState {
  monthly: number;
  years: number;
  /** hrubý výnos v procentech (6 = 6 %) */
  gross: number;
  etfId: string;
}

export interface CalcResult {
  etf: Scenario;
  avg: Scenario;
  difference: number;
  etfTer: number;
  etfName: string;
}

interface Ctx {
  config: CalcConfig;
  calc: CalcState;
  result: CalcResult;
  setCalc: (patch: Partial<CalcState>) => void;
  unlocked: boolean;
  leadDone: boolean;
  /** Voláno po odeslání formuláře (i při chybě serveru, PLAN §6). */
  markLead: (r: LeadResult) => void;
  lead: LeadResult | null;
}

const LandingCtx = createContext<Ctx | null>(null);

export function useLanding(): Ctx {
  const c = useContext(LandingCtx);
  if (!c) throw new Error("useLanding mimo LandingState");
  return c;
}

export function LandingState({
  config,
  variant,
  children,
}: {
  config: CalcConfig;
  variant: string;
  children: React.ReactNode;
}) {
  const [calc, setCalcState] = useState<CalcState>(config.defaults);
  const lead = useSyncExternalStore(subscribeLead, getLead, () => null);
  const touched = useRef(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(calc);

  useEffect(() => {
    document.documentElement.dataset.variant = variant;
    captureAttribution(); // first-touch UTM, referrer a vstupní stránka (ukládají se k leadu)
  }, [variant]);

  const setCalc = useCallback(
    (patch: Partial<CalcState>) => {
      setCalcState((prev) => {
        const next = { ...prev, ...patch };
        latest.current = next;
        return next;
      });
      if (!touched.current) {
        touched.current = true;
        track("calc_interacted");
      }
      if (debounce.current) clearTimeout(debounce.current);
      debounce.current = setTimeout(() => {
        const s = latest.current;
        track("calc_changed", {
          monthly: s.monthly,
          years: s.years,
          return: s.gross,
          compare_to: s.etfId,
        });
      }, 1000);
    },
    [],
  );

  const markLead = useCallback((r: LeadResult) => setLead(r), []);

  const result = useMemo<CalcResult>(() => {
    const etf = config.options.find((o) => o.id === calc.etfId) ?? config.options[0];
    const g = calc.gross / 100;
    const a = scenario(calc.monthly, calc.years, g, etf.ter / 100);
    const b = scenario(calc.monthly, calc.years, g, config.avgTer / 100, config.avgEntry / 100);
    return { etf: a, avg: b, difference: a.final - b.final, etfTer: etf.ter, etfName: etf.name };
  }, [calc, config]);

  const value = useMemo<Ctx>(
    () => ({
      config,
      calc,
      result,
      setCalc,
      unlocked: lead !== null,
      leadDone: lead !== null,
      markLead,
      lead,
    }),
    [config, calc, result, setCalc, markLead, lead],
  );

  return <LandingCtx.Provider value={value}>{children}</LandingCtx.Provider>;
}
