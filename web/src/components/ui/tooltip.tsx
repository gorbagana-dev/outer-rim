"use client";

import { cn } from "@/lib/cn";
import { useState, type ReactNode } from "react";

export function Tooltip({
  content,
  children,
}: {
  content: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <span
        role="tooltip"
        className={cn(
          "absolute z-[1000] bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-sm whitespace-nowrap pointer-events-none",
          "bg-[var(--void-4)] text-[var(--text-primary)] border border-[var(--border-strong)] shadow-purple text-sm",
          "motion-safe:transition-opacity motion-safe:duration-fast",
          open ? "opacity-100" : "opacity-0",
        )}
      >
        {content}
      </span>
    </span>
  );
}
