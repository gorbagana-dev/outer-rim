"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { CHAINS, explorerTxUrl, type ChainId } from "@/lib/chains";
import { formatTokenAmount } from "@/lib/format";
import { truncateAddress } from "@/lib/address";
import type { HistoryItem } from "@/lib/types";
import { ExternalLink, Recycle, X } from "lucide-react";
import { useBridgeConfig } from "@/providers/config-provider";

const STATUS_LABEL: Record<HistoryItem["status"], string> = {
  idle: "Idle",
  review: "Review",
  signing: "Signing",
  submitted: "Submitted",
  confirming: "Confirming",
  "waiting-relayer": "Waiting on relayer",
  delivered: "Delivered",
  failed: "Failed",
};

export function HistoryDrawer({
  open,
  onClose,
  items,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}) {
  const config = useBridgeConfig();
  return (
    <div
      className={
        open
          ? "fixed inset-0 z-[1000]"
          : "pointer-events-none"
      }
      hidden={!open}
    >
      <button
        type="button"
        aria-label="Close history"
        className="absolute inset-0 bg-[var(--surface-overlay)] backdrop-blur-[8px]"
        onClick={onClose}
      />
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--void-2)] border-l border-[var(--border-strong)] shadow-elevated flex flex-col"
        role="dialog"
        aria-label="Transfer history"
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-[var(--border-subtle)]">
          <div>
            <p className="m-0 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-pink-500">
              Dumpster log
            </p>
            <h2 className="m-0 font-display text-xl text-acid-500 uppercase">History</h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <X size={18} aria-hidden />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Recycle size={28} className="text-[var(--text-muted)]" aria-hidden />
              <p className="m-0 font-bold">No transfers yet</p>
              <p className="m-0 text-sm text-[var(--text-muted)]">
                Once you dump $GOR over the rim, it shows up here.
              </p>
            </div>
          )}
          {items.map((item) => {
            const amount = formatTokenAmount(item.amount, { context: "compact", tokenDecimals: 6 });
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelect(item)}
                className="text-left p-4 rounded-md bg-[var(--surface-1)] border border-[var(--border-default)] hover:border-[var(--border-strong)] motion-safe:transition-[border-color] motion-safe:duration-fast"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    {CHAINS[item.origin].shortName} → {CHAINS[item.destination].shortName}
                  </span>
                  <Badge
                    tone={
                      item.status === "delivered"
                        ? "acid"
                        : item.status === "failed"
                          ? "danger"
                          : "cyan"
                    }
                    dot={item.status === "waiting-relayer"}
                    pulse={item.status === "waiting-relayer"}
                  >
                    {STATUS_LABEL[item.status]}
                  </Badge>
                </div>
                <p className="m-0 font-mono text-lg tabular">
                  <span aria-label={amount.aria}>{amount.text}</span>{" "}
                  <span className="text-sm text-[var(--text-muted)]">$GOR</span>
                </p>
                <p className="m-0 mt-1 font-mono text-xs text-cyan-500">
                  to {truncateAddress(item.recipient)}
                </p>
                {item.originTx && (
                  <a
                    href={explorerTxUrl(
                      item.origin,
                      item.originTx,
                      item.origin === "solana" ? config.solanaExplorer : config.gorchainExplorer,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Origin tx <ExternalLink size={12} aria-hidden />
                  </a>
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
