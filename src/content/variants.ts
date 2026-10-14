export type VariantId = "poplatky" | "srovnani";
export type SectionId =
  | "hero"
  | "kalkulacka"
  | "srovnani"
  | "tri-veci"
  | "tahak"
  | "o-nas"
  | "zaver";

export interface Variant {
  id: VariantId;
  /** Hlavní route varianty. "/" je alias pro srovnani. */
  path: string;
  /** Pořadí sekcí (PLAN §8) */
  sections: SectionId[];
  /** Reklama, která na variantu vede (UTM utm_content předpona) */
  adContentPrefix: string;
}

export const VARIANTS: Record<VariantId, Variant> = {
  poplatky: {
    id: "poplatky",
    path: "/poplatky",
    sections: ["hero", "kalkulacka", "srovnani", "tri-veci", "tahak", "o-nas", "zaver"],
    adContentPrefix: "a_poplatky",
  },
  srovnani: {
    id: "srovnani",
    path: "/srovnani",
    sections: ["hero", "srovnani", "kalkulacka", "tri-veci", "tahak", "o-nas", "zaver"],
    adContentPrefix: "b_voo",
  },
};

export const DEFAULT_VARIANT: VariantId = "srovnani";
