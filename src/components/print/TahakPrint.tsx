import { PAGE_COUNT, PAGES, tahakPrint as t } from "@/content/tahakPrint";
import { ETF_ROWS, SOURCES, TWIN_GROUPS } from "@/lib/tahakPrint";
import { Marker } from "../Marker";
import { Stamp } from "../Stamp";
import { TickerBadge } from "../TickerBadge";

/**
 * Tiskový tahák (A4). Každá <Sheet> je jedna strana PDF. Texty jsou v src/content/tahakPrint.ts,
 * čísla v src/lib/tahakPrint.ts. Strany se nesmí přetéct, kontroluje to scripts/render-pdf.ts.
 */

function Sheet({ page, title, children }: { page: number; title?: string; children: React.ReactNode }) {
  return (
    <section
      data-sheet={page}
      className="relative mx-auto mb-6 flex h-[297mm] w-[210mm] flex-col overflow-hidden border border-line bg-paper px-[14mm] pt-[10mm] pb-[8mm] break-after-page last:break-after-auto print:mb-0 print:border-0"
    >
      <header className="flex items-baseline justify-between border-b-[1.5pt] border-ink pb-[1.5mm]">
        <span className="serif text-[10pt] font-semibold">{t.running.left}</span>
        <span className="mono text-[7.5pt] text-grey">{t.running.right}</span>
      </header>
      {title ? (
        <h2 className="serif mt-[6mm] mb-[3mm] text-[23pt] leading-[1.08] font-semibold tracking-[-0.01em]">{title}</h2>
      ) : null}
      <div data-body className="flex min-h-0 flex-1 flex-col">{children}</div>
      <footer className="mt-[3mm] flex items-baseline justify-between gap-6 border-t border-line pt-[1.5mm] text-[7pt] text-grey">
        <span>{t.running.footer}</span>
        <span className="mono shrink-0">
          {page} / {PAGE_COUNT}
        </span>
      </footer>
    </section>
  );
}

