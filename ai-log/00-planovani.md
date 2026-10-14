# ai-log 00 – Plánování (Claude Code)

Export konverzace z Claude Code (desktop app), převedený do čitelné podoby: zprávy uživatele, odpovědi asistenta a zkrácená volání nástrojů.

## 👤 Uživatel

ZADANIE B: Konverzná landing page

Cieľom je landing page s porovnaním ETF obchodovaných na NYSE pre českého drobného investora, ktorý prichádza z reklamy na mobile a stránke venuje len niekoľko sekúnd. Stránka má fungovať ako lead magnet: ponúknuť návštevníkovi hodnotu a výmenou za ňu získať jeho kontakt. Pekný dizajn nestačí, stránka musí byť optimalizovaná na prínos kontaktov. Zároveň nesmie pôsobiť ako základný výstup od Claude. Dizajn aj texty majú byť premyslené pre túto cieľovú skupinu. Pri hodnotení sa budem riadiť hlavne otázkou, či by sme na ňu mohli zajtra spustiť reklamu.

Určte cieľovú skupinu, čo návštevník dostane výmenou za kontakt a v ktorom momente oň požiadate. Hodnota by mala byť zrejmá ešte pred vyplnením formulára. Navrhnite aj dve verzie reklamy. Prvá obrazovka stránky by mala nadväzovať na prísľub reklamy a okamžite komunikovať, čo návštevník získa.

Výber interaktívnych prvkov, napríklad porovnania fondov, kalkulačky poplatkov alebo skladania portfólia, nechávam na Vás. Každý z nich by mal viesť ku kontaktu. Formulár by mal mať čo najmenej polí. Premyslite aj to, čo návštevník dostane po jeho odoslaní.

Použite skutočné dáta s uvedením zdroja a merajte celú cestu od príchodu po odoslanie formulára. V README zdôvodnite poradie sekcií, uveďte očakávanú konverziu a tri hypotézy na A/B test zoradené podľa očakávaného dopadu. Stránku nasaďte na bezplatný hosting, napríklad Vercel.


Riešenie prosím zašlite do 16. 10. 2026 ako odpoveď na tento e-mail. Priložte odkaz na verejný repozitár na GitHube a pri zadaní B aj URL stránky. V repozitári by mal byť výsledok (pri zadaní A plán, dáta zo vzorky so zdrojom pri každom údaji a výsledok merania presnosti, pri zadaní B obe verzie reklamy), kód s priebežnou históriou commitov a v priečinku ai-log export konverzácií s Claude Code (príkaz /export).


tady mas zadani ktere splinis do punitku a idealne tam das neco navic 

tvym ukolem pro ted je vytovrit robusni plan komplexni at to vsechno splmime ja to pak v ostatincih chatech budu postupne delat takze tam dej i nejake instrukce podke ceho se to ma ridit

> 🔧 `Bash` — List contents of the project directory

> 🔧 `ToolSearch` — select:WebSearch,WebFetch

> ↳ 

> ↳ total 0 drwxr-xr-x@  2 kovy  staff   64 Oct 13 17:32 . drwxr-xr-x@ 17 kovy  staff  544 Oct 13 17:32 .. .

> 🔧 `WebSearch` — PRIIPs KID US-domiciled ETF EU retail investors cannot buy VOO 2026 Retail Investment Strategy change

> 🔧 `WebSearch` — Unbounce conversion benchmark report median landing page conversion rate finance lead generation

> 🔧 `WebSearch` — Meta special ad category financial products and services required EU countries 2025 Czech Republic

> 🔧 `WebSearch` — časový test cenné papíry 2026 limit 40 milionů osvobození 100 000 Kč zákon o daních z příjmů

