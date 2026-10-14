import type { Metadata } from "next";
import Link from "next/link";
import { legal } from "@/content/legal";

export const metadata: Metadata = { title: legal.notFound.title, robots: { index: false } };

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[var(--measure)] px-[var(--gutter)] py-14">
      <p className="mono text-[0.75rem] text-grey">404</p>
      <h1 className="serif mt-2 text-[1.875rem] leading-[1.1] font-semibold">{legal.notFound.title}</h1>
      <p className="mt-3 text-[1.0625rem]">{legal.notFound.text}</p>
      <p className="mt-8">
        <Link href="/" className="underline underline-offset-4">
          {legal.notFound.back}
        </Link>
      </p>
    </main>
  );
}
