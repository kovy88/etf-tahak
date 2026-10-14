# Plán: konverzní landing page „ETF tahák" (Zadání B)

Tohle je zdroj pravdy pro všechny navazující chaty. Pravidla práce jsou v `CLAUDE.md`, původní zadání v `docs/zadani.md`.
Termín: **pátek 16. 10. 2026**. Cíl je mít hotovo ve čtvrtek večer, aby na pátek zbyla jen kontrola a odeslání.
Hodnoticí otázka zní: *„Mohli bychom na to zítra pustit reklamu?"* Podle ní poměřuj každé rozhodnutí.

---

## 0. Stav (každý chat odškrtne svoji fázi)

- [ ] F0 Setup: repo, GitHub, Vercel
- [ ] F1 Data a zdroje
- [ ] F2 Texty (stránka + reklamy)
- [ ] F3 Design systém + statická stránka
- [ ] F4 Interaktivní prvky + varianty
- [ ] F5 Formulář, leady, děkovný stav, e-mail
- [ ] F6 Měření a souhlas s cookies
- [ ] F7 Lead magnet (PDF)
- [ ] F8 Reklamy (kreativy)
- [ ] F9 QA a připravenost na spuštění
- [ ] F10 README, ai-log, odevzdání

---

## 1. Zadání → výstup (kontrola do puntíku)

| Požadavek ze zadání | Jak ho splníme | Kde |
|---|---|---|
| Srovnání ETF z NYSE pro českého drobného investora | 12 ETF s primárním listingem na NYSE Arca. Čísla v USD i CZK. U každého „koupíte z ČR?" a jeho UCITS dvojče | sekce Srovnání, `src/data/etfs.json` |
| Návštěvník je na mobilu a dá stránce pár sekund | mobile-first 360–390 px. Slib, hodnota a CTA na 1. obrazovce. LCP < 2 s | §8, §16 |
| Lead magnet optimalizovaný na kontakty | tahák + osobní výpočet, 1 pole, 5 míst výzvy, sticky CTA | §4–6 |
| Nesmí působit jako základní výstup Claude | vlastní design směr „anotovaný tahák", česká typografie, seznam zakázaných frází | §13–14, `CLAUDE.md` |
| Určit cílovou skupinu | persona, JTBD a insight | §3 |
| Co dostane výměnou za kontakt | PDF tahák, výpočet do e-mailu, odemčené srovnání | §4 |
| V jakém momentě žádáme kontakt | hlavně hned po výsledku kalkulačky. Dále gate srovnání, hero a závěr | §5 |
| Hodnota je zřejmá před formulářem | výsledek kalkulačky bez e-mailu, 3 karty ETF zdarma, náhled stran taháku | §4–5 |
| Dvě verze reklamy | A „Poplatky", B „VOO z Česka nekoupíte". Texty + kreativy 4:5 a 9:16 | `ads/` |
| 1. obrazovka navazuje na slib reklamy | vlastní hero a pořadí sekcí pro každou reklamu (`/poplatky`, `/srovnani`) | §7–8 |
| Každý interaktivní prvek vede ke kontaktu | kalkulačka → „Pošlete mi výpočet", srovnání → „Odemknout zbylých 9" | §9 |
| Co nejméně polí | jen e-mail, bez checkboxu | §11 |
| Co dostane po odeslání | okamžité stažení, odemčení na stránce, e-mail, 1 dobrovolná otázka | §6 |
| Skutečná data se zdrojem | každé číslo má `source` + `as_of`, bez zdroje build neprojde | §10 |
| Měřit celou cestu od příchodu po odeslání | PostHog funnel, serverový `lead_created`, UTM a „cesta" uložené u leadu | §12 |
| README: pořadí sekcí, očekávaná konverze, 3 A/B hypotézy podle dopadu | osnova a koncepty jsou připravené | §17–19 |
| Nasazení na bezplatný hosting | Vercel | F0 |
| Veřejný GitHub s průběžnou historií commitů | malé commity po každém kroku, žádný squash | `CLAUDE.md` |
| Složka `ai-log/` s exporty `/export` | export každého chatu, včetně tohoto plánovacího | F10 |

---

## 2. Klíčová rozhodnutí (TL;DR)

1. **Cílovka:** začínající český investor ve věku 24–40 let. Z YouTube a Redditu ví o „VOO", ale neví, co si z toho může koupit, kolik ho to bude stát a jak to danit.
2. **Insight (proč zrovna my):** srovnání NYSE ETF na internetu jsou psaná pro Američany. Čech řeší tři jiné věci:
   - americké ETF jako retailový klient u EU brokera běžně nekoupí (PRIIPs/KID),
   - výnos v korunách není totéž co výnos v dolarech,
   - platí české daně (časový test).

   Na tomhle stojí hodnota stránky i obou reklam.
3. **Nabídka:** „ETF tahák 2026" (PDF, ~10 stran), k tomu osobní výpočet poplatků do e-mailu a odemčení kompletního srovnání s UCITS dvojčaty přímo na stránce.
4. **Moment žádosti:** až po první hodnotě, ne před ní. Hlavní místo je hned pod výsledkem kalkulačky. Samotný výsledek za e-mailem **není**.
5. **Formulář:** jedno pole (e-mail). Žádné jméno, telefon ani checkbox. Mikrotext: „Žádný telefon, žádný poradce."
6. **Po odeslání:** okamžité stažení PDF a odemčení srovnání, bez čekání na e-mail. Pak 1 dobrovolná otázka na 1 ťuk.
7. **Měření:** PostHog EU (do souhlasu bez cookies) + serverová událost `lead_created` + UTM a souhrn cesty uložený u každého leadu v DB.
8. **Stack:** Next.js (App Router, TS, Tailwind) na Vercelu, Supabase (EU) pro leady, Resend pro e-mail, Python (uv, ruff) pro datový pipeline.
   - **Doména:** jen `*.vercel.app`, vlastní doménu nekupujeme. Hodnota se proto doručuje **okamžitě na stránce** (stažení PDF + odemčení). E-mail je hotový a otestovaný, ale v produkci vypnutý přes `NEXT_PUBLIC_EMAIL_ENABLED=false`, dokud nebude doména (viz §11).
   - **Vědomá výjimka z pravidla „API = FastAPI":** jediný endpoint pro formulář je Next.js route handler. FastAPI na free tieru Renderu se po nečinnosti probouzí desítky sekund, takže by se ztrácely leady z placené reklamy. Vercel sice FastAPI spustí jako Python funkci, ale pro jeden endpoint je to zbytečná složitost.

---

## 3. Cílová skupina

**Primární persona: „Začínající samouk"**
- 24–40 let, zaměstnanec nebo OSVČ s příjmem nad mediánem. Má 50–500 tis. Kč na spořicím účtu nebo v bankovním podílovém fondu.
- Je na Instagramu a Facebooku, sleduje české i americké finfluencery, čte r/eupersonalfinance nebo FB skupiny o investování.
- Má nebo zakládá účet u XTB, Trading 212, Revolut, Fio, Portu nebo IBKR.
- **Job to be done:** „Chci si vybrat 1–2 ETF a začít pravidelně investovat, aniž bych udělal drahou chybu."
- **Bolesti:**
  - informační přetlak a angličtina,
  - neví, který ETF vybrat,
  - zjistil, že VOO u brokera „nejde koupit",
  - bojí se daní,
  - nevěří finančním poradcům, kteří volají.
- **Kontext návštěvy:** mobil, in-app prohlížeč Instagramu nebo Facebooku, večer. Do 3–8 s se rozhodne, jestli zůstane.

