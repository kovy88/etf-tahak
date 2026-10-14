"use client";

import { useState } from "react";
import { NBSP, czk, czkRounded, pct } from "@/lib/format";
import { CalcChart } from "./CalcChart";
import { useLanding } from "./LandingState";
import { Marker } from "./Marker";

export interface CalcLabels {
  monthly: string;
  monthlyCustom: string;
  monthlyCustomUnit: string;
  years: string;
  yearsUnit: string;
  gross: string;
  grossTag: string;
  compare: string;
  etf: string;
  avgFund: string;
  differencePrefix: string;
  deposited: string;
  feesPaid: string;
  etfFinal: string;
  avgFinal: string;
  feesAvgSuffix: string;
  feesEtfSuffix: string;
  and: string;
  chartLegend: { etf: string; avg: string; deposited: string; years: string; unitMil: string; unitTis: string; aria: (years: number, etf: string, avg: string, dep: string) => string };
}

const AMOUNTS = [1000, 3000, 5000, 10000];
const YEARS = [10, 20, 25, 30];
const GROSS = [4, 6, 8];

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`mono inline-flex h-11 items-center border px-3 text-[0.875rem] ${
        on ? "border-ink bg-ink text-paper" : "border-line text-grey hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

/** Interaktivní kalkulačka: okamžitý přepočet, bez tlačítka „Spočítat“. */
export function CalcPanel({ labels }: { labels: CalcLabels }) {
  const { calc, result, config, setCalc } = useLanding();
  const [custom, setCustom] = useState("");
  const max = result.etf.final;
  const w = (v: number) => `${Math.max(4, Math.round((v / max) * 100))}%`;

  const onCustom = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 6);
    setCustom(digits);
    const n = Number(digits);
    if (n >= 100) setCalc({ monthly: n });
  };

  return (
    <>
      <div className="grid gap-4 text-[0.9375rem]">
        <div role="group" aria-labelledby="calc-monthly">
          <p id="calc-monthly" className="mb-1.5 font-medium">{labels.monthly}</p>
          <div className="flex flex-wrap gap-2">
            {AMOUNTS.map((a) => (
              <Chip
                key={a}
                on={calc.monthly === a && custom === ""}
                onClick={() => {
                  setCustom("");
                  setCalc({ monthly: a });
                }}
              >
                {czk(a)}
              </Chip>
            ))}
          </div>
          <label className="mt-2 flex items-center gap-2 text-[0.875rem] text-grey">
            <span>{labels.monthlyCustom}</span>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={custom}
              onChange={(e) => onCustom(e.target.value)}
              placeholder="2 500"
              aria-label={`${labels.monthlyCustom} (${labels.monthlyCustomUnit})`}
              className={`mono h-11 w-28 border bg-white/60 px-3 text-[0.9375rem] text-ink ${custom ? "border-ink" : "border-line"}`}
            />
            <span>{labels.monthlyCustomUnit}</span>
          </label>
        </div>

        <div role="group" aria-labelledby="calc-years">
          <p id="calc-years" className="mb-1.5 font-medium">{labels.years}</p>
          <div className="flex flex-wrap gap-2">
            {YEARS.map((y) => (
              <Chip key={y} on={calc.years === y} onClick={() => setCalc({ years: y })}>
                {`${y}${NBSP}${labels.yearsUnit}`}
              </Chip>
            ))}
          </div>
        </div>

        <div role="group" aria-labelledby="calc-gross">
          <p id="calc-gross" className="mb-1.5 font-medium">
            {labels.gross} <span className="font-normal text-grey">({labels.grossTag})</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {GROSS.map((g) => (
              <Chip key={g} on={calc.gross === g} onClick={() => setCalc({ gross: g })}>
                {pct(g, 0)}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="calc-etf" className="mb-1.5 block font-medium">
            {labels.compare}: {labels.etf}
          </label>
          <select
            id="calc-etf"
            value={calc.etfId}
            onChange={(e) => setCalc({ etfId: e.target.value })}
            className="h-12 w-full border border-ink bg-white/60 px-3 text-[0.9375rem]"
          >
            {config.options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({pct(o.ter, 4)})
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[0.875rem] text-grey">
            vs. {labels.avgFund} ({pct(config.avgTer)})
          </p>
        </div>
      </div>

      <div className="mt-6 border-y border-ink py-4" aria-live="polite">
        <p className="text-[0.9375rem]">
          {`${labels.differencePrefix} ${calc.years}${NBSP}${labels.yearsUnit}`}
        </p>
        <p className="mono mt-1 text-[2.25rem] leading-none font-semibold tracking-[-0.03em]">
          <Marker>{czkRounded(result.difference)}</Marker>
        </p>
        <div className="mt-4 grid gap-2.5 text-[0.875rem]">
          <div>
            <div className="mb-1 flex justify-between">
              <span>{labels.etfFinal}</span>
              <span className="mono text-gain-text">{czkRounded(result.etf.final)}</span>
            </div>
            <div className="h-2 bg-line">
              <div className="h-2 bg-gain transition-[width] duration-300 motion-reduce:transition-none" style={{ width: w(result.etf.final) }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between">
              <span>{labels.avgFinal}</span>
              <span className="mono text-loss">{czkRounded(result.avg.final)}</span>
            </div>
            <div className="h-2 bg-line">
              <div className="h-2 bg-loss transition-[width] duration-300 motion-reduce:transition-none" style={{ width: w(result.avg.final) }} />
            </div>
          </div>
        </div>
        <p className="mt-3 text-[0.875rem] text-grey">
          {labels.deposited}: <span className="mono">{czk(result.etf.deposited)}</span>. {labels.feesPaid}{" "}
          <span className="mono text-loss">{czkRounded(result.avg.feeCost)}</span> {labels.feesAvgSuffix} {labels.and}
          {NBSP}
          <span className="mono">{czkRounded(result.etf.feeCost)}</span> {labels.feesEtfSuffix}.
        </p>
      </div>
      <CalcChart legend={labels.chartLegend} />
    </>
  );
}
