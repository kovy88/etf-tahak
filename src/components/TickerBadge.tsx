/** Ticker v monospace; `struck` ho přeškrtne (neobchodovatelné z ČR). */
export function TickerBadge({ children, struck = false }: { children: React.ReactNode; struck?: boolean }) {
  return (
    <span
      className={`mono inline-block border border-ink px-2 py-0.5 text-[0.9375rem] font-semibold ${
        struck ? "relative text-grey line-through decoration-loss decoration-2" : ""
      }`}
    >
      {children}
    </span>
  );
}