**Koho necílíme:** pokročilé investory (tahák jim nic nového nedá), lovce rychlého zbohatnutí a tradery.

**Proč se k lead magnetu hodí:** v jeho znalostech je jasná a konkrétní mezera, kterou tahák zaplní. Navíc stojí na začátku rozhodování, takže lead má hodnotu pro navazující komunikaci (broker, kurz nebo aplikace, podle byznysu zadavatele).

---

## 4. Nabídka

**ETF tahák 2026 (PDF, 8–12 stran)**
1. Srovnání 12 nejpopulárnějších ETF z NYSE: poplatek, velikost, dividenda, výnos za 1, 5 a 10 let v USD i CZK.
2. Které z nich koupíte z Česka a jejich evropská UCITS dvojčata (ticker, ISIN, TER, akumulační/distribuční).
3. Daně v ČR pro ETF investora: časový test 3 roky, limit 100 000 Kč, dividendy a W-8BEN, kdy podat přiznání.
4. Na co se dívat při výběru brokera (bez doporučení konkrétního) a kolik stojí převod měny.
5. Checklist „prvních 5 kroků".
6. Osobní výpočet z kalkulačky (posílá se v e-mailu).

Každé číslo v taháku má zdroj a datum. Tahák se generuje ze stejných dat jako stránka (F7), takže si nikdy neodporují.

**Proč právě tahle nabídka:**
- je konkrétní (počet ETF, počet stran),
- řeší českou bolest, kterou v češtině nikde jinde v kompaktní podobě nenajde,
- dá se ukázat předem (náhled stran).

**Hodnota viditelná před formulářem:**
- výsledek kalkulačky je vidět hned s výchozími hodnotami, i bez jakékoli interakce,
- zdarma jsou 3 plné karty ETF a insight „VOO z ČR nekoupíte",
- sekce „3 věci, které vám americká videa neřeknou" s reálnými čísly,
- náhled 3 stran taháku, obsah a štítek „aktualizováno 10/2026, zdroje u každého čísla".

---

## 5. Kdy a jak žádáme o kontakt

Na všech místech je stejná komponenta `LeadForm`. Liší se parametrem `location` (kvůli měření) a textem tlačítka podle kontextu.

| # | Místo | Spouštěč | Text tlačítka (koncept) | Role |
|---|---|---|---|---|
| 1 | Pod výsledkem kalkulačky | uživatel vidí svoje číslo | „Pošlete mi výpočet + tahák" | **hlavní**: vrchol motivace, personalizace |
| 2 | Gate ve srovnání | ťuk na „Odemknout zbylých 9 ETF + dvojčata" | „Odemknout srovnání" | sekundární, staví na zvědavosti |
| 3 | Hero CTA | návštěvník přišel rovnou pro tahák | „Chci tahák zdarma" → bottom sheet s polem | pro rozhodnuté (opt-in ve 2 krocích) |
| 4 | Sticky lišta dole | po odscrollování hero. Schová se, když je vidět formulář nebo klávesnice | „Tahák zdarma" | záchytná síť |
| 5 | „Co je v taháku" + závěr | po náhledu stran | „Chci tahák zdarma" | pro váhavé po FAQ |

**Zásady:**
- Nejdřív dát, pak chtít.
- Obsah nikdy nezakrývat popupem.
- Žádný exit-intent: na mobilu nefunguje a obtěžuje.
- Po odeslání se všechna místa přepnou do stavu „hotovo".

---

## 6. Po odeslání

