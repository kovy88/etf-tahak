"use client";

/** Znovu otevře cookie lištu (odvolání souhlasu). */
export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("etf:cookie-settings"))}
      className="inline-flex min-h-11 items-center underline underline-offset-2"
    >
      {label}
    </button>
  );
}
