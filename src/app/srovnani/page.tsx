import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { hero, N } from "@/content";
import { openGraph } from "@/lib/seo";

const title = `${N.etfCount} ETF z NYSE: co z nich koupíte z Česka`;
export const metadata: Metadata = {
  title,
  description: hero.srovnani.sub,
  // stejný obsah jako „/“, kanonická je hlavní stránka
  alternates: { canonical: "/" },
  openGraph: openGraph({ title, description: hero.srovnani.sub, url: "/srovnani", image: "srovnani" }),
};

export default function Page() {
  return <LandingPage variant="srovnani" />;
}