1. **Okamžitě na stránce (< 300 ms, optimisticky):** „Hotovo. Tahák je váš." a tlačítko **Stáhnout PDF**. Srovnání se odemkne přímo na stránce. Když selže server, uživatel PDF dostane i tak a chybu jen zalogujeme. Za naše chyby návštěvníka netrestáme.
2. **Jedna dobrovolná otázka na 1 ťuk:** „Kde investujete nebo chcete začít?" (XTB / Trading 212 / Revolut / Fio / Portu / IBKR / Jinde / Zatím nikde). Odpověď se uloží k leadu, slouží ke kvalifikaci a personalizaci e-mailů.
3. **E-mail do 1 minuty** (jen při `NEXT_PUBLIC_EMAIL_ENABLED=true`, tedy až s vlastní doménou; do té doby to v produkci neplatí):
   - předmět s osobním číslem („Váš výpočet: 439 000 Kč na poplatcích + ETF tahák"),
   - odkaz na PDF, 3 řádky shrnutí a jeden další krok,
   - odesílatel je jméno člověka, ne „noreply".
4. **Nápověda ke schránce** (jen když se e-mail posílá): „Na Seznamu se může schovat v Newsletterech, v Gmailu v Promoakcích." Bez e-mailu děkovný stav **nesmí slibovat**, že něco přijde do schránky.
5. **Sdílení:** „Pošlete kamarádovi, který taky řeší VOO". Přes Web Share API, odkaz s `utm_source=share`.
6. **Navazující sekvence:** jen popsat v README, implementace je volitelná.
   - D+2: daně krok za krokem
   - D+4: 3 drahé chyby začátečníků
   - D+7: jak koupit UCITS ETF u brokera
   - D+10: nabídka zadavatele

---

## 7. Reklamy a návaznost první obrazovky

Platforma je Meta (Instagram + Facebook): feed 4:5 (1080×1350) a Stories/Reels 9:16 (1080×1920). Každá reklama vede na vlastní routu, jejíž hero opakuje slib reklamy.

### A – „Poplatky" (averze ke ztrátě → kalkulačka) → `/poplatky`
- **Kreativa:** obří číslo „439 000 Kč" (přesnou hodnotu dopočítá F1) a text „tolik může za 25 let stát poplatek 1,8 % ročně místo 0,07 %". Drobně „modelový výpočet, zdroje na webu".
- **Primární text:** „Rozdíl mezi 1,8 % a 0,07 % ročně vypadá jako drobnost. Při 3 000 Kč měsíčně za 25 let to může být přes 400 000 Kč. Spočítejte si to na svých číslech a stáhněte si srovnání 12 ETF z newyorské burzy. Zdarma."
- **Titulek:** „Kolik stojí poplatek 1,8 %? Spočítejte si to"
- **Hero na webu:** stejné číslo a kalkulačka s výběrem částky přímo v první obrazovce.

### B – „VOO z Česka nekoupíte" (zvědavost, insider → srovnání) → `/srovnani` (zároveň `/`)
- **Kreativa:** tickery VOO · SPY · VTI · SCHD jako burzovní tabule, razítko „z ČR běžně nekoupíte*" a výzva „Tady je, co místo nich →".
- **Primární text:** „Na YouTube všichni řeší VOO. Jako drobný investor v EU ho ale u běžného brokera nekoupíte. Srovnali jsme 12 nejpopulárnějších ETF z NYSE a ke každému našli evropské dvojče, které koupit jde. I s poplatky a daněmi v Česku."
- **Titulek:** „12 ETF z NYSE: co z nich koupíte z Česka"
- **Hero na webu:** stejná tabule tickerů, hned pod ní srovnání.

### Pravidla reklam
- Čísla v reklamě, na webu i ve výchozím stavu kalkulačky jsou stejná. Mají jeden zdroj: `src/data/examples.json`.
- **Zásady Mety:**
  - netvrdit osobní vlastnosti adresáta („Máte peníze v bance?", „Jako investor…" ✗),
  - neslibovat výnosy,
  - uvést „modelový výpočet".
- Ověřit, jestli Meta pro CZ vyžaduje Special Ad Category „Financial products and services". Ta omezuje cílení (věk, lokalita, lookalike). Patří do launch checklistu.
- **UTM:** `?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_tahak_launch&utm_content=a_poplatky_feed` (obdobně `b_voo_story` atd.).
- Kreativy generujeme z kódu (HTML → PNG přes Playwright). Jsou tak reprodukovatelné, verzované a mají stejnou typografii jako web.

---

## 8. Struktura stránky (mobil) a pořadí sekcí

Pořadí sekcí je konfigurace podle varianty (`src/content/variants.ts`). Varianta A má kalkulačku před srovnáním, varianta B obráceně.

| # | Sekce | Obsah | Proč právě tady |
|---|---|---|---|
| S1 | Hero | eyebrow s datem dat, H1 = slib reklamy, 1 věta „co dostanete", interaktivní důkaz (A: číslo + volba částky, B: tabule tickerů), CTA „Chci tahák zdarma", sekundární odkaz „Nejdřív si to spočítám ↓", miniatura taháku | do 3 s potvrdit, že je návštěvník na správném místě (message match), a ukázat hodnotu |
| S2 | Kalkulačka (A) / Srovnání (B) | plně funkční bez e-mailu, pod výsledkem formulář #1 | první hodnota co nejdřív: většina návštěvníků na mobilu uvidí jen 1–2 obrazovky |
| S3 | Srovnání (A) / Kalkulačka (B) | 3 karty zdarma, gate na zbytek | druhá hodnota a druhý důvod nechat e-mail |
| S4 | „3 věci, které vám americká videa neřeknou" | PRIIPs, USD vs. CZK na reálných číslech, daně. Každý bod končí „podrobně v taháku" | prohlubuje mezeru ve znalostech, kterou zaplní tahák |
| S5 | Co je v taháku | náhled 3 stran, obsah, formulář #5 | nabídka je nejkonkrétnější těsně před výzvou |
| S6 | Kdo za tím stojí + data + FAQ | člověk (jméno, foto), odkud jsou data, 4–5 otázek: Je to zdarma? Proč e-mail? Zavolá mi někdo? Je to doporučení? Jak často aktualizujete? | námitky řešíme až u těch, kdo váhají |
| S7 | Závěrečné CTA + patička | formulář, upozornění, zdroje, provozovatel, zásady | poslední šance + compliance |

**Další pravidla rozvržení:**
- Žádná navigace ani odkazy ven. Výjimkou jsou zdroje v patičce, ty se otevírají v novém okně.
- Sticky CTA se zobrazuje od S2.
- Hero včetně CTA se musí vejít do 360×600 px, protože in-app prohlížeč ukrojí lištu. U spodního okraje první obrazovky má vykukovat začátek S2.

---

## 9. Interaktivní prvky

### 9.1 Kalkulačka poplatků
- **Vstupy:**
  - měsíční vklad: čipy 1 000 / 3 000 / 5 000 / 10 000 Kč + vlastní částka,
  - horizont: 10 / 20 / 25 / 30 let, výchozí 25,
  - co srovnat: ETF (výběr ze seznamu, výchozí je nejlevnější S&P 500 UCITS) vs. „průměrný akciový fond v ČR" (TER a vstupní poplatek ze zdroje),
  - předpokládaný hrubý výnos 6 % p.a., volitelně 4 / 6 / 8 %, s viditelným štítkem „předpoklad, ne předpověď".
- **Výpočet:**
  - měsíční složené úročení,
  - čistý výnos = hrubý výnos − TER,
  - vstupní poplatek krátí každý vklad,
  - čistá funkce `src/lib/calc.ts` s unit testy (vitest).
- **Výstup:**
  - velké číslo „rozdíl",
  - dvě čáry ve vlastním SVG grafu (bez knihovny),
  - „z toho zaplacené poplatky celkem",
  - přepočet hned při změně, bez tlačítka „Spočítat".
- **Ke kontaktu:** formulář #1 je hned pod výsledkem. Vstupy a výsledek se uloží k leadu a použijí v e-mailu.

### 9.2 Srovnávač ETF z NYSE
- Karty místo široké tabulky. Filtry-čipy: S&P 500 · Celé USA · Svět · Dividendy · Dluhopisy a zlato.
- **Obsah karty:**
  - ticker (mono), název, emitent,
  - TER, AUM, dividendový výnos,
  - výnos za 5 let p.a. v USD a v CZK,
  - štítek „Z ČR jako retail: nekoupíte / koupíte",
  - řádek „Evropské dvojče: CSPX · TER 0,07 %",
  - poznámka pod čarou se zdrojem.
- **Gate:** 3 karty (VOO, SPY, VT) jsou zdarma i s dvojčaty. Zbylých 9 je rozmazaných s výzvou „Odemknout zbylých 9 + dvojčata", která otevře formulář #2. Po odeslání se odemknou bez reloadu.
- **Mikro-insight:** „VOO, SPY a IVV sledují stejný index. Liší se poplatkem." Vizuálně 3 čísla vedle sebe.

### 9.3 Volitelné (jen když zbude čas)
- Porovnání 2 ETF vedle sebe.
- Kvíz „jaký typ ETF hledáte" **ne**: hrozí, že bude působit jako investiční doporučení.

---

## 10. Data a zdroje

**Pravidlo:** žádné číslo bez `source` (URL) a `as_of` (datum). Pokud některé chybí, build i testy selžou. Na stránce:
- datum dat je v hero,
- u každé sekce je poznámka pod čarou,
- kompletní seznam zdrojů je v patičce a v README.

**Kandidáti ETF:** VOO, SPY, IVV, VTI, VT, VEA, VWO, SCHD, VYM, VUG, AGG, GLD. U každého ověř primární listing na NYSE Arca u emitenta nebo na NYSE. QQQ a BND jsou na Nasdaqu, takže je nepoužívat (nanejvýš zmínit v poznámce).

| Údaj | Primární zdroj | Poznámka |
|---|---|---|
| TER, AUM, počet pozic, index, datum založení, dividendový výnos | stránky a fact sheety emitentů (Vanguard, iShares, SPDR/State Street, Schwab) | ručně do YAML s URL a datem |
| Výnosy za 1/5/10 let (NAV total return k 30. 9. 2026) | stránka emitenta, sekce Performance (standardizované čtvrtletní výnosy) | data k 30. 9. už by měla být zveřejněná |
| Kurz USD/CZK | denní kurz ČNB: `https://www.cnb.cz/cs/financni-trhy/devizovy-trh/kurzy-devizoveho-trhu/kurzy-devizoveho-trhu/denni_kurz.txt?date=DD.MM.YYYY` | přepočet `CZK_kum = (1+r_USD)^n × FX_konec / FX_začátek`, pak anualizovat. Metodu uvést na webu |
| UCITS dvojčata (ticker, ISIN, TER, domicil, akum./distr.) | stránky emitentů, justETF jen jako sekundární kontrola | např. S&P 500 → CSPX/SXR8, VUAA, SPYL; svět → VWCE |
| „Americké ETF retail v EU nekoupí" | Nařízení (EU) č. 1286/2014 (PRIIPs) na EUR-Lex + help stránka brokera dostupného v ČR | formulovat přesně: „jako retailový klient, skutečný ETF (ne CFD)". Ověřit, že se do 10/2026 nic nezměnilo (Retail Investment Strategy) |
| Náklady průměrného akciového fondu v ČR | nejnovější report ESMA „Costs and Performance of EU Retail Investment Products". Fallback: medián z KID 3–5 největších akciových fondů v ČR | žádný konkrétní bankovní fond nejmenovat negativně, použít průměr nebo medián |
| Daně | zákon č. 586/1992 Sb., § 4 odst. 1 (zakonyprolidi.cz) + Finanční správa | časový test 3 roky. Od 2026 je u cenných papírů zrušen strop 40 mil. Kč. Limit 100 000 Kč hrubých příjmů **ověřit přímo v textu zákona** |
| Modelový výnos 6 % | uvést jako předpoklad, případně s odkazem na dlouhodobé výnosy akcií (např. Global Investment Returns Yearbook) | nikdy jako slib |

**Pipeline (Python, uv, ruff):**
- `data/etfs.source.yaml`: ruční vstup, u každé hodnoty `value`, `source` a `as_of`.
- `data/facts.source.yaml`: PRIIPs, daně, náklady fondů, předpoklady.
- `data/build.py`:
  - stáhne kurzy ČNB,
  - přepočte výnosy do CZK,
  - spočítá ukázkové příklady pro reklamy a hero,
  - zvaliduje vše přes pydantic,
  - zapíše `src/data/etfs.json`, `src/data/facts.json` a `src/data/examples.json`.
- `data/tests/` (pytest) kontroluje, že:
  - každá hodnota má zdroj,
  - TER je v rozumném rozsahu,
  - kurz existuje,
  - příklady sedí s `calc.ts` (sdílené testovací případy v `data/tests/calc_cases.json`).
- Stažené surové soubory (`data/raw/`) commitovat, pokud jsou malé. Kvůli reprodukovatelnosti.

---

## 11. Formulář a leady (technika)

### Formulář
- **Pole:** `<input type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" enterkeyhint="send">`. Label je viditelný, validace probíhá až na blur nebo při odeslání.
- **Oprava překlepů v doméně** pro české schránky (seznam.cz, email.cz, centrum.cz, post.cz, volny.cz, atlas.cz, gmail.com, icloud.com, outlook.com): „Mysleli jste @seznam.cz?" Oprava jedním ťukem.
- **Antispam bez tření:**
  - honeypot pole,
  - minimální čas od zobrazení formuláře (~2 s),
  - volitelně kontrola MX záznamu domény na serveru,
  - žádná CAPTCHA.
- **Mikrotext pod tlačítkem:** „Jen e-mail. Žádný telefon, žádný poradce. Tahák stáhnete hned. Odhlášení jedním klikem · Zásady ochrany údajů."
- **Proč nechceme jméno (patří do README):** každé pole navíc snižuje konverzi. Oslovení jménem navíc v češtině naráží na 5. pád („Dobrý den, Petře"), takže se nevyplatí.

### Endpointy
- **`POST /api/lead`** (Next.js route handler, Node runtime):
  1. validace přes zod,
  2. upsert do Supabase (duplicitní e-mail vrací úspěch a nic neprozradí),
  3. odpověď s `downloadUrl`,
  4. e-mail a serverová událost do PostHogu přes `after()`, takže neblokují odpověď.
- **`POST /api/lead/profile`:** uloží odpověď na dobrovolnou otázku. Lead se identifikuje nehádatelným `lead_id` z první odpovědi.

### Supabase
Region EU (Frankfurt), migrace v `supabase/migrations/`.
- **Tabulka `leads`:** `id uuid pk, email citext unique, created_at, updated_at, variant, form_location, utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer, landing_path, in_app_browser, calc jsonb, journey jsonb, broker text, consent_text_version, posthog_id, user_agent`.
- **Přístup:** RLS zapnuté, žádné veřejné policies. Zapisuje jen service role ze serveru.
- **`journey`:** `{time_to_submit_ms, sections_seen[], calc_used, compare_unlock_clicked, cta_clicks}`.

### E-mail a PDF
- **E-mail:** Resend, ovládaný přepínačem `NEXT_PUBLIC_EMAIL_ENABLED`.
  - Bez ověřené domény posílá Resend jen na adresu vlastníka účtu. Na `*.vercel.app` doménu ověřit nejde (nemáme její DNS).
  - **Teď:** šablona i odesílání jsou implementované a otestované odesláním na vlastní adresu (screenshot do README). V produkci platí `NEXT_PUBLIC_EMAIL_ENABLED=false`, takže endpoint e-mail přeskočí a nic nerozbije.
  - **Při spuštění:** koupit doménu, v Resend ověřit SPF/DKIM, nastavit `NEXT_PUBLIC_EMAIL_ENABLED=true` a upravit mikrotexty. Patří do launch checklistu v README.
  - Texty formuláře i děkovného stavu se řídí přepínačem. Když je vypnutý, neslibují e-mail, jen okamžité stažení.
- **PDF:** `public/tahak/<nahodny-hash>.pdf`. Únik odkazu nevadí, je to lead magnet, ne tajemství.

### Env proměnné (`.env.example`)
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com`, `NEXT_PUBLIC_META_PIXEL_ID`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_EMAIL_ENABLED=false`, `RESEND_API_KEY`, `EMAIL_FROM`, `LEAD_PDF_PATH`.

---

## 12. Měření (tracking plan)

**Nástroje:**
- **PostHog Cloud EU:** funnely, breakdowny, session replay, později i experimenty.
  - Do souhlasu běží bez cookies (`persistence: 'memory'`), po souhlasu přejde na `localStorage+cookie`.
  - Stub snippet je ve `<head>` (s frontou), aby se zachytily i rychlé odchody. Samotnou knihovnu načítat lazy.
- **Meta Pixel** (a případně GA4) se načte až po souhlasu, s ID z env. Bez ID se nenačte vůbec.

**Pravdivý počet leadů je v DB.** U každého leadu je uložené UTM, varianta a cesta. Díky tomu známe CPL a konverzi podle reklamy, i když někdo tracking blokuje.

**Společné vlastnosti všech událostí:**
- `variant`, `utm_*`,
- `in_app_browser` (FB/IG/TikTok/žádný, z User-Agentu),
- `viewport_w`, `ms_since_landing`.

| Událost | Kdy | Vlastnosti |
|---|---|---|
| `landing_viewed` | načtení stránky | `landing_path`, `referrer` |
| `section_viewed` | sekce je z ≥ 50 % ve viewportu, jednou | `section_id`, `order` |
| `scroll_depth` | 25/50/75/100 % | `depth` |
| `cta_clicked` | jakékoli CTA | `location` (hero/sticky/calc/compare_gate/tahak/final) |
| `calc_interacted` | první změna vstupu | – |
| `calc_changed` | změna vstupu (debounce 1 s) | `monthly`, `years`, `return`, `compare_to` |
| `compare_filter_changed` / `compare_gate_clicked` | filtr / ťuk na odemčení | `filter` |
| `form_viewed` | formulář je z ≥ 50 % vidět nebo se otevřel sheet | `location` |
| `form_started` | první fokus nebo první znak | `location` |
| `form_error` | chyba validace | `reason` (empty/invalid/server) |
| `email_typo_suggested` / `email_typo_accepted` | návrh opravy domény | `domain` |
| `form_submitted` | klient odeslal | `location` |
| `lead_created` | **server** po zápisu do DB | `location`, `is_duplicate`, `variant`, `utm_content` |
| `thankyou_viewed`, `pdf_downloaded`, `profile_answered`, `share_clicked` | po odeslání | `broker` u `profile_answered` |
| `consent_updated` | volba v cookie liště | `analytics`, `marketing` |
| `web_vitals` | LCP/CLS/INP | hodnoty |

**Hlavní funnel:**
1. `landing_viewed`
2. engaged (`calc_interacted` ∨ `compare_*` ∨ `scroll_depth ≥ 50`)
3. `form_viewed`
4. `form_started`
5. `lead_created`

Breakdown podle `variant`, `utm_content`, `location` a `in_app_browser`.

**Mezi reklamou a webem:** porovnat „link clicks" v Metě s `landing_viewed`. Rozdíl ukáže, kolik lidí odpadne při načítání v in-app prohlížeči.

**Ověření:**
- Playwright E2E projde celou cestu a ověří posloupnost událostí. V testovacím režimu se události zrcadlí do `window.__events`.
- Ručně zkontrolovat Live events v PostHogu.
- Do README přidat screenshot funnelu z testovacího provozu a `analytics/funnel.sql` nad tabulkou `leads`.

---

## 13. Design směr – „anotovaný tahák"

**Koncept:** stránka vypadá jako pečlivě připravený burzovní tahák. Tištěná tabulka na teplém papíře, čísla zvýrazněná fixou, poznámky na okraji. Spojuje „NYSE" (tickery, burzovní tabule) a „tahák" (zvýrazňovač).

- **Barvy (tokeny v CSS proměnných):**
  - papír `#F4F1EA`, inkoust `#15140F`, šedá `#6B665C`, linky `#D9D3C7`,
  - zvýrazňovač `#FFE066`,
  - „ztráta/poplatky" `#C2410C`, „zisk/dvojče" `#0F7B4A`.

  Jen světlý režim kvůli in-app prohlížečům. Dark mode případně jako bonus.
- **Písmo:**
  - nadpisy: výrazný serif (kandidáti Fraunces, Newsreader, Source Serif 4),
  - text: sans (IBM Plex Sans nebo Instrument Sans),
  - tickery a čísla: mono (IBM Plex Mono nebo JetBrains Mono) s `font-variant-numeric: tabular-nums`.

  U každého fontu ověřit subset latin-ext (čeština). Self-host přes `next/font`: lepší výkon a kvůli GDPR žádné volání Google Fonts z prohlížeče.
- **Signature prvky:**
  1. burzovní pruh tickerů s reálnými daty (respektuje `prefers-reduced-motion`),
  2. SVG „tah fixou" pod klíčovými čísly,
  3. náhled taháku jako stoh papírů,
  4. štítky „Nekoupíte" a „Dvojče" jako razítka.
- **Layout:**
  - jeden sloupec, okraje 20 px, sekce oddělené tenkou linkou jako v novinách,
  - hlavním vizuálem jsou velká čísla,
  - tlačítka 52 px vysoká, na mobilu přes celou šířku, v inkoustové černé.
- **Zakázáno, protože to vypadá jako AI šablona:**
  - fialovo-modré gradienty, glassmorphism, rozmazané barevné bloby,
  - mřížky 3 karet se stíny, ikony v kroužcích,
  - emoji v textu, stock fotky a AI ilustrace,
  - výchozí Inter/Geist bez úprav,
  - hero s mockupem telefonu.
- **Pohyb:** minimum. Přepočet čísla v kalkulačce trvá 300 ms, tah fixou proběhne jednou při zobrazení.
- **Desktop:** stačí důstojná verze (obsah max. ~680 px, tabulka smí být širší). Optimalizujeme pro mobil.

---

## 14. Texty

Pravidla jsou podrobně v `CLAUDE.md`. Jediný zdroj textů je `src/content/` (typované TS soubory), ne samostatný dokument.

**Koncepty hero** (čísla jsou ilustrativní, finální hodnoty budou z `examples.json`):
- **A:**
  - eyebrow: „Kalkulačka + srovnání 12 ETF z NYSE · data k 30. 9. 2026"
  - H1: „Poplatek 1,8 % ročně vypadá jako drobnost. Za 25 let je to 439 000 Kč."
  - podtitulek: „Spočítejte si to na svých číslech. A stáhněte si tahák: 12 ETF z newyorské burzy, co z nich koupíte z Česka a jak je danit."
- **B:**
  - eyebrow: „Srovnání 12 ETF z NYSE pro české investory"
  - H1: „VOO, SPY, VTI. Z Česka je běžně nekoupíte. Tady je, co místo nich."
  - podtitulek: „Ke každému americkému ETF evropské dvojče, které u českých brokerů koupíte. S poplatky, výnosy v korunách a daněmi."

**Upozornění (krátké, ale viditelné):** „Nejde o investiční doporučení. Minulé výnosy nezaručují budoucí. Hodnota investice může klesat i stoupat, výnos v korunách ovlivňuje kurz USD/CZK. Výpočty jsou modelové."

---

## 15. Právo a compliance (připravenost na spuštění)

- **Upozornění:**
  - nejde o investiční poradenství ve smyslu § 4 odst. 2 písm. e) zákona č. 256/2004 Sb. (ZPKT; odkaz ověřit),
  - minulá výkonnost nezaručuje budoucí,
  - měnové riziko,
  - výpočty jsou modelové.
- **Stránka `/zasady-ochrany-udaju`:**
  - správce (placeholder provozovatele),
  - účel: zaslání taháku a navazujících e-mailů o ETF, o které si uživatel sám řekl,
  - právní základ a doba uchování,
  - zpracovatelé: Vercel, Supabase EU, Resend, PostHog EU, Meta (jen se souhlasem),
  - práva subjektu údajů.
- **E-maily:** jsou obchodní sdělení podle zákona č. 480/2004 Sb. Mikrotext jasně říká, co přijde, a každý e-mail obsahuje odhlášení. Propagace produktů zadavatele vyžaduje samostatný souhlas (patří do launch checklistu).
- **Cookie lišta:** malá, dole, nezakrývá hero. „Přijmout" i „Odmítnout" jsou stejně výrazné. Bez souhlasu běží jen analytika bez cookies.
- **Srovnávací tvrzení:** objektivní a ověřitelná, se zdroji. Žádné konkrétní bankovní fondy nejmenovat negativně.
- **Žádné vymyšlené recenze, počty stažení ani loga médií.** Počítadlo leadů zobrazit, jen když je reálné a přesáhne 100.
- **Provozovatel a impressum:** placeholder, doplní zadavatel.

---

## 16. Výkon a QA

- **Výkonnostní rozpočet:**
  - Lighthouse mobile: výkon ≥ 95, přístupnost 100,
  - LCP < 2,0 s (4G, střední Android), CLS < 0,05, INP < 200 ms,
  - JS při prvním načtení < 120 kB gzip.

  LCP prvkem je text H1 (žádný hero obrázek). PostHog a Pixel se načítají až po prvním vykreslení.
- **Zařízení a situace:**
  - iPhone Safari, Android Chrome,
  - **in-app prohlížeč Instagramu a Facebooku** (stačí si poslat odkaz v DM),
  - šířka 320 px,
  - otevřená klávesnice se sheetem a sticky lištou (`visualViewport`, `dvh`),
  - landscape.
- **Testy:**
  - vitest: kalkulačka,
  - pytest: data,
  - Playwright E2E pro obě varianty: příchod s UTM → kalkulačka → odeslání → děkovný stav → události. Dále chyba serveru, duplicitní e-mail a překlep v doméně.
- **Přístupnost:** kontrast AA, dotykové cíle ≥ 44 px, `<dialog>` pro sheet s fokus pastí, popisky polí, ovládání klávesnicí.
- **Ostatní:** OG obrázek, title a description pro sdílení, favicon, 404, `lang="cs"`.

---

## 17. Očekávaná konverze (model pro README)

**Metrika:** leady / unikátní `landing_viewed` (konverze landing page). Zvlášť sledovat i konverzi klik → lead.

| Krok | Na 100 návštěv | Předpoklad |
|---|---|---|
| Landing viewed | 100 | – |
| Engaged (scroll za hero nebo interakce) | 55 | studený mobilní provoz, slib sedí s reklamou |
| Interakce s kalkulačkou nebo srovnáním | 30 | interakce už v 1. obrazovce |
| Viděl formulář s úmyslem | 18 | formulář je hned u výsledku |
| Začal psát | 12 | 1 pole, autocomplete |
| Odeslal | 9 | ~75 % dokončení u formuláře s 1 polem |

**Odhad: 9 % (pesimisticky 5 %, optimisticky 14 %).**

**Kotvy:** Unbounce Conversion Benchmark 2024 uvádí medián 6,6 % napříč obory, 3,8 % pro finance a pojištění a 3,9 % pro investování. Tyto mediány ale zahrnují i formuláře s více poli a poptávky.
- Výš nás táhne lead magnet s jedním polem, který ukazuje hodnotu předem.
- Níž nás táhne studený provoz ze sociálních sítí na mobilu.

F10 má benchmarky dohledat a přesně ocitovat (URL, rok).

**CPL** (ilustrativně, předpoklady v README označit):
- CPC 10–15 Kč,
- 80 % kliků se skutečně načte,
- CPL ≈ 12 / (0,8 × 0,09) ≈ 170 Kč.

---

## 18. A/B hypotézy (koncept, seřazeno podle očekávaného dopadu)

**Formát:** *Protože [pozorování], věříme, že [změna] zvýší [metriku] o [X]. Poznáme to podle [primární metrika] při n ≈ [návštěv na variantu].*

Velikost vzorku spočítá skript `analytics/sample_size.py` (statsmodels). Orientačně při 9% základní konverzi, α = 0,05 a síle testu 0,8:
- +30 % relativně ≈ 2 000 návštěv na variantu,
- +20 % relativně ≈ 4 300 návštěv na variantu.

1. **Hloubka gate (nejvyšší dopad):**
   - Varianty: karty 4–12 a dvojčata zamčené vs. vše zdarma a za e-mail jen PDF a výpočet.
   - Očekávání: zamčení přinese +30–50 % leadů.
   - Riziko: horší kvalita leadů. Proto sledovat i otevření e-mailu a stažení PDF.
2. **Interaktivní vs. statický hero:**
   - Varianty: výběr částky a živé číslo v první obrazovce vs. jen text a CTA.
   - Očekávání: +15–25 %, protože víc lidí dojde k prvnímu „aha".
3. **Formulace nabídky na CTA:**
   - Varianty: „Pošlete mi můj výpočet" (osobní, 1. osoba) vs. „Chci tahák zdarma".
   - Očekávání: +5–15 %.

**Backlog:**
- tykání vs. vykání,
- skutečné počítadlo stažení,
- sticky lišta ano/ne,
- pořadí kalkulačky a srovnání.

Test úhlů reklam A vs. B běží už od spuštění, takže to není hypotéza pro landing page.

---

## 19. Osnova README

1. Odkazy: živá URL, reklamy (`ads/`), GIF průchodu na mobilu
2. Shrnutí rozhodnutí (5 odrážek)
3. Cílová skupina a insight
4. Nabídka, hodnota před formulářem a moment žádosti o kontakt
5. Reklamy A/B a návaznost první obrazovky (s náhledy)
6. Pořadí sekcí a proč (tabulka)
7. Interaktivní prvky → kontakt
8. Co se stane po odeslání
9. Data a zdroje (tabulka, datum dat, jak data aktualizovat)
10. Měření (funnel, události, kde je vidět, screenshot)
11. Očekávaná konverze (model, kotvy, CPL)
12. 3 A/B hypotézy seřazené podle dopadu
13. Launch checklist (co zbývá před spuštěním reklamy)
14. Technika: stack, lokální spuštění, struktura repa, testy
15. Jak jsem pracoval s Claude Code (`ai-log/`)

---

## 20. Harmonogram a fáze

| Den | Fáze |
|---|---|
| Út 13. 10. večer | F0, začátek F1 |
| St 14. 10. | F1, F2, F3, F4 |
| Čt 15. 10. | F5, F6, F7, F8 |
| Pá 16. 10. dopoledne | F9, F10, odeslání do 12:00 |

**Paralelní práce:** souběžně jde jen F1 (data v `data/`) a F3 (design v `src/components`), ideálně každá ve vlastním worktree. Všechno ostatní dělat postupně.

**Rituál každého chatu:**
1. Vlož prompt fáze z tohoto souboru.
2. Na konci commit + push a odškrtni fázi v §0.
3. Spusť `/export` a ulož výsledek jako `ai-log/NN-faze.md` (např. `03-design.md`). Pokud `/export` v desktop aplikaci nejde, otevři v terminálu ve složce projektu `claude --resume`, vyber session a spusť `/export` tam.

### F0 – Setup (~45 min)
```text
Fáze F0 z docs/PLAN.md. Přečti CLAUDE.md a docs/PLAN.md §2, §11, §20.
1) Založ Next.js projekt (aktuální stabilní verze, App Router, TypeScript, Tailwind, ESLint, src/). create-next-app spusť do dočasné složky a obsah přesuň sem, protože root už obsahuje CLAUDE.md a docs/.
2) Přidej .gitignore (.env* kromě .env.example), .env.example podle PLAN §11 a složky ads/, ai-log/, data/, analytics/, supabase/migrations/ (s .gitkeep).
3) Python část: uv projekt v data/ (pyproject, ruff, pytest, pydantic, httpx, pyyaml).
4) git init, první commit (plán + kostra), přes gh vytvoř veřejné GitHub repo „etf-tahak" a pushni.
5) Nasaď na Vercel a propoj s GitHub repem, aby se main nasazoval automaticky. Vlastní doménu nepoužíváme: pojmenuj Vercel projekt tak, aby URL byla krátká a důvěryhodná (např. etf-tahak.vercel.app; když je obsazená, navrhni mi 3 alternativy). Ověř, že produkční URL vrací 200.
6) README zatím obsahuje jen název, 1 větu, produkční URL a odkaz na repo.
Commituj po krocích. Na konci odškrtni F0 v PLAN §0.
```

### F1 – Data a zdroje (~3 h)
```text
Fáze F1 z docs/PLAN.md: data a zdroje. Přečti §4, §9.1 a §10. Cíl: skutečná data se zdrojem u každého čísla.
1) U každého kandidátního ETF ověř primární listing (NYSE Arca) a vyplň data/etfs.source.yaml: ticker, název, emitent, burza, index, kategorie, TER, AUM, počet pozic, dividendový výnos, výnosy za 1/5/10 let (NAV total return k 30. 9. 2026). U každé hodnoty value/source/as_of. Zdrojem je stránka nebo fact sheet emitenta. Když stránku nejde stáhnout, použij jiný oficiální dokument emitenta (fact sheet PDF, prospekt). Agregátor nikdy jako primární zdroj.
2) Ke každému ETF najdi UCITS dvojče: ticker na Xetra/LSE, ISIN, TER, akumulační/distribuční, domicil. Zdroj = emitent.
3) data/facts.source.yaml:
   - PRIIPs: EUR-Lex + help stránka brokera. Ověř stav k 10/2026 a formulaci „retail, skutečný ETF, ne CFD".
   - Náklady průměrného akciového fondu v ČR: report ESMA, fallback medián z KID 3–5 fondů.
   - Daně: § 4 odst. 1 ZDP (časový test, limit 100 000 Kč, stav od 2026).
   - Předpoklad výnosu.
4) data/build.py:
   - stáhne kurzy ČNB pro potřebná data,
   - přepočte výnosy do CZK (metoda v §10),
   - spočítá examples: 3 000 Kč/měs., 25 let, 6 %, nejlevnější S&P 500 UCITS vs. průměrný fond. Stejný vzorec, jaký bude v calc.ts,
   - zvaliduje vše přes pydantic a zapíše src/data/{etfs,facts,examples}.json.
5) pytest: každá hodnota má zdroj a datum, rozsahy dávají smysl, examples sedí se sdílenými testovacími případy v data/tests/calc_cases.json (později je použije i vitest).
6) Do konzole vypiš tabulku ETF a seznam toho, co se nepodařilo ověřit. Neověřené věci nevymýšlej: označ je `verified: false` a napiš mi je.
Commituj po krocích (yaml, build, testy). uv + ruff. Na konci odškrtni F1.
```

### F2 – Texty (~2 h)
```text
Fáze F2 z docs/PLAN.md: texty. Přečti CLAUDE.md (sekce Texty), PLAN §3–8, §14 a §15, data ze src/data/. Použij skill design:ux-copy.
1) Všechny texty stránky napiš do src/content/ (typované TS):
   - obě varianty hero (poplatky, srovnani) a sekce S2–S7,
   - mikrotexty a chybové hlášky formuláře,
   - děkovný stav, dobrovolnou otázku, sdílení,
   - FAQ, cookie lištu, upozornění,
   - e-mail po odeslání (předmět + tělo),
   - src/content/variants.ts s pořadím sekcí podle varianty.
2) Čísla v textech ber výhradně ze src/data/*.json. Žádná natvrdo.
3) Texty reklam A a B napiš do ads/A-poplatky/copy.md a ads/B-voo/copy.md:
   - primární text (prvních 125 znaků nese celé sdělení), titulek ≤ 40 znaků, popis, CTA tlačítko,
   - UTM odkaz a návaznost na hero,
   - kontrola zásad Mety (osobní vlastnosti, sliby výnosu).
4) Self-review: projdi zakázané fráze a typografická pravidla z CLAUDE.md. Přečti hero nahlas: pochopí ho člověk za 3 s? Ke každé variantě dej 2–3 alternativy H1 a jednu doporuč.
Commit. Na konci odškrtni F2.
```

### F3 – Design systém + statická stránka (~3 h)
```text
Fáze F3 z docs/PLAN.md: design systém a statická stránka. Přečti CLAUDE.md (sekce Design), PLAN §8, §13 a §16. Použij skill frontend-design:frontend-design.
1) Nejdřív udělej 2 rychlé směry hero na mobilu 375×667 v rámci konceptu „anotovaný tahák". Pořiď screenshoty přes Playwright, ukaž mi je a nech mě vybrat.
2) Tokeny (CSS proměnné), fonty přes next/font (ověř latin-ext) a základní komponenty: Button, Section, SourceNote (poznámka pod čarou), TickerBadge, Stamp (Nekoupíte/Dvojče), Highlight (tah fixou), StickyCta, Sheet (<dialog>), LeadForm (zatím bez backendu).
3) Postav staticky všechny sekce S1–S7 s texty ze src/content a daty ze src/data. Routy /, /poplatky a /srovnani podle variants.ts (static generation).
4) Kontrola:
   - screenshoty na 360, 375, 414 a 1280 px,
   - hero včetně CTA se vejde do 360×600,
   - Lighthouse mobile,
   - projdi zakázané vzory z §13.
Commituj po komponentách a sekcích. Na konci odškrtni F3.
```

### F4 – Interaktivní prvky (~3 h)
```text
Fáze F4 z docs/PLAN.md: interaktivní prvky. Přečti §5 a §9.
1) src/lib/calc.ts jako čistá funkce, vitest proti data/tests/calc_cases.json.
2) Kalkulačka:
   - čipy částky, horizont, výnos se štítkem předpokladu, výběr ETF vs. průměrný fond,
   - okamžitý přepočet a vlastní SVG graf,
   - výsledek viditelný hned s výchozími hodnotami,
   - ve variantě poplatky je volba částky už v hero.
3) Srovnávač: karty, filtry, 3 karty zdarma, zbytek rozmazaný s gate. Stav „odemčeno" zatím lokálně, F5 ho napojí na lead.
4) Formulář na všech místech z §5 s parametrem location.
   - Sticky CTA se schová, když je vidět formulář nebo je otevřená klávesnice.
   - Sheet z hero CTA dá fokus na pole přímo v obsluze kliknutí (kvůli iOS).
5) Oprava překlepů v doméně: src/lib/emailTypos.ts + test.
6) Ověř celou interakci v Playwrightu na 375 px, bez posunů layoutu (CLS).
Commituj po prvcích. Na konci odškrtni F4.
```

### F5 – Leady (~3 h)
```text
Fáze F5 z docs/PLAN.md: leady. Přečti §6, §11 a §15. Účty Supabase a Resend zakládám já, řekni mi přesně, co potřebuješ (klíče dám sám do .env.local a do Vercelu).
1) supabase/migrations/001_leads.sql podle §11 (RLS, citext, indexy) a spusť ji.
2) POST /api/lead a /api/lead/profile: zod, honeypot, minimální čas, upsert, duplicita = úspěch, odpověď s downloadUrl, e-mail a serverová událost přes after().
3) Klient:
   - optimistický úspěch, okamžité stažení, odemčení srovnání,
   - přepnutí všech CTA do stavu „hotovo",
   - dobrovolná otázka (čipy),
   - sdílení přes Web Share API s fallbackem „kopírovat odkaz",
   - nápověda ke schránce.
   Při chybě serveru PDF stejně vydat.
4) E-mail přes Resend (React Email nebo čisté HTML): osobní výpočet, odkaz na PDF, 1 další krok, odhlášení. Řídí ho přepínač NEXT_PUBLIC_EMAIL_ENABLED (§11). Když je vypnutý nebo chybí klíč, endpoint funguje dál a e-mail přeskočí. Otestuj odesláním na moji adresu (testovací režim Resend) a ulož screenshot e-mailu do docs/img/. Texty formuláře a děkovného stavu podmiň přepínačem, aby bez e-mailu nic neslibovaly.
5) K leadu ukládej UTM (first-touch ze sessionStorage), variantu, location, snapshot kalkulačky a journey (§11).
6) Stránka /zasady-ochrany-udaju.
7) Otestuj odeslání na 375 px, duplicitu, chybu a záznam v DB. Zkontroluj, že service key není v klientském bundlu.
Commituj po krocích. Na konci odškrtni F5.
```

### F6 – Měření (~2 h)
```text
Fáze F6 z docs/PLAN.md: měření. Přečti §12 a §15. Projekt v PostHogu (EU) založím já.
1) Stub PostHogu ve <head>, do souhlasu bez cookies, po souhlasu přepnout persistenci, knihovnu načítat lazy.
2) Cookie lišta: „Přijmout" a „Odmítnout" stejně výrazné, nezakrývá hero. Meta Pixel jen po souhlasu a jen s ID v env. Po úspěšném odeslání událost Lead.
3) Všechny události z tabulky v §12 implementuj přes jeden modul src/lib/track.ts (typované názvy událostí), se společnými vlastnostmi, detekcí in-app prohlížeče a web vitals.
4) Serverový lead_created přes posthog-node v /api/lead.
5) V testovacím režimu zrcadli události do window.__events. Playwright E2E ověří jejich posloupnost pro obě varianty.
6) V PostHogu vytvoř funnel z §12 s breakdownem (popiš mi kroky, případně přes API). Přidej analytics/funnel.sql nad tabulkou leads.
7) Proklikej to sám na produkci a ověř Live events.
Commit. Na konci odškrtni F6.
```

### F7 – Lead magnet PDF (~2 h)
```text
Fáze F7 z docs/PLAN.md: lead magnet. Přečti §4 a §13.
1) Routa /tahak/print (noindex): tisková verze taháku na A4 ze src/data a src/content, ve stejném design jazyce, se zdroji u každého čísla, datem dat a upozorněním.
2) Skript scripts/render-pdf.ts (Playwright page.pdf) vyrobí public/tahak/<hash>.pdf a PNG náhledy 3 stran pro sekci „Co je v taháku".
3) Zkontroluj PDF na telefonu: čitelnost a velikost < 3 MB.
Commit. Na konci odškrtni F7.
```

### F8 – Reklamy (~1,5 h)
```text
Fáze F8 z docs/PLAN.md: reklamy. Přečti §7 a texty v ads/*/copy.md.
1) Kreativy připrav jako HTML šablony v ads/_src/ se stejnými tokeny a fonty jako web. Čísla ber ze src/data/examples.json.
2) ads/render.mjs (Playwright) vyrobí ads/A-poplatky/feed-1080x1350.png a story-1080x1920.png, totéž pro B. Respektuj bezpečné zóny Stories: horních a dolních ~250 px bez textu.
3) Do copy.md doplň:
   - náhledy,
   - UTM odkazy na /poplatky a /srovnani,
   - návrh cílení: CZ, 24–45 let, zájmy investice/ETF (pozor na Special Ad Category),
   - testovací rozpočet, např. 2× 500 Kč/den po 5 dní,
   - co měřit.
4) Ověř, že hero každé varianty opakuje slib i číslo z kreativy.
Commit. Na konci odškrtni F8.
```

### F9 – QA a připravenost na spuštění (~2 h)
```text
Fáze F9 z docs/PLAN.md: QA a připravenost na spuštění. Přečti §15 a §16. Použij skilly design:accessibility-review a engineering:deploy-checklist.
1) Lighthouse mobile na produkci pro / a /poplatky. Splň rozpočet z §16 a oprav, co nesplní.
2) Playwright na 320/360/375/414 px a v landscape. Sheet a sticky lišta s otevřenou klávesnicí.
3) Projdi texty: typografie, zakázané fráze, každé číslo má zdroj, upozornění jsou vidět.
4) OG obrázek, favicon, title/description, 404.
5) Napiš mi checklist pro ruční test v in-app prohlížeči Instagramu a Facebooku (odkaz si pošlu) a oprav, co z testu vyjde.
6) Security: spusť /security-review. Žádné tajné klíče v repu ani v ai-log.
Commituj po opravách. Na konci odškrtni F9.
```

### F10 – README a odevzdání (~1,5 h)
```text
Fáze F10 z docs/PLAN.md: README a odevzdání. Přečti §17–19 a celé zadání v docs/zadani.md.
1) analytics/sample_size.py (statsmodels, uv): spočítej n pro 3 hypotézy.
2) Dohledej benchmarky konverze a přesně je ocituj (URL, rok).
3) Napiš README podle osnovy v §19. Stručně, s tabulkami, bez vaty. Projdi tabulku v §1 a ověř, že je každý bod zadání splněný v README nebo v repu.
4) GIF nebo screenshoty průchodu na mobilu ulož do docs/img/.
5) Zkontroluj ai-log/: jsou tam exporty všech chatů (00-planovani …) a žádné API klíče ani tajemství.
6) Finální kontrola v anonymním okně: repo je veřejné, URL běží, reklamy jsou v ads/.
7) Připrav mi text odpovědi na e-mail (slovensky nebo česky) s odkazem na repo a URL. Neposílej ho, pošlu sám.
Commit + push. Odškrtni F10.
```

---

## 21. Otevřená rozhodnutí (na tobě)

1. ~~**Doména**~~ **Rozhodnuto 13. 10.:** jen `*.vercel.app`. E-mail je implementovaný, ale v produkci vypnutý. Hodnota se doručuje okamžitě na stránce. Doména a ověření v Resend patří do launch checklistu v README (§11).
2. **Značka:** pracovně „ETF tahák". Ověřit, že název ani doména nejsou obsazené.
3. ~~**„Kdo za tím stojí"**~~ **Rozhodnuto 13. 10.:** autorem je skutečný člověk, ne anonymní značka. Skutečná osoba zvyšuje důvěru a nic se nevymýšlí.
   - **Obsah sekce:** jméno, 1–2 věty o tom, proč tahák vznikl, a odkaz na zdroje dat.
   - **Fotka:** jen pokud ji dodám. Jinak se použije typografický monogram (iniciály v razítku), žádná stock ani AI fotka.
   - **Jméno a text:** v `src/content` jako `AUTHOR`. F2 se mě na ně zeptá.
   - **Provozovatel v patičce:** zůstává placeholder pro zadavatele.
4. ~~**Výjimka z FastAPI**~~ **Rozhodnuto 13. 10.:** formulářový endpoint je Next.js route handler (důvod v §2, bod 8).
5. ~~**Vykání vs. tykání**~~ **Rozhodnuto 13. 10.:** vykání.
6. **Účty, které musíš založit sám:** GitHub (gh), Vercel, Supabase (EU), PostHog (EU), Resend a případně Meta Business (Pixel).

---

## 22. Rizika a co škrtnout při skluzu

| Riziko | Opatření |
|---|---|
| Stránky emitentů jsou v JS nebo blokují stahování | ručně přepsat z PDF fact sheetu s URL a datem, kopii uložit do `data/raw/` |
| Fakt o PRIIPs nebo daních nesedí | ověřit v primárních zdrojích, formulovat opatrně („běžně", „jako retailový klient") |
| Nestihneme to | škrtat v tomto pořadí: sdílení → dobrovolná otázka → animace tickeru → MX kontrola → navazující e-maily → porovnání 2 ETF. **Nikdy neškrtat:** data se zdroji, měření, 1 pole, message match, README, ai-log |
| Paralelní chaty si přepíšou práci | pracovat postupně, nebo ve worktree (ověřit `pwd`, branch a `node_modules`) |
| V ai-logu jsou klíče | před commitem grep na `sk_`, `eyJ`, `phc_`, `re_` apod. |
| Bez domény nejde posílat e-maily | hodnota se doručuje okamžitě na stránce, e-mail je za přepínačem (§11) |

---

## 23. Něco navíc (už je v plánu, ať víš, čím se odlišujeme)

- **Message match:** hero i pořadí sekcí se řídí reklamou. Čísla v reklamě, na webu i v kalkulačce jsou stejná.
- **Výnosy v korunách:** přepočet kurzy ČNB. Pro Čecha je to jediný relevantní pohled.
- **PRIIPs insight a UCITS dvojčata:** skutečná hodnota, kterou americká srovnání nedají.
- **Lead „s cestou":** u každého leadu je uložené UTM, varianta, místo formuláře, výpočet a chování. Díky tomu známe CPL a kvalitu leadů podle reklamy bez závislosti na cookies.
- **Oprava překlepů** v českých e-mailových doménách.
- **Okamžité doručení hodnoty** a otázka na 1 ťuk pro kvalifikaci leadu.
- **Kvalita pod kontrolou:** build neprojde bez zdroje u čísla a E2E test projde celou cestu včetně událostí.
- **Kreativy generované z kódu** a launch checklist v README.
