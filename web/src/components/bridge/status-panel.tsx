"use client";

import { Button } from "@/components/ui/button";
import { CHAINS, explorerTxUrl } from "@/lib/chains";
import { formatTokenAmount } from "@/lib/format";
import type { HistoryItem, TransferStatus } from "@/lib/types";
import { Check, ExternalLink } from "lucide-react";
import { useBridgeConfig } from "@/providers/config-provider";

const PHASES = [
  { id: "lock", label: "Lock" },
  { id: "relay", label: "Relay" },
  { id: "unlock", label: "Unlock" },
] as const;

function phaseOf(status: TransferStatus): number {
  if (status === "waiting-relayer" || status === "delivered") return 2;
  return 0;
}

export function StatusPanel({
  item,
  onNew,
}: {
  item: HistoryItem;
  onNew: () => void;
}) {
  const config = useBridgeConfig();
  const failed = item.status === "failed";
  const landed = item.status === "delivered" || item.status === "waiting-relayer";
  const phase = phaseOf(item.status);
  const amount = formatTokenAmount(item.amount, { context: "detailed", tokenDecimals: 9 });
  const origin = CHAINS[item.origin];
  const destination = CHAINS[item.destination];
  const copy = statusCopy(item.status, origin.shortName, destination.shortName);
  const fill = failed ? 8 : landed ? 100 : phase === 0 ? 18 : 62;

  return (
    <div className="flex flex-col gap-5" aria-live="polite">
      <div>
        <p className="m-0 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-pink-500">
          {origin.shortName} → {destination.shortName}
        </p>
        <h3 className="m-0 mt-1 font-display text-[32px] uppercase leading-none text-acid-500 [text-shadow:var(--text-glow-acid)]">
          {copy.title}
        </h3>
      </div>

      <p className="m-0 font-mono text-[40px] leading-none tabular text-[var(--text-primary)]">
        <span aria-label={amount.aria}>{amount.text}</span>
        <span className="ml-2 font-display text-[22px] text-pink-500 [text-shadow:var(--text-glow-pink)]">
          $GOR
        </span>
      </p>

      <div>
        <div className="relative h-[3px] rounded-full bg-[var(--white-12)]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-acid-500 shadow-acid motion-safe:transition-[width] motion-safe:duration-slow motion-safe:ease-out"
            style={{ width: `${fill}%` }}
          />
        </div>
        <ol className="m-0 mt-3 grid list-none grid-cols-3 p-0">
          {PHASES.map((step, i) => {
            const done = !failed && (landed || phase > i);
            const active = !failed && !landed && phase === i;
            return (
              <li key={step.id} className={i === 1 ? "text-center" : i === 2 ? "text-right" : "text-left"}>
                <span
                  className={
                    failed && i === 0
                      ? "font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--status-danger)]"
                      : done
                        ? "font-body text-[11px] font-bold uppercase tracking-[0.14em] text-acid-500"
                        : active
                          ? "font-body text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-500"
                          : "font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]"
                  }
                >
                  {done && <Check size={12} className="mr-1 inline" aria-hidden />}
                  {active && (
                    <span
                      className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current align-middle motion-safe:animate-[gor-pulse_1.4s_ease-in-out_infinite]"
                      aria-hidden
                    />
                  )}
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <p className="m-0 text-sm text-[var(--text-secondary)]">{failed ? item.error || copy.body : copy.body}</p>

      {(item.originTx || item.destinationTx) && (
      <div className="flex flex-col items-start gap-2">
        {item.originTx && (
          <a
            href={explorerTxUrl(
              item.origin,
              item.originTx,
              item.origin === "solana" ? config.solanaExplorer : config.gorchainExplorer,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs"
          >
            {origin.shortName} transaction
            <ExternalLink size={12} aria-hidden />
          </a>
        )}
        {item.destinationTx && (
          <a
            href={explorerTxUrl(
              item.destination,
              item.destinationTx,
              item.destination === "solana" ? config.solanaExplorer : config.gorchainExplorer,
            )}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs"
          >
            {destination.shortName} transaction
            <ExternalLink size={12} aria-hidden />
          </a>
        )}
      </div>
      )}

      <Button type="button" variant={landed ? "primary" : "secondary"} size="lg" fullWidth onClick={onNew}>
        {landed ? "Bridge again" : "New transfer"}
      </Button>
    </div>
  );
}

function statusCopy(status: TransferStatus, origin: string, destination: string) {
  switch (status) {
    case "signing":
      return {
        title: "Sign the lock",
        body: `Approve the transaction in your wallet. Nothing leaves ${origin} until you do.`,
      };
    case "submitted":
      return {
        title: "Lock in flight",
        body: `Broadcast to ${origin}. Waiting for the cluster to take it.`,
      };
    case "confirming":
      return {
        title: "Confirming",
        body: `${origin} has the transaction. Holding for confirmation.`,
      };
    case "waiting-relayer":
    case "delivered":
      return {
        title: "Landed",
        body: `$GOR is on ${destination}.`,
      };
    case "failed":
      return {
        title: "Failed",
        body: "The lock did not confirm.",
      };
    default:
      return { title: "In the chute", body: "" };
  }
}
