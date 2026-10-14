import { compare } from "@/content";
import { EtfCard } from "./EtfCard";
import { LeadForm } from "./LeadForm";
import { Section } from "./Section";
import { SourceNote } from "./SourceNote";
import { FREE, LOCKED } from "@/lib/etfs";
import { pct } from "@/lib/format";
import { etfsData } from "@/content/data";

/**
 * S2/S3 Srovnávač. Statická verze: 3 karty zdarma, zbytek rozmazaný s bránou.
 * Filtry, ťuk na bránu a odemknutí bez reloadu dělá F4/F5.
 */
export function CompareSection() {
  const sp = ["VOO", "SPY", "IVV"].map((t) => etfsData.etfs.find((e) => e.ticker === t)!);
  return (
    <Section id="srovnani" title={compare.title}>
      <p className="-mt-1 mb-4 text-[0.9375rem] text-grey">{compare.intro}</p>

      <ul className="mb-2 flex flex-wrap gap-2 text-[0.875rem]" aria-label="Filtr (aktivuje se v další fázi)">
        {Object.entries(compare.filters).map(([k, v]) => (
          <li
            key={k}
            className={`inline-flex h-9 items-center border px-3 ${
              k === "all" ? "border-ink bg-ink text-paper" : "border-line text-grey"
            }`}
          >
            {v}
          </li>
        ))}
      </ul>

      <div>
        {FREE.map((e) => (
          <EtfCard key={e.ticker} etf={e} />
        ))}
      </div>

      <aside className="my-2 border-y border-ink py-4">
        <p className="serif text-[1.125rem] font-semibold">{compare.microInsight.title}</p>
        <p className="mt-1 text-[0.9375rem]">{compare.microInsight.text}</p>
        <div className="mono mt-3 grid grid-cols-3 gap-2 text-center">
          {sp.map((e) => (
            <div key={e.ticker} className="border border-line py-2">
              <div className="text-[0.8125rem] font-semibold">{e.ticker}</div>
              <div className="text-[1rem]">{pct(e.ter_pct.value, 4)}</div>
            </div>
          ))}
        </div>
      </aside>

      <div className="relative mt-4">
        <div className="pointer-events-none select-none blur-[5px]" aria-hidden="true" inert>
          {LOCKED.slice(0, 3).map((e) => (
            <EtfCard key={e.ticker} etf={e} />
          ))}
        </div>
        <div className="absolute inset-x-0 top-6 flex justify-center px-2">
          <a
            href="#srovnani-form"
            className="inline-flex h-[var(--btn-h)] items-center justify-center bg-ink px-6 text-center text-[1.0625rem] font-medium text-paper"
          >
            {compare.gate.unlock(LOCKED.length)}
          </a>
        </div>
      </div>
      <p className="mt-3 text-[0.875rem] text-grey">{compare.gate.hint}</p>
      <div className="mt-4" id="srovnani-form">
        <LeadForm location="compare_gate" />
      </div>

      <SourceNote className="mt-6">
        {compare.footnote} Kurz ČNB k 30. 9. 2026: {etfsData.meta.fx_usd_czk_end.value.toString().replace(".", ",")} Kč za USD.
      </SourceNote>
    </Section>
  );
}
