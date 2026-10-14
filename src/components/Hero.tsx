import { hero } from "@/content";
import type { VariantId } from "@/content";
import { HeroAmounts, HeroNumber } from "./HeroProof";
import { Stamp } from "./Stamp";
import { SheetButton } from "./SheetButton";
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
          <HeroNumber labelTemplate={h.proof.labelTemplate} annotation={h.proof.annotation} />
        </h1>
        <HeroAmounts
          captionTemplate={h.proof.captionTemplate}
          amountsLabel={h.proof.amountsLabel}
          amounts={[1000, 3000, 5000, 10000].map((v) => ({ value: v }))}
        />
        <p className="mt-3 text-[0.9375rem] leading-snug">{h.sub}</p>
        <div className="mt-4">
          <SheetButton label={h.cta} location="hero" />
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
          <SheetButton label={h.cta} location="hero" />
          <Secondary href="#srovnani">{h.secondary}</Secondary>
        </div>
      </div>
    </header>
  );
}

