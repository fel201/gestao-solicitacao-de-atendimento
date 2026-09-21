import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "link";
};

const variantClasses = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "border border-[#536170] text-slate-200 hover:bg-[#2b323a]",
  danger: "border border-red-400/70 text-red-300 hover:bg-red-400/10",
  link: "text-cyan-300 underline hover:text-cyan-200",
};

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
