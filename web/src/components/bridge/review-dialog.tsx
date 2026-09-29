"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CHAINS, GOR_DECIMALS, explorerAddressUrl, type ChainId } from "@/lib/chains";
import { formatTokenAmount } from "@/lib/format";
import { truncateAddress } from "@/lib/address";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { useBridgeConfig } from "@/providers/config-provider";

export function ReviewDialog({
  open,
  onClose,
  onConfirm,
  origin,
  destination,
  amount,
  recipient,
  sender,
  feeText,
  feeSymbol,
  busy,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  origin: ChainId;
  destination: ChainId;
  amount: string;
  recipient: string;
  sender: string;
  feeText?: string;
  feeSymbol?: "SOL" | "GOR";
  busy: boolean;
}) {
  const config = useBridgeConfig();
  const [copied, setCopied] = useState(false);
  const shown = formatTokenAmount(amount, {
    context: "detailed",
    tokenDecimals: GOR_DECIMALS[origin],
  });
  const mismatch = Boolean(sender && recipient && sender !== recipient);
  const from = CHAINS[origin];
  const to = CHAINS[destination];

  return (
    <Dialog
      open={open}
      onClose={busy ? () => undefined : onClose}
      eyebrow="Review"
      title={busy ? "Signing" : "Send it through?"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Back
          </Button>
          <Button onClick={onConfirm} loading={busy}>
            {busy ? "Signing" : "Sign and send"}
          </Button>
        </>
      }
    >
      <p className="m-0 font-mono text-[40px] leading-none tabular text-acid-500 [text-shadow:var(--text-glow-acid)]">
        <span aria-label={shown.aria}>{shown.text}</span>
        <span className="ml-2 font-display text-[22px] text-pink-500 [text-shadow:var(--text-glow-pink)]">
          $GOR
        </span>
      </p>
      <p className="mt-2 mb-0 text-sm text-[var(--text-muted)]">1:1. You receive the same amount.</p>

      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <ChainMark chain={origin} />
        <span className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          to
        </span>
        <ChainMark chain={destination} align="end" />
      </div>

      <dl className="m-0 mt-5 grid gap-3 text-sm">
        <Row
          label="Locks"
          value={origin === "gorchain" ? `Native $GOR on ${from.shortName}` : `SPL $GOR on ${from.shortName}`}
        />
        <Row
          label="Unlocks"
          value={destination === "gorchain" ? `Native $GOR on ${to.shortName}` : `SPL $GOR on ${to.shortName}`}
        />
        <Row
          label="Recipient"
          value={
            <span className="inline-flex items-center gap-1.5">
              <button
                type="button"
                className="font-mono text-cyan-500"
                onClick={async () => {
                  await navigator.clipboard.writeText(recipient);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1000);
                }}
                title={recipient}
              >
                {copied ? "Copied" : truncateAddress(recipient)}
              </button>
              <a
                href={explorerAddressUrl(
                  destination,
                  recipient,
                  destination === "solana" ? config.solanaExplorer : config.gorchainExplorer,
                )}
                target="_blank"
                rel="noreferrer"
                aria-label="Open recipient on explorer"
              >
                <ExternalLink size={12} aria-hidden />
              </a>
            </span>
          }
        />
      </dl>

      {mismatch && (
        <p className="mt-4 mb-0 text-sm text-[var(--yellow-500)]">
          This is not your connected wallet. Read the address before you sign.
        </p>
      )}
      <p className="mt-4 mb-0 flex items-baseline justify-between gap-3 text-sm">
        <span className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          Fee
        </span>
        <span className="font-mono tabular text-[var(--text-primary)]">
          {feeText ?? "—"}{" "}
          {feeSymbol && (
            <span className={feeSymbol === "SOL" ? "font-display text-cyan-500" : "font-display text-pink-500"}>
              {feeSymbol}
            </span>
          )}
        </span>
      </p>
    </Dialog>
  );
}

function ChainMark({ chain, align = "start" }: { chain: ChainId; align?: "start" | "end" }) {
  const meta = CHAINS[chain];
  return (
    <div className={`flex items-center gap-2 ${align === "end" ? "flex-row-reverse text-right" : ""}`}>
      <img src={meta.mark} alt="" width={28} height={28} className="rounded-sm" />
      <span className="font-bold text-[var(--text-primary)]">{meta.shortName}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-[var(--border-subtle)] pb-3 last:border-0 last:pb-0">
      <dt className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {label}
      </dt>
      <dd className="m-0 text-right text-[var(--text-primary)]">{value}</dd>
    </div>
  );
}
