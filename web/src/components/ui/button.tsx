import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const variants = {
  primary:
    "bg-acid-500 text-[var(--text-on-acid)] shadow-acid hover:bg-acid-400 hover:shadow-acid-strong active:bg-acid-600",
  secondary:
    "bg-transparent text-pink-500 border-2 border-pink-500 hover:bg-pink-500 hover:text-white hover:shadow-pink",
  outline:
    "bg-transparent text-cyan-500 border-2 border-cyan-500 hover:bg-cyan-500/10 hover:shadow-cyan",
  ghost:
    "bg-transparent text-[var(--text-secondary)] border-2 border-transparent hover:bg-[var(--white-6)] hover:text-[var(--text-primary)]",
  danger:
    "bg-[var(--sunset-600)] text-white hover:bg-[var(--sunset-500)] hover:shadow-pink",
  sticker:
    "bg-[var(--surface-sticker)] text-[var(--text-on-sticker)] border-2 border-[var(--ink-900)] shadow-sticker rounded-[var(--radius-xs)] font-display tracking-normal normal-case hover:rotate-0",
};

const sizes = {
  sm: "h-8 min-h-8 px-3 text-[11px]",
  md: "h-10 min-h-10 px-[18px] text-[13px]",
  lg: "h-12 min-h-12 px-6 text-[15px]",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth,
  loading,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-body font-bold uppercase tracking-[0.14em] whitespace-nowrap",
        "motion-safe:transition-[transform,background-color,box-shadow,color,border-color] motion-safe:duration-fast motion-safe:ease-out",
        "motion-safe:active:scale-[0.97]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none",
        variants[variant],
        sizes[size],
        fullWidth && "flex w-full",
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span
          className="h-3.5 w-3.5 rounded-full border-2 border-current border-r-transparent motion-safe:animate-spin"
          aria-hidden
        />
      ) : (
        iconLeft
      )}
      {children}
      {iconRight}
    </button>
  );
}
