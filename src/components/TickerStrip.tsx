import { compare } from "@/content";
import { etfsData } from "@/content/data";
import { pct } from "@/lib/format";

/**
 * Burzovní pruh s reálnými daty: výnos za 5 let p. a. v Kč (kurz ČNB), se znaménkem.
 * Dekorativní, zdroje a metoda jsou ve srovnání níže.
 */
export function TickerStrip() {
  const items = etfsData.etfs.map((e) => {
    const v = e.returns_czk_pct["5y"].value;
    return { t: e.ticker, v, up: v >= 0 };
  });
  const row = (key: string) =>
    items.map((i) => (
      <span key={key + i.t} className="mono flex items-baseline gap-1.5 px-3 text-[13px] leading-none">
        <span className="font-semibold">{i.t}</span>
        <span className={i.up ? "text-[#7fd9a8]" : "text-[#ffb089]"}>
          {i.up ? "+" : "\u2212"}{pct(Math.abs(i.v), 1)}
        </span>
      </span>
    ));
  return (
    <div
      className="overflow-hidden bg-ink py-2.5 text-paper"
      role="img"
      aria-label={compare.tickerAria}
    >
      <div className="ticker-track" aria-hidden="true">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
