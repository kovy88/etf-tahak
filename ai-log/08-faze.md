# ai-log – F8 Reklamy (Claude Code)

Export konverzace z Claude Code (desktop app), převedený do čitelné podoby: zprávy uživatele, odpovědi asistenta a zkrácená volání nástrojů. Úvahy modelu jsou vynechány. Chat začíná vloženým závěrem fáze F7 (tahák a PDF), samotná práce na F7 proběhla v předchozím chatu a v této relaci není. Hlavní obsah je fáze F8 (kreativy reklam).

## 👤 Uživatel

<pasted_content id="d447">
Čtu data a existující kód pro F7. Teď ověřím fakta, která v datech chybí (W-8BEN, termín přiznání, převod měny), protože v taháku nesmí být číslo bez zdroje.
Ověřuji poslední fakta pro daňovou kapitolu (sazba z dividend a zápočet zahraniční daně) a poté napíšu data a obsah taháku. Shell se přesunul do `/tmp`, takže budu dál používat absolutní cesty do repa.
Hotovo s rešerší zákonů a IRS. Ověřuji ještě sazbu v § 16 a pak zapisuji fakta do `data/facts.source.yaml`.
Píšu texty tiskového taháku (`src/content/tahakPrint.ts`), pak komponenty stran.
Teď komponenty stran a route.
Stránky jsou hotové vizuálně. Kontroluji poznámkové plochy a pak spouštím skutečný build a render PDF.
F7 je hotová, commitnutá, pushnutá a nasazená. PDF má 11 stran A4, 1,2 MB a v produkci se stáhne.
Co přibylo

* Tisková verze: `/tahak/print` (noindex) renderuje 11 stran ze `src/data` a nového `src/content/tahakPrint.ts`. Je tam srovnání 12 ETF, výnosy v Kč, dvojčata s ISIN, daně, broker, checklist a zdroje. Každý řádek má číslo zdroje `[n]` a datum údaje.
* PDF a náhledy: `npm run pdf` postaví web a vyrobí `public/tahak/9a91cdaed8.pdf` a 3 PNG náhledy. Selže, když se některá strana přeteče nebo PDF přesáhne 3 MB.
* Sekce „Co je v taháku": místo CSS papírů ukazuje skutečné strany z PDF. CLS je 0.
* Nová ověřená fakta v `data/facts.source.yaml`:
   * sazby daně a práh přiznání 50 000 Kč ze zákona,
   * srážka z USA 15 % s W-8BEN a 30 % bez něj (IRS) a platnost W-8BEN,
   * lhůty přiznání za rok 2025 z Finanční správy.
* Poplatek za převod měny: jen ilustrace 0,1 / 0,5 / 1 % z vkladu, označená jako modelový předpoklad, žádný ceník brokera.

Ověření

* Lint, typecheck a 82 unit testů procházejí. Python testy (19) také. Playwright (25) prošel.
* Měření a lišta cookies na `/tahak/print` neběží.
* Na produkci vrací PDF, 3 náhledy i `/tahak/print` (s noindex) stav 200.
* Na 375 px jsem sekci s náhledy zkontroloval screenshotem.
* Přečtení PDF na telefonu: tabulky jsou čitelné na šířku displeje, ale drobný text (fondy, zdroje) vyžaduje přiblížení.

Rozhodnutí a co hlídat

* Vercel env netřeba. Cestu k PDF drží `src/data/leadPdf.json`, `LEAD_PDF_PATH` a `NEXT_PUBLIC_LEAD_PDF_PATH` ji jen přepisují. Děkovný stav tedy hned ukáže „Stáhnout PDF".
* Po změně dat nebo textů spusťte `npm run pdf` a commitněte výstup.
* Termíny přiznání za rok 2026 ve zdrojích nejsou, tahák uvádí lhůty za 2025 jako příklad a odkazuje na Finanční správu.
* Neověřeno: dividendový výnos u VWO a SPY je v tabulce s hvězdičkou. Co tahák daňově neřeší (pořadí prodeje při pravidelných nákupech, ztráty, daň na úrovni fondu), je na straně 6 uvedené.
* LCP: Lighthouse na `/poplatky` mobil ukázal 3,0 s (v F4 2,6 s). LCP prvkem je pořád H1, ne nové obrázky. Cíl je pod 2 s, patří do F9.

