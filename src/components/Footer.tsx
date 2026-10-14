import { legal } from "@/content";
import { dateCs } from "@/lib/format";
import { etfsData, facts } from "@/content/data";

const SOURCES: { label: string; href: string }[] = [
  { label: "Vanguard", href: "https://investor.vanguard.com/investment-products/etfs/profile/voo" },
  { label: "iShares", href: "https://www.ishares.com/us/products/239726/ishares-core-sp-500-etf" },
  { label: "State Street (SPDR)", href: "https://www.ssga.com/us/en/intermediary/etfs/state-street-spdr-sp-500-etf-trust-spy" },
  { label: "Schwab", href: "https://www.schwabassetmanagement.com/products/schd" },
  { label: "Kurzy ČNB", href: etfsData.meta.fx_usd_czk_end.source },
  { label: "ESMA: náklady fondů", href: facts.fund_costs.avg_equity_fund_ter_pct.source },
  { label: "Zákon č. 586/1992 Sb.", href: facts.taxes.law.source },
  { label: "Nařízení PRIIPs", href: facts.priips.regulation_art5_1.source },
];

export function Footer() {
  return (
    <footer className="border-t border-ink bg-paper-deep">
      <div className="mx-auto max-w-[var(--measure)] px-[var(--gutter)] pb-28 pt-8 text-[0.8125rem] leading-relaxed text-grey">
        <p className="text-ink">{legal.disclaimerShort}</p>
        <ul className="mt-3 grid gap-1">
          {legal.disclaimerFull.slice(1).map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <p className="mt-4 text-ink">{legal.footer.sources}</p>
        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
          {SOURCES.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          {legal.footer.operator} · {legal.footer.dataNote} ·{" "}
          <a href="/zasady-ochrany-udaju" className="underline underline-offset-2">
            {legal.footer.privacy}
          </a>
        </p>
        <p className="mono mt-2 text-[0.6875rem]">Vygenerováno {dateCs(etfsData.meta.generated_at.slice(0, 10))}</p>
      </div>
    </footer>
  );
}
