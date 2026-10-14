import { threeThings } from "@/content";
import { Section } from "./Section";

export function ThreeThings() {
  return (
    <Section id={threeThings.id} title={threeThings.title}>
      <ol className="grid gap-7">
        {threeThings.items.map((it) => (
          <li key={it.id}>
            <h3 className="serif text-[1.25rem] leading-snug font-semibold">{it.heading}</h3>
            <p className="mt-1.5 text-[1rem] leading-[1.55]">{it.text}</p>
            <p className="mt-2 text-[0.875rem]">
              <a href="#tahak" className="underline underline-offset-4">
                {it.more}
              </a>
              <span className="text-grey"> · {it.sourceHint}</span>
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
