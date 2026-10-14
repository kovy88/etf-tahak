# ETF tahák – pravidla projektu

Konverzní landing page (lead magnet) se srovnáním ETF z NYSE pro české drobné investory, kteří přicházejí z mobilní reklamy.
- Zadání: `docs/zadani.md`
- Plán, fáze a stav: `docs/PLAN.md`. Je to zdroj pravdy. Když se plán změní, uprav ho.
- Termín: pá 16. 10. 2026.
- Hodnotí se otázkou: **„Mohli bychom na to zítra pustit reklamu?"**

## Jak pracovat
- Na začátku chatu si přečti `docs/PLAN.md`: §0 (stav) a sekce své fáze.
- Na konci chatu:
  1. commit + push,
  2. zaškrtni fázi v PLAN §0,
  3. připomeň mi `/export` do `ai-log/NN-faze.md`.
- Commituj malé kroky po každé logické změně (Conventional Commits, anglicky) a průběžně pushuj. Historii nikdy nesquashuj ani nepřepisuj, průběžná historie se hodnotí.
- Účty, platby, DNS a odesílání e-mailů nebo zpráv dělám já. Řekni mi přesně, co potřebuješ.
- Tajné klíče patří jen do `.env.local` a do Vercelu. Nikdy do repa, logů ani `ai-log/`.
- Nejasnost, která mění výsledek: zeptej se. Drobnost: rozhodni podle plánu a napiš, jak jsi rozhodl.

## Stack a struktura
- **Web:** Next.js (App Router, TypeScript, `src/`), Tailwind, Vercel.
- **Služby:** Supabase (EU), Resend, PostHog EU.
- **Doména:** jen `*.vercel.app`. E-mail je za přepínačem `NEXT_PUBLIC_EMAIL_ENABLED` a v produkci vypnutý. Když je vypnutý, žádný text nesmí slibovat, že něco přijde e-mailem (PLAN §11).
- **Python** jen v `data/` a `analytics/`: `uv`, `uv run ruff check --fix`, `uv run ruff format`, `uv run pytest`.
- Formulářový endpoint je Next.js route handler. Je to vědomá výjimka z pravidla „API = FastAPI" (PLAN §2).
- **Struktura repa:**
  - `src/app`: routy
  - `src/components`
  - `src/content`: všechny texty
  - `src/data`: generované JSON soubory, ručně je neupravuj
  - `src/lib`: calc, track, emailTypos
  - `data/`: zdroje a build dat
  - `ads/`, `analytics/`, `supabase/migrations/`, `ai-log/`, `docs/`
- Před commitem: lint, typecheck a testy dotčené části.

## Neporušitelná pravidla produktu
1. **Mobil first.** Navrhuj a kontroluj na 375×667 a 360 px. Hero včetně CTA se vejde do 360×600.
2. **Formulář má jediné pole: e-mail.** Žádná další pole, checkbox ani CAPTCHA.
3. **Hodnota před formulářem.** Výsledek kalkulačky a 3 karty ETF nikdy nejsou za e-mailem.
4. **Každý interaktivní prvek končí výzvou ke kontaktu** (`LeadForm` s `location`).
5. **Žádné číslo bez zdroje.**
   - Data ber jen ze `src/data/*.json` (generuje je `data/build.py`).
   - Každá hodnota má `source` a `as_of`.
   - Nic nevymýšlej. Neověřené věci označ a dej mi vědět.
6. **Čísla v reklamách, v hero a ve výchozím stavu kalkulačky jsou stejná** (`src/data/examples.json`).
7. **Každá nová interakce má událost** přes `src/lib/track.ts` podle tracking plánu (PLAN §12). Nové události dopiš do plánu.
8. **Nic nefalšujeme.** Žádné vymyšlené recenze, počty uživatelů ani loga. Žádné „doporučení" konkrétního ETF. Výpočty označuj jako „modelové".
9. **Výkon:** LCP < 2 s, CLS < 0,05, JS < 120 kB gzip. Žádné těžké knihovny na grafy ani animace.

## Design („anotovaný tahák", PLAN §13)
- Při práci na UI použij skill `frontend-design:frontend-design`.
- **Základ vzhledu:**
  - tokeny jen přes CSS proměnné,
  - serif na nadpisy, mono na tickery a čísla (`tabular-nums`),
  - papírové pozadí, zvýrazňovač na klíčových číslech.
- **Zakázáno:**
  - fialovo-modré gradienty, glassmorphism, bloby,
  - mřížky karet se stíny, ikony v kroužcích,
  - emoji, stock a AI obrázky,
  - výchozí Inter/Geist,
  - mockup telefonu.
- Po každé vizuální změně udělej screenshot přes Playwright na 375 px a kriticky se zeptej: „Vypadá to jako šablona?"

## Texty (čeština)
- Vykání, krátké věty, konkrétní čísla, aktivní slovesa. Jediný zdroj textů je `src/content/`. Na texty použij skill `design:ux-copy`.
- **Typografie:**
  - nezlomitelná mezera po k, s, v, z, o, u, a, i a mezi číslem a jednotkou,
  - formáty: `0,03 %`, `439 000 Kč`, datum `30. 9. 2026`,
  - „české uvozovky", pomlčka – s mezerami, žádné em-dash (—),
  - čísla formátuj přes `Intl.NumberFormat('cs-CZ')` nebo helper.
- **Zakázané fráze:**
  - „odemkněte svůj potenciál", „v dnešní době", „revoluční", „jednoduše a rychle",
  - „pojďme se podívat", „cesta k finanční svobodě", „nejlepší ETF",
  - „zaručený výnos", „bez rizika",
  - konstrukce „Není to jen X, je to Y", řečnické trojice, vykřičníky za sebou.
- **Reklamy na Metě:** netvrdit osobní vlastnosti adresáta, neslibovat výnos.
- **Povinná upozornění:**
  - nejde o investiční doporučení,
  - minulé výnosy nezaručují budoucí,
  - měnové riziko,
  - výpočty jsou modelové.

## Hotovo znamená
- Funguje na 375 px v Playwrightu, v konzoli nejsou chyby, testy jsou zelené, lint i typecheck projdou.
- Nové texty splňují pravidla výše, nová čísla mají zdroj, nové interakce mají události.
- Je commitnuto a pushnuto, nasazeno na Vercel a na nasazené verzi ověřeno.
- Stav v PLAN §0 je aktuální.
