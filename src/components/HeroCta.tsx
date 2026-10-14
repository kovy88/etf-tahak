"use client";

import { useRef } from "react";
import { formCopy } from "@/content/form";
import { EMAIL_ENABLED } from "@/lib/flags";
import { Button } from "./Button";
import { LeadForm } from "./LeadForm";

/** Hero CTA otevře bottom sheet (<dialog>) s formulářem. Fokus se dává přímo v obsluze kliknutí (iOS). */
export function HeroCta({ label }: { label: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const c = formCopy(EMAIL_ENABLED);
  return (
    <>
      <Button
        type="button"
        onClick={() => {
          const d = ref.current;
          if (!d) return;
          d.showModal();
          d.querySelector<HTMLInputElement>("input[type=email]")?.focus();
        }}
      >
        {label}
      </Button>
      <dialog
        ref={ref}
        aria-label={c.sheet.title}
        className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none border-t-2 border-ink bg-paper p-0 backdrop:bg-ink/50"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="mx-auto max-w-[var(--measure)] px-[var(--gutter)] pb-6 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="serif text-[1.25rem] font-semibold">{c.sheet.title}</p>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="h-11 px-2 text-[0.9375rem] underline underline-offset-4"
            >
              {c.sheet.close}
            </button>
          </div>
          <LeadForm location="hero" />
        </div>
      </dialog>
    </>
  );
}
