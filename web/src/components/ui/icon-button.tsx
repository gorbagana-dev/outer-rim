import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const sizes = {
  sm: "h-8 w-8 min-h-8 min-w-8",
  md: "h-10 w-10 min-h-10 min-w-10",
  lg: "h-12 w-12 min-h-12 min-w-12",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: "ghost" | "outline" | "primary" | "pink";
  size?: keyof typeof sizes;
  active?: boolean;
  children: ReactNode;
};

export function IconButton({
  label,
  variant = "ghost",
  size = "md",
  active,
  className,
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-sm",
        "motion-safe:transition-[background-color,color,box-shadow,border-color] motion-safe:duration-fast motion-safe:ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-500",
        "disabled:cursor-not-allowed disabled:opacity-40",
        sizes[size],
        variant === "ghost" &&
          (active
            ? "bg-[var(--white-6)] text-acid-500"
            : "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--white-6)] hover:text-[var(--text-primary)]"),
        variant === "outline" &&
          "border-2 border-[var(--border-default)] text-[var(--text-primary)] hover:shadow-purple hover:bg-purple-500/15",
        variant === "primary" && "bg-acid-500 text-[var(--text-on-acid)] shadow-acid",
        variant === "pink" &&
          "border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white hover:shadow-pink",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
