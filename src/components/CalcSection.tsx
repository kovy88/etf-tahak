import { calc, N } from "@/content";
import { examples } from "@/content/data";
import { czk, pct } from "@/lib/format";
import { LeadForm } from "./LeadForm";
import { Marker } from "./Marker";
import { Section } from "./Section";
import { SourceNote } from "./SourceNote";

/**
 * S2/S3 Kalkulačka. Zatím statická se zdrojovými hodnotami (výchozí stav).
 * Interaktivitu, přepočet a graf dělá F4.
 */
export function CalcSection() {
  const d = examples.default;
  const etf = examples.inputs.etf;
  const max = d.etf_final_czk;
  const w = (v: number) => `${Math.round((v / max) * 100)}%`;
  const chip = (label: string, on: boolean) => (
    <span
      key={label}
      className={`mono inline-flex h-9 items-center border px-3 text-[0.875rem] ${
        on ? "border-ink bg-ink text-paper" : "border-line text-grey"
      }`}
    >
      {label}
    </span>
  );
  return (
    <Section id="kalkulacka" title={calc.title}>
      <dl className="grid gap-4 text-[0.9375rem]">
        <div>
          <dt className="mb-1.5 font-medium">{calc.labels.monthly}</dt>
          <dd className="flex flex-wrap gap-2">
            {examples.by_amount.map((a) => chip(czk(a.monthly_czk), a.monthly_czk === d.monthly_czk))}
          </dd>
        </div>
        <div>
          <dt className="mb-1.5 font-medium">{calc.labels.years}</dt>
          <dd className="flex flex-wrap gap-2">
            {examples.by_horizon.map((a) => chip(`${a.years} ${calc.labels.yearsUnit}`, a.years === d.years))}
          </dd>
        </div>
        <div>
          <dt className="mb-1.5 font-medium">
            {calc.labels.gross} <span className="font-normal text-grey">({calc.labels.grossTag})</span>
          </dt>
          <dd className="flex flex-wrap gap-2">
            {examples.by_gross.map((a) => chip(pct(a.gross_pct, 0), a.gross_pct === d.gross_pct))}
          </dd>
        </div>
        <div>
          <dt className="mb-1.5 font-medium">{calc.labels.compare}</dt>
          <dd className="text-grey">
            {calc.labels.etf}: {etf.name} ({N.etfTer}) vs. {calc.labels.avgFund} ({N.avgTer})
          </dd>
        </div>
      </dl>

      <div className="mt-6 border-y border-ink py-4" aria-live="polite">
        <p className="text-[0.9375rem]">{calc.result.difference(d.years)}</p>
        <p className="mono mt-1 text-[2.25rem] leading-none font-semibold tracking-[-0.03em]">
          <Marker>{N.diffHeadline}</Marker>
        </p>
        <div className="mt-4 grid gap-2.5 text-[0.875rem]">
          <div>
            <div className="mb-1 flex justify-between">
              <span>{calc.result.etfFinal}</span>
              <span className="mono text-gain-text">{N.etfFinal}</span>
            </div>
            <div className="h-2 bg-line">
              <div className="h-2 bg-gain" style={{ width: w(d.etf_final_czk) }} />
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between">
              <span>{calc.result.avgFinal}</span>
              <span className="mono text-loss">{N.avgFinal}</span>
            </div>
            <div className="h-2 bg-line">
              <div className="h-2 bg-loss" style={{ width: w(d.avg_fund_final_czk) }} />
            </div>
          </div>
        </div>
        <p className="mt-3 text-[0.875rem] text-grey">
          {calc.result.deposited}: <span className="mono">{N.deposited}</span>. {calc.result.feesPaid}{" "}
          <span className="mono text-loss">{N.feeCostAvg}</span> (průměrný fond) a{" "}
          <span className="mono">{N.feeCostEtf}</span> (ETF).
        </p>
      </div>

      <SourceNote className="mt-3">
        {calc.assumptionNote} {calc.avgFundNote} {calc.methodNote}
      </SourceNote>

      <div className="mt-6">
        <LeadForm location="calc" />
      </div>
    </Section>
  );
}
