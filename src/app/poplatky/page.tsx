import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { hero, N } from "@/content";

export const metadata: Metadata = {
  title: `Kolik stojí poplatek ${N.avgTer} ročně? Kalkulačka a tahák`,
  description: hero.poplatky.sub,
};

export default function Page() {
  return <LandingPage variant="poplatky" />;
}
