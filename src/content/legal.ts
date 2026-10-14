import { typoDeep } from "@/lib/format";
import { N } from "./data";

/** Povinná upozornění (CLAUDE.md, PLAN §14, §15). */
export const legal = typoDeep({
  disclaimerShort:
    "Nejde o investiční doporučení. Minulé výnosy nezaručují budoucí. Hodnota investice může klesat i stoupat, výnos v korunách ovlivňuje kurz USD/CZK. Výpočty jsou modelové.",
  disclaimerFull: [
    "Nejde o investiční doporučení ani investiční poradenství. Žádné ETF nedoporučujeme.",
    "Minulé výnosy nezaručují budoucí. Hodnota investice může klesat i stoupat a můžete přijít o část vložených peněz.",
    "Výnos v korunách ovlivňuje kurz USD/CZK (měnové riziko).",
    "Všechny výpočty jsou modelové a vycházejí z předpokladů uvedených u kalkulačky.",
    `Údaje o ETF jsou k ${N.dataDate}. Údaje o daních a regulaci nejsou právní ani daňové poradenství.`,
  ],
  cookie: {
    text: "Návštěvnost měříme anonymně a bez cookies. Se souhlasem si pamatujeme vaši cestu po stránce a měříme reklamy.",
    accept: "Přijmout",
    decline: "Odmítnout",
    settings: "Nastavení cookies",
    label: "Souhlas s cookies",
  },
  footer: {
    operator: "Provozovatel: [doplní zadavatel]",
    sources: "Zdroje dat",
    privacy: "Zásady ochrany údajů",
    dataNote: `Data k ${N.dataDate}`,
    sourceLabels: {
      fx: "Kurzy ČNB",
      esma: "ESMA: náklady fondů",
      law: "Zákon č. 586/1992 Sb.",
      priips: "Nařízení PRIIPs",
    },
  },
  notFound: {
    title: "Tahle stránka neexistuje",
    text: `Odkaz je asi neúplný. Srovnání ${N.etfCount} ETF z NYSE a kalkulačka poplatků jsou na hlavní stránce.`,
    back: "Na hlavní stránku",
  },
  /** Sdílení odkazu (OG obrázky vyrábí scripts/render-og.mjs) */
  share: {
    siteName: "ETF tahák",
    ogAltPoplatky: `Modelový výpočet: rozdíl ${N.diffHeadline} mezi poplatkem ${N.avgTer} a ${N.etfTer} ročně za ${N.years} let`,
    ogAltSrovnani: "VOO, SPY, VTI, SCHD: z Česka je běžně nekoupíte. Tady je, co místo nich.",
  },
});
