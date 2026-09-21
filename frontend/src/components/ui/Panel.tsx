import type { HTMLAttributes, PropsWithChildren } from "react";

type PanelProps = PropsWithChildren<HTMLAttributes<HTMLElement>>;

export default function Panel({ children, className = "", ...props }: PanelProps) {
  return (
    <section
      className={`rounded-xl border border-[#3f4b59] bg-[#161616] p-4 ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}
