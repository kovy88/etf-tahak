import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { block?: boolean };

/** Inkoustové tlačítko, 52 px vysoké, na mobilu přes celou šířku. */
export function Button({ block = true, className = "", children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`inline-flex h-[var(--btn-h)] items-center justify-center bg-ink px-6 text-[1.0625rem] font-medium text-paper transition-colors hover:bg-[#2a2820] active:bg-black ${
        block ? "w-full" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
