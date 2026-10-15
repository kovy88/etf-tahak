import { typoDeep } from "@/lib/format";
import { OPERATOR } from "./author";

/**
 * Zásady ochrany osobních údajů. NÁVRH textu pro landing page, před spuštěním ho má projít právník.
 * Doba uchování je návrh k odsouhlasení.
 */
export const privacy = typoDeep({
  title: "Zásady ochrany osobních údajů",
  updated: "Verze 2026-10-a",
  sections: [
    {
      h: "Kdo údaje zpracovává",
      p: [`Správcem je provozovatel stránky ${OPERATOR.name} (fyzická osoba). Kontakt: ${OPERATOR.email}.`],
    },
    {
      h: "Jaké údaje a proč",
      p: [
        "Když zadáte e-mail, uložíme jej spolu s údaji o tom, jak jste stránku používali: odkud jste přišli (reklama a její označení), kterou variantu stránky jste viděli, co jste si v kalkulačce spočítali a kam jste klikli. Pokud odpovíte na dobrovolnou otázku, uložíme i odpověď.",
        "Účel: zpřístupnit vám tahák a srovnání, měřit úspěšnost reklamy a posílat vám informace o ETF, o které jste si řekli.",
        "Když e-mail neodesíláme, nikam nic neposíláme. Jakmile se odesílání zapne, dostanete tahák i na e-mail a každý e-mail bude obsahovat odhlášení jedním klikem.",
      ],
    },
    {
      h: "Právní základ",
      p: ["Váš souhlas, který dáváte odesláním formuláře (čl. 6 odst. 1 písm. a) nařízení GDPR). Souhlas můžete kdykoli odvolat."],
    },
    {
      h: "Jak dlouho údaje uchováváme",
      p: ["Po dobu 24 měsíců od odeslání formuláře, nebo do odvolání souhlasu. Pak je smažeme."],
    },
    {
      h: "Komu je předáváme (zpracovatelé)",
      p: [
        "Vercel (hosting), Supabase v EU (databáze), Resend (odesílání e-mailů, až se zapne), PostHog v EU (měření návštěvnosti).",
        "Meta (měření reklam) se zapíná jen s vaším souhlasem v cookie liště.",
      ],
    },
    {
      id: "cookies",
      h: "Cookies a měření",
      p: [
        "Bez souhlasu s cookies používáme dočasný identifikátor v paměti stránky. Neukládáme analytické cookies. Pokud odešlete formulář, spojíme tuto návštěvu s uloženým kontaktem pro vyhodnocení zdroje a cesty k odeslání.",
        "Se souhlasem si v prohlížeči uložíme identifikátor (cookie a localStorage), abychom poznali opakovanou návštěvu, a zapneme záznam obrazovky s maskovanými poli formuláře. Zároveň můžeme načíst Meta Pixel, který měří úspěšnost reklam na Facebooku a Instagramu.",
        "Volbu ukládáme v prohlížeči (localStorage, klíč etf_consent). Změnit ji můžete kdykoli tlačítkem „Nastavení cookies“ v patičce.",
      ],
    },
    {
      h: "Vaše práva",
      p: [
        `Máte právo na přístup k údajům, opravu, výmaz, omezení zpracování, přenositelnost a vznést námitku. Souhlas odvoláte odhlášením z e-mailů nebo zprávou na ${OPERATOR.email}. Stížnost můžete podat u Úřadu pro ochranu osobních údajů (uoou.gov.cz).`,
      ],
    },
  ],
  back: "Zpět na stránku",
  unsubscribed: {
    title: "Odhlášeno",
    text: "Další e-maily vám už nepošleme.",
    back: "Zpět na stránku",
    errorTitle: "Odhlášení se nepovedlo",
    errorText: "Odhlášení se nám nepodařilo potvrdit. Zkuste odkaz z e-mailu znovu. Pokud problém trvá, napište na",
  },
});
