import { typoDeep } from "@/lib/format";
import { N } from "./data";

export const calc = typoDeep({
  id: "kalkulacka",
  title: "Kolik stojí poplatky na vašich číslech",
  labels: {
    monthly: "Měsíční vklad",
    monthlyCustom: "Jiná částka",
    years: "Horizont",
    yearsUnit: "let",
    gross: "Hrubý výnos ročně",
    grossTag: "předpoklad, ne předpověď",
    compare: "Srovnat",
    etf: "ETF",
    avgFund: "Průměrný akciový fond v EU",
  },
  result: {
    difference: (years: number) => `Rozdíl za ${years} let`,
    deposited: "Vložíte celkem",
    feesPaid: "Poplatky vás vyjdou na",
    etfFinal: "S ETF",
    avgFinal: "S průměrným fondem",
  },
  assumptionNote: `Modelový výpočet. Výnos ${N.gross} ročně před poplatky je předpoklad, ne předpověď. Skutečný výnos se bude lišit a může být záporný.`,
  avgFundNote: `Průměrný akciový fond v EU: průběžné náklady ${N.avgTer} ročně (ESMA, data za rok 2024). Vstupní poplatek jsme nezapočítali, rozdíl je proto spíš podhodnocený. Neplatí pro konkrétní fond.`,
  methodNote:
    "Vklad na začátku měsíce, čistý výnos = hrubý výnos minus roční náklady fondu, měsíční připisování.",
  sourceLabel: "Zdroje a metoda",
});

export const compare = typoDeep({
  id: "srovnani",
  title: `${N.etfCount} nejpopulárnějších ETF z NYSE`,
  intro: "Co z nich koupíte jako drobný investor z Česka a čím je nahradit.",
  filters: {
    all: "Vše",
    sp500: "S&P 500",
    usa: "Celé USA",
    world: "Svět",
    dividend: "Dividendy",
    bonds_gold: "Dluhopisy a zlato",
  },
  card: {
    ter: "Roční náklady (TER)",
    aum: "Velikost fondu",
    yield: "Dividendový výnos",
    ret5Usd: "Výnos za 5 let p. a. v USD",
    ret5Czk: "Výnos za 5 let p. a. v Kč",
    buyable: "Z ČR jako retail",
    notBuyable: "nekoupíte",
    twinLabel: "Evropské dvojče",
    twinSimilar: "Podobná alternativa",
    twinNone: "Evropské dvojče jsme neověřili",
    twinSimilarNote: "jiný index, nejde o dvojče",
    unverified: "neověřeno",
  },
  microInsight: {
    title: "Stejný index, jiný poplatek",
    text: `VOO, SPY a IVV sledují stejný index S&P 500. Roční náklady: ${N.sp500Ters.VOO}, ${N.sp500Ters.SPY}, ${N.sp500Ters.IVV}.`,
  },
  gate: {
    unlock: (n: number) => `Odemknout zbylých ${n} + dvojčata`,
    hint: "Zbytek srovnání je rozmazaný. Stačí e-mail.",
  },
  footnote: `Výnosy: NAV, v USD podle emitenta k 30. 9. 2026, v korunách přepočtené kurzem ČNB. Minulé výnosy nezaručují budoucí.`,
});

export const threeThings = typoDeep({
  id: "tri-veci",
  title: "3 věci, které vám americká videa neřeknou",
  items: [
    {
      id: "priips",
      heading: "VOO si u běžného brokera v EU nekoupíte",
      text: "Americké ETF nemají klíčový informační dokument (KID), který evropské nařízení PRIIPs vyžaduje pro drobné investory. Brokeři je proto obvykle blokují. Na CFD to neplatí, ale to není ETF.",
      more: "Podrobně v taháku",
      sourceHint: "Zdroj: nařízení EU č. 1286/2014, Interactive Brokers",
    },
    {
      id: "kurz",
      heading: "Výnos v dolarech není výnos v korunách",
      text: `VOO dosáhl za 10 let průměrného výnosu ${N.vooUsd10} ročně v dolarech. V korunách to bylo ${N.vooCzk10} ročně, protože se mezitím změnil kurz. Přepočet je náš a modelový.`,
      more: "Podrobně v taháku",
      sourceHint: "Zdroj: Vanguard, kurzy ČNB",
    },
    {
      id: "dane",
      heading: "V Česku se dá výnos osvobodit od daně",
      text: `Příjem z prodeje cenných papírů je osvobozený, když je držíte déle než ${N.timeTestYears} roky. Nebo když úhrn příjmů za rok nepřesáhne ${N.valueTestCzk}. Podmínek je víc, podrobně je rozebíráme v taháku.`,
      more: "Podrobně v taháku",
      sourceHint: "Zdroj: zákon č. 586/1992 Sb., § 4 odst. 1",
    },
  ],
});

export const tahak = (emailEnabled: boolean) =>
  typoDeep({
    id: "tahak",
    title: "Co je v taháku",
    updated: `Aktualizováno 10/2026. Zdroje u každého čísla.`,
    items: [
      `Srovnání ${N.etfCount} ETF z NYSE: poplatek, velikost, dividenda, výnos za 1, 5 a 10 let v USD i v Kč`,
      "Které z nich koupíte z Česka a jejich evropská dvojče: ticker, ISIN, poplatek, akumulační nebo distribuční",
      `Daně v ČR: časový test ${N.timeTestYears} roky, limit ${N.valueTestCzk}, kdy podat přiznání`,
      "Na co se dívat při výběru brokera a kolik stojí převod měny",
      "Prvních 5 kroků jako checklist",
      ...(emailEnabled ? ["Váš osobní výpočet z kalkulačky"] : []),
    ],
    cta: "Chci tahák zdarma",
  });

export const about = typoDeep({
  id: "o-nas",
  dataHeading: "Odkud jsou data",
  dataText: `Poplatky, velikosti a výnosy ETF jsou ze stránek emitentů (Vanguard, iShares, State Street, Schwab) k ${N.dataDate}. Kurzy z ČNB, náklady fondů z ESMA, daně ze zákona. U každého čísla najdete zdroj a datum.`,
});

export const finalCta = (emailEnabled: boolean) =>
  typoDeep({
    id: "zaver",
    title: "Tahák je zdarma",
    text: emailEnabled
      ? "Zadejte e-mail a stáhněte si ho hned. Kopii vám pošleme do schránky."
      : "Zadejte e-mail a stáhněte si ho hned.",
    cta: "Chci tahák zdarma",
  });
