import Image from "next/image";
import { tahak } from "@/content";
import { EMAIL_ENABLED } from "@/lib/flags";
import { PDF_PREVIEW_SIZE, PDF_PREVIEWS } from "@/lib/leadPdf";
import { LeadForm } from "./LeadForm";
import { Section } from "./Section";

/** Stoh skutečných stran z PDF (scripts/render-pdf.ts). Rozměry jsou pevné, takže nic neskáče (CLS). */
function Stack({ previews }: { previews: ReturnType<typeof tahak>["previews"] }) {
  const pos = ["-rotate-6 top-3 left-0", "rotate-3 top-1.5 left-6", "-rotate-1 top-0 left-12"];
  const { width, height } = PDF_PREVIEW_SIZE;
  return (
    <div className="relative mb-6 h-[16.5rem] w-[15rem] max-w-full">
      {previews.map((p, i) => (
        <Image
          key={p.key}
          src={PDF_PREVIEWS[p.key]}
          alt={p.alt}
          width={width}
          height={height}
          sizes="180px"
          className={`absolute h-auto w-[10.5rem] border border-line shadow-[0_1px_0_var(--line)] ${pos[i]}`}
        />
      ))}
    </div>
  );
}

export function TahakSection() {
  const t = tahak(EMAIL_ENABLED);
  return (
    <Section id={t.id} title={t.title}>
      <Stack previews={t.previews} />
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
