import { typoDeep } from "@/lib/format";
import { N } from "./data";

/** Hero obou variant. Slib a čísla musí odpovídat reklamám (ads/A-poplatky a ads/B-voo, copy.md). */
export const hero = typoDeep({
  poplatky: {
    eyebrow: `Kalkulačka + srovnání ${N.etfCount} ETF z NYSE · data k ${N.dataDate}`,
    h1: `Rozdíl mezi poplatkem ${N.avgTer} a ${N.etfTer} ročně? Za ${N.years} let ${N.diffHeadline}.`,
    sub: `Při ${N.monthly} měsíčně a výnosu ${N.gross} ročně před poplatky. Spočítejte si to na svých číslech a stáhněte si tahák: ${N.etfCount} ETF z newyorské burzy, co z nich koupíte z Česka a jak je danit.`,
    proof: {
      labelTemplate: "Za {years} let",
      annotation: "modelový výpočet",
      amountsLabel: "Měsíční vklad v Kč",
      captionTemplate: "rozdíl mezi průměrným akciovým fondem v EU ({avg} ročně) a vybraným ETF ({etf} ročně)",
      label: `Za ${N.years} let`,
      value: N.diffHeadline,
      caption: `rozdíl mezi průměrným akciovým fondem v EU (${N.avgTer} ročně) a vybraným ETF (${N.etfTer} ročně)`,
    },
    question: `Rozdíl mezi poplatkem ${N.avgTer} a ${N.etfTer} ročně?`,
    cta: "Chci tahák zdarma",
    secondary: "Nejdřív si to spočítám ↓",
    thumbCaption: `Tahák: ${N.etfCount} ETF, zdroje u každého čísla`,
    alternatives: [
      `${N.diffHeadline} za ${N.years} let. Tolik může stát rozdíl mezi ${N.avgTer} a ${N.etfTer} poplatku ročně.`,
      `Poplatek ${N.avgTer} ročně není drobnost. Při ${N.monthly} měsíčně je to za ${N.years} let ${N.diffHeadline}.`,
      `Kolik vás stojí poplatek ${N.avgTer} ročně? Za ${N.years} let ${N.diffHeadline}.`,
    ],
    recommended: "h1",
  },
  srovnani: {
    eyebrow: `Srovnání ${N.etfCount} ETF z NYSE pro české investory · data k ${N.dataDate}`,
    h1: "VOO, SPY, VTI. Z Česka je běžně nekoupíte. Tady je, co místo nich.",
    sub: `U ${N.exactTwins} z ${N.etfCount} ETF existuje evropské dvojče se stejným indexem, u dalších ${N.similarTwins} aspoň podobná alternativa. S poplatky, výnosy v korunách a českými daněmi.`,
    boardCaption: "z ČR běžně nekoupíte",
    boardTickers: ["VOO", "SPY", "VTI", "SCHD"],
    cta: "Chci tahák zdarma",
    secondary: "Nejdřív srovnání ↓",
    thumbCaption: `Tahák: ${N.etfCount} ETF, zdroje u každého čísla`,
    alternatives: [
      "VOO u českého brokera většinou nekoupíte. Tady je, co jde koupit místo něj.",
      `${N.etfCount} ETF z NYSE. Které z nich koupíte z Česka a čím je nahradit.`,
      "Americké ETF z Česka často nekoupíte. Evropské alternativy najdete tady.",
    ],
    recommended: "h1",
  },
});
