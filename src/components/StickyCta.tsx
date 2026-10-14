import { formCopy } from "@/content";
import { EMAIL_ENABLED } from "@/lib/flags";

/**
 * Lepivá lišta dole. Je poslední dítě obalu sekcí S2–S7, takže se přilepí ke spodku okna,
 * jakmile hero odroluje, a bez JS. Schovávání při formuláři a klávesnici řeší F4.
 */
export function StickyCta() {
  const c = formCopy(EMAIL_ENABLED);
  return (
    <div className="sticky bottom-0 z-20 border-t border-ink bg-paper px-[var(--gutter)] py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-[var(--measure)]">
        <a
          href="#tahak-form"
          className="flex h-[var(--btn-h)] w-full items-center justify-center bg-ink text-[1.0625rem] font-medium text-paper"
        >
          {c.cta.sticky}
        </a>
      </div>
    </div>
  );
}