const Lead = ({ children }: { children: React.ReactNode }) => (
  <p className="serif max-w-[155mm] text-[14.5pt] leading-[1.38]">{children}</p>
);
const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="serif mb-[2mm] text-[14pt] leading-tight font-semibold">{children}</h3>
);
const Body = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-[10.5pt] leading-[1.5] ${className}`}>{children}</p>
);
const Foot = ({ children }: { children: React.ReactNode }) => (
  <p className="mt-auto pt-[3mm] text-[8pt] leading-snug text-grey">{children}</p>
);

/** Číslo v tabulce: záporné červeně (znaménko tam je vždy, barva je jen doplněk). */
const Val = ({ v, bold = false }: { v: string; bold?: boolean }) => (
  <span className={`mono ${v.startsWith("−") ? "text-loss" : ""} ${bold ? "font-semibold" : ""}`}>{v}</span>
);

/** Linkované místo na vlastní poznámky, vyplní zbytek strany. */
function Notes() {
  return (
    <div className="mt-[8mm] flex min-h-[30mm] flex-1 flex-col">
      <p className="mono text-[7.5pt] text-grey">{t.notesLabel}</p>
      <div
        className="flex-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent calc(9mm - 0.5pt), var(--line) calc(9mm - 0.5pt), var(--line) 9mm)",
        }}
      />
    </div>
  );
}

function MarginNotes({ heading, items, tail }: { heading?: string; items: string[]; tail?: string }) {
  return (
    <aside className="serif w-[44mm] shrink-0 border-l border-line pl-[4mm] text-[9.5pt] leading-[1.4] text-grey italic">
      {heading ? <p className="mb-[1.5mm] font-semibold not-italic text-ink">{heading}</p> : null}
      <ul className="grid gap-[2mm]">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      {tail ? <p className="mt-[3mm] text-ink">{tail}</p> : null}
    </aside>
  );
}

function Cover() {
  const c = t.cover;
  return (
    <Sheet page={PAGES.cover}>
      <h1 className="serif mt-[12mm] text-[58pt] leading-[0.95] font-semibold tracking-[-0.02em]">{c.title}</h1>
      <p className="serif mt-[5mm] max-w-[140mm] text-[15pt] leading-[1.3]">{c.lead}</p>
      <p className="mono mt-[3mm] max-w-[150mm] text-[8pt] leading-snug text-grey">{c.meta}</p>

      <div className="mt-[12mm]">
        <H3>{c.contentsHeading}</H3>
        <ol className="border-t border-ink">
          {c.contents.map((i) => (
            <li key={i.page} className="flex items-baseline gap-3 border-b border-line py-[2.6mm] text-[10.5pt]">
              <span className="min-w-0 flex-1">{i.text}</span>
              <span className="mono shrink-0 text-grey">{i.page}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-auto border-t-[1.5pt] border-ink pt-[4mm]">
        <p className="serif text-[12pt] font-semibold">{c.teaserHeading}</p>
        <div className="mt-[2mm] flex items-end gap-[8mm]">
          <div>
            <p className="mono text-[8pt] text-grey">{c.teaserLabel}</p>
            <p className="serif text-[40pt] leading-[1.05] font-semibold">
              <Marker>{c.teaserValue}</Marker>
            </p>
          </div>
          <p className="max-w-[88mm] pb-[2mm] text-[9pt] leading-[1.4]">{c.teaserText}</p>
        </div>
        <p className="mt-[2.5mm] text-[7.5pt] leading-snug text-grey">{c.teaserNote}</p>
      </div>
    </Sheet>
  );
}

function Compare() {
  const c = t.compare;
  const th = "mono pb-[1.5mm] text-right text-[8pt] font-normal text-grey";
  return (
    <Sheet page={PAGES.compare} title={c.title}>
      <p className="max-w-[155mm] text-[10.5pt] leading-[1.45]">{c.intro}</p>
      <table className="mt-[4mm] w-full border-collapse text-[9.5pt]">
        <thead>
          <tr className="border-b border-ink align-bottom">
            <th className="mono pb-[1.5mm] text-left text-[8pt] font-normal text-grey">{c.cols.etf}</th>
            <th className={th}>{c.cols.ter}</th>
            <th className={th}>{c.cols.aum}</th>
            <th className={th}>{c.cols.div}</th>
            <th className={th} colSpan={3}>
              {c.unit}
            </th>
          </tr>
          <tr className="border-b border-ink">
            <th colSpan={4} />
            <th className={th}>{c.cols.y1}</th>
            <th className={th}>{c.cols.y5}</th>
            <th className={th}>{c.cols.y10}</th>
          </tr>
        </thead>
        <tbody>
          {ETF_ROWS.map((r) => (
            <tr key={r.ticker} className="border-b border-line align-top">
              <td className="py-[2.5mm] pr-2">
                <span className="mono font-semibold">{r.ticker}</span>
                <span className="mono ml-1 text-[6.5pt] text-grey">{r.ref}</span>
                <span className="block text-[7.5pt] leading-tight text-grey">{r.name}</span>
              </td>
              <td className="py-[2.5mm] text-right">
                <Val v={r.ter} bold />
              </td>
              <td className="py-[2.5mm] text-right">
                <Val v={r.aum} />
              </td>
              <td className="py-[2.5mm] text-right">
                <Val v={r.div} />
              </td>
              {r.usd.map((v, i) => (
                <td key={i} className="py-[2.5mm] text-right">
                  <Val v={v} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-[3mm] text-[8pt] leading-snug text-grey">{c.colsNote}</p>
      <div className="serif mt-[6mm] grid max-w-[150mm] gap-[2mm] border-l-[2pt] border-marker pl-[4mm] text-[10.5pt] leading-[1.4] text-grey italic">
        {c.margin.map((m) => (
          <p key={m}>{m}</p>
        ))}
      </div>
      <Foot>{c.footnote}</Foot>
    </Sheet>
  );
}

function CzkPage() {
  const c = t.czk;
  const th = "mono pb-[1.5mm] text-right text-[8pt] font-normal text-grey";
  return (
    <Sheet page={PAGES.czk} title={c.title}>
      <p className="max-w-[155mm] text-[10.5pt] leading-[1.45]">{c.intro}</p>
      <table className="mt-[4mm] w-full border-collapse text-[9.5pt]">
        <thead>
          <tr className="border-b border-line align-bottom">
            <th />
            <th className={`${th} border-l border-line`} colSpan={2}>
              {c.cols.y1}
            </th>
            <th className={`${th} border-l border-line`} colSpan={2}>
              {c.cols.y5}
            </th>
            <th className={`${th} border-l border-line`} colSpan={2}>
              {c.cols.y10}
            </th>
          </tr>
          <tr className="border-b border-ink">
            <th className="mono pb-[1.5mm] text-left text-[8pt] font-normal text-grey">{c.cols.etf}</th>
            {[0, 1, 2].flatMap((i) => [
              <th key={`u${i}`} className={`${th} border-l border-line`}>
                {c.cols.usd}
              </th>,
              <th key={`c${i}`} className={th}>
                {c.cols.czk}
              </th>,
            ])}
          </tr>
        </thead>
        <tbody>
          {ETF_ROWS.map((r) => (
            <tr key={r.ticker} className="border-b border-line">
              <td className="py-[2.5mm]">
                <span className="mono font-semibold">{r.ticker}</span>
                <span className="mono ml-1 text-[6.5pt] text-grey">{r.ref}</span>
              </td>
              {[0, 1, 2].flatMap((i) => [
                <td key={`u${i}`} className="border-l border-line py-[2.5mm] text-right text-grey">
                  <Val v={r.usd[i]} />
                </td>,
                <td key={`c${i}`} className="py-[2.5mm] text-right">
                  <Val v={r.czk[i]} bold />
                </td>,
              ])}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-[8mm] grid grid-cols-2 gap-[8mm]">
        <div>
          <H3>{c.howHeading}</H3>
          <Body>{c.how}</Body>
        </div>
        <div>
          <H3>{c.whyHeading}</H3>
          <Body>{c.why}</Body>
        </div>
      </div>
      <Foot>{c.footnote}</Foot>
    </Sheet>
  );
}

function Buy() {
  const c = t.buy;
  return (
    <Sheet page={PAGES.buy} title={c.title}>
      <div className="flex min-h-0 flex-1 gap-[6mm]">
        <div className="min-w-0 flex-1">
          <Lead>{c.lead}</Lead>
          <div className="mt-[4mm] flex flex-wrap items-center gap-x-[3mm] gap-y-[2mm]">
            {ETF_ROWS.map((r) => (
              <TickerBadge key={r.ticker} struck>
                {r.ticker}
              </TickerBadge>
            ))}
            <Stamp tone="loss">nekoupíte</Stamp>
          </div>
          <div className="mt-[6mm] grid gap-[3mm]">
            {c.detail.map((d) => (
              <Body key={d}>{d}</Body>
            ))}
          </div>

          <h3 className="serif mt-[10mm] mb-[2mm] text-[14pt] font-semibold">{c.typesHeading}</h3>
          <ul className="border-t border-ink">
            {(
              [
                ["gain", c.stamps.twin, c.types.twin],
                ["gain", c.stamps.similar, c.types.similar],
                ["loss", c.stamps.none, c.types.none],
              ] as const
            ).map(([tone, label, text]) => (
              <li key={label} className="grid grid-cols-[28mm_1fr] items-center gap-[4mm] border-b border-line py-[4mm]">
                <span>
                  <Stamp tone={tone}>{label}</Stamp>
                </span>
                <span className="text-[10.5pt] leading-[1.45]">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="w-[52mm] shrink-0 border-l border-line pl-[4mm]">
          <H3>{c.glossaryHeading}</H3>
          <dl className="grid gap-[4mm] text-[9.5pt] leading-[1.4]">
            {c.glossary.map((g) => (
              <div key={g.term}>
                <dt className="mono font-semibold">{g.term}</dt>
                <dd className="text-grey">{g.text}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </Sheet>
  );
}

function Twins() {
  const c = t.twins;
  const th = "mono text-[8pt] text-grey";
  return (
    <Sheet page={PAGES.twins} title={c.title}>
      <p className="max-w-[155mm] text-[10pt] leading-[1.4]">{c.intro}</p>
      <div className="mt-[3mm] grid grid-cols-[34mm_1fr] border-b border-ink pb-[1mm]">
        <span className={th}>{c.cols.us}</span>
        <div className="grid grid-cols-[1fr_30mm_15mm_19mm_28mm] gap-x-2">
          <span className={th}>{c.cols.fund}</span>
          <span className={th}>{c.cols.isin}</span>
          <span className={`${th} text-right`}>{c.cols.ter}</span>
          <span className={th}>{c.cols.kind}</span>
          <span className={th}>{c.cols.venue}</span>
        </div>
      </div>
      {TWIN_GROUPS.map((g) => (
        <div key={g.tickers.join()} className="grid grid-cols-[34mm_1fr] border-b border-line py-[1.2mm]">
          <div>
            <p className="mono text-[10pt] leading-tight font-semibold">{g.tickers.join(" ")}</p>
            <p
              className={`serif mt-[0.8mm] text-[9pt] font-semibold ${g.match === "none" ? "text-loss" : "text-gain-text"}`}
            >
              {c.matchLabel[g.match === "exact" ? "exact" : g.match]}
            </p>
          </div>
          <div>
            {g.funds.map((f) => (
              <div key={f.id} className="grid grid-cols-[1fr_30mm_15mm_19mm_28mm] items-baseline gap-x-2 py-[0.5mm] text-[8.5pt]">
                <span className="leading-tight">
                  <span className="mono font-semibold">{f.id}</span> <span className="mono text-[7pt] text-grey">{f.ref}</span>
                  <span className="block text-[7.5pt] text-grey">{f.name}</span>
                </span>
                <span className="mono text-[8.5pt]">{f.isin}</span>
                <span className="mono text-right">{f.ter}</span>
                <span>{f.kind}</span>
                <span className="mono text-[8pt] leading-tight">{f.venues}</span>
              </div>
            ))}
            <p className="serif mt-[0.8mm] text-[8.5pt] leading-snug text-grey italic">{g.note}</p>
          </div>
        </div>
      ))}
      <Foot>{c.footnote}</Foot>
    </Sheet>
  );
}

function TaxSale() {
  const c = t.taxSale;
  return (
    <Sheet page={PAGES.taxSale} title={c.title}>
      <div className="flex min-h-0 flex-1 gap-[6mm]">
        <div className="flex min-w-0 flex-1 flex-col">
          <Lead>{c.lead}</Lead>
          <div className="mt-[6mm] grid gap-[6mm]">
            {c.tests.map((x) => (
              <div key={x.name} className="border-t-[1.5pt] border-ink pt-[2.5mm]">
                <p className="serif text-[14pt] font-semibold">{x.name}</p>
                <p className="serif mt-[2mm] text-[34pt] leading-[1.05] font-semibold">
                  <Marker>{x.figure}</Marker>
                </p>
                <p className="serif mt-[2.5mm] text-[12.5pt] leading-[1.3]">{x.rule}</p>
                <p className="mt-[1.5mm] text-[9.5pt] leading-snug text-grey">{x.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-[8mm] border-t-[1.5pt] border-loss pt-[2.5mm]">
            <p className="serif text-[14pt] font-semibold">{c.otherwiseHeading}</p>
            <Body className="mt-[1.5mm]">{c.otherwise}</Body>
          </div>
          <Notes />
        </div>
        <MarginNotes heading={c.marginHeading} items={c.margin} tail={c.marginTail} />
      </div>
      <Foot>{c.footnote}</Foot>
    </Sheet>
  );
}

function TaxDividend() {
  const c = t.taxDividend;
  return (
    <Sheet page={PAGES.taxDividend} title={c.title}>
      <div className="flex min-h-0 flex-1 gap-[6mm]">
        <div className="flex min-w-0 flex-1 flex-col">
          <H3>{c.dividendHeading}</H3>
          <div className="mb-[4mm] flex gap-[8mm]">
            {c.rates.map((r) => (
              <div key={r.label}>
                <p className={`serif text-[34pt] leading-[1.05] font-semibold ${r.loss ? "text-loss" : ""}`}>
                  {r.loss ? r.value : <Marker>{r.value}</Marker>}
                </p>
                <p className="text-[9pt] leading-tight text-grey">{r.label}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-[2.5mm]">
            {c.dividend.map((d) => (
              <Body key={d}>{d}</Body>
            ))}
          </div>
          <div className="mt-[8mm]">
            <H3>{c.czHeading}</H3>
            <Body>{c.cz}</Body>
            <Body className="mt-[2mm] text-grey">{c.accumulating}</Body>
          </div>
          <div className="mt-[8mm] border-t-[1.5pt] border-ink pt-[2.5mm]">
            <H3>{c.returnHeading}</H3>
            <Body>{c.returnRule}</Body>
          </div>
          <Notes />
        </div>
        <aside className="w-[56mm] shrink-0 border-l border-line pl-[4mm]">
          <H3>{c.deadlinesHeading}</H3>
          <ul className="border-t border-ink">
            {c.deadlines.map((d) => (
              <li key={d.who} className="border-b border-line py-[2mm]">
                <p className="mono text-[11pt] font-semibold">
                  <Marker>{d.when}</Marker>
                </p>
                <p className="mt-[0.5mm] text-[8.5pt] leading-tight text-grey">{d.who}</p>
              </li>
            ))}
          </ul>
          <p className="serif mt-[3mm] text-[9.5pt] leading-[1.4] text-grey italic">{c.deadlinesNote}</p>
        </aside>
      </div>
      <Foot>{c.footnote}</Foot>
    </Sheet>
  );
}

function Broker() {
  const c = t.broker;
  return (
    <Sheet page={PAGES.broker} title={c.title}>
      <Lead>{c.lead}</Lead>
      <h3 className="serif mt-[6mm] mb-[2mm] text-[14pt] font-semibold">{c.questionsHeading}</h3>
      <ul className="border-t border-ink">
        {c.questions.map((q) => (
          <li key={q.q} className="grid grid-cols-[62mm_1fr] gap-[4mm] border-b border-line py-[3mm]">
            <span className="serif text-[11.5pt] leading-tight font-semibold">{q.q}</span>
            <span className="text-[9.5pt] leading-[1.4] text-grey">{q.why}</span>
          </li>
        ))}
      </ul>
      <h3 className="serif mt-[9mm] mb-[1mm] text-[14pt] font-semibold">{c.fxHeading}</h3>
      <Body>{c.fxLead}</Body>
      <table className="mt-[3mm] w-full border-collapse text-[10pt]">
        <thead>
          <tr className="border-b border-ink">
            <th className="mono pb-[1mm] text-left text-[8pt] font-normal text-grey">{c.fxCols.rate}</th>
            <th className="mono pb-[1mm] text-right text-[8pt] font-normal text-grey">{c.fxCols.month}</th>
            <th className="mono pb-[1mm] text-right text-[8pt] font-normal text-grey">{c.fxCols.year}</th>
            <th className="mono pb-[1mm] text-right text-[8pt] font-normal text-grey">{c.fxCols.total}</th>
          </tr>
        </thead>
        <tbody>
          {c.fxRows.map((r) => (
            <tr key={r.rate} className="border-b border-line">
              <td className="mono py-[1.5mm]">{r.rate}</td>
              <td className="mono py-[1.5mm] text-right">{r.month}</td>
              <td className="mono py-[1.5mm] text-right">{r.year}</td>
              <td className="mono py-[1.5mm] text-right font-semibold">{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="serif mt-[3mm] max-w-[150mm] text-[10pt] leading-[1.4] text-grey italic">{c.fxNote}</p>
    </Sheet>
  );
}

function Steps() {
  const c = t.steps;
  return (
    <Sheet page={PAGES.steps} title={c.title}>
      <ol className="mt-[2mm] border-t-[1.5pt] border-ink">
        {c.steps.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[14mm_1fr_8mm] items-start gap-[3mm] border-b border-line py-[6.5mm]">
            <span className="mono text-[26pt] leading-none font-semibold text-grey">{i + 1}</span>
            <span>
              <span className="serif block text-[16pt] leading-tight font-semibold">{s.title}</span>
              <span className="mt-[2mm] block max-w-[125mm] text-[10.5pt] leading-[1.5]">{s.text}</span>
            </span>
            <span className="mt-[1mm] block h-[6mm] w-[6mm] border-[1.5pt] border-ink" aria-hidden="true" />
          </li>
        ))}
      </ol>
      <p className="serif mt-[8mm] max-w-[140mm] text-[11pt] leading-[1.4] text-grey italic">{c.tail}</p>
      <Notes />
    </Sheet>
  );
}

function Sources() {
  const c = t.sources;
  return (
    <Sheet page={PAGES.sources} title={c.title}>
      <p className="max-w-[150mm] text-[9pt] leading-[1.4]">{c.intro}</p>
      <ol className="mt-[3mm] columns-2 gap-[7mm] border-t border-ink pt-[2mm]">
        {SOURCES.map((s) => (
          <li key={s.n} className="mb-[2.2mm] break-inside-avoid text-[7pt] leading-[1.3]">
            <span className="mono mr-1 font-semibold">[{s.n}]</span>
            <span className="font-semibold">{s.label}</span>
            <span className="mono block text-[6pt] leading-[1.25] break-all text-grey">{s.url.replace(/^https?:\/\//, "")}</span>
            <span className="block text-[6.5pt] text-grey">{s.dates}</span>
          </li>
        ))}
      </ol>
    </Sheet>
  );
}

function Method() {
  const c = t.method;
  return (
    <Sheet page={PAGES.method} title={c.title}>
      <H3>{c.methodHeading}</H3>
      <ul className="grid gap-[3mm]">
        {c.method.map((m) => (
          <li key={m} className="text-[10.5pt] leading-[1.5]">
            {m}
          </li>
        ))}
      </ul>
      <div className="mt-[8mm] border-t-[1.5pt] border-ink pt-[2mm]">
        <H3>{c.legalHeading}</H3>
        <ul className="grid gap-[2mm]">
          {c.legal.map((m) => (
            <li key={m} className="text-[10.5pt] leading-[1.5]">
              {m}
            </li>
          ))}
        </ul>
      </div>
      <p className="serif mt-auto text-[10pt] leading-[1.4]">{c.author}</p>
    </Sheet>
  );
}

export function TahakPrint() {
  return (
    <>
      <Cover />
      <Compare />
      <CzkPage />
      <Buy />
      <Twins />
      <TaxSale />
      <TaxDividend />
      <Broker />
      <Steps />
      <Sources />
      <Method />
    </>
  );
}
