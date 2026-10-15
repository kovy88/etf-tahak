# Reklama A: „Poplatky“ → `/poplatky`

Čísla jsou z `src/data/examples.json` (3 000 Kč měsíčně, 25 let, výnos 6 % ročně před poplatky). Hlídá je test `ads/ads.test.ts`.

## Texty

- **Primární text:** Rozdíl mezi poplatkem 1,46 % a 0,03 % ročně? Za 25 let 377 000 Kč. Modelový výpočet, spočítejte si to na svých číslech.
- **Pokračování primárního textu:** Při 3 000 Kč měsíčně a výnosu 6 % ročně před poplatky. Přepočítejte si rozdíl na svých číslech. K tomu ETF tahák zdarma: 12 fondů z NYSE, evropské alternativy a české daně. Stažení hned po zadání e-mailu.
- **Titulek:** Kolik stojí poplatek 1,46 % ročně?
- **Popis:** Kalkulačka + tahák zdarma
- **Tlačítko:** Stáhnout

## Kreativa (text v obrázku)

- **Nadpis:** Kolik stojí rozdíl v poplatcích?
- **Velké číslo:** 377 000 Kč
- **Popisek výsledku:** Modelový rozdíl za 25 let
- **Fond:** Průměrný akciový fond v EU
- **ETF:** UCITS ETF na S&P 500
- **Nabídka:** Kalkulačka + ETF tahák zdarma
- **Detail nabídky:** 12 ETF, evropské alternativy a české daně.
- **Výzva:** Spočítat vlastní rozdíl
- **Drobně:** Model: 3 000 Kč měsíčně, výnos 6 % ročně před poplatky. Nejde o předpověď ani investiční doporučení. Poplatky ročně, zdroje ESMA a emitent na webu.
- **Formáty:** feed 1080×1350, story 1080×1920; ve Stories je horních a dolních 270 px bez obsahu.

Číslo, obě sazby a počet stran doplňuje generátor přímo z dat. Miniatura je skutečná strana PDF, ne ilustrační maketa. Tmavý blok ukazuje, které poplatky model srovnává; žlutá výzva říká, co má návštěvník udělat. Text v obrázku funguje i bez rozkliknutí dlouhého primárního textu.

## Náhledy

- Feed 4:5: ![feed](feed-1080x1350.png)
- Story 9:16: ![story](story-1080x1920.png)

Znovu vygenerujete příkazem `npm run ads` (šablony v `ads/_src/`, texty z tohoto souboru).

## Odkazy (UTM)

- Feed: `https://etf-tahak.vercel.app/poplatky?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_tahak_launch&utm_content=a_poplatky_feed`
- Story: `https://etf-tahak.vercel.app/poplatky?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_tahak_launch&utm_content=a_poplatky_story`

## Návaznost na hero

Hero na `/poplatky` opakuje stejné číslo i stejnou větu (viz `src/content/hero.ts`):
„Rozdíl mezi poplatkem 1,46 % a 0,03 % ročně? Za 25 let 377 000 Kč.“ Pod ním je kalkulačka s volbou částky.

## Kontrola zásad Mety

- Žádné tvrzení o osobě adresáta („máte“, „jako investor“ ✗). Text mluví o poplatcích, ne o čtenáři.
- Žádný slib výnosu. Výnos 6 % je označený jako modelový předpoklad.
- Je uvedeno „modelový výpočet“.
- Žádné „bez rizika“, „zaručený“, „nejlepší“.
- Special Ad Category: viz Nastavení kampaně níže (ověřeno).

## Nastavení kampaně (návrh)

- **Cíl kampaně:** provoz na web (Traffic, optimalizace na Landing page views). Konverzi Lead nastavte, až Pixel nasbírá první leady.
- **Cílení:** Česko, 24–45 let, všechna pohlaví, Instagram + Facebook, umístění feed a Stories/Reels. Zájmy: investování, ETF, akciové trhy, osobní finance. Žádné lookalike a úzké segmenty v prvním testu.
- **Special Ad Category (ověřeno 14. 10. 2026 v [dokumentaci Mety](https://developers.facebook.com/docs/marketing-api/audiences/special-ad-category)):** kategorie „Financial products and services“ je povinná pro inzerenty z USA nebo při cílení na USA. Pro „některé části Evropy“ platí jen u úvěrů, což tahák není. Pro CZ inzerenta s cílením na CZ tedy povinná není. Kdyby ji Meta při schvalování přesto vyžádala, cílení se zúží na 18–65+, všechna pohlaví, bez zájmů a lookalike. Kreativy i texty projdou i tak, změní se jen publikum.
- **Rozpočet testu:** 2 sady × 500 Kč/den × 5 dní = 5 000 Kč. Rozdělení mezi A a B se dělá na úrovni reklamních sad, ať každá dostane stejný rozpočet.
- **Co měřit (PostHog + tabulka `leads`):**
  - v Metě: CTR na odkaz, CPC, počet kliků na odkaz,
  - na webu: `landing_viewed` proti klikům na odkaz (ztráta při načítání v in-app prohlížeči),
  - dál: engaged, `form_viewed`, `form_started`, `lead_created`,
  - výsledek: konverze a CPL podle `utm_content` (feed vs. story),
  - v rozpadu podle `in_app_browser`.
- **Vyhodnocení po 5 dnech:** pokračovat s kreativou a formátem s nižším CPL. Pod ~30 leady na sadu nejsou rozdíly průkazné, brát je jako směr, ne jako důkaz.
