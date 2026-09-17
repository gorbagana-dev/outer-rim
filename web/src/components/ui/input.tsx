import { cn } from "@/lib/cn";
import type { InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  suffix?: ReactNode;
  iconLeft?: ReactNode;
  mono?: boolean;
  inputSize?: "sm" | "md" | "lg";
};

export function Input({
  label,
  hint,
  error,
  suffix,
  iconLeft,
  mono,
  inputSize = "md",
  id,
  className,
  disabled,
  ...rest
}: Props) {
  const fieldId = id ?? rest.name;
  const errorId = error && fieldId ? `${fieldId}-error` : undefined;
  const hintId = hint && fieldId ? `${fieldId}-hint` : undefined;
  const h = inputSize === "sm" ? "h-8" : inputSize === "lg" ? "h-12" : "h-10";

  return (
    <label className={cn("flex flex-col gap-1.5", disabled && "opacity-50", className)}>
      {label && (
        <span className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
          {label}
        </span>
      )}
      <span
        className={cn(
          "flex items-center gap-2 px-3 rounded-sm bg-[var(--void-0)] border-2",
          h,
          error
            ? "border-[var(--status-danger)]"
            : "border-[var(--border-default)] focus-within:border-cyan-500 focus-within:shadow-cyan",
          "shadow-[var(--shadow-inset-bin)]",
          "motion-safe:transition-[border-color,box-shadow] motion-safe:duration-fast",
        )}
      >
        {iconLeft}
        <input
          id={fieldId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hintId}
          className={cn(
            "min-w-0 flex-1 bg-transparent border-0 outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
            mono ? "font-mono text-sm tabular" : "font-body text-[15px]",
          )}
          {...rest}
        />
        {suffix && (
          <span className="font-body text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--text-muted)]">
            {suffix}
          </span>
        )}
      </span>
      {(error || hint) && (
        <span
          id={error ? errorId : hintId}
          className={cn("text-xs", error ? "text-[var(--status-danger)]" : "text-[var(--text-muted)]")}
        >
          {error || hint}
        </span>
      )}
    </label>
  );
}
