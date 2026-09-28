"use client";

import { useBridgeConfig } from "@/providers/config-provider";

export function BridgeNotice() {
  const config = useBridgeConfig();
  if (config.routeReady) return null;

  return (
    <div
      role="status"
      className="flex h-7 items-center justify-center border-b border-[var(--border-subtle)] bg-[rgba(7,3,15,0.92)] px-3 text-center font-body text-[11px] leading-none text-[var(--text-muted)]"
    >
      Bridge is not live yet. Please don’t connect your wallet.
    </div>
  );
}
