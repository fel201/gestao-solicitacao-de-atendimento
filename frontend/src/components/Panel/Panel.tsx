import type { PropsWithChildren } from "react";

type PanelProps = PropsWithChildren<{ className?: string }>;

export default function Panel({ children, className = "" }: PanelProps) {
  return (
    <section
      className={`rounded-xl border border-[#3f4b59] bg-[#161616] p-4 ${className}`}
    >
      {children}
    </section>
  );
}
