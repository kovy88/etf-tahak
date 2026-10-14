import { finalCta } from "@/content";
import { EMAIL_ENABLED } from "@/lib/flags";
import { LeadForm } from "./LeadForm";
import { Section } from "./Section";

export function FinalCta() {
  const c = finalCta(EMAIL_ENABLED);
  return (
    <Section id={c.id} title={c.title}>
      <p className="-mt-1 mb-4 text-[1rem]">{c.text}</p>
      <div id="tahak-form">
        <LeadForm location="final" />
      </div>
    </Section>
  );
}
