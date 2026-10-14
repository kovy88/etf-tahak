import { compare } from "@/content";
import { etfsData } from "@/content/data";
import { ETFS, FREE_TICKERS } from "@/lib/etfs";
import { pct } from "@/lib/format";
import { CompareList } from "./CompareList";
import { EtfCard } from "./EtfCard";
import { Section } from "./Section";
import { SourceNote } from "./SourceNote";

/** S2/S3 Srovnávač. Karty se renderují na serveru, filtry a brána jsou v CompareList. */
export function CompareSection() {
  const sp = ["VOO", "SPY", "IVV"].map((t) => etfsData.etfs.find((e) => e.ticker === t)!);
  const cards = ETFS.map((e) => ({
    ticker: e.ticker,
    category: e.category,
    free: (FREE_TICKERS as readonly string[]).includes(e.ticker),
    node: <EtfCard etf={e} />,
  }));
  const unlockLabels: Record<number, string> = Object.fromEntries(
    Array.from({ length: ETFS.length + 1 }, (_, n) => [n, compare.gate.unlock(n)]),
  );
  const insight = (
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
  );
  return (
    <Section id="srovnani" title={compare.title}>
      <p className="-mt-1 mb-4 text-[0.9375rem] text-grey">{compare.intro}</p>
      <CompareList
        cards={cards}
        filters={compare.filters}
        filterAria={compare.gate.filterAria}
        unlockLabels={unlockLabels}
        hint={compare.gate.hint}
        empty={compare.gate.empty}
        insight={insight}
      />
      <SourceNote className="mt-6">
        {compare.footnote} Kurz ČNB k 30. 9. 2026: {etfsData.meta.fx_usd_czk_end.value.toString().replace(".", ",")} Kč za USD.
      </SourceNote>
    </Section>
  );
}
