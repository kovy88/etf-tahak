"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/track";
import { LeadForm } from "./LeadForm";
import { useLanding } from "./LandingState";

export interface CompareCard {
  ticker: string;
  category: string;
  free: boolean;
  node: React.ReactNode;
}

export interface CompareListProps {
  cards: CompareCard[];
  filters: Record<string, string>;
  filterAria: string;
  unlockLabels: Record<number, string>;
  hint: string;
  empty: string;
  insight: React.ReactNode;
}

const BLURRED_SHOWN = 3;

/** Filtry, 3 karty zdarma a rozmazaný zbytek s bránou. Po odeslání formuláře se odemkne bez reloadu. */
export function CompareList({ cards, filters, filterAria, unlockLabels, hint, empty, insight }: CompareListProps) {
  const { unlocked, lead } = useLanding();
  const [filter, setFilter] = useState("all");
  const [gateOpen, setGateOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const inView = cards.filter((c) => filter === "all" || c.category === filter);
  const free = inView.filter((c) => c.free);
  const rest = inView.filter((c) => !c.free);
  const locked = unlocked ? [] : inView.filter((c) => !c.free);
  const showInsight = filter === "all" || filter === "sp500";

  useEffect(() => {
    if (gateOpen && !unlocked) formRef.current?.querySelector<HTMLInputElement>("input[type=email]")?.focus();
    if (unlocked && lead?.location === "compare_gate") formRef.current?.scrollIntoView({ block: "center" });
  }, [gateOpen, unlocked, lead?.location]);

  return (
    <>
      <ul className="mb-2 flex flex-wrap gap-2 text-[0.875rem]" aria-label={filterAria}>
        {Object.entries(filters).map(([k, v]) => (
          <li key={k}>
            <button
              type="button"
              aria-pressed={filter === k}
              onClick={() => {
                setFilter(k);
                track("compare_filter_changed", { filter: k });
              }}
              className={`inline-flex h-11 items-center border px-3 ${
                filter === k ? "border-ink bg-ink text-paper" : "border-line text-grey hover:border-ink"
              }`}
            >
              {v}
            </button>
          </li>
        ))}
      </ul>

      {inView.length === 0 ? <p className="py-6 text-grey">{empty}</p> : null}

      <div>
        {free.map((c) => (
          <div key={c.ticker}>{c.node}</div>
        ))}
      </div>

      {showInsight ? insight : null}

      {/* Slot zůstává na místě i po odemčení: PDF, otázka i thankyou_viewed nesmí s bránou zmizet. */}
      {gateOpen || lead?.location === "compare_gate" ? (
        <div className="mt-4" ref={formRef} id="srovnani-form">
          <LeadForm location="compare_gate" />
        </div>
      ) : null}

      {unlocked ? rest.map((c) => <div key={c.ticker}>{c.node}</div>) : null}

      {locked.length > 0 ? (
        <>
          <div className="relative mt-4">
            <div className="pointer-events-none select-none blur-[5px]" aria-hidden="true" inert>
              {locked.slice(0, BLURRED_SHOWN).map((c) => (
                <div key={c.ticker}>{c.node}</div>
              ))}
            </div>
            {!gateOpen ? <div className="absolute inset-x-0 top-6 flex justify-center px-2">
              <button
                type="button"
                onClick={() => {
                  track("compare_gate_clicked", { filter });
                  setGateOpen(true);
                }}
                className="inline-flex min-h-[var(--btn-h)] items-center justify-center bg-ink px-6 py-2 text-center text-[1.0625rem] font-medium text-paper"
              >
                {unlockLabels[locked.length] ?? unlockLabels[0]}
              </button>
            </div> : null}
          </div>
          <p className="mt-3 text-[0.875rem] text-grey">{hint}</p>
        </>
      ) : null}
    </>
  );
}
