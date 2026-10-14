"use client";

import { useId } from "react";
import { formCopy } from "@/content/form";
import type { FormLocation } from "@/content/form";
import { EMAIL_ENABLED } from "@/lib/flags";
import { Button } from "./Button";

/**
 * Jediné pole: e-mail (PLAN §11). Zatím bez backendu: odeslání dělá F5,
 * události F6. `location` rozlišuje místo pro měření.
 */
export function LeadForm({ location, id }: { location: FormLocation; id?: string }) {
  const c = formCopy(EMAIL_ENABLED);
  const uid = useId();
  const inputId = `${uid}-email`;
  const microId = `${uid}-micro`;
  return (
    <form
      id={id}
      data-location={location}
      noValidate
      onSubmit={(e) => e.preventDefault()}
      className="w-full"
    >
      <label htmlFor={inputId} className="mb-1.5 block text-[0.9375rem] font-medium">
        {c.label}
      </label>
      <input
        id={inputId}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="send"
        placeholder={c.placeholder}
        aria-describedby={microId}
        className="mb-3 h-[var(--btn-h)] w-full border border-ink bg-white/60 px-4 text-[1.0625rem] placeholder:text-grey/70"
      />
      <Button type="submit">{c.cta[location]}</Button>
      <p id={microId} className="mt-2.5 text-[0.8125rem] leading-snug text-grey">
        {c.micro}{" "}
        <a href="/zasady-ochrany-udaju" className="underline underline-offset-2">
          {c.privacyLink}
        </a>
        .
      </p>
    </form>
  );
}
