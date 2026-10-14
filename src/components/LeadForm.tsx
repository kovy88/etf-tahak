"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formCopy } from "@/content/form";
import type { FormLocation } from "@/content/form";
import { isValidEmail, suggestEmail } from "@/lib/emailTypos";
import { EMAIL_ENABLED } from "@/lib/flags";
import { submitLead } from "@/lib/lead";
import { track } from "@/lib/track";
import { Button } from "./Button";
import { useLanding } from "./LandingState";

type Err = "empty" | "invalid" | "server" | null;

/**
 * Jediné pole: e-mail (PLAN §11). Validace až na blur nebo při odeslání, návrh opravy domény,
 * po odeslání se všechna místa přepnou do stavu „hotovo“ (PLAN §5).
 * Odeslání je zatím stub (src/lib/lead.ts), F5 ho napojí na server.
 */
export function LeadForm({ location, id }: { location: FormLocation; id?: string }) {
  const c = formCopy(EMAIL_ENABLED);
  const uid = useId();
  const inputId = `${uid}-email`;
  const microId = `${uid}-micro`;
  const errId = `${uid}-err`;
  const { leadDone, markLead, email: doneEmail } = useLanding();
  const [value, setValue] = useState("");
  const [err, setErr] = useState<Err>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const started = useRef(false);
  const shownFor = useRef<string | null>(null);
  const ref = useRef<HTMLFormElement>(null);

  // form_viewed: formulář je z ≥ 50 % vidět
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("form_viewed", { location });
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [location]);

  if (leadDone) {
    return (
      <div id={id} data-location={location} data-state="done" className="w-full" role="status">
        <p className="serif text-[1.25rem] leading-snug font-semibold">{c.thanks.title}</p>
        <p className="mt-1 text-[0.9375rem]">{c.thanks.unlocked}</p>
        {EMAIL_ENABLED && c.thanks.emailSent && doneEmail ? (
          <p className="mt-1 text-[0.9375rem] text-grey">{c.thanks.emailSent(doneEmail)}</p>
        ) : null}
      </div>
    );
  }

  const validate = (v: string): Err => (!v.trim() ? "empty" : !isValidEmail(v) ? "invalid" : null);

  const onBlur = () => {
    if (!value) return;
    const e = validate(value);
    setErr(e);
    if (e) track("form_error", { location, reason: e });
  };

  const onChange = (v: string) => {
    if (!started.current) {
      started.current = true;
      track("form_started", { location });
    }
    setValue(v);
    if (err) setErr(null);
    if (suggestion) setSuggestion(null);
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate(value);
    if (e) {
      setErr(e);
      track("form_error", { location, reason: e });
      return;
    }
    // Překlep v doméně: nabídneme opravu, druhé odeslání stejné adresy projde.
    const s = suggestEmail(value);
    if (s && shownFor.current !== value) {
      shownFor.current = value;
      setSuggestion(s);
      track("email_typo_suggested", { location, domain: s.split("@")[1] });
      return;
    }
    setBusy(true);
    track("form_submitted", { location });
    try {
      await submitLead({ email: value.trim(), location });
      markLead(value.trim());
    } catch {
      // Za naše chyby návštěvníka netrestáme (PLAN §6): stejně ho pustíme dál.
      track("form_error", { location, reason: "server" });
      markLead(value.trim());
    } finally {
      setBusy(false);
    }
  };

  const accept = () => {
    if (!suggestion) return;
    track("email_typo_accepted", { location, domain: suggestion.split("@")[1] });
    setValue(suggestion);
    shownFor.current = suggestion;
    setSuggestion(null);
  };

  return (
    <form
      ref={ref}
      id={id}
      data-location={location}
      noValidate
      onSubmit={onSubmit}
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={err ? true : undefined}
        aria-describedby={`${err ? errId : ""} ${microId}`.trim()}
        className={`mb-2 h-[var(--btn-h)] w-full border bg-white/60 px-4 text-[1.0625rem] placeholder:text-grey/70 ${
          err ? "border-loss" : "border-ink"
        }`}
      />
      <div className="min-h-0" aria-live="polite">
        {err ? (
          <p id={errId} className="mb-2 text-[0.875rem] text-loss">
            {c.errors[err]}
          </p>
        ) : null}
        {suggestion ? (
          <p className="mb-2 text-[0.9375rem]">
            {c.typo.suggest(suggestion.split("@")[1])}{" "}
            <button type="button" onClick={accept} className="min-h-11 px-1 font-medium underline underline-offset-4">
              {c.typo.accept}
            </button>
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={busy} aria-busy={busy}>
        {busy ? c.sending : c.cta[location]}
      </Button>
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
