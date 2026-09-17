"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CHAINS, explorerTxUrl, type ChainId } from "@/lib/chains";
import { formatTokenAmount } from "@/lib/format";
import type { HistoryItem, TransferStatus } from "@/lib/types";
import { Check, ExternalLink, Loader2, Skull } from "lucide-react";
import { useBridgeConfig } from "@/providers/config-provider";

const STEPS: { id: TransferStatus; label: string }[] = [
  { id: "signing", label: "Sign" },
  { id: "submitted", label: "Broadcast" },
  { id: "confirming", label: "Confirm" },
  { id: "waiting-relayer", label: "Relay" },
  { id: "delivered", label: "Delivered" },
];

const ORDER: TransferStatus[] = STEPS.map((s) => s.id);

export function StatusPanel({
  item,
  onDismiss,
}: {
  item: HistoryItem | null;
  onDismiss: () => void;
}) {
  const config = useBridgeConfig();
  if (!item || item.status === "idle" || item.status === "review") return null;

  const failed = item.status === "failed";
  const currentIndex = ORDER.indexOf(item.status === "failed" ? "confirming" : item.status);
  const amount = formatTokenAmount(item.amount, { context: "detailed", tokenDecimals: 9 });

  return (
    <Card variant="neon" accent={failed ? "pink" : item.status === "delivered" ? "acid" : "cyan"} className="mt-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-pink-500">
            {CHAINS[item.origin].shortName} → {CHAINS[item.destination].shortName}
          </p>
          <h3 className="m-0 mt-1 font-display text-2xl uppercase text-acid-500">
            {failed ? "Dump failed" : item.status === "delivered" ? "On the other lid" : "In the chute"}
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Hide
        </Button>
      </div>
      <p className="mt-2 mb-4 font-mono text-xl tabular">
        <span aria-label={amount.aria}>{amount.text}</span>{" "}
        <span className="text-sm text-[var(--text-muted)]">$GOR</span>
      </p>
      <ol className="m-0 p-0 list-none flex flex-col gap-2">
        {STEPS.map((step, i) => {
          const done = !failed && currentIndex > i;
          const active = !failed && currentIndex === i;
          return (
            <li key={step.id} className="flex items-center gap-3 text-sm">
              <span
                className={
                  failed && i === currentIndex
                    ? "text-[var(--status-danger)]"
                    : done
                      ? "text-acid-500"
                      : active
                        ? "text-cyan-500"
                        : "text-[var(--text-muted)]"
                }
              >
                {failed && i === currentIndex ? (
                  <Skull size={16} aria-hidden />
                ) : done ? (
                  <Check size={16} aria-hidden />
                ) : active ? (
                  <Loader2 size={16} className="motion-safe:animate-spin" aria-hidden />
                ) : (
                  <span className="inline-block w-4 text-center">·</span>
                )}
              </span>
              <span className={active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}>
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
      {item.originTx && (
        <a
          href={explorerTxUrl(
            item.origin,
            item.originTx,
            item.origin === "solana" ? config.solanaExplorer : config.gorchainExplorer,
          )}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 mt-4 text-sm"
        >
          Origin transaction <ExternalLink size={12} aria-hidden />
        </a>
      )}
      {item.status === "waiting-relayer" && (
        <p className="mt-3 mb-0 text-sm text-[var(--text-muted)]">
          Origin lock is confirmed. The relayer still has to deliver on {CHAINS[item.destination].shortName}.
          Keep this tab — we cannot see delivery without an explorer.
        </p>
      )}
      {failed && item.error && (
        <p className="mt-3 mb-0 text-sm text-[var(--status-danger)]">{item.error}</p>
      )}
    </Card>
  );
}
