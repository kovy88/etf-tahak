import { compare } from "@/content";
import { dateCs, pct, usdShort } from "@/lib/format";
import { bestTwin, listingTicker, listingVenue, type Etf } from "@/lib/etfs";
import { SourceNote } from "./SourceNote";
import { Stamp } from "./Stamp";

function Stat({ label, value, unverified }: { label: string; value: string; unverified?: boolean }) {
  return (
    <div>
      <dt className="text-[0.75rem] leading-tight text-grey">{label}</dt>
      <dd className="mono text-[0.9375rem] font-medium">
        {value}
        {unverified ? <span className="text-loss" title={compare.card.unverified}>*</span> : null}
      </dd>
    </div>
  );
}

export function EtfCard({ etf }: { etf: Etf }) {
  const twin = bestTwin(etf);
  const m = etf.ucits_twin.match;
  const c = compare.card;
  const ret = etf.returns_czk_pct["5y"].value;
  return (
    <article className="border-t border-line py-5 first:border-t-0">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="mono text-[1.375rem] leading-none font-semibold">{etf.ticker}</p>
          <p className="mt-1 text-[0.875rem] leading-snug">{etf.name}</p>
          <p className="text-[0.75rem] text-grey">{etf.issuer}</p>
        </div>
        <Stamp tone="loss" className="shrink-0">
          {c.notBuyable}
        </Stamp>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-3">
        <Stat label={c.ter} value={pct(etf.ter_pct.value, 4)} />
        <Stat label={c.aum} value={usdShort(etf.aum_usd.value, false)} />
        <Stat
          label={c.yield}
          value={pct(etf.dividend_yield_pct.value)}
          unverified={etf.dividend_yield_pct.verified === false}
        />
      </dl>

      <p className="mt-3 text-[0.8125rem] text-grey">{c.ret5Usd}</p>
      <p className="mono text-[0.9375rem]">
        {pct(etf.return_5y_pct.value)} <span className="text-grey">v USD</span>
        <span className="text-grey"> → </span>
        <span className={`font-semibold ${ret >= 0 ? "text-gain-text" : "text-loss"}`}>{pct(ret)}</span>{" "}
        <span className="text-grey">v Kč</span>
      </p>

      <div className="mt-3 flex items-start gap-2.5 bg-paper-deep px-3 py-2.5 text-[0.875rem] leading-snug">
        {m === "none" || !twin ? (
          <p className="text-grey">{c.twinNone}</p>
        ) : (
          <>
            {m === "exact" ? (
              <Stamp tone="gain" className="shrink-0">
                dvojče
              </Stamp>
            ) : null}
            <p>
              <span className="text-grey">{m === "exact" ? c.twinLabel : c.twinSimilar}: </span>
              <span className="mono font-semibold">{listingTicker(twin)}</span>{" "}
              <span className="text-grey">
                ({listingVenue(twin)}) · TER <span className="mono text-ink">{pct(twin.ter_pct.value)}</span>
                {m === "similar" ? `, ${c.twinSimilarNote}` : ""}
              </span>
            </p>
          </>
        )}
      </div>

      <SourceNote className="mt-3">
        Zdroj:{" "}
        <a href={etf.ter_pct.source ?? "#"} target="_blank" rel="noopener noreferrer" className="underline">
          {etf.issuer}
        </a>
        , údaje k {dateCs(etf.return_5y_pct.as_of)}.
      </SourceNote>
    </article>
  );
}
