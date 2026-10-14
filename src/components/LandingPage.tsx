import { VARIANTS } from "@/content";
import type { SectionId, VariantId } from "@/content";
import { AboutSection } from "./AboutSection";
import { CalcSection } from "./CalcSection";
import { CompareSection } from "./CompareSection";
import { FinalCta } from "./FinalCta";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
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

/** Sestaví stránku podle pořadí sekcí varianty (src/content/variants.ts). */
export function LandingPage({ variant }: { variant: VariantId }) {
  const order = VARIANTS[variant].sections.filter((s): s is Exclude<SectionId, "hero"> => s !== "hero");
  return (
    <>
      <Hero variant={variant} />
      <main>
        {/* Lepivá lišta je ve vlastním obalu, který začíná až druhou sekcí: do F4 (IntersectionObserver)
            se tak nezobrazí přes náhled S2 pod hero. */}
        {order.slice(0, 1).map((id) => {
          const S = SECTIONS[id];
          return <S key={id} />;
        })}
        <div>
          {order.slice(1).map((id) => {
            const S = SECTIONS[id];
            return <S key={id} />;
          })}
          <StickyCta />
        </div>
      </main>
      <Footer />
    </>
  );
}
