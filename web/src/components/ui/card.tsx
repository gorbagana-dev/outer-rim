import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "neon" | "sticker" | "cardboard" | "glass";
  accent?: "acid" | "pink" | "cyan" | "yellow" | "purple";
  header?: ReactNode;
  footer?: ReactNode;
  padding?: string;
  tilt?: number;
};

const accents = {
  acid: "border-acid-500 shadow-acid",
  pink: "border-pink-500 shadow-pink",
  cyan: "border-cyan-500 shadow-cyan",
  yellow: "border-[var(--yellow-500)]",
  purple: "border-[var(--purple-400)] shadow-purple",
};

export function Card({
  variant = "default",
  accent = "acid",
  header,
  footer,
  padding = "p-5",
  tilt,
  className,
  children,
  ...rest
}: Props) {
  const paper = variant === "sticker" || variant === "cardboard";
  return (
    <div
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
      className={cn(
        "flex flex-col overflow-hidden",
        variant === "default" &&
          "bg-[var(--surface-1)] border border-[var(--border-default)] rounded-md text-[var(--text-primary)]",
        variant === "neon" &&
          cn("bg-[var(--surface-1)] border-2 rounded-md text-[var(--text-primary)]", accents[accent]),
        variant === "sticker" &&
          "bg-[var(--surface-sticker)] border-2 border-[var(--ink-900)] rounded-xs text-[var(--text-on-sticker)] shadow-[var(--shadow-sticker-lg)]",
        variant === "cardboard" &&
          "bg-[var(--surface-cardboard)] border-2 border-[var(--card-700)] rounded-xs text-[var(--ink-900)] shadow-sticker",
        variant === "glass" &&
          "bg-[rgba(21,10,38,0.6)] backdrop-blur-[8px] border border-[var(--border-subtle)] rounded-md",
        className,
      )}
      {...rest}
    >
      {header && (
        <div
          className={cn(
            "px-5 py-3 uppercase",
            paper
              ? "border-b border-dashed border-[var(--ink-900)] font-display tracking-normal"
              : "border-b border-[var(--border-subtle)] font-body text-[11px] font-bold tracking-[0.14em] text-[var(--text-muted)]",
          )}
        >
          {header}
        </div>
      )}
      <div className={cn(padding, "flex-1")}>{children}</div>
      {footer && (
        <div
          className={cn(
            "px-5 py-3",
            paper ? "border-t border-dashed border-[var(--ink-900)]" : "border-t border-[var(--border-subtle)]",
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