Připomínám `/export` do `ai-log/07-faze.md`. Další je F8 (reklamy), nejlépe v novém chatu.
</pasted_content id="d447">

pokracuj

## 🤖 Claude

> 🔧 `mcp__ccd_turn__update_plan` — {"items": [{"content": "Přečíst PLAN §0 a sekci F8", "status": "in_progress"}, {"content": "Naplánovat a připravit reklamy (F8)", "status": "pending"}, {"conten…

> ↳ Plan shown (3 steps).

> 🔧 `Bash` — Show git status and PLAN headings

> ↳ ## main...origin/main 9:## 0. Stav (každý chat odškrtne svoji fázi) 25:## 1. Zadání → výstup (kontrola do puntíku) 51:## 2. Klíčová rozhodnutí (TL;DR) 71:## 3. Cílová skupina 92:## 4. Nabídka 117:## 5. Kdy a jak žádáme o kontakt 137:## 6. Po odeslání 155:## 7. Reklamy a návaznost první obrazovky 159…

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ 1 # Plán: konverzní landing page „ETF tahák" (Zadání B) 2 3 Tohle je zdroj pravdy pro všechny navazující chaty. Pravidla práce jsou v `CLAUDE.md`, původní zadání v `docs/zadani.md`. 4 Termín: **pátek 16. 10. 2026**. Cíl je mít hotovo ve čtvrtek večer, aby na pátek zbyla jen kontrola a odeslání. 5 Ho…

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ 155 ## 7. Reklamy a návaznost první obrazovky 156 157 Platforma je Meta (Instagram + Facebook): feed 4:5 (1080×1350) a Stories/Reels 9:16 (1080×1920). Každá reklama vede na vlastní routu, jejíž hero opakuje slib reklamy. 158 159 ### A – „Poplatky" (averze ke ztrátě → kalkulačka) → `/poplatky` 160 - …

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ 695 ### F7 – Lead magnet PDF (~2 h) – hotovo 696 ```text 697 Fáze F7 z docs/PLAN.md: lead magnet. Přečti §4 a §13. 698 1) Routa /tahak/print (noindex): tisková verze taháku na A4 ze src/data a src/content, ve stejném design jazyce, se zdroji u každého čísla, datem dat a upozorněním. 699 2) Skript sc…

> 🔧 `Bash` — Inspect ads dir, examples data, scripts

> ↳ A-poplatky B-voo ads.test.ts ads/A-poplatky: copy.md ads/B-voo: copy.md { "default": { "monthly_czk": 3000, "years": 25, "gross_pct": 6.0, "deposited_czk": 900000, "etf_final_czk": 2029836, "avg_fund_final_czk": 1652523, "difference_czk": 377313, "etf_fee_cost_czk": 8907, "avg_fund_fee_cost_czk": 38…

> 🔧 `Bash` — Read ad copy, ad test, tokens, fonts

> ↳ # Reklama A: „Poplatky“ → `/poplatky` Čísla jsou z `src/data/examples.json` (3 000 Kč měsíčně, 25 let, výnos 6 % ročně před poplatky). Hlídá je test `ads/ads.test.ts`. ## Texty - **Primární text:** Rozdíl mezi poplatkem 1,46 % a 0,03 % ročně? Za 25 let 377 000 Kč. Modelový výpočet, spočítejte si to …

> 🔧 `Bash` — Inspect render script, fonts, hero, etfs data

> ↳ /** * Vyrobí PDF taháku a PNG náhledy ze stránky /tahak/print (PLAN F7). * * Spuštění: npm run pdf (postaví web a spustí tenhle skript) * Bez PDF_BASE_URL skript sám nastartuje `next start` na portu 3110 (potřebuje hotový build). * * Výstup: * - public/tahak/<hash>.pdf (hash = prvních 10 znaků SHA-2…

> 🔧 `Bash` — Install font packages and list font files

> ↳ npm audit fix --force Run `npm audit` for details. fraunces-latin-ext-wght-normal.woff2 fraunces-latin-wght-normal.woff2 ibm-plex-mono-latin-400-normal.woff2 ibm-plex-mono-latin-600-normal.woff2 ibm-plex-mono-latin-ext-400-normal.woff2 ibm-plex-mono-latin-ext-600-normal.woff2 36: diffHeadline: czkRo…

> 🔧 `Bash` — Check rounding helper and ETF ids

> ↳ 17- 18-/** Zaokrouhlí na násobek `step` a vrátí "377 000 Kč" */ 19:export function czkRounded(n: number, step = 1000): string { 20- return czk(Math.round(n / step) * step); 21-} 22- 23-/** 0.0945 -> "0,0945 %", 1.46 -> "1,46 %" (bez zbytečných nul, minimálně 2 desetinná místa) */ 24-export function …

> 🔧 `Bash` — Create ad templates and render script, run it

> ↳ Hotovo: ads/A-poplatky a ads/B-voo -rw-r--r-- 1 kovy staff 87982 Oct 14 19:12 ads/A-poplatky/feed-1080x1350.png -rw-r--r-- 1 kovy staff 90688 Oct 14 19:12 ads/A-poplatky/story-1080x1920.png -rw-r--r-- 1 kovy staff 104532 Oct 14 19:12 ads/B-voo/feed-1080x1350.png -rw-r--r-- 1 kovy staff 111532 Oct 14…

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/A-poplatky/feed-1080x1350.png

> ↳ 

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/B-voo/feed-1080x1350.png

> ↳ 

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/B-voo/story-1080x1920.png

> ↳ 

> 🔧 `Bash` — Fix ticker parsing and number size, rerender

> ↳ Hotovo: ads/A-poplatky a ads/B-voo

Opravil jsem přetékající číslo v kreativě A a špatné parsování tabule v B. Teď kontroluji výsledné PNG.

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/A-poplatky/story-1080x1920.png

> ↳ 

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/B-voo/feed-1080x1350.png

> ↳ 

> 🔧 `Bash` — Make room for stamp and rerender

> ↳ Exit code 1 sed: 1: "ads/_src/b.html ": command a expects \ followed by text

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/B-voo/story-1080x1920.png

> ↳ 

macOS `sed -i` potřebuje příponu, úprava neproběhla. Opravím to přes Edit.

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/ads/_src/b.html

> ↳ The file /Users/kovy/Developer/Junior AI Developer/ads/_src/b.html has been updated successfully.

> 🔧 `Bash` — Rerender ads

> ↳ Hotovo: ads/A-poplatky a ads/B-voo

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/B-voo/story-1080x1920.png

> ↳ 

> 🔧 `Bash` — Read tracking plan and conversion model

> ↳ ## 12. Měření (tracking plan) **Nástroje:** - **PostHog Cloud EU:** funnely, breakdowny, session replay, později i experimenty. - Do souhlasu běží bez cookies (`persistence: 'memory'`), po souhlasu přejde na `localStorage+cookie`. - Stub snippet je ve `<head>` (s frontou), aby se zachytily i rychlé …

Teď doplním `copy.md` o náhledy, cílení, rozpočet a měření (sdílené části do obou souborů) a přidám npm skript.

> 🔧 `Bash` — Update copy.md files, add script, run tests, lint, typecheck

> ↳ package.json | 5 ++++- 1 file changed, 4 insertions(+), 1 deletion(-) RUN v5.0.4 /Users/kovy/Developer/Junior AI Developer Test Files 1 passed (1) Tests 7 passed (7) Start at 19:13:04 Duration 268ms (transform 68%, import 26%, tests 3%, worker 2%) > etf-tahak@0.1.0 lint > eslint

> 🔧 `Bash` — Add PNG test, update PLAN, run all tests, stage

> ↳ Test Files 8 passed (8) Tests 83 passed (83) Start at 19:13:19 Duration 453ms (transform 46%, import 38%, tests 13%, worker 2%) M ads/A-poplatky/copy.md A ads/A-poplatky/feed-1080x1350.png A ads/A-poplatky/story-1080x1920.png M ads/B-voo/copy.md A ads/B-voo/feed-1080x1350.png A ads/B-voo/story-1080x…

> 🔧 `Bash` — Commit in two steps and push

> ↳ 14e10b6 docs(plan): mark F8 done and record ads workflow 43de0e9 feat(ads): render Meta creatives from HTML templates with Playwright c0dd532 docs(plan): mark F7 done and record tax facts and PDF workflow ## main...origin/main

> 🔧 `mcp__ccd_turn__wrap_up` — {"recap": "F8 je hotová, commitnutá a pushnutá. `npm run ads` vyrobí 4 PNG kreativ (feed a story pro A a B) z šablon v `ads/_src/`. `copy.md` má náhledy, cílení…

> ↳ Nothing is pending, so the app draws no box; the recap is the session's status. Your closing message is your answer to the user: write it now, as the last thing you say this turn.

F8 (reklamy) je hotová, commitnutá a pushnutá.

**Co přibylo**
- `npm run ads` (`ads/render.mjs`) vyrobí z `ads/_src/{a,b}.html` čtyři kreativy. Jsou to `feed-1080x1350.png` a `story-1080x1920.png` pro A i B. Každá má stejné tokeny jako web a fonty z balíčků `@fontsource`.
- Texty bere skript z oddílu „Kreativa“ v `copy.md`, takže čísla mají jeden zdroj (`src/data/examples.json` přes test).
- Skript selže, když obsah přeteče vodorovně nebo svisle. Stories mají nahoře i dole 270 px bez textu.
- `copy.md` obou reklam má nově náhledy, návrh kampaně a metriky:
  - **Cílení:** CZ, 24–45 let, zájmy investování, ETF a osobní finance.
  - **Rozpočet:** 2 × 500 Kč/den × 5 dní.
  - **Měření:** podle `utm_content`, `landing_viewed` proti klikům v Metě a `lead_created`.
- `ads/ads.test.ts` hlídá čísla proti datům a shodu s hero. Nově ověřuje i rozměry PNG.
- Hero `/poplatky` opakuje „377 000 Kč za 25 let“ a hero `/srovnani` větu „VOO, SPY, VTI. Z Česka je běžně nekoupíte.“. Shodu kontroluje test.

**Co hlídat**
- **Special Ad Category:** neověřeno, jestli ji Meta pro CZ vynutí. Pokud ano, omezí věk, lokalitu a zájmy, takže cílení v `copy.md` platí jen v rozsahu, který Meta dovolí. Ověří se při zakládání kampaně a patří do F9 a do launch checklistu.
- **Postup F9:** F9 je další fáze (QA, Lighthouse, in-app prohlížeč, rate limit, Supabase). Nejlépe ji spusťte v novém chatu.
- **Vzhled:** PNG jsem prošel očima na feedu a ve stories, vzhled jsem nijak nehodnotil přes Playwright na 375 px, protože jde o obrázky, ne o web.
- **Před odevzdáním:** `/export` do `ai-log/08-faze.md`. Dřívější `ai-log/07-faze.md` z F7 jste podle zprávy zatím neexportoval.

## 👤 Uživatel

Před odevzdáním: /export do ai-log/08-faze.md. Dřívější ai-log/07-faze.md z F7 jste podle zprávy zatím neexportoval.

to mas delat ty

## 🤖 Claude

> 🔧 `ToolSearch` — {"query": "select:mcp__ccd_session_mgmt__export_transcript,mcp__ccd_session_mgmt__list_sessions", "max_results": 5}

> ↳ 

> 🔧 `Bash` — List ai-log directory

> ↳ total 520 drwxr-xr-x 11 kovy staff 352 Oct 14 16:46 . drwxr-xr-x@ 32 kovy staff 1024 Oct 14 17:05 .. -rw-r--r-- 1 kovy staff 0 Oct 14 10:00 .gitkeep -rw-r--r-- 1 kovy staff 16848 Oct 14 03:45 00-planovani.md -rw-r--r-- 1 kovy staff 10098 Oct 14 15:39 00-setup.md -rw-r--r-- 1 kovy staff 44961 Oct 14 …

> 🔧 `mcp__ccd_session_mgmt__export_transcript` — {"session_id": "self"}

> 🔧 `mcp__ccd_session_mgmt__list_sessions` — {"limit": 8}
