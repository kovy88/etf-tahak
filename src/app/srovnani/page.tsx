import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import { hero } from "@/content";

export const metadata: Metadata = {
  title: "12 ETF z NYSE: co z nich koupíte z Česka",
  description: hero.srovnani.sub,
};

export default function Page() {
  return <LandingPage variant="srovnani" />;
}
