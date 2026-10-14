import type { Metadata } from "next";
import { N } from "@/content";
import { legal } from "@/content/legal";

type Og = NonNullable<Metadata["openGraph"]>;

const OG_IMAGES = {
  poplatky: { url: "/og/poplatky.png", width: 1200, height: 630, alt: legal.share.ogAltPoplatky },
  srovnani: { url: "/og/srovnani.png", width: 1200, height: 630, alt: legal.share.ogAltSrovnani },
};

/** Open Graph pro sdílení. Next.js openGraph z layoutu nedědí po polích, proto ho skládáme celý. */
export function openGraph(o: { title: string; description: string; url: string; image: keyof typeof OG_IMAGES }): Og {
  return {
    type: "website",
    locale: "cs_CZ",
    siteName: legal.share.siteName,
    title: o.title,
    description: o.description,
    url: o.url,
    images: [OG_IMAGES[o.image]],
  };
}

export const SITE_TITLE = `ETF tahák: ${N.etfCount} ETF z NYSE pro české investory`;
export const SITE_DESCRIPTION = `Srovnání ${N.etfCount} ETF z NYSE, jejich evropských alternativ, poplatků a českých daní. Zdroje u každého čísla.`;
