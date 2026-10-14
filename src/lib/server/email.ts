import "server-only";
import { Resend } from "resend";
import { email as copy } from "@/content/email";
import { legal } from "@/content/legal";
import { czkRounded, NBSP, pct } from "@/lib/format";
import { personalDifference, type CalcSnapshot } from "./personal";

export const EMAIL_ENABLED = process.env.NEXT_PUBLIC_EMAIL_ENABLED === "true";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export interface BuildInput {
  siteUrl: string;
  pdfUrl: string | null;
  leadId: string;
  calc: CalcSnapshot | null;
}

export interface Built {
  subject: string;
  html: string;
  text: string;
  unsubscribeUrl: string;
}

/** Sestaví e-mail po odeslání (PLAN §6). Osobní číslo se počítá na serveru. */
export function buildEmail({ siteUrl, pdfUrl, leadId, calc }: BuildInput): Built {
  const unsubscribeUrl = `${siteUrl}/api/unsubscribe?id=${leadId}`;
  const fill = (s: string): string =>
    s
      .replaceAll("{pdfUrl}", pdfUrl ? `${siteUrl}${pdfUrl.startsWith("/") ? "" : "/"}${pdfUrl}` : siteUrl)
      .replaceAll("{unsubscribeUrl}", unsubscribeUrl)
      .replaceAll("{years}", calc ? String(calc.years) : "")
      .replaceAll("{gross}", calc ? pct(calc.gross, 0) : "")
      .replaceAll("{diff}", calc ? czkRounded(personalDifference(calc)) : "");

  const subject = calc ? fill(copy.subject) : copy.subjectFallback;
  // Řádek s osobním výpočtem se vynechá, když kalkulačku nepoužil.
  const lines = copy.lines.filter((l) => calc || !l.includes("{diff}")).map(fill);
  const footer = copy.footer.map(fill);

  const p = (t: string, extra = "") => `<p style="margin:0 0 14px;font-size:16px;line-height:1.55;${extra}">${t}</p>`;
  const linkify = (t: string) =>
    esc(t).replace(/(https?:\/\/[^\s<]+)/g, (u) => `<a href="${u}" style="color:#15140f">${u}</a>`);

  const html = `<!doctype html>
<html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;background:#f4f1ea;color:#15140f;font-family:Georgia,'Times New Roman',serif;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(copy.preheader)}</span>
<div style="max-width:560px;margin:0 auto;padding:28px 20px;">
${p(esc(copy.greeting))}
${lines.map((l) => p(linkify(l))).join("\n")}
<p style="margin:24px 0 24px;"><a href="${esc(fill("{pdfUrl}"))}" style="display:inline-block;background:#15140f;color:#f4f1ea;text-decoration:none;padding:14px 22px;font-family:Arial,sans-serif;font-size:16px;">Stáhnout tahák (PDF)</a></p>
${p(esc(copy.signoff), "margin-top:8px;")}
<hr style="border:0;border-top:1px solid #d9d3c7;margin:28px 0 14px">
${footer
  .map((l) => {
    const i = l.indexOf(unsubscribeUrl);
    const html = i < 0 ? linkify(l) : `${esc(l.slice(0, i).replace(/jedním klikem: $/, ""))}<a href="${unsubscribeUrl}" style="color:#15140f">jedním klikem</a>.`;
    return p(html, "font-size:12px;color:#6b665c;font-family:Arial,sans-serif;");
  })
  .join("\n")}
${p(esc(legal.disclaimerShort), "font-size:12px;color:#6b665c;font-family:Arial,sans-serif;")}
</div></body></html>`;

  const text = [copy.greeting, "", ...lines, "", copy.signoff, "", "--", ...footer, legal.disclaimerShort]
    .join("\n")
    .replaceAll(NBSP, " ");
  return { subject: subject.replaceAll(NBSP, " "), html, text, unsubscribeUrl };
}

export type SendResult = { sent: true; id: string | null } | { sent: false; reason: string };

/** Odešle e-mail přes Resend. Když je vypnutý přepínač nebo chybí klíč, bez chyby přeskočí. */
export async function sendLeadEmail(to: string, input: BuildInput): Promise<SendResult> {
  if (!EMAIL_ENABLED) return { sent: false, reason: "disabled" };
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return { sent: false, reason: "not_configured" };
  const built = buildEmail(input);
  const resend = new Resend(key);
  const { data, error } = await resend.emails.send({
    from: `${copy.fromName} <${from}>`,
    to,
    subject: built.subject,
    html: built.html,
    text: built.text,
    headers: {
      "List-Unsubscribe": `<${built.unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  if (error) return { sent: false, reason: error.message };
  return { sent: true, id: data?.id ?? null };
}
