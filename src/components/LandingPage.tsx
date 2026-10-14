import { VARIANTS } from "@/content";
import type { SectionId, VariantId } from "@/content";
import { examples, etfsData } from "@/content/data";
import { AboutSection } from "./AboutSection";
import { CalcSection } from "./CalcSection";
import { CompareSection } from "./CompareSection";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { LandingState, type CalcConfig, type EtfOption } from "./LandingState";
import { StickyCta } from "./StickyCta";
import { TahakSection } from "./TahakSection";
import { ThreeThings } from "./ThreeThings";

const SECTIONS: Record<Exclude<SectionId, "hero">, () => React.JSX.Element> = {
  kalkulacka: CalcSection,
  srovnani: CompareSection,
  "tri-veci": ThreeThings,
  tahak: TahakSection,
  "o-nas": AboutSection,
  zaver: FinalCta,
};

/** Akciové UCITS ETF, se kterými kalkulačka srovnává (bez dluhopisů a zlata). */
const EXCLUDED = new Set(["IUAA", "SGLN"]);

function buildConfig(): CalcConfig {
  const seen = new Map<string, EtfOption>();
  for (const e of etfsData.etfs)
    for (const f of e.ucits_twin.funds)
      if (!EXCLUDED.has(f.id) && !seen.has(f.id))
        seen.set(f.id, { id: f.id, name: f.name, ter: f.ter_pct.value });
  const options = [...seen.values()].sort((a, b) => a.ter - b.ter || a.name.localeCompare(b.name, "cs"));
  const d = examples.default;
  return {
    options,
    avgTer: examples.inputs.avg_fund.ter_pct.value,
    avgEntry: examples.inputs.avg_fund.entry_fee_pct.value,
    defaults: { monthly: d.monthly_czk, years: d.years, gross: d.gross_pct, etfId: examples.inputs.etf.id },
  };
}

/** Sestaví stránku podle pořadí sekcí varianty (src/content/variants.ts). */
export function LandingPage({ variant }: { variant: VariantId }) {
  const order = VARIANTS[variant].sections.filter((s): s is Exclude<SectionId, "hero"> => s !== "hero");
  return (
    <LandingState config={buildConfig()} variant={variant}>
      <Hero variant={variant} />
      <main>
        {order.map((id) => {
          const S = SECTIONS[id];
          return <S key={id} />;
        })}
      </main>
      <Footer />
      <StickyCta />
    </LandingState>
  );
}
