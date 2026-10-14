import Image from "next/image";
import { hero } from "@/content";
import type { VariantId } from "@/content";
import { PDF_PREVIEW_SIZE, PDF_PREVIEWS } from "@/lib/leadPdf";
import { HeroAmounts, HeroNumber, HeroSub } from "./HeroProof";
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

/** Miniatura skutečné strany taháku vedle věty o nabídce: návštěvník vidí, co dostane, ještě před formulářem. */
function Thumb({ alt }: { alt: string }) {
  const { width, height } = PDF_PREVIEW_SIZE;
  return (
    <Image
      src={PDF_PREVIEWS.compare}
      alt={alt}
      width={width}
      height={height}
      sizes="56px"
      className="float-right mb-1 ml-3 mt-1 h-auto w-14 rotate-2 border border-line bg-paper shadow-[0_1px_0_var(--line)]"
    />
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
        <div className="mt-3 flow-root">
          <Thumb alt={h.thumbCaption} />
          <HeroSub template={h.subTemplate} />
        </div>
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
        </div>
        <div className="mt-3 flow-root">
          <Thumb alt={h.thumbCaption} />
          <p className="text-[0.9375rem] leading-snug">{h.sub}</p>
        </div>
        <div className="mt-4">
          <SheetButton label={h.cta} location="hero" />
          <Secondary href="#srovnani">{h.secondary}</Secondary>
        </div>
      </div>
    </header>
  );
}

