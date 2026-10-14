# Reklama A: „Poplatky“ → `/poplatky`

Čísla jsou z `src/data/examples.json` (3 000 Kč měsíčně, 25 let, výnos 6 % ročně před poplatky). Hlídá je test `ads/ads.test.ts`.

## Texty

- **Primární text:** Rozdíl mezi poplatkem 1,46 % a 0,03 % ročně? Za 25 let 377 000 Kč. Modelový výpočet, spočítejte si to na svých číslech.
- **Pokračování primárního textu:** Při 3 000 Kč měsíčně a výnosu 6 % ročně před poplatky. Stáhněte si srovnání 12 ETF z newyorské burzy: co z nich koupíte z Česka a jak je danit. Zdarma.
- **Titulek:** Kolik stojí poplatek 1,46 % ročně?
- **Popis:** Kalkulačka + tahák zdarma
- **Tlačítko:** Stáhnout

## Kreativa (text v obrázku)

- **Velké číslo:** 377 000 Kč
- **Řádek pod číslem:** rozdíl mezi poplatkem 1,46 % a 0,03 % ročně za 25 let
- **Drobně:** Modelový výpočet: 3 000 Kč měsíčně, výnos 6 % ročně před poplatky. Zdroje na webu.
- **Formáty:** feed 1080×1350, story 1080×1920 (horních a dolních ~250 px bez textu).

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
- K ověření před spuštěním: jestli Meta pro CZ vyžaduje Special Ad Category „Financial products and services“ a ověření inzerenta (omezí cílení).
