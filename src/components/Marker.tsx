/** Tah fixou pod klíčovým číslem. Animace proběhne jednou při zobrazení. */
export function Marker({ children }: { children: React.ReactNode }) {
  return <span className="marker">{children}</span>;
}
