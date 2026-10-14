# ai-log – F8 Reklamy (Claude Code)

Export konverzace z Claude Code (desktop app) převedený ze surového přepisu do čitelné podoby. Zprávy uživatele jsou pod „👤 Uživatel“, odpovědi a volání nástrojů pod „🤖 Claude“, automatické zprávy klienta (načtený skill, pokračování přerušené odpovědi) pod „⚙️ Klient“. Úvahy modelu a systémové zprávy jsou vynechány, výstupy nástrojů zkráceny a tajné hodnoty maskovány.

## 👤 Uživatel

_(vložený text:)_

> Čtu data a existující kód pro F7. Teď ověřím fakta, která v datech chybí (W-8BEN, termín přiznání, převod měny), protože v taháku nesmí být číslo bez zdroje.
> Ověřuji poslední fakta pro daňovou kapitolu (sazba z dividend a zápočet zahraniční daně) a poté napíšu data a obsah taháku. Shell se přesunul do `/tmp`, takže budu dál používat absolutní cesty do repa.
> Hotovo s rešerší zákonů a IRS. Ověřuji ještě sazbu v § 16 a pak zapisuji fakta do `data/facts.source.yaml`.
> Píšu texty tiskového taháku (`src/content/tahakPrint.ts`), pak komponenty stran.
> Teď komponenty stran a route.
> Stránky jsou hotové vizuálně. Kontroluji poznámkové plochy a pak spouštím skutečný build a render PDF.
> F7 je hotová, commitnutá, pushnutá a nasazená. PDF má 11 stran A4, 1,2 MB a v produkci se stáhne.
> Co přibylo
> 
> * Tisková verze: `/tahak/print` (noindex) renderuje 11 stran ze `src/data` a nového `src/content/tahakPrint.ts`. Je tam srovnání 12 ETF, výnosy v Kč, dvojčata s ISIN, daně, broker, checklist a zdroje. Každý řádek má číslo zdroje `[n]` a datum údaje.
> * PDF a náhledy: `npm run pdf` postaví web a vyrobí `public/tahak/9a91cdaed8.pdf` a 3 PNG náhledy. Selže, když se některá strana přeteče nebo PDF přesáhne 3 MB.
> * Sekce „Co je v taháku": místo CSS papírů ukazuje skutečné strany z PDF. CLS je 0.
> * Nová ověřená fakta v `data/facts.source.yaml`:
>    * sazby daně a práh přiznání 50 000 Kč ze zákona,
>    * srážka z USA 15 % s W-8BEN a 30 % bez něj (IRS) a platnost W-8BEN,
>    * lhůty přiznání za rok 2025 z Finanční správy.
> * Poplatek za převod měny: jen ilustrace 0,1 / 0,5 / 1 % z vkladu, označená jako modelový předpoklad, žádný ceník brokera.
> 
> Ověření
> 
> * Lint, typecheck a 82 unit testů procházejí. Python testy (19) také. Playwright (25) prošel.
> * Měření a lišta cookies na `/tahak/print` neběží.
> * Na produkci vrací PDF, 3 náhledy i `/tahak/print` (s noindex) stav 200.
> * Na 375 px jsem sekci s náhledy zkontroloval screenshotem.
> * Přečtení PDF na telefonu: tabulky jsou čitelné na šířku displeje, ale drobný text (fondy, zdroje) vyžaduje přiblížení.
> 
> Rozhodnutí a co hlídat
> 
> * Vercel env netřeba. Cestu k PDF drží `src/data/leadPdf.json`, `LEAD_PDF_PATH` a `NEXT_PUBLIC_LEAD_PDF_PATH` ji jen přepisují. Děkovný stav tedy hned ukáže „Stáhnout PDF".
> * Po změně dat nebo textů spusťte `npm run pdf` a commitněte výstup.
> * Termíny přiznání za rok 2026 ve zdrojích nejsou, tahák uvádí lhůty za 2025 jako příklad a odkazuje na Finanční správu.
> * Neověřeno: dividendový výnos u VWO a SPY je v tabulce s hvězdičkou. Co tahák daňově neřeší (pořadí prodeje při pravidelných nákupech, ztráty, daň na úrovni fondu), je na straně 6 uvedené.
> * LCP: Lighthouse na `/poplatky` mobil ukázal 3,0 s (v F4 2,6 s). LCP prvkem je pořád H1, ne nové obrázky. Cíl je pod 2 s, patří do F9.
> 
> Připomínám `/export` do `ai-log/07-faze.md`. Další je F8 (reklamy), nejlépe v novém chatu.

