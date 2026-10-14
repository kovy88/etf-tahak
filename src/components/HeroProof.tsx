"use client";

import { czkRounded, num, pct } from "@/lib/format";
import { Marker } from "./Marker";
import { useLanding } from "./LandingState";

/** Číslo v hero (uvnitř h1) reaguje na stav kalkulačky. */
export function HeroNumber({ labelTemplate, annotation }: { labelTemplate: string; annotation: string }) {
  const { calc, result } = useLanding();
  const label = labelTemplate.replace("{years}", String(calc.years));
  return (
    <span className="relative mt-2.5 block border-y border-line py-2.5">
      <span className="mono block text-[0.75rem] text-grey">{label}</span>
      <span
        className="mono block text-[2.625rem] leading-[1.05] font-semibold tracking-[-0.035em]"
        aria-live="polite"
      >
        <Marker>{czkRounded(result.difference)}</Marker>
      </span>
      <span className="serif absolute right-0 top-2.5 -rotate-3 text-[0.8125rem] italic leading-none text-loss">
        {annotation}
      </span>
    </span>
  );
}

/** Popisek pod číslem a volba měsíční částky přímo v první obrazovce. */
export function HeroAmounts({
  captionTemplate,
  amounts,
  amountsLabel,
}: {
  captionTemplate: string;
  amounts: { value: number }[];
  amountsLabel: string;
}) {
  const { calc, result, config, setCalc } = useLanding();
  const caption = captionTemplate.replace("{avg}", pct(config.avgTer)).replace("{etf}", pct(result.etfTer));
  return (
    <>
      <p className="mt-2 text-[0.8125rem] leading-snug text-grey">{caption}</p>
      <p id="hero-amounts" className="mono mt-3 text-[0.75rem] text-grey">
        {amountsLabel}
      </p>
      <div className="mt-1.5 flex flex-wrap gap-2" role="group" aria-labelledby="hero-amounts">
        {amounts.map((a) => (
          <button
            key={a.value}
            type="button"
            aria-pressed={calc.monthly === a.value}
            onClick={() => setCalc({ monthly: a.value })}
            className={`mono inline-flex h-11 min-w-[4.25rem] items-center justify-center border px-2.5 text-[0.875rem] ${
              calc.monthly === a.value ? "border-ink bg-ink text-paper" : "border-line text-grey"
            }`}
          >
            {num(a.value)}
          </button>
        ))}
      </div>
    </>
  );
}
