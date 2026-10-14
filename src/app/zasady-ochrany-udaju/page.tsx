import type { Metadata } from "next";
import Link from "next/link";
import { privacy } from "@/content/privacy";

export const metadata: Metadata = {
  title: privacy.title,
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-[var(--measure)] px-[var(--gutter)] py-10">
      <h1 className="serif text-[1.875rem] leading-[1.1] font-semibold">{privacy.title}</h1>
      <p className="mono mt-2 text-[0.8125rem] text-grey">{privacy.updated}</p>
      {privacy.sections.map((s) => (
        <section key={s.h} className="mt-7">
          <h2 className="serif text-[1.25rem] font-semibold">{s.h}</h2>
          {s.p.map((t) => (
            <p key={t} className="mt-2 text-[1rem] leading-[1.6]">
              {t}
            </p>
          ))}
        </section>
      ))}
      <p className="mt-10">
        <Link href="/" className="underline underline-offset-4">
          {privacy.back}
        </Link>
      </p>
    </main>
  );
}
