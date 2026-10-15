import { typoDeep } from "@/lib/format";

export type FormLocation = "calc" | "compare_gate" | "hero" | "sticky" | "tahak" | "final";

/** Texty formuláře a děkovného stavu. Řídí je přepínač NEXT_PUBLIC_EMAIL_ENABLED (PLAN §11). */
export const formCopy = (emailEnabled: boolean) =>
  typoDeep({
    label: "Váš e-mail",
    placeholder: "jmeno@email.cz",
    cta: {
      calc: emailEnabled ? "Pošlete mi výpočet + tahák" : "Stáhnout tahák zdarma",
      compare_gate: "Odemknout srovnání",
      hero: "Chci tahák zdarma",
      sticky: "Tahák zdarma",
      tahak: "Chci tahák zdarma",
      final: "Chci tahák zdarma",
    } satisfies Record<FormLocation, string>,
    sheet: {
      title: emailEnabled ? "Kam tahák poslat?" : "Stáhněte si tahák",
      close: "Zavřít",
    },
    micro: emailEnabled
      ? "Jen e-mail. Žádný telefon, žádný poradce. Tahák stáhnete hned. Odhlášení jedním klikem."
      : "Jen e-mail. Žádný telefon, žádný poradce. Tahák stáhnete hned. Adresu uložíme pro případné další informace o ETF.",
    privacyLink: "Zásady ochrany údajů",
    errors: {
      empty: "Doplňte e-mail, ať víme, kam tahák patří.",
      invalid: "Tohle nevypadá jako e-mail. Zkontrolujte ho, prosím.",
      server: "Odeslání se nepovedlo, ale tahák si můžete stáhnout.",
    },
    typo: {
      suggest: (domain: string) => `Mysleli jste @${domain}?`,
      accept: "Opravit",
    },
    sending: "Odesílám…",
    thanks: {
      title: "Hotovo. Tahák je váš.",
      titleNoPdf: "Hotovo. Srovnání je odemčené.",
      titleShort: "Hotovo.",
      downloadAgain: "Stáhnout PDF",
      download: "Stáhnout PDF",
      unlocked: "Úplné srovnání je odemčené.",
      emailSent: emailEnabled ? (email: string) => `Kopii posíláme na ${email}.` : null,
      mailboxHint: emailEnabled
        ? "Na Seznamu se může schovat v Newsletterech, v Gmailu v Promoakcích."
        : null,
      duplicate: "Tuhle adresu už známe. Tahák je i tak váš.",
    },
    profile: {
      question: "Kde investujete nebo chcete začít?",
      options: ["XTB", "Trading 212", "Revolut", "Fio", "Portu", "IBKR", "Jinde", "Zatím nikde"],
      thanks: "Díky, zapsali jsme si to.",
      error: "Odpověď se neuložila. Zkuste to prosím znovu.",
      optional: "Dobrovolné, stačí jeden ťuk.",
    },
    share: {
      text: "Pošlete kamarádovi, který taky řeší VOO",
      button: "Sdílet",
      copyLink: "Zkopírovat odkaz",
      copied: "Odkaz je zkopírovaný.",
      shareTitle: "ETF tahák",
    },
  });
