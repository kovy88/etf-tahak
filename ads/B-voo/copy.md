# Reklama B: „VOO z Česka nekoupíte“ → `/srovnani` (a `/`)

Čísla jsou z `src/data/etfs.json` (počty dvojčat). Hlídá je test `ads/ads.test.ts`.

## Texty

- **Primární text:** Drobní investoři v EU VOO u běžného brokera obvykle nekoupí. Srovnali jsme 12 ETF z NYSE a našli evropské alternativy.
- **Pokračování primárního textu:** U 4 z 12 existuje evropské dvojče se stejným indexem, u dalších 6 podobná alternativa. S poplatky, výnosy v korunách a českými daněmi. Zdarma.
- **Titulek:** 12 ETF z NYSE: co koupíte z Česka
- **Popis:** Srovnání + tahák zdarma
- **Tlačítko:** Zjistit více

## Kreativa (text v obrázku)

- **Tabule:** VOO · SPY · VTI · SCHD jako burzovní tabule.
- **Razítko:** z ČR běžně nekoupíte*
- **Výzva:** Tady je, co místo nich →
- **Drobně:** * Drobní investoři u běžného brokera v EU. Nejde o investiční doporučení. Zdroje na webu.
- **Formáty:** feed 1080×1350, story 1080×1920 (horních a dolních ~250 px bez textu).

## Odkazy (UTM)

- Feed: `https://etf-tahak.vercel.app/srovnani?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_tahak_launch&utm_content=b_voo_feed`
- Story: `https://etf-tahak.vercel.app/srovnani?utm_source=meta&utm_medium=paid_social&utm_campaign=etf_tahak_launch&utm_content=b_voo_story`

## Návaznost na hero

Hero na `/srovnani` má stejnou tabuli tickerů a větu (viz `src/content/hero.ts`):
„VOO, SPY, VTI. Z Česka je běžně nekoupíte. Tady je, co místo nich.“ Pod ní je srovnání.

## Kontrola zásad Mety

- Žádné tvrzení o osobě adresáta. „Drobní investoři v EU“ je obecný popis regulace, ne oslovení.
- Žádný slib výnosu, žádný výnos v textu vůbec.
- Tvrzení „obvykle nekoupí“ je opatrné: vychází z praxe brokerů (viz `data/facts.source.yaml`, sekce priips), ne ze zákazu.
- Žádné „bez rizika“, „zaručený“, „nejlepší“.
- K ověření před spuštěním: Special Ad Category „Financial products and services“ a ověření inzerenta.
