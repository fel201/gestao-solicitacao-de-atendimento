import type { PropsWithChildren } from "react";

type FormFieldProps = PropsWithChildren<{
  label: string;
  error?: string;
  hint?: string;
  className?: string;
}>;

export default function FormField({
  label,
  error,
  hint,
  children,
  className = "",
}: FormFieldProps) {
  return (
    <label className={`flex flex-col gap-2 text-slate-200 ${className}`}>
      {label}
      {children}
      {hint && !error && <span className="text-sm text-slate-400">{hint}</span>}
      {error && <span className="text-sm text-red-700">{error}</span>}
    </label>
  );
}
