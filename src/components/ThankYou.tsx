"use client";

import { useEffect, useRef, useState } from "react";
import { formCopy } from "@/content/form";
import { EMAIL_ENABLED } from "@/lib/flags";
import { submitProfile } from "@/lib/lead";
import type { LeadResult } from "@/lib/leadStore";
import { track } from "@/lib/track";

/**
 * Děkovný stav (PLAN §6): okamžité stažení PDF, odemčení srovnání, 1 dobrovolná otázka na 1 ťuk
 * a sdílení. Text o e-mailu se zobrazí jen při NEXT_PUBLIC_EMAIL_ENABLED=true.
 * `full` = formulář, kde se odesílalo. Ostatní místa ukážou jen krátké „hotovo“ se stažením.
 */
export function ThankYou({ lead, full }: { lead: LeadResult; full: boolean }) {
  const c = formCopy(EMAIL_ENABLED);
  const [broker, setBroker] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const hasPdf = Boolean(lead.downloadUrl);
  const viewed = useRef(false);

  // thankyou_viewed jednou za návštěvu, jen u formuláře, kde se odesílalo
  useEffect(() => {
    if (!full || viewed.current) return;
    viewed.current = true;
    track("thankyou_viewed", { location: lead.location, saved: Boolean(lead.leadId) });
  }, [full, lead.location, lead.leadId]);

  const answer = async (b: string) => {
    setBroker(b);
    track("profile_answered", { broker: b });
    if (lead.leadId) await submitProfile(lead.leadId, b);
  };

  const share = async () => {
    track("share_clicked", { method: typeof navigator.share === "function" ? "web_share" : "copy" });
    const url = `${window.location.origin}/?utm_source=share&utm_medium=referral`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: c.share.shareTitle, text: c.share.text, url });
        return;
      } catch {
        /* uživatel sdílení zrušil: nic neděláme */
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* schránka nedostupná */
    }
  };

  return (
    <div className="w-full" role="status" data-state="done">
      <p className="serif text-[1.25rem] leading-snug font-semibold">
        {hasPdf ? (full ? c.thanks.title : c.thanks.titleShort) : c.thanks.titleNoPdf}
      </p>
      <p className="mt-1 text-[0.9375rem]">{c.thanks.unlocked}</p>
      {EMAIL_ENABLED && c.thanks.emailSent && full ? (
        <p className="mt-1 text-[0.9375rem] text-grey">{c.thanks.emailSent(lead.email)}</p>
      ) : null}
      {EMAIL_ENABLED && c.thanks.mailboxHint && full ? (
        <p className="mt-1 text-[0.8125rem] text-grey">{c.thanks.mailboxHint}</p>
      ) : null}

      {hasPdf ? (
        <a
          href={lead.downloadUrl ?? "#"}
          download
          onClick={() => track("pdf_downloaded", { location: lead.location })}
          className="mt-3 flex h-[var(--btn-h)] w-full items-center justify-center bg-ink text-[1.0625rem] font-medium text-paper"
        >
          {full ? c.thanks.download : c.thanks.downloadAgain}
        </a>
      ) : null}

      {full && lead.leadId ? (
        <div className="mt-5 border-t border-line pt-4">
          <p className="font-medium">{c.profile.question}</p>
          <p className="mb-2 text-[0.8125rem] text-grey">{c.profile.optional}</p>
          {broker ? (
            <p className="text-[0.9375rem]">{c.profile.thanks}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {c.profile.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => answer(o)}
                  className="inline-flex h-11 items-center border border-line px-3 text-[0.9375rem] hover:border-ink"
                >
                  {o}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {full ? (
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-[0.9375rem]">{c.share.text}</p>
          <button
            type="button"
            onClick={share}
            className="mt-2 inline-flex h-11 items-center border border-ink px-4 text-[0.9375rem] font-medium"
          >
            {copied ? c.share.copied : typeof navigator !== "undefined" && "share" in navigator ? c.share.button : c.share.copyLink}
          </button>
        </div>
      ) : null}
    </div>
  );
}