pokracuj

## 🤖 Claude

> 🔧 `mcp__ccd_turn__update_plan` — {"items": [{"content": "Přečíst PLAN §0 a sekci F8", "status": "in_progress"}, {"content": "Naplánovat a připravit reklamy (F8)", "status": "pending"}, {"content": "Ověřit, commit…

> ↳ Plan shown (3 steps).

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && git status -sb | head -5 && grep -n "^## \|^### " docs/PLAN.md | head -60

> ↳ ## main...origin/main 9:## 0. Stav (každý chat odškrtne svoji fázi) 25:## 1. Zadání → výstup (kontrola do puntíku) 51:## 2. Klíčová rozhodnutí (TL;DR) 71:## 3. Cílová skupina 92:## 4. Nabídka 117:## 5. Kdy a jak žádáme o kontakt 137:## 6. Po odeslání 155:## 7. Reklamy a návaznost první obrazovky 15…

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ 1 # Plán: konverzní landing page „ETF tahák" (Zadání B) 2 3 Tohle je zdroj pravdy pro všechny navazující chaty. Pravidla práce jsou v `CLAUDE.md`, původní zadání v `docs/zadani.md`. 4 Termín: **pátek 16. 10. 2026**. Cíl je mít hotovo ve čtvrtek večer, aby na pátek zbyla jen kontrola a odeslání. 5 H…

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ 155 ## 7. Reklamy a návaznost první obrazovky 156 157 Platforma je Meta (Instagram + Facebook): feed 4:5 (1080×1350) a Stories/Reels 9:16 (1080×1920). Každá reklama vede na vlastní routu, jejíž hero opakuje slib reklamy. 158 159 ### A – „Poplatky" (averze ke ztrátě → kalkulačka) → `/poplatky` 160 -…

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ 695 ### F7 – Lead magnet PDF (~2 h) – hotovo 696 ```text 697 Fáze F7 z docs/PLAN.md: lead magnet. Přečti §4 a §13. 698 1) Routa /tahak/print (noindex): tisková verze taháku na A4 ze src/data a src/content, ve stejném design jazyce, se zdroji u každého čísla, datem dat a upozorněním. 699 2) Skript s…

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && ls -R ads | head -40; cat src/data/examples.json; ls src/app src/app/*/ | head -40; ls scripts; grep -n "\"scripts\"" -A18 packag…

> ↳ A-poplatky B-voo ads.test.ts ads/A-poplatky: copy.md ads/B-voo: copy.md { "default": { "monthly_czk": 3000, "years": 25, "gross_pct": 6.0, "deposited_czk": 900000, "etf_final_czk": 2029836, "avg_fund_final_czk": 1652523, "difference_czk": 377313, "etf_fee_cost_czk": 8907, "avg_fund_fee_cost_czk": 3…

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && cat ads/A-poplatky/copy.md ads/B-voo/copy.md; cat ads/ads.test.ts; sed -n 1,60p src/app/globals.css; grep -n "font" src/app/layou…

> ↳ # Reklama A: „Poplatky“ → `/poplatky` Čísla jsou z `src/data/examples.json` (3 000 Kč měsíčně, 25 let, výnos 6 % ročně před poplatky). Hlídá je test `ads/ads.test.ts`. ## Texty - **Primární text:** Rozdíl mezi poplatkem 1,46 % a 0,03 % ročně? Za 25 let 377 000 Kč. Modelový výpočet, spočítejte si to…

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && cat scripts/render-pdf.ts | head -80; sed -n 1,30p src/app/layout.tsx; ls .next/static/media 2>/dev/null | head; ls node_modules …

> ↳ /** * Vyrobí PDF taháku a PNG náhledy ze stránky /tahak/print (PLAN F7). * * Spuštění: npm run pdf (postaví web a spustí tenhle skript) * Bez PDF_BASE_URL skript sám nastartuje `next start` na portu 3110 (potřebuje hotový build). * * Výstup: * - public/tahak/<hash>.pdf (hash = prvních 10 znaků SHA-…

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && npm i -D @fontsource-variable/fraunces @fontsource/ibm-plex-mono 2>&1 | tail -3; ls node_modules/@fontsource-variable/fraunces/fi…

> ↳ npm audit fix --force Run `npm audit` for details. fraunces-latin-ext-wght-normal.woff2 fraunces-latin-wght-normal.woff2 ibm-plex-mono-latin-400-normal.woff2 ibm-plex-mono-latin-600-normal.woff2 ibm-plex-mono-latin-ext-400-normal.woff2 ibm-plex-mono-latin-ext-600-normal.woff2 36: diffHeadline: czkR…

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && grep -n "czkRounded" -B2 -A8 src/lib/format.ts | head -40; grep -n "NBSP =" src/lib/format.ts; python3 -c " import json;d=json.lo…

> ↳ 17- 18-/** Zaokrouhlí na násobek `step` a vrátí "377 000 Kč" */ 19:export function czkRounded(n: number, step = 1000): string { 20- return czk(Math.round(n / step) * step); 21-} 22- 23-/** 0.0945 -> "0,0945 %", 1.46 -> "1,46 %" (bez zbytečných nul, minimálně 2 desetinná místa) */ 24-export function…

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && mkdir -p ads/_src && cat > ads/_src/ad.css <<'EOF' /* Tokeny shodné s webem (src/app/globals.css, PLAN §13). Fonty z balíčků @fon…

> ↳ Hotovo: ads/A-poplatky a ads/B-voo -rw-r--r-- 1 kovy staff 87982 Oct 14 19:12 ads/A-poplatky/feed-1080x1350.png -rw-r--r-- 1 kovy staff 90688 Oct 14 19:12 ads/A-poplatky/story-1080x1920.png -rw-r--r-- 1 kovy staff 104532 Oct 14 19:12 ads/B-voo/feed-1080x1350.png -rw-r--r-- 1 kovy staff 111532 Oct 1…

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/A-poplatky/feed-1080x1350.png

> ↳ [obrázek]

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/B-voo/feed-1080x1350.png

> ↳ [obrázek]

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/B-voo/story-1080x1920.png

> ↳ [obrázek]

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && python3 - <<'EOF' p='ads/render.mjs' s=open(p).read() s=s.replace('field(md, "Tabule")\n .split("·")','field(md, "Tabule")\n .rep…

> ↳ Hotovo: ads/A-poplatky a ads/B-voo

Opravil jsem přetékající číslo v kreativě A a špatné parsování tabule v B. Teď kontroluji výsledné PNG.

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/A-poplatky/story-1080x1920.png

> ↳ [obrázek]

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/B-voo/feed-1080x1350.png

> ↳ [obrázek]

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && sed -i 's/.board { background: var(--ink); color: var(--paper); padding: 36px 44px;/.board { background: var(--ink); color: var(-…

> ↳ Exit code 1 sed: 1: "ads/_src/b.html ": command a expects \ followed by text

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/B-voo/story-1080x1920.png

> ↳ [obrázek]

macOS `sed -i` potřebuje příponu, úprava neproběhla. Opravím to přes Edit.

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/ads/_src/b.html

> ↳ The file /Users/kovy/Developer/Junior AI Developer/ads/_src/b.html has been updated successfully.

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && node ads/render.mjs

> ↳ Hotovo: ads/A-poplatky a ads/B-voo

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/ads/B-voo/story-1080x1920.png

> ↳ [obrázek]

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && sed -n 320,388p docs/PLAN.md; sed -n 487,514p docs/PLAN.md

> ↳ ## 12. Měření (tracking plan) **Nástroje:** - **PostHog Cloud EU:** funnely, breakdowny, session replay, později i experimenty. - Do souhlasu běží bez cookies (`persistence: 'memory'`), po souhlasu přejde na `localStorage+cookie`. - Stub snippet je ve `<head>` (s frontou), aby se zachytily i rychlé…

Teď doplním `copy.md` o náhledy, cílení, rozpočet a měření (sdílené části do obou souborů) a přidám npm skript.

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && python3 - <<'EOF' import re def add(path, preview, budget_note): s=open(path).read() s=s.replace("\n## Odkazy (UTM)", f""" ## Náh…

> ↳ package.json | 5 ++++- 1 file changed, 4 insertions(+), 1 deletion(-) RUN v5.0.4 /Users/kovy/Developer/Junior AI Developer Test Files 1 passed (1) Tests 7 passed (7) Start at 19:13:04 Duration 268ms (transform 68%, import 26%, tests 3%, worker 2%) > etf-tahak@0.1.0 lint > eslint

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && python3 - <<'EOF' p='ads/ads.test.ts' s=open(p).read() s=s.replace('import { readFileSync } from "node:fs";','import { readFileSy…

> ↳ Test Files 8 passed (8) Tests 83 passed (83) Start at 19:13:19 Duration 453ms (transform 46%, import 38%, tests 13%, worker 2%) M ads/A-poplatky/copy.md A ads/A-poplatky/feed-1080x1350.png A ads/A-poplatky/story-1080x1920.png M ads/B-voo/copy.md A ads/B-voo/feed-1080x1350.png A ads/B-voo/story-1080…

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && git reset -q && git add ads package.json package-lock.json && git commit -q -m "feat(ads): render Meta creatives from HTML templa…

> ↳ 14e10b6 docs(plan): mark F8 done and record ads workflow 43de0e9 feat(ads): render Meta creatives from HTML templates with Playwright c0dd532 docs(plan): mark F7 done and record tax facts and PDF workflow ## main...origin/main

> 🔧 `mcp__ccd_turn__wrap_up` — {"recap": "F8 je hotová, commitnutá a pushnutá. `npm run ads` vyrobí 4 PNG kreativ (feed a story pro A a B) z šablon v `ads/_src/`. `copy.md` má náhledy, cílení, rozpočet a metrik…

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

> 🔧 `ToolSearch` — select:mcp__ccd_session_mgmt__export_transcript,mcp__ccd_session_mgmt__list_sessions

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && ls -la ai-log

> ↳ total 520 drwxr-xr-x 11 kovy staff 352 Oct 14 16:46 . drwxr-xr-x@ 32 kovy staff 1024 Oct 14 17:05 .. -rw-r--r-- 1 kovy staff 0 Oct 14 10:00 .gitkeep -rw-r--r-- 1 kovy staff 16848 Oct 14 03:45 00-planovani.md -rw-r--r-- 1 kovy staff 10098 Oct 14 15:39 00-setup.md -rw-r--r-- 1 kovy staff 44961 Oct 14…

> 🔧 `mcp__ccd_session_mgmt__export_transcript` — {"session_id": "self"}

> 🔧 `mcp__ccd_session_mgmt__list_sessions` — {"limit": 8}

> ↳ _(výpis jiných projektů a sezení vynechán)_

> ↳ _(výpis jiných projektů a sezení vynechán)_

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && S=/private/tmp/claude-501/-Users-kovy-Developer-Junior-AI-Developer/2cb95c58-1a6a-4846-af6b-2193360bbcff/scratchpad && mkdir -p $…

> ↳ /private/tmp/claude-501/-Users-kovy-Developer-Junior-AI-Developer/2cb95c58-1a6a-4846-af6b-2193360bbcff/scratchpad/exp/2cb95c58-1a6a-4846-af6b-2193360bbcff.jsonl /private/tmp/claude-501/-Users-kovy-Developer-Junior-AI-Developer/2cb95c58-1a6a-4846-af6b-2193360bbcff/scratchpad/exp/transcript.jsonl /pr…

> 🔧 `Bash` — cd /private/tmp/claude-501/-Users-kovy-Developer-Junior-AI-Developer/2cb95c58-1a6a-4846-af6b-2193360bbcff/scratchpad/exp && wc -l transcript.jsonl && python3 -I - <<'EOF' import j…

> ↳ _(výpis jiných projektů a sezení vynechán)_

> 🔧 `mcp__ccd_session_mgmt__list_sessions` — {"limit": 40}

> ↳ _(výpis jiných projektů a sezení vynechán)_

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && sed -n 1,4p ai-log/06-faze.md; grep -c "🔧" ai-log/06-faze.md; tail -c 600 ai-log/06-faze.md; python3 -I - <<'EOF' import json n=0…

> ↳ # ai-log – F6 Měření a souhlas s cookies (Claude Code) Export konverzace z Claude Code (desktop app), převedený do čitelné podoby: zprávy uživatele, odpovědi asistenta a zkrácená volání nástrojů. Úvahy modelu jsou vynechány. Chat obsahuje i převod exportů F0 až F5 do ai-log a poslední fázi F6. 129 …

Exportuju přepis této relace přes nástroj aplikace a převádím ho do čitelného markdownu stejným formátem jako `06-faze.md`. Pak zkontroluji, že v něm nejsou klíče.

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && S=/private/tmp/claude-501/-Users-kovy-Developer-Junior-AI-Developer/2cb95c58-1a6a-4846-af6b-2193360bbcff/scratchpad && cat > $S/c…

> ↳ 13670 ai-log/08-faze.md 0 73:> 🔧 `Bash` — Read ad copy, ad test, tokens, fonts 166:- `npm run ads` (`ads/render.mjs`) vyrobí z `ads/_src/{a,b}.html` čtyři kreativy. Jsou to `feed-1080x1350.png` a `story-1080x1920.png` pro A i B. Každá má stejné tokeny jako web a fonty z balíčků `@fontsource`. ještě…

> 🔧 `Bash` — cd "/Users/kovy/Developer/Junior AI Developer" && git add ai-log/08-faze.md && git commit -q -m "docs(ai-log): add exported chat for phase F8 Co-Authored-By: Claude Sonnet 5.5 <no…

> ↳ ## main...origin/main

Máte pravdu, udělal jsem to já. `ai-log/08-faze.md` je v repu a pushnutý. Příkaz `/export` sám spustit neumím, ale použil jsem export přepisu relace z aplikace. Zip je v `~/Downloads`. Převedl jsem ho do čitelného markdownu ve stejném formátu jako `06-faze.md` (zprávy a zkrácená volání nástrojů, bez úvah modelu). Prohledal jsem ho na klíče a tokeny a nic nenašel.

`ai-log/07-faze.md` vytvořit nejde. Tahle relace začíná vloženým závěrem F7, samotná práce na F7 v ní není. Mezi uloženými relacemi jsem chat s F7 nenašel. Závěrečná zpráva F7 je ale v úvodu `08-faze.md`. Pokud ten chat ještě někde máte, řekněte mi a doplním ho. Jinak bych v README u F7 uvedl, že log chybí a že shrnutí je v `08-faze.md`.

## 👤 Uživatel

takze kolik toho jeste zbyva?

## 🤖 Claude

> 🔧 `Read` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ 745 ```text 746 Fáze F10 z docs/PLAN.md: README a odevzdání. Přečti §17–19 a celé zadání v docs/zadani.md. 747 1) analytics/sample_size.py (statsmodels, uv): spočítej n pro 3 hypotézy. 748 2) Dohledej benchmarky konverze a přesně je ocituj (URL, rok). 749 3) Napiš README podle osnovy v §19. Stručně…

Zbývají dvě fáze, F9 a F10, plus pár věcí, které musíte udělat vy. Do termínu (pátek 16. 10.) jsou dva dny.

**F9, QA a připravenost na spuštění (~2 h)**
- Lighthouse mobil na produkci. LCP je teď 3,0 s na `/poplatky`, cíl je pod 2 s, takže je to hlavní oprava.
- Playwright na 320/360/375/414 px a na šířku, lišta a sheet s klávesnicí.
- Kontrola textů: typografie, zakázané fráze, zdroje u čísel.
- OG obrázek, favicon, 404.
- Checklist pro ruční test v in-app prohlížeči Instagramu a Facebooku. Ten testujete vy.
- `/security-review` a kontrola, že v repu ani v ai-logu nejsou klíče.
- Supabase: pravidelný dotaz proti pozastavení a rate limit na `/api/lead`.
- Ověření Special Ad Category u Mety.

**F10, README a odevzdání (~1,5 h)**
- `analytics/sample_size.py` a benchmarky konverze s přesnou citací.
- README podle osnovy §19 a kontrola tabulky zadání (§1).
- Screenshoty nebo GIF průchodu do `docs/img/`.
- Kontrola `ai-log/` včetně `07-faze.md`, který chybí (ke zvážení: poznámka v README).
- Finální kontrola v anonymním okně a text e-mailu s odkazem. E-mail pošlete vy.

**Na vás**
- Ruční test v in-app prohlížeči IG/FB.
- Rozhodnutí o značce „ETF tahák" (ověřit, že není obsazená) a jméno autora a text sekce „Kdo za tím stojí", pokud ještě nejsou doplněné.
- Odeslání odpovědi a případně Meta účet a Pixel.

Odhad je asi 3,5 h práce, takže to do pátku zvládneme, když F9 spustíte hned. Doporučuji ji začít v novém chatu, ať má čistý `ai-log/09-faze.md`.
