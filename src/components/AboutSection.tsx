import { about, AUTHOR, faq } from "@/content";
import { EMAIL_ENABLED } from "@/lib/flags";
import { Section } from "./Section";
import { Stamp } from "./Stamp";

export function AboutSection() {
  const f = faq(EMAIL_ENABLED);
  return (
    <Section id={about.id} title={AUTHOR.heading}>
      <div className="flex items-start gap-4">
        {AUTHOR.photo ? null : (
          <div
            aria-hidden="true"
            className="serif flex h-16 w-16 shrink-0 -rotate-6 items-center justify-center border-2 border-ink text-[1.5rem] font-semibold"
          >
            {AUTHOR.initials}
          </div>
        )}
        <div>
          <p className="serif text-[1.125rem] font-semibold">{AUTHOR.name}</p>
          <p className="mt-1 text-[1rem] leading-[1.55]">{AUTHOR.text}</p>
        </div>
      </div>

      <h3 className="serif mt-8 text-[1.25rem] font-semibold">{about.dataHeading}</h3>
      <p className="mt-1.5 text-[1rem] leading-[1.55]">{about.dataText}</p>
      <p className="mt-2 text-[0.8125rem] text-grey">
        <Stamp tone="gain" className="mr-2">
          {about.dataStamp}
        </Stamp>
      </p>

      <h3 id={f.id} className="serif mt-8 text-[1.25rem] font-semibold">
        {f.title}
      </h3>
      <div className="mt-2 border-t border-line">
        {f.items.map((it) => (
          <details key={it.q} className="group border-b border-line">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-[1rem] font-medium">
              {it.q}
              <span aria-hidden="true" className="mono text-grey group-open:hidden">
                +
              </span>
              <span aria-hidden="true" className="mono hidden text-grey group-open:inline">
                −
              </span>
            </summary>
            <p className="pb-4 text-[1rem] leading-[1.55]">{it.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