> ↳ Web search results for query: "Meta special ad category financial products and services required EU countries 2025 Czech Republic"  Links: [{"title":"Meta blocks political ads in EU as TTPA regulation takes effect","url":"https://ppc.land/meta-blocks-political-ads-in-eu-as-ttpa-regulation-takes-effe…

> ↳ Web search results for query: "PRIIPs KID US-domiciled ETF EU retail investors cannot buy VOO 2026 Retail Investment Strategy change"  Links: [{"title":"retail investment strategy the bold plan to put retail investors first","url":"https://apexgroup.com/insights/retail-investment-strategy-the-bold-p…

> ↳ Web search results for query: "Unbounce conversion benchmark report median landing page conversion rate finance lead generation"  Links: [{"title":"unbounce unbounce","url":"https://unbounce.com/?p=135737"},{"title":"unbounce unbounce","url":"https://unbounce.com/?p=94305"},{"title":"unbounce unboun…

> ↳ Web search results for query: "časový test cenné papíry 2026 limit 40 milionů osvobození 100 000 Kč zákon o daních z příjmů"  Links: [{"title":"Přeskočit na obsah","url":"https://arws.cz/novinky-v-arrows/jak-se-od-roku-2026-opet-meni-daneni-prijmu-z-prevodu-podilu-v-s-r-o-a-prodeje-akcii"},{"title":…

> 🔧 `Write` — /Users/kovy/Developer/Junior AI Developer/docs/zadani.md

> ↳ File created successfully at: /Users/kovy/Developer/Junior AI Developer/docs/zadani.md (file state is current in your context — no need to Read it back)

> 🔧 `Write` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ File created successfully at: /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md (file state is current in your context — no need to Read it back)

> 🔧 `Write` — /Users/kovy/Developer/Junior AI Developer/CLAUDE.md

> ↳ File created successfully at: /Users/kovy/Developer/Junior AI Developer/CLAUDE.md (file state is current in your context — no need to Read it back)

## 🤖 Claude

Plán je hotový ve třech souborech:

- **[CLAUDE.md](CLAUDE.md)**: pravidla projektu. Každý nový chat v této složce si je načte sám: stack, pravidla produktu, design a texty, co znamená „hotovo“ a jak commitovat.
- **[docs/PLAN.md](docs/PLAN.md)**: hlavní plán. Začíná tabulkou, kde je každý bod zadání spárovaný s konkrétním výstupem. Dál obsahuje strategii, specifikace, tracking plan, koncept README a 11 fází, každou s promptem pro nový chat.
- **[docs/zadani.md](docs/zadani.md)**: původní znění zadání.

**Hlavní rozhodnutí v plánu:**
- **Cílovka a hlavní myšlenka:** začínající český investor, který slyšel o „VOO“. Jenže ho jako drobný investor v EU běžně nekoupí, protože americké ETF nemají povinný dokument pro EU (KID podle nařízení PRIIPs). Navíc výnos v korunách se liší od výnosu v dolarech a platí české daně. Tahle mezera dává nabídce hodnotu a obě reklamy na ní stojí.
- **Nabídka a formulář:** výměnou za e-mail návštěvník dostane „ETF tahák“ v PDF, svůj výpočet a odemčené srovnání. Formulář má jen pole pro e-mail. Kontakt chceme hlavně hned po výsledku kalkulačky. Ten výsledek ale za e-mailem není, takže hodnotu vidí ještě před formulářem.
- **Reklamy:** dvě verze, A „Poplatky“ a B „VOO z Česka nekoupíte“. Každá vede na vlastní stránku, jejíž první obrazovka opakuje slib a čísla z reklamy.
- **Měření:** PostHog do souhlasu s cookies běží bez nich. Server navíc zaznamená každý nový lead a u leadu v databázi se uloží, z jaké reklamy přišel a co na stránce dělal.

**Co musíš rozhodnout sám (PLAN §21):**
1. **Doména:** doporučuji koupit (asi 200 Kč). Bez ní Resend nedoručí e-maily na cizí adresy.
2. **FastAPI:** navrhuji výjimku z tvého pravidla pro formulářový endpoint. Bezplatný Render se po nečinnosti probouzí desítky sekund a během té doby by se ztrácely leady z placené reklamy.
3. **Vlastní jméno a fotka** v sekci „Kdo za tím stojí“, nebo anonymní značka?
4. **Účty:** Vercel, Supabase, PostHog, Resend a GitHub musíš založit sám.

Část faktů jsem ověřil, ale ještě je potřeba je potvrdit z primárních zdrojů. Plán je má u sebe označené ke kontrole ve fázi F1:
- **Americká ETF z EU:** zákaz pro drobné investory platí. Nenašel jsem žádnou změnu v roce 2026.
- **Daně:** od roku 2026 je u cenných papírů zrušený strop 40 mil. Kč pro osvobození. Limit 100 000 Kč chci ověřit přímo v zákoně.
- **Kategorie reklam Meta:** povinnost zařadit finanční reklamy do zvláštní kategorie je potvrzená jen pro USA. Pro Česko nejasné.

Jako odhad konverze plán počítá s 9 % (rozmezí 5–14 %). Opírá se o srovnávací data Unbounce: 6,6 % napříč obory a 3,8 % pro finance.

**Další krok:** otevři nový chat a vlož prompt F0 z PLAN §20. Až F0 vytvoří složku `ai-log/`, vyexportuj tenhle chat jako `ai-log/00-planovani.md`.

Zdroje:
- [PRIIPs a americká ETF (finorum)](https://finorum.com/us-etfs-in-europe/), [Lynx – KID](https://lynxbroker.com/service/products-and-regulations/regulations/key-information-document)
- [Unbounce – finance a pojištění](https://unbounce.com/industry/finance-and-insurance/), [Unbounce – finance](https://unbounce.com/industry/finance/)
- [Meta – Special Ad Category](https://developers.facebook.com/docs/marketing-api/audiences/special-ad-category), [Meta – finanční služby](https://transparency.meta.com/policies/ad-standards/restricted-goods-services/financial-services)
- [ARROWS – zdanění investic 2026](https://arws.cz/novinky-v-arrows/zdaneni-investicnich-prijmu-2026), [Pohoda – změny od 2026](https://portal.pohoda.cz/dane-ucetnictvi-mzdy/dan-z-prijmu/zmeny-v-osvobozeni-prijmu-z-prodeje-cennych-papiru-a-obchodnich-podilu-od-roku-2026/)

## 👤 Uživatel

1. Doména: doporučuji koupit (asi 200 Kč). Bez ní Resend nedoručí e-maily na cizí adresy.
2. FastAPI: navrhuji výjimku z tvého pravidla pro formulářový endpoint. Bezplatný Render se po nečinnosti probouzí desítky sekund a během té doby by se ztrácely leady z placené reklamy.
3. Vlastní jméno a fotka v sekci „Kdo za tím stojí“, nebo anonymní značka?
4. Účty: Vercel, Supabase, PostHog, Resend a GitHub musíš založit sám.


hele udelam to pres vercel domenu jenom

## 🤖 Claude

Zapisuju do plánu rozhodnutí jet jen na Vercel doméně. Hlavní dopad je na e-maily, proto upravím jejich doručování.

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ The file /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md has been updated successfully. (file state is current in your context — no need to Read it back)

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ The file /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md has been updated successfully. (file state is current in your context — no need to Read it back)

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ The file /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md has been updated successfully. (file state is current in your context — no need to Read it back)

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ The file /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md has been updated successfully. (file state is current in your context — no need to Read it back)

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ The file /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md has been updated successfully. (file state is current in your context — no need to Read it back)

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ The file /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md has been updated successfully. (file state is current in your context — no need to Read it back)

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ The file /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md has been updated successfully. (file state is current in your context — no need to Read it back)

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ The file /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md has been updated successfully. (file state is current in your context — no need to Read it back)

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/CLAUDE.md

> ↳ The file /Users/kovy/Developer/Junior AI Developer/CLAUDE.md has been updated successfully. (file state is current in your context — no need to Read it back)

> 🔧 `Bash` — Find email flag references for consistency

> ↳ CLAUDE.md:23:- **Doména:** jen `*.vercel.app`. E-mail je za přepínačem `NEXT_PUBLIC_EMAIL_ENABLED` a v produkci vypnutý. Když je vypnutý, žádný text nesmí slibovat, že něco přijde e-mailem (PLAN §11). docs/PLAN.md:66:   - **Doména:** jen `*.vercel.app`, vlastní doménu nekupujeme. Hodnota se proto do…

> 🔧 `Bash` — Unify email flag name across the plan

> ↳ 66:   - **Doména:** jen `*.vercel.app`, vlastní doménu nekupujeme. Hodnota se proto doručuje **okamžitě na stránce** (stažení PDF + odemčení). E-mail je hotový a otestovaný, ale v produkci vypnutý přes `NEXT_PUBLIC_EMAIL_ENABLED=false`, dokud nebude doména (viz §11). 141:3. **E-mail do 1 minuty** (j…

## 🤖 Claude

Plán je upravený pro běh jen na `*.vercel.app`.

Hlavní důsledek je, že Resend bez vlastní domény posílá e-maily jen na adresu majitele účtu. Proto je teď hlavní doručení okamžitě na stránce: návštěvník po odeslání formuláře hned stáhne PDF a odemkne se mu celé srovnání.

E-mail se pořád postaví a otestuje odesláním na tvou adresu, screenshot půjde do README. V produkci ale zůstane vypnutý přepínačem `NEXT_PUBLIC_EMAIL_ENABLED=false`. Dokud je vypnutý, texty formuláře ani děkovného stavu nesmí slibovat, že něco přijde e-mailem. Tohle pravidlo je i v [CLAUDE.md](CLAUDE.md), aby ho další chaty dodržely.

Koupě domény a ověření v Resendu (SPF/DKIM) jsou v launch checklistu v README jako kroky před ostrým spuštěním. Hodnotitel tak uvidí, že to je promyšlené a ne zapomenuté.

V [docs/PLAN.md](docs/PLAN.md) jsem upravil §2, §6, §11, §21, §22 a prompty F0 a F5. F0 teď hlídá, aby adresa na Vercelu byla krátká a důvěryhodná, třeba `etf-tahak.vercel.app`.

Pořád jsou otevřené tyhle body z §21:
- výjimka z FastAPI pro formulářový endpoint,
- tvoje jméno a fotka, nebo anonymní značka,
- vykání.

Klidně je rozhodni až v příslušné fázi.

## 👤 Uživatel

jaky vykani?

## 🤖 Claude

Jde o oslovení návštěvníka v textech stránky a reklam:

- **Vykání:** „Spočítejte si, kolik **vás** stojí poplatky. **Stáhněte si** tahák."
- **Tykání:** „Spočítej si, kolik **tě** stojí poplatky. **Stáhni si** tahák."

Doporučuju **vykání**:
- **Peníze a důvěra:** u investic působí seriózněji. Banky a brokeři v Česku většinou vykají.
- **Širší cílovka:** 24–40 let. Pětatřicátník tykání od neznámé značky může brát jako příliš familiární.
- **Bezpečnost:** vykáním nikoho neurazíš, kdežto tykáním můžeš.

Tykání by sedělo, kdyby šlo čistě o mladé publikum z TikToku a značka chtěla působit jako kamarád. Takhle mluví třeba Revolut.

V plánu je vykání už nastavené jako výchozí. Tykání vs. vykání je navíc v backlogu A/B testů, takže se dá později ověřit na datech. Jestli souhlasíš, nic měnit nemusíš.

## 👤 Uživatel

ok vykani, nech to tak

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ The file /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md has been updated successfully.

## 🤖 Claude

Hotovo, v §21 je teď vykání zapsané jako rozhodnuté. Pravidlo už bylo v CLAUDE.md, takže se ho budou držet všechny další chaty.

Otevřené zůstávají jen výjimka z FastAPI pro formulářový endpoint a otázka, jestli na stránce bude tvoje jméno a fotka. Můžeš rovnou začít fází F0.

## 👤 Uživatel

nevim delej co je nejlepsi asi

> 🔧 `Edit` — /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md

> ↳ The file /Users/kovy/Developer/Junior AI Developer/docs/PLAN.md has been updated successfully.

## 🤖 Claude

Rozhodl jsem obě otevřené otázky a zapsal je do §21 v [docs/PLAN.md](docs/PLAN.md):

1. **FastAPI:** výjimku beru. Formulář bude Next.js route handler na Vercelu. Je to nejrychlejší řešení a nehrozí čekání na probuzení serveru, kvůli kterému by se ztrácely leady z reklamy.
2. **„Kdo za tím stojí“:** stránku podepíše skutečný člověk, tedy ty, ne anonymní značka. Skutečné jméno zvyšuje důvěru a nic se nevymýšlí.
   - Fotka bude jen pokud nějakou dodáš. Jinak tam dáme iniciály ve stylu razítka, žádnou stock ani AI fotku.
   - Na jméno a jednu dvě věty o tobě se tě zeptá chat ve fázi F2.

Otevřené zůstávají jen účty: GitHub, Vercel, Supabase, PostHog a Resend. Každá fáze ti řekne, který účet zrovna potřebuje.

Můžeš otevřít nový chat a vložit prompt F0 z §20 v [docs/PLAN.md](docs/PLAN.md). Tenhle chat pak vyexportuj přes `/export` do `ai-log/00-planovani.md`.

## 👤 Uživatel

idealne to ta dej ty

> 🔧 `ToolSearch` — select:mcp__ccd_session_mgmt__export_transcript

> ↳ 

> 🔧 `mcp__ccd_session_mgmt__export_transcript` — self

