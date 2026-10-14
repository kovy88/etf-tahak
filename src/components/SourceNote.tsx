/** Poznámka pod čarou se zdrojem. */
export function SourceNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`border-t border-line pt-1.5 text-[0.75rem] leading-snug text-grey ${className}`}>{children}</p>
  );
}
