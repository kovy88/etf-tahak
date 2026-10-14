"use client";

import { series } from "@/lib/calc";
import { NBSP, czk, num } from "@/lib/format";
import { useLanding } from "./LandingState";

const W = 320;
const H = 176;
const PAD = { l: 34, r: 6, t: 16, b: 20 };

function niceStep(max: number): number {
  const raw = max / 4;
  const p = 10 ** Math.floor(Math.log10(raw));
  for (const m of [1, 2, 5, 10]) if (raw <= m * p) return m * p;
  return 10 * p;
}

/** Dvě čáry (ETF, průměrný fond) a vklady. Vlastní SVG, bez knihovny. */
export function CalcChart({ legend }: { legend: { etf: string; avg: string; deposited: string; years: string; unitMil: string; unitTis: string; ariaTemplate: string } }) {
  const { calc, result, config } = useLanding();
  const g = calc.gross / 100;
  const etf = series(calc.monthly, calc.years, g, result.etfTer / 100);
  const avg = series(calc.monthly, calc.years, g, config.avgTer / 100, config.avgEntry / 100);
  const dep = Array.from({ length: calc.years + 1 }, (_, y) => calc.monthly * 12 * y);
  const max = Math.max(...etf, ...avg);
  const step = niceStep(max);
  const top = Math.ceil(max / step) * step;
  const x = (i: number) => PAD.l + (i / calc.years) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - v / top) * (H - PAD.t - PAD.b);
  const path = (s: number[]) => s.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step);
  const unitMil = top >= 1e6;
  const label = (v: number) => (unitMil ? num(v / 1e6, step < 1e6 ? 1 : 0) : num(v / 1e3, 0));
  const xTicks = [0, Math.round(calc.years / 2), calc.years];
  return (
    <figure className="mt-4">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={legend.ariaTemplate
          .replace("{years}", String(calc.years))
          .replace("{etf}", czk(Math.round(etf.at(-1)! / 1000) * 1000))
          .replace("{avg}", czk(Math.round(avg.at(-1)! / 1000) * 1000))
          .replace("{dep}", czk(dep.at(-1)!))}
      >
        <text x={0} y={8} fontSize="9" fill="var(--grey)" className="mono">
          {unitMil ? legend.unitMil : legend.unitTis}
        </text>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--line)" strokeWidth="1" />
            <text x={PAD.l - 4} y={y(t) + 3} textAnchor="end" fontSize="9" fill="var(--grey)" className="mono">
              {label(t)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={H - 6} textAnchor={t === 0 ? "start" : t === calc.years ? "end" : "middle"} fontSize="9" fill="var(--grey)" className="mono">
            {t === 0 ? "0" : `${t}${NBSP}${legend.years}`}
          </text>
        ))}
        <path className="chart-line" d={path(dep)} fill="none" stroke="var(--grey)" strokeWidth="1.5" strokeDasharray="4 3" />
        <path className="chart-line" d={path(avg)} fill="none" stroke="var(--loss)" strokeWidth="2.25" />
        <path className="chart-line" d={path(etf)} fill="none" stroke="var(--gain)" strokeWidth="2.25" />
      </svg>
      <figcaption className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-grey">
        <span><i className="mr-1.5 inline-block h-[3px] w-4 bg-gain align-middle" />{legend.etf}</span>
        <span><i className="mr-1.5 inline-block h-[3px] w-4 bg-loss align-middle" />{legend.avg}</span>
        <span><i className="mr-1.5 inline-block h-0 w-4 border-t-2 border-dashed border-grey align-middle" />{legend.deposited}</span>
      </figcaption>
    </figure>
  );
}
