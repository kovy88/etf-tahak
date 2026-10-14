import { hero } from "@/content";
import type { VariantId } from "@/content";
import { HeroCta } from "./HeroCta";
import { Marker } from "./Marker";
import { Stamp } from "./Stamp";
import { TickerBadge } from "./TickerBadge";
import { TickerStrip } from "./TickerStrip";

function Secondary({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="mt-1 flex h-11 items-center justify-center text-[0.9375rem] underline underline-offset-4"
    >
      {children}
    </a>
  );
}

export function Hero({ variant }: { variant: VariantId }) {
  return variant === "poplatky" ? <HeroPoplatky /> : <HeroSrovnani />;
}

function HeroPoplatky() {
  const h = hero.poplatky;
  return (
    <header>
      <TickerStrip />
      <div className="mx-auto max-w-[var(--measure)] px-[var(--gutter)] pb-3 pt-4">
        <p className="mono text-[0.75rem] leading-snug text-grey">{h.eyebrow}</p>
        <h1 className="mt-3">
          <span className="serif block text-[1.5rem] leading-[1.12] font-semibold tracking-[-0.01em]">
            {h.question}
          </span>
          <span className="relative mt-2.5 block border-y border-line py-2.5">
            <span className="mono block text-[0.75rem] text-grey">{h.proof.label}</span>
            <span className="mono block text-[2.625rem] leading-[1.05] font-semibold tracking-[-0.035em]">
              <Marker>{h.proof.value}</Marker>
            </span>
            <span className="serif absolute right-0 top-2.5 -rotate-3 text-[0.8125rem] italic leading-none text-loss">
              modelový výpočet
            </span>
          </span>
        </h1>
        <p className="mt-2 text-[0.8125rem] leading-snug text-grey">{h.proof.caption}</p>
        <p className="mt-3 text-[0.9375rem] leading-snug">{h.sub}</p>
        <div className="mt-4">
          <HeroCta label={h.cta} />
          <Secondary href="#kalkulacka">{h.secondary}</Secondary>
        </div>
      </div>
    </header>
  );
}

function HeroSrovnani() {
  const h = hero.srovnani;
  return (
    <header>
      <TickerStrip />
      <div className="mx-auto max-w-[var(--measure)] px-[var(--gutter)] pb-3 pt-4">
        <p className="mono text-[0.75rem] leading-snug text-grey">{h.eyebrow}</p>
        <h1 className="serif mt-3 text-[1.75rem] leading-[1.1] font-semibold tracking-[-0.015em]">{h.h1}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2" aria-label={h.boardCaption}>
          {h.boardTickers.map((t) => (
            <TickerBadge key={t} struck>
              {t}
            </TickerBadge>
          ))}
          <Stamp tone="loss">{h.boardCaption}</Stamp>
        </div>
        <p className="mt-3 text-[0.9375rem] leading-snug">{h.sub}</p>
        <div className="mt-4">
          <HeroCta label={h.cta} />
          <Secondary href="#srovnani">{h.secondary}</Secondary>
        </div>
      </div>
    </header>
  );
}

