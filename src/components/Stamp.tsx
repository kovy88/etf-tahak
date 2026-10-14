/** Razítko: „nekoupíte“ (červené) a „dvojče“ (zelené). */
export function Stamp({
  tone,
  children,
  className = "",
}: {
  tone: "loss" | "gain";
  children: React.ReactNode;
  className?: string;
}) {
  const c = tone === "loss" ? "text-loss border-loss" : "text-gain-text border-gain";
  return (
    <span
      className={`serif inline-block -rotate-3 border-2 px-2 py-0.5 text-[0.8125rem] leading-tight font-semibold ${c} ${className}`}
    >
      {children}
    </span>
  );
}
