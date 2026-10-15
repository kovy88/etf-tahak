import type { Metadata } from "next";
import Link from "next/link";
import { OPERATOR } from "@/content/author";
import { privacy } from "@/content/privacy";

export const metadata: Metadata = { title: privacy.unsubscribed.errorTitle, robots: { index: false } };

export default function UnsubscribeErrorPage() {
  return (
    <main className="mx-auto max-w-[var(--measure)] px-[var(--gutter)] py-14">
      <h1 className="serif text-[1.875rem] leading-[1.1] font-semibold">{privacy.unsubscribed.errorTitle}</h1>
      <p className="mt-3 text-[1.0625rem]">
        {privacy.unsubscribed.errorText}{" "}
        <a href={`mailto:${OPERATOR.email}`} className="underline underline-offset-4">{OPERATOR.email}</a>.
      </p>
      <p className="mt-8">
        <Link href="/" className="underline underline-offset-4">{privacy.unsubscribed.back}</Link>
      </p>
    </main>
  );
}
