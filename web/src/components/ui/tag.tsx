import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLSpanElement> & {
  variant?: "chip" | "sticker";
  tilt?: number;
  children: ReactNode;
};

export function Tag({ variant = "chip", tilt = 0, className, children, ...rest }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-7 px-2.5 whitespace-nowrap select-none",
        variant === "sticker"
          ? "bg-[var(--surface-sticker)] text-[var(--text-on-sticker)] border-[1.5px] border-[var(--ink-900)] shadow-[2px_2px_0_var(--ink-900)] font-display text-sm uppercase rounded-xs"
          : "bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border-default)] rounded-full font-body text-sm font-medium",
        className,
      )}
      style={variant === "sticker" ? { transform: `rotate(${tilt}deg)` } : undefined}
      {...rest}
    >
      {children}
    </span>
  );
}
