import { tahak } from "@/content";
import { EMAIL_ENABLED } from "@/lib/flags";
import { LeadForm } from "./LeadForm";
import { Section } from "./Section";

/** Stoh papírů z CSS. Skutečné náhledy stran z PDF doplní F7. */
function Stack() {
  const sheet = (rot: string, top: string, label: string) => (
    <div
      className={`absolute left-0 h-36 w-28 border border-line bg-paper-deep p-2 shadow-[0_1px_0_var(--line)] ${rot} ${top}`}
    >
      <div className="serif text-[0.6875rem] leading-tight font-semibold">{label}</div>
      <div className="mt-2 grid gap-1">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-px bg-line" />
        ))}
      </div>
    </div>
  );
  return (
    <div className="relative mb-6 h-44 w-36" aria-hidden="true">
      {sheet("-rotate-6", "top-3", "Daně v ČR")}
      {sheet("rotate-3", "top-1.5 left-3", "Evropská dvojčata")}
      {sheet("-rotate-1", "top-0 left-6", "Srovnání 12 ETF")}
    </div>
  );
}

export function TahakSection() {
  const t = tahak(EMAIL_ENABLED);
  return (
    <Section id={t.id} title={t.title}>
      <Stack />
      <p className="mono mb-4 text-[0.8125rem] text-grey">{t.updated}</p>
      <ul className="grid gap-2.5 text-[1rem] leading-snug">
        {t.items.map((i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mono mt-0.5 text-gain-text" aria-hidden="true">
              +
            </span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <LeadForm location="tahak" />
      </div>
    </Section>
  );
}
