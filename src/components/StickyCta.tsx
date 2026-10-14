"use client";

import { useEffect, useState } from "react";
import { formCopy } from "@/content/form";
import { EMAIL_ENABLED } from "@/lib/flags";
import { SheetButton } from "./SheetButton";

/**
 * Lepivá lišta dole. Ukáže se, když odroluje hero (od S2), a schová se, když je vidět
 * formulář nebo je otevřená klávesnice (visualViewport).
 */
export function StickyCta() {
  const c = formCopy(EMAIL_ENABLED);
  const [pastHero, setPastHero] = useState(false);
  const [formsVisible, setFormsVisible] = useState(0);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const first = document.querySelector("main > section");
    if (!first) return;
    // Pozor: IntersectionObserver nehlásí „přeskočení“ prvku skokem (kotva, rychlý scroll),
    // proto se poloha čte při scrollu. Lišta se ukáže, jakmile začátek S2 vyjede do horních 60 % okna.
    let raf = 0;
    const check = () => {
      raf = 0;
      setPastHero(first.getBoundingClientRect().top < window.innerHeight * 0.6);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        setFormsVisible(visible.size);
      },
      { threshold: 0.5 },
    );
    document.querySelectorAll("main form[data-location]").forEach((f) => io.observe(f));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const on = () => setKeyboard(window.innerHeight - vv.height > 150);
    vv.addEventListener("resize", on);
    return () => vv.removeEventListener("resize", on);
  }, []);

  const show = pastHero && formsVisible === 0 && !keyboard;
  return (
    <div
      data-visible={show}
      data-past-hero={pastHero}
      data-forms={formsVisible}
      data-keyboard={keyboard}
      aria-hidden={!show}
      inert={!show}
      className={`fixed inset-x-0 bottom-[var(--cookie-h,0px)] z-20 border-t border-ink bg-paper px-[var(--gutter)] py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] transition-transform duration-200 motion-reduce:transition-none ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-[var(--measure)]">
        <SheetButton label={c.cta.sticky} location="sticky" />
      </div>
    </div>
  );
}
