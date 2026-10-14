import { typoDeep } from "@/lib/format";
import { AUTHOR } from "./author";
import { N } from "./data";

/**
 * E-mail po odeslání. Posílá se jen při NEXT_PUBLIC_EMAIL_ENABLED=true.
 * Placeholdery: {diff} osobní rozdíl z kalkulačky, {pdfUrl}, {unsubscribeUrl}.
 */
export const email = typoDeep({
  fromName: AUTHOR.name,
  subject: `Váš výpočet: {diff} na poplatcích + ETF tahák`,
  subjectFallback: `ETF tahák: ${N.etfCount} ETF z NYSE a co z nich koupíte z Česka`,
  preheader: "Odkaz na PDF a váš výpočet uvnitř.",
  greeting: "Dobrý den,",
  lines: [
    "tady je tahák, o který jste si řekli: {pdfUrl}",
    `Váš výpočet: rozdíl v poplatcích za {years} let je {diff} (modelový výpočet, výnos {gross} ročně před poplatky).`,
    "Jeden krok navíc: než cokoli koupíte, ověřte u svého brokera, jestli má ke zvolenému ETF český nebo anglický KID.",
  ],
  signoff: `${AUTHOR.name}`,
  footer: [
    "Nejde o investiční doporučení. Minulé výnosy nezaručují budoucí. Výpočty jsou modelové.",
    "Odhlásit se můžete jedním klikem: {unsubscribeUrl}",
  ],
});
