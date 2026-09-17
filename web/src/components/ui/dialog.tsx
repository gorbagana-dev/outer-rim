"use client";

import { cn } from "@/lib/cn";
import { IconButton } from "./icon-button";
import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
  variant?: "default" | "sticker";
};

export function Dialog({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  width = 480,
  variant = "default",
}: Props) {
  const sticker = variant === "sticker";
  const titleId = useId();
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-[var(--surface-overlay)] backdrop-blur-[8px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full flex flex-col overflow-hidden motion-safe:animate-[gor-enter_200ms_var(--ease-out)]",
          sticker
            ? "bg-[var(--surface-sticker)] text-[var(--text-on-sticker)] border-2 border-[var(--ink-900)] rounded-xs shadow-[var(--shadow-sticker-lg)] -rotate-1"
            : "bg-[var(--void-2)] text-[var(--text-primary)] border border-[var(--border-strong)] rounded-lg shadow-elevated shadow-purple",
        )}
        style={{ maxWidth: width }}
      >
        <div className="flex items-start gap-3 px-5 pt-5">
          <div className="min-w-0 flex-1">
            {eyebrow && (
              <div
                className={cn(
                  "font-body text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5",
                  sticker ? "text-[var(--card-700)]" : "text-pink-500",
                )}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <h2
                id={titleId}
                className={cn(
                  "m-0 font-display text-[28px] leading-snug uppercase",
                  sticker ? "text-[var(--ink-900)]" : "text-acid-500 [text-shadow:var(--text-glow-acid)]",
                )}
              >
                {title}
              </h2>
            )}
          </div>
          <IconButton label="Close" size="sm" onClick={onClose}>
            <X size={16} aria-hidden />
          </IconButton>
        </div>
        <div className={cn("p-5 font-body", sticker ? "text-[var(--ink-900)]" : "text-[var(--text-secondary)]")}>
          {children}
        </div>
        {footer && <div className="flex justify-end gap-2.5 px-5 pb-5">{footer}</div>}
      </div>
    </div>
  );
}
