import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { hero, N } from "@/content";
import { openGraph } from "@/lib/seo";

const title = `Kolik stojí poplatek ${N.avgTer} ročně? Kalkulačka a tahák`;
export const metadata: Metadata = {
  title,
  description: hero.poplatky.sub,
  openGraph: openGraph({ title, description: hero.poplatky.sub, url: "/poplatky", image: "poplatky" }),
};

export default function Page() {
  return <LandingPage variant="poplatky" />;
}
