/** Sekce oddělená tenkou linkou jako v novinách. Okraje 20 px, sloupec max ~640 px. */
export function Section({
  id,
  title,
  children,
  className = "",
}: {
  id?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-4 border-t border-ink ${className}`}>
      <div className="mx-auto max-w-[var(--measure)] px-[var(--gutter)] py-9">
        {title ? (
          <h2 className="serif mb-4 text-[1.625rem] leading-[1.15] font-semibold tracking-[-0.01em]">{title}</h2>
        ) : null}
        {children}
      </div>
    </section>
  );
}
