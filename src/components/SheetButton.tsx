"use client";

import { useRef } from "react";
import { formCopy } from "@/content/form";
import type { FormLocation } from "@/content/form";
import { EMAIL_ENABLED } from "@/lib/flags";
import { track } from "@/lib/track";
import { Button } from "./Button";
import { LeadForm } from "./LeadForm";

/**
 * Tlačítko, které otevře bottom sheet (<dialog>) s formulářem (opt-in ve 2 krocích, PLAN §5).
 * Fokus na pole se dává přímo v obsluze kliknutí, jinak ho iOS nepřijme.
 */
export function SheetButton({
  label,
  location,
  className = "",
}: {
  label: string;
  location: Extract<FormLocation, "hero" | "sticky">;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const c = formCopy(EMAIL_ENABLED);
  return (
    <>
      <Button
        type="button"
        className={className}
        onClick={() => {
          track("cta_clicked", { location });
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
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[100dvh] w-full max-w-none overflow-y-auto border-t-2 border-ink bg-paper p-0 backdrop:bg-ink/50"
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
          <LeadForm location={location} />
        </div>
      </dialog>
    </>
  );
}
