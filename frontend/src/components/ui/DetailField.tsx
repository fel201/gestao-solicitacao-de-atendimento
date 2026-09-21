import type { PropsWithChildren } from "react";

type DetailFieldProps = PropsWithChildren<{
  label: string;
  className?: string;
}>;

export default function DetailField({
  label,
  children,
  className = "",
}: DetailFieldProps) {
  return (
    <div className={`rounded-lg border border-[#3f4b59] bg-[#1b1b1b] p-4 ${className}`}>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </dt>
      <dd className="mt-2 font-medium text-slate-100">{children}</dd>
    </div>
  );
}
