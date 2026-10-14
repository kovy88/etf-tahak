import { typoDeep } from "@/lib/format";

/**
 * Autor stránky. NÁVRH textu: neobsahuje žádné vymyšlené fakty o autorovi.
 * Fotka není, použije se monogram v razítku (PLAN §21, bod 3).
 */
export const AUTHOR = typoDeep({
  name: "Matěj Koval",
  initials: "MK",
  photo: null as string | null,
  heading: "Kdo za tím stojí",
  text: "Tahák jsem sestavil, protože srovnání ETF z NYSE jsou psaná pro Američany. Čech řeší jiné věci: co u brokera vůbec koupí, kolik z výnosu sní kurz dolaru a jak se to daní. Každé číslo má u sebe zdroj a datum.",
  sourcesLink: "Odkud jsou data",
});

/** Provozovatel stránky a správce osobních údajů (fyzická osoba). Jeden zdroj pro patičku i zásady. */
export const OPERATOR = {
  name: AUTHOR.name,
  email: "koval.macek@gmail.com",
} as const;
