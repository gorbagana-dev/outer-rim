import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

const tones = {
  acid: "text-acid-500 bg-[var(--status-success-bg)]",
  pink: "text-pink-500 bg-[rgba(255,45,170,0.14)]",
  cyan: "text-cyan-500 bg-[var(--status-info-bg)]",
  yellow: "text-[var(--yellow-500)] bg-[var(--status-warning-bg)]",
  danger: "text-[var(--sunset-600)] bg-[var(--status-danger-bg)]",
  purple: "text-[var(--purple-300)] bg-[rgba(154,77,255,0.16)]",
  neutral: "text-[var(--text-secondary)] bg-[var(--white-6)]",
};

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: keyof typeof tones;
  variant?: "soft" | "solid" | "outline";
  dot?: boolean;
  pulse?: boolean;
  children: ReactNode;
};

export function Badge({
  tone = "acid",
  variant = "soft",
  dot,
  pulse,
  className,
  children,
  ...rest
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 h-[22px] px-2 rounded-xs font-body text-[11px] font-bold uppercase tracking-[0.14em] whitespace-nowrap",
        variant === "soft" && tones[tone],
        variant === "outline" && "bg-transparent border",
        variant === "solid" && "text-[var(--ink-900)]",
        className,
      )}
      style={
        variant === "solid"
          ? { background: tone === "danger" || tone === "pink" ? "var(--pink-500)" : "var(--acid-500)", color: tone === "danger" || tone === "pink" ? "white" : "var(--ink-900)" }
          : variant === "outline"
            ? { color: "currentColor", borderColor: "currentColor" }
            : undefined
      }
      {...rest}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full bg-current", pulse && "motion-safe:animate-[gor-pulse_1.4s_ease-in-out_infinite]")}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}
