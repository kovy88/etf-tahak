import { typoDeep, pct, czk } from "@/lib/format";
import { FX, SOURCES, ref, fxIllustration } from "@/lib/tahakPrint";
import { N, examples, facts } from "./data";
import { legal } from "./legal";

/** Texty tiskové verze taháku (PDF). Čísla jen z N a src/data, zdroje jako [n] podle SOURCES. */

const tax = facts.taxes;
const lawRef = ref("law");
const irs1 = ref("irs1");
const irs2 = ref("irs2");
const fs = ref("fs");
const esma = ref("esma");
const ib = ref("ib");
const eurlex = ref("eurlex");
const cnb = ref("cnb");

export const PAGES = {
  cover: 1,
  compare: 2,
  czk: 3,
  buy: 4,
  twins: 5,
  taxSale: 6,
  taxDividend: 7,
  broker: 8,
  steps: 9,
  sources: 10,
  method: 11,
} as const;
export const PAGE_COUNT = Object.keys(PAGES).length;

const fxRows = fxIllustration(examples.default.monthly_czk, examples.default.years);

export const tahakPrint = typoDeep({
  running: {
    left: "ETF tahák 2026",
    right: `Data k ${N.dataDate}`,
    footer: "Nejde o investiční doporučení. Minulé výnosy nezaručují budoucí. Výpočty jsou modelové.",
  },

  notesLabel: "Poznámky",

  cover: {
    title: "ETF tahák 2026",
    lead: `${N.etfCount} ETF z NYSE, jejich evropské alternativy, české daně a prvních 5 kroků.`,
    meta: `Aktualizováno 10/2026. Data k ${N.dataDate}. Číslo v hranaté závorce odkazuje na zdroj na straně ${PAGES.sources}.`,
    contentsHeading: "Na čem je co",
    contents: [
      { page: PAGES.compare, text: `Srovnání ${N.etfCount} ETF: poplatek, velikost, dividenda, výnosy v USD` },
      { page: PAGES.czk, text: "Výnosy v korunách a co s nimi dělá kurz" },
      { page: PAGES.buy, text: "Co koupíte z Česka a proč ne VOO a SPY" },
      { page: PAGES.twins, text: "Evropská dvojčata: ticker, ISIN, poplatek, typ" },
      { page: PAGES.taxSale, text: "Daně: prodej ETF, časový a hodnotový test" },
      { page: PAGES.taxDividend, text: "Daně: dividendy, W-8BEN, přiznání a termíny" },
      { page: PAGES.broker, text: "Výběr brokera a kolik stojí převod měny" },
      { page: PAGES.steps, text: "Prvních 5 kroků jako checklist" },
      { page: PAGES.sources, text: "Zdroje a data k jednotlivým číslům" },
    ],
    teaserHeading: "Proč se vyplatí hlídat poplatky",
    teaserLabel: `Za ${N.years} let`,
    teaserValue: N.diffHeadline,
    teaserText: `Rozdíl mezi průměrným akciovým fondem v EU (${N.avgTer} ročně) a ETF s poplatkem ${N.etfTer} ročně, při vkladu ${N.monthly} měsíčně a výnosu ${N.gross} ročně před poplatky.`,
    teaserNote: `Modelový výpočet, ne předpověď. Poplatek ${N.etfTer} má nejlevnější z ověřených UCITS ETF na S&P 500 (${N.etfId}) ${ref("fund:" + N.etfId)}, průměr fondů je z ESMA, data za rok 2024 ${esma}. Metoda je na straně ${PAGES.method}.`,
  },

  compare: {
    title: `${N.etfCount} ETF z NYSE: základní čísla`,
    intro: "Všechna kotují na NYSE Arca. Pořadí odpovídá webu, není to žebříček a žádné z nich nedoporučujeme.",
    cols: { etf: "ETF", ter: "Poplatek ročně", aum: "Velikost fondu", div: "Dividenda", y1: "1 rok", y5: "5 let", y10: "10 let" },
    colsNote: "Poplatek je roční TER podle emitenta. Velikost v USD. Dividenda je výnos za posledních 12 měsíců. Výnosy jsou průměrné roční v USD.",
    unit: "Výnos p. a. v USD",
    margin: [
      `Tři ETF na stejný index S&P 500 mají poplatek ${N.sp500Ters.VOO}, ${N.sp500Ters.SPY} a ${N.sp500Ters.IVV}. Index je stejný, účet za správu ne.`,
      "Hvězdička (*) označuje údaj, který se nepodařilo plně ověřit.",
    ],
    footnote: `Výnosy: NAV, průměrný roční total return v USD podle emitenta k ${N.dataDate}. Minulé výnosy nezaručují budoucí. U každého ETF je datum jednotlivých údajů na straně ${PAGES.sources}.`,
  },

  czk: {
    title: "Výnosy v korunách",
    intro: "Američtí emitenti uvádějí výnos v dolarech. Vy utrácíte koruny, proto jsme výnosy přepočetli kurzem ČNB.",
    cols: { etf: "ETF", y1: "1 rok", y5: "5 let", y10: "10 let", usd: "USD", czk: "Kč" },
    howHeading: "Jak jsme přepočítali",
    how: `Kumulovaný výnos v USD jsme vynásobili změnou kurzu USD/CZK mezi začátkem a koncem období a pak ho převedli na roční průměr. Kurz ČNB ${cnb}: ${FX.end} (30. 9. 2026), ${FX.y1} (30. 9. 2025), ${FX.y5} (30. 9. 2021), ${FX.y10} (30. 9. 2016).`,
    whyHeading: "Proč se liší",
    why: `U VOO vychází za 10 let ${N.vooUsd10} ročně v USD, ale ${N.vooCzk10} v korunách. Kurz klesl z ${FX.y10} na ${FX.end} Kč za dolar, koruna tedy posílila a výnos v korunách ubrala. Kurz se může pohnout i opačným směrem. Tomu se říká měnové riziko.`,
    margin: ["Kurz ovlivňuje i evropské fondy v dolarech nebo eurech, pokud je platíte z korun."],
    footnote: "Modelový přepočet z veřejných kurzů. Minulé výnosy nezaručují budoucí. Poplatky brokera a daně v něm nejsou.",
  },

  buy: {
    title: "Co z toho koupíte z Česka",
    lead: `Jako retailový klient u brokera v EU obvykle nekoupíte americká ETF jako VOO nebo SPY. Jejich emitent nevydává dokument KID podle nařízení PRIIPs ${ib}.`,
    detail: [
      `Před nabídkou retailovým investorům musí tvůrce produktu zpracovat a zveřejnit KID (čl. 5 odst. 1). Kdo produkt prodává, předá KID zdarma (čl. 13 odst. 1) ${eurlex}.`,
      "Jde o praxi brokerů, ne o výslovný zákaz ETF v nařízení. Netýká se profesionálních klientů ani CFD na tato ETF. Některý broker může mít jiný přístup.",
    ],
    typesHeading: "Tři druhy alternativ v tabulce na další straně",
    stamps: {
      twin: "Dvojče",
      similar: "Podobné",
      none: "Nenalezeno",
    },
    types: {
      twin: `Stejný index, evropský fond (UCITS). Takových je ${N.exactTwins} z ${N.etfCount}.`,
      similar: `Jiný index nebo jiný druh fondu, podobné pokrytí. Takových je ${N.similarTwins} z ${N.etfCount}. Nejde o dvojče.`,
      none: `Žádnou ověřenou alternativu jsme nenašli. Takových je ${N.noTwins} z ${N.etfCount}.`,
    },
    glossaryHeading: "Čtyři slova z tabulky",
    glossary: [
      { term: "UCITS", text: "evropský typ fondu, který smí brokeři v EU nabízet retailovým klientům" },
      { term: "ISIN", text: "dvanáctimístný kód fondu. Podle něj ho najdete u brokera, i když se ticker liší podle burzy" },
      { term: "Akumulační", text: "fond výnosy reinvestuje, nevyplácí je" },
      { term: "Distribuční", text: "fond výnosy vyplácí na účet" },
    ],
  },

  twins: {
    title: "Evropská dvojčata a alternativy",
    intro: "U každého amerického ETF je vlevo to, co jsme k němu našli. Údaje jsou k datu uvedenému u zdroje.",
    cols: { us: "Americké ETF", fund: "Evropský fond", isin: "ISIN", ter: "Poplatek", kind: "Typ", venue: "Burza a ticker" },
    matchLabel: { exact: "Dvojče", similar: "Podobné", none: "Nenalezeno" },
    footnote: "Poplatek je roční TER podle emitenta. ETC (zlato) není UCITS ETF. Ověřte, že fond u vašeho brokera najdete podle ISIN.",
  },

  taxSale: {
    title: "Daň z prodeje ETF v ČR",
    lead: `Příjem z prodeje cenného papíru je pro fyzickou osobu osvobozen ve dvou případech ${lawRef}.`,
    tests: [
      {
        name: "Časový test",
        figure: `${N.timeTestYears} roky`,
        rule: `Mezi nákupem a prodejem uplynuly víc než ${N.timeTestYears} roky.`,
        detail: "Bez limitu částky. Neplatí pro cenné papíry v obchodním majetku a další výjimky ze zákona.",
      },
      {
        name: "Hodnotový test",
        figure: N.valueTestCzk,
        rule: `Úhrn příjmů z prodeje za rok nepřesáhne ${N.valueTestCzk}.`,
        detail: "Počítají se hrubé příjmy z prodeje, ne zisk. Platí nezávisle na časovém testu.",
      },
    ],
    otherwiseHeading: "Když neplatí ani jedno",
    otherwise: `Zdaníte rozdíl mezi příjmem z prodeje a prokazatelnými výdaji na nákup (§ 10 odst. 4). Sazba je 15 % z části základu daně do 36násobku průměrné mzdy a 23 % z části nad ním ${lawRef}. Příjem uvedete v přiznání.`,
    marginHeading: "Co tahák neřeší",
    margin: [
      "Pořadí prodeje, když nakupujete pravidelně v různých dnech.",
      "Přepočet nákupu a prodeje v cizí měně na koruny.",
      "Ztráty a ETF v obchodním majetku podnikatele.",
      "Daně na úrovni samotného fondu.",
    ],
    marginTail: "Pro vlastní situaci se poraďte s daňovým poradcem.",
    footnote: `Zákon č. 586/1992 Sb., § 4 odst. 1 písm. t) a u), § 10 a § 16, ve znění platném od 1. 8. 2026. Nejde o daňové poradenství.`,
  },

  taxDividend: {
    title: "Dividendy, W-8BEN a přiznání",
    dividendHeading: "Dividendy z USA a W-8BEN",
    rates: [
      { value: pct(tax.us_dividend_treaty_rate_pct.value, 0), label: "se vyplněným W-8BEN u brokera", loss: false },
      { value: pct(tax.us_dividend_rate_without_w8ben_pct.value, 0), label: "bez formuláře W-8BEN", loss: true },
    ],
    dividend: [
      `Z dividend od amerických firem se podle smlouvy mezi ČR a USA strhává ${pct(tax.us_dividend_treaty_rate_pct.value, 0)}, pokud je u brokera vyplněný formulář W-8BEN ${irs1}. Bez něj může plátce strhnout ${pct(tax.us_dividend_rate_without_w8ben_pct.value, 0)} ${irs2}.`,
      `Formulář W-8BEN odevzdáváte brokerovi, ne americkému úřadu IRS. Platí zpravidla do konce třetího kalendářního roku po roce podpisu. Při změně okolností to oznamte do 30 dnů ${irs2}.`,
    ],
    czHeading: "Dividendy a česká daň",
    cz: `Dividendy a podíly na zisku podílového fondu jsou příjem z kapitálového majetku (§ 8 odst. 1 písm. a). Pokud podáváte přiznání, zahrnete i zdanitelné zahraniční dividendy. Daň zaplacenou v USA lze podle mezinárodní smlouvy a § 38f započítat ${lawRef}.`,
    returnHeading: "Kdy podat přiznání",
    returnRule: `Obecná hranice je ${czk(tax.filing_threshold_czk.value)} ročně. U zaměstnance s jedním nebo postupně více zaměstnavateli a podepsaným prohlášením k dani je hranice jiných příjmů podle § 7 až 10 jen ${czk(tax.filing_employee_other_income_threshold_czk.value)}. Osvobozené příjmy a příjmy zdaněné srážkou se nepočítají. Další důvody pro podání, například daňová ztráta, se posuzují zvlášť ${lawRef}.`,
    deadlinesHeading: "Termíny na příkladu roku 2025",
    deadlines: [
      { who: "Na papíře", when: "1. 4. 2026" },
      { who: "Elektronicky", when: "4. 5. 2026" },
      { who: "Přes daňového poradce nebo advokáta", when: "1. 7. 2026" },
    ],
    deadlinesNote: `Takto vypadaly lhůty pro přiznání za rok 2025 ${fs}. Přesné termíny za rok 2026 ověřte na webu Finanční správy.`,
    accumulating:
      "Akumulační fondy z tabulky na straně 5 výnosy nevyplácejí. Zisk se u nich projeví až při prodeji.",
    footnote: "Nejde o daňové poradenství. Sazba smlouvy se může lišit podle druhu příjmu a plátce.",
  },

  broker: {
    title: "Na co se dívat u brokera",
    lead: "Konkrétního brokera nedoporučujeme. Tohle jsou otázky, na které si u každého odpovězte.",
    questionsHeading: "Otázky k položení",
    questions: [
      { q: "Najdu fond podle ISIN?", why: "Použijte ISIN z tabulky na straně 5. Fond musí být dostupný a musíte vidět jeho KID." },
      { q: "Kolik stojí obchod?", why: "Zjistěte poplatek za jeden nákup, minimální poplatek a poplatek za pravidelný vklad." },
      { q: "Kolik stojí převod měny?", why: "Ptejte se na poplatek i na rozdíl oproti kurzu ČNB." },
      { q: "Co stojí účet?", why: "Správa účtu, neaktivita, vedení a výpisy." },
      { q: "Dostanu podklady k přiznání?", why: "Přehled nákupů, prodejů a dividend s datem a kurzem." },
      { q: "Eviduje broker formulář W-8BEN?", why: "Pokud budete kupovat americké tituly, zeptejte se, jak ho broker zpracuje." },
      { q: "Jak se chrání moje peníze?", why: "Zeptejte se, jak jsou peníze a cenné papíry chráněny pro případ úpadku brokera." },
    ],
    fxHeading: "Kolik stojí převod měny",
    fxLead: `Při vkladu ${N.monthly} měsíčně vychází poplatek za převod takto. Procenta jsou ilustrace, ne ceník žádného brokera. Poslední sloupec je jen součet poplatků z vkladů, bez výnosů.`,
    fxCols: { rate: "Poplatek za převod", month: "Měsíčně", year: "Ročně", total: `Za ${N.years} let` },
    fxRows: fxRows.map((r) => ({ rate: r.pct, month: r.month, year: r.year, total: r.total })),
    fxNote: "Nezapomeňte na rozdíl mezi kurzem brokera a kurzem ČNB. Platíte ho navíc k poplatku.",
  },

  steps: {
    title: "Prvních 5 kroků",
    steps: [
      { title: "Určete horizont", text: `Víte, kdy peníze nejspíš budete potřebovat? Po víc než ${N.timeTestYears} letech držení je příjem z prodeje osvobozen (strana ${PAGES.taxSale}).` },
      { title: "Najděte fondy podle ISIN", text: `Z tabulky na straně ${PAGES.twins} si vypište ISIN a u brokera ověřte, že fond najdete a vidíte jeho KID.` },
      { title: "Porovnejte brokery", text: `Projděte otázky ze strany ${PAGES.broker}. Rozhodují poplatek za obchod, za převod měny a za účet.` },
      { title: "Otevřete účet", text: "Připravte si doklad totožnosti a bankovní účet pro vklady. Pokud broker chce W-8BEN, vyplňte ho." },
      { title: "Nastavte pravidelný vklad", text: "Uložte si potvrzení o nákupech a výplatách. Budete je potřebovat do přiznání." },
    ],
    tail: "Spočítat si vliv poplatků na vlastní částce můžete v kalkulačce na webu, odkud máte tahák.",
  },

  sources: {
    title: "Zdroje a data",
    intro: "Číslo odpovídá hranaté závorce u údaje na předchozích stranách. Datum říká, k jakému dni údaj platí.",
    list: SOURCES.map((s) => ({ n: s.n, label: s.label, url: s.url, dates: s.dates })),
  },

  method: {
    title: "Metoda a upozornění",
    methodHeading: "Metoda",
    method: [
      `Výnosy v USD: průměrný roční total return NAV podle stránky emitenta k ${N.dataDate}.`,
      `Výnosy v Kč: vlastní přepočet kurzem ČNB ke stejnému dni (strana ${PAGES.czk}).`,
      "Dividendový výnos: údaj emitenta nebo vlastní výpočet z výplat za posledních 12 měsíců. Postup u konkrétního ETF je v poznámce u zdroje. U VWO a SPY se údaj nepodařilo plně ověřit.",
      `Kalkulačka poplatků: vklad ${N.monthly} měsíčně, ${N.years} let, hrubý výnos ${N.gross} ročně. Čistý výnos je hrubý výnos minus roční poplatek. Poplatky ${N.avgTer} (průměr fondů) a ${N.etfTer} (ETF) jsou ze zdrojů ${esma} a ${ref("fund:" + N.etfId)}.`,
    ],
    legalHeading: "Upozornění",
    legal: legal.disclaimerFull,
    author: "Tahák sestavil Matěj Koval.",
  },
});
